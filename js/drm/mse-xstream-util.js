// Demo's utility methods used to fetch and buffer into MSE. Used by both of
// the demo's video elements, so makes no reliance upon DOM since it could
// be used by either main window context or dedicated worker.

function loadBinaryAsync(url) {
  return new Promise((resolve, reject) => {
    let request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onerror = event => {
      reject(event);
    };
    request.onload = () => {
      if (request.status != 200) {
        reject(new Error('Unexpected response status code: ' + request.status));
        return;
      }
      let response = new Uint8Array(request.response);
      resolve(response);
    };
    request.send();
  });
}

async function appendChunk(source_buffer, chunk, advance_to_next_chunk_cb) {
  return new Promise((resolve, reject) => {
    let sb_error_handler = (e) => {
      source_buffer.removeEventListener('error', sb_error_handler);
      source_buffer.removeEventListener('updateend', sb_updateend_handler);
      reject(new Error(e));
      return;
    };

    let sb_updateend_handler = () => {
      source_buffer.removeEventListener('error', sb_error_handler);
      source_buffer.removeEventListener('updateend', sb_updateend_handler);
      advance_to_next_chunk_cb();
      resolve();
      return;
    }

    try {
      source_buffer.appendBuffer(chunk);
    } catch (e) {
      if (e.code != 22 && e.name != 'QUOTA_EXCEEDED_ERR' && e.name != 'QuotaExceededError') {
        reject(e);
      } else {
        // We assume naively that MSE won't normally give us a
        // QuotaExceededError exception for this demo. This is probably ok since
        // the media file is small. We do provide for a naive way of just
        // retrying the same append (after a brief delay) by *not* calling the
        // advance_to_next_chunk_cb if that exception occurs.
        setTimeout(resolve, 0);
      }
    }
    source_buffer.addEventListener('error', sb_error_handler);
    source_buffer.addEventListener('updateend', sb_updateend_handler);
  });
}

async function whenSourceOpenedThenFetchAndAppendInChunks(
    domain,
    media_source,
    media_url,
    media_type,
    offset,
    object_url_to_revoke,
    log_cb) {
  return new Promise((resolve, reject) => {
    if (!MediaSource.isTypeSupported(media_type)) {
      throw new Error('MediaSource.isTypeSupported indicated media type ' + media_type + ' is not supported.');
    }

    media_source.addEventListener('sourceopen', () => {
      log_cb('Handling sourceopen event');

      // Worker MediaSource doesn't use object URLs, so nothing to revoke in
      // that case.
      if (object_url_to_revoke != null) {
        URL.revokeObjectURL(object_url_to_revoke);
      }
      let source_buffer = media_source.addSourceBuffer(media_type);

      feed(domain, media_url, offset, source_buffer, media_source).then(resolve()).catch(_ => reject(_));
    }, {once: true});
  });
}

async function chunk2sb(domain, chunk, sb) {
  for (let i = 0; i < chunk.length; i++) {
    chunk[i] = domain[chunk[i]];    
  }

  await appendChunk(sb, chunk, () => {});
};

async function feed(domain, url, start, sb, media_source) {
  console.log("feed(url,...)");
  await fetch(url, {headers: {'range': 'bytes=' + start + '-'}}).then(response => response.body).then(rs => {
    const reader = rs.getReader();

    return new ReadableStream({
      async start(controller) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            media_source.endOfStream();
            break;
          }
          await chunk2sb(domain, value, sb)
        }

        controller.close();
        reader.releaseLock();
        //log_cb('Appends completed. Calling endOfStream.');
        //media_source.endOfStream();
        //log_cb('Buffering completed.');      
      }
    })
  }).catch(console.error)
}

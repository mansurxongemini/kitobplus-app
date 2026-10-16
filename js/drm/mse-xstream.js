const MEDIA_TYPE = 'audio/mpeg;codec=mp3';

let wait_counter = 0;
let wait_handle;
let pending_ended_count_before_stopping_busywait = 0;
let worker;
let audio_tag;

// Render timing for log messages
let initial_time = null;

function startBusyWaiting() {
  wait_counter++;
  wait_handle = setTimeout(startBusyWaiting, 1000);
}

function stopBusyWaiting() {
  if (wait_handle != undefined) {
    clearTimeout(wait_handle);
    wait_handle = undefined;
    wait_counter = 0;
  }
}

function incrementPendingEnded() {
  if (pending_ended_count_before_stopping_busywait == 0)
    startBusyWaiting();

  pending_ended_count_before_stopping_busywait++;
}

function decrementPendingEnded() {
  if (pending_ended_count_before_stopping_busywait > 0) {
    pending_ended_count_before_stopping_busywait--;
    if (pending_ended_count_before_stopping_busywait <= 0)
      stopBusyWaiting();
  }
}

function startMseBuffering(domain, audio, url) {
  let media_source = new MediaSource();
  let object_url = URL.createObjectURL(media_source);
  audio.src = object_url;
  return Promise.all([
    // Let playback start when ready.
    audio.play(),
    // Meanwhile, begin fetching and appending.
    whenSourceOpenedThenFetchAndAppendInChunks(
        domain,
        media_source, url, MEDIA_TYPE, 0,
        object_url /* sourceopen handler in utility script will revoke this url*/,
        logmsg => console.log(logmsg))
  ]);
}

function startPlayer(domain, audio, url, offset, length) {
  console.log("Start offset = " + offset + ", length = " + length);
  //const audio = document.createElement('audio');
  //audio.controls = true;
  audio.load();

  console.log('Starting MSE usage from main thread');

  let handled_decrement = false;
  incrementPendingEnded();
  if (wait_handle != undefined) {
    console.log('Ensured busy-waiting has started');
  } else {
    // This case should never occur, unless code has changed.
    console.log('Error: busy-waiting should have started. Aborting.');
    decrementPendingEnded();
    return;
  }

  if (window.MediaSource == undefined) {
    console.log('Error: MediaSource API is unavailable from main/Window context.');
    decrementPendingEnded();
    return;
  }

  audio.onerror = () => {
    console.log('Audio Element Error: code=' + audio.error.code + ', message=' + audio.error.message);
    if (!handled_decrement) {
      handled_decrement = true;
      decrementPendingEnded();
    }
    return;
  };

/*
  orig_onended = audio.onended;
  audio.onended = () => {
    console.log('Audio Element \'ended\'');
    audio.onended = orig_onended;

    if (!handled_decrement) {
      handled_decrement = true;
      decrementPendingEnded();
    }
    if (orig_onended) {
      orig_onended();
    }
    return;
  };
*/

  let player_promise;
  audio_tag = audio;
  player_promise = startMseBuffering(domain, audio, url + /*"&offset=" + Math.round(offset * 1000) + */ "&mk=1&length=" + Math.round(length * 1000));
 
  player_promise.catch(e => {
    if (!handled_decrement) {
      handled_decrement = true;
      decrementPendingEnded();
    }
    console.log(e);
    return;
  });
}


function stopPlayer() {
  if (audio_tag != undefined) {
    audio_tag.removeAttribute('src');
    audio_tag.load();
    audio_tag = undefined;
    console.log('Stopped MSE usage on main thread demo');
  }

  // Play promise rejection handling and MediaSource API usage after being
  // closed can also stop the busy-waiting. decrementPendingEnded() takes
  // care not to over-decrement. This is just a catch-all to ensure busy-waiting
  // stops.
  while (pending_ended_count_before_stopping_busywait > 0)
    decrementPendingEnded();
}

function populateParametersTable() {
}

function checkIfMseInWorkerSupported() {
  console.log("checkIfMseInWorkerSupported");
  if (MediaSource && MediaSource.canConstructInDedicatedWorker === true && MediaSourceHandle) {    
  } else {
    //status_div.innerText = "Error: this browser does not appear to support MSE-in-Workers (MediaSource.canConstructInDedicatedWorker !== true or browser is missing either MediaSource or MediaSourceHandle).";
    //alert('Браузер не поддерживается. Пожалуйста, попробуйте Google Chrome');
  }
}

// Expose startPlayer function to global window object
window.startPlayer = startPlayer;
window.stopPlayer = stopPlayer;

/*
// Debug: Log that functions are exposed
console.log('DRM functions exposed to window:', {
  startPlayer: typeof window.startPlayer,
  stopPlayer: typeof window.stopPlayer
});
*/

window.onload = () => {
  checkIfMseInWorkerSupported();
  //console.log('DRM scripts loaded, startPlayer available:', typeof window.startPlayer === 'function');
  return;
};

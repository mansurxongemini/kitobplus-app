import React, { Component } from 'react'
import { withMediaProps } from 'react-media-player'
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class KBPlayPause extends Component {
  shouldComponentUpdate({ media }) {
    return this.props.media.isPlaying !== media.isPlaying
  }

  _handlePlayPause = () => {
    this.props.media.playPause()
  }

  render() {
    const { className, style, media } = this.props
    return (
      <>
      <button
        type="button"
        className={className}
        style={style}
        onClick={this._handlePlayPause}
        aria-label={media.isPlaying ? 'Пауза' : 'Воспроизведение'}
      >
        {media.isPlaying ? 'Пауза' : 'Воспроизведение'}
        <i class="fa-regular fa-play">1</i>
      </button>
      <FontAwesomeIcon icon={faPlay} />
      <span>test</span>
      </>
    )
  }
}

export default withMediaProps(KBPlayPause)
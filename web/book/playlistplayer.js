import React from 'react';
import {save as savePlaybackPosition} from '../lib/playback_position.ts';

const PlaylistPlayer = React.forwardRef((props, ref) => {
    const playerRef = React.useRef(null);
    const [rate, setRate] = React.useState(1);
    const [offset, setOffset] = React.useState(0);

    const _nextTrack = () => changeTrack(1);

    const changeTrack = (d) => {
        let trackId = Number(playerRef.current.getAttribute('trackId'));
        if (0 <= trackId + d && trackId + d < props.playlist.length) {
            _playTrack(trackId + d);
        }     
    };

    const step = (s) => {
        let p = offset + playerRef.current.currentTime + s;
        let t = Number(playerRef.current.getAttribute('trackId'));
        
        if (p < 0 && p > -25) {p = 0;}

        if (0 <= p && p < props.playlist[t].length) {
            //playerRef.current.currentTime = p;
            //setTimeout(() => playerRef.current.play(), 50);
            _playTrack(t, p);
            return;
        }

        if (p >= props.playlist[t].length) {
            _nextTrack();
            return;
        }

        if (!t) {
            return;
        }

        let np = props.playlist[t - 1].length + p;
        if (np < 0) {np = 0;}

        _playTrack(t - 1, np);
    };

    React.useEffect(() => {        
        playerRef.current.playbackRate = rate;
        playerRef.current.defaultPaybackRate = rate;
    }, [rate]);

    React.useImperativeHandle(ref, () => ({
        async playit(id) {
            alert('?');
            console.log(props.playlist[id]);
            playerRef.current.src = '';
            //playerRef.current.src = props.playlist[id];
            try {
                await waitForStartPlayer();
                const _ = [105,248,146,253,240,173,109,206,119,127,213,126,197,120,196,136,172,214,37,104,199,169,43,242,83,132,44,80,95,190,99,215,142,164,81,82,223,144,16,116,113,222,249,162,3,47,205,156,179,71,79,9,125,121,128,180,38,58,63,250,188,91,103,226,76,228,97,225,107,155,52,141,218,152,145,239,41,204,129,31,178,21,68,202,255,115,6,30,0,67,28,186,51,56,151,191,42,241,53,229,211,147,143,92,45,12,106,73,94,24,123,85,165,5,158,19,208,39,57,118,131,90,139,122,88,72,62,192,216,87,8,60,130,159,176,251,26,166,236,40,160,247,150,20,100,36,110,134,86,163,4,112,171,46,181,194,114,11,203,177,174,14,245,207,210,117,157,77,65,234,233,25,66,140,75,32,184,161,27,59,154,7,61,232,23,168,246,89,48,182,29,219,201,108,101,220,231,135,1,189,167,55,54,209,2,243,70,198,224,64,10,148,102,200,15,84,195,137,235,96,35,111,149,244,69,175,221,238,237,50,153,49,13,217,227,93,185,18,34,17,124,212,254,193,33,230,133,170,22,183,252,138,74,187,78,98];
                window.startPlayer(_, playerRef.current, props.playlist[id], 0, 0);//props.playlist[id].length);
            } catch (error) {
                console.error('Failed to start DRM player in playit:', error);
            }
            setTimeout(() => playerRef.current.play(), 50);
        },
        playPause() {
            props.onProgress(!playerRef.current.paused, Number(playerRef.current.getAttribute('trackId')), offset + playerRef.current.currentTime);
            if (playerRef.current.paused) {
                try {
                    playerRef.current.play();
                } catch (e) {console.error(e);};
                setTimeout(_ => {
                    playerRef.current.playbackRate = rate;
                    playerRef.current.defaultPaybackRate = rate;
                }, 100);
            } else {
                playerRef.current.pause();
            }
        },
        nextTrack() {_nextTrack();},
        previosTrack() {
            changeTrack(-1);
        },
        stepForward() {step(30);},
        stepBackward() {step(-30);},
        playTrack(trackId, position = 0) {_playTrack(trackId, position);},
        switchRate(currentRate) {
            let r = Math.round(100 * (currentRate + 0.25));
            if (r > 200) r = 100;
            r /= 100;
            setRate(r);
            return r;
        },
        currentTrack() {
            return Number(playerRef.current.getAttribute('trackId'));
        },
        currentPosition() {
            return Math.round((offset + playerRef.current.currentTime) * 1000);
        },
    }));

    const waitForStartPlayer = () => {
        return new Promise((resolve, reject) => {
            console.log('Checking for startPlayer function, current type:', typeof window.startPlayer);
            
            if (typeof window.startPlayer === 'function') {
                console.log('startPlayer is already available');
                resolve();
                return;
            }
            
            console.log('startPlayer not available, waiting...');
            let attempts = 0;
            const maxAttempts = 50; // 5 seconds max wait
            const checkInterval = setInterval(() => {
                attempts++;
                //console.log(`Attempt ${attempts}/50: startPlayer type is`, typeof window.startPlayer);
                
                if (typeof window.startPlayer === 'function') {
                    console.log('startPlayer became available!');
                    clearInterval(checkInterval);
                    resolve();
                } else if (attempts >= maxAttempts) {
                    console.error('startPlayer function not available after 5 seconds. Window object keys:', Object.keys(window).filter(k => k.includes('start') || k.includes('Player')));
                    clearInterval(checkInterval);
                    reject(new Error('startPlayer function not available after 5 seconds'));
                }
            }, 100);
        });
    };

    const _playTrack = async (trackId, position = 0) => {
        playerRef.current.setAttribute('trackId', trackId);
        const is_mp3 = props.playlist[trackId].url.match(/\.mp3$/);
        playerRef.current.src = '';

        setOffset(is_mp3 ? 0 : position);
        console.log(props.playlist);
        console.log(trackId);
        console.log(props.playlist[trackId]);
        if (is_mp3) {
            playerRef.current.src = props.playlist[trackId].url;
        } else {
            try {
                await waitForStartPlayer();
                const _ = [105,248,146,253,240,173,109,206,119,127,213,126,197,120,196,136,172,214,37,104,199,169,43,242,83,132,44,80,95,190,99,215,142,164,81,82,223,144,16,116,113,222,249,162,3,47,205,156,179,71,79,9,125,121,128,180,38,58,63,250,188,91,103,226,76,228,97,225,107,155,52,141,218,152,145,239,41,204,129,31,178,21,68,202,255,115,6,30,0,67,28,186,51,56,151,191,42,241,53,229,211,147,143,92,45,12,106,73,94,24,123,85,165,5,158,19,208,39,57,118,131,90,139,122,88,72,62,192,216,87,8,60,130,159,176,251,26,166,236,40,160,247,150,20,100,36,110,134,86,163,4,112,171,46,181,194,114,11,203,177,174,14,245,207,210,117,157,77,65,234,233,25,66,140,75,32,184,161,27,59,154,7,61,232,23,168,246,89,48,182,29,219,201,108,101,220,231,135,1,189,167,55,54,209,2,243,70,198,224,64,10,148,102,200,15,84,195,137,235,96,35,111,149,244,69,175,221,238,237,50,153,49,13,217,227,93,185,18,34,17,124,212,254,193,33,230,133,170,22,183,252,138,74,187,78,98];
                window.startPlayer(_, playerRef.current, props.playlist[trackId].url, position, props.playlist[trackId].length);
            } catch (error) {
                console.error('Failed to start DRM player:', error);
                // Fallback to regular audio if DRM player fails
                playerRef.current.src = props.playlist[trackId].url;
            }
        }
        const playDelay = (position > 0 ? 150 : 100);
        
        if (is_mp3 && position > 0) {
            setTimeout(() => {playerRef.current.currentTime = position;}, 100);
        }

        setTimeout(() => playerRef.current.play().catch(_ => console.error(_)), playDelay);
        setTimeout(_ => {
            playerRef.current.playbackRate = rate;
            playerRef.current.defaultPaybackRate = rate;
        }, playDelay + 100);
        props.onProgress(true, trackId, position);
    }

    React.useEffect(() => {
        console.log(props);
        if (!props.playlist || !props.playlist.length) return;
        console.log('PlaylistPlayer');
        _playTrack(props.track ? props.track : 0, props.position ? props.position / 1000: 0);
        if (props.rate) {
            //console.log('setRate to ' + props.rate);
            //setTimeout(_ => setRate(props.rate), 500);
            setRate(props.rate);
        }        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.playlist, props.track, props.position, props.rate]);

    return (
        <audio
            ref={playerRef}
            type={'audio/mpeg'}
            data-is-playing='0'
            onPlaying={(e) => {console.log('onPlaying'); e.target.setAttribute('is-playing', '0');}}
            onPause={(e) => {console.log('onPause'); e.target.setAttribute('is-playing', '1');}}
            onCanPlay={(e) => {               
                console.log('onCanPlay (autoplay = ' + (e.target.getAttribute('autoplay') ? 'true' : 'false') + ')');
                if (e.target.getAttribute('autoplay') === 'yes') {
                    e.target.setAttribute('autoplay', 'no');
                    if (e.target.getAttribute('autoplay-position') !== 0 && e.target.getAttribute('autoplay-position')) {
                        e.target.currentTime = e.target.getAttribute('autoplay-position');
                    }
                    e.target.play();
                }
            }}
            onEnded={(e) => {
                console.log('onEnded');
                _nextTrack();           
            }}
            onSeeked={(e) =>{
                console.log('onSeeked');
            }}
            onSeeking={(e) =>{console.log('onSeeking');}}
            onTimeUpdate={(e) => {
                if (!e.target.paused) {
                    savePlaybackPosition({
                        books_id: props.book.id, 
                        track: Number(e.target.getAttribute('trackId')),
                        position: Math.round((offset + e.target.currentTime) * 1000),
                        rate: rate,
                    });
                }
                props.onProgress(!e.target.paused, Number(e.target.getAttribute('trackId')), offset + e.target.currentTime);
            }}
        />
    );
});

export default PlaylistPlayer;

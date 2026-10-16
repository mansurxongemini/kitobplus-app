import React from 'react';
import '../css/timer.css';

const Timer = ({value, ariaPrefix}) => {
    const [hours, setHours] = React.useState('0');
    const [minutes, setMinutes] = React.useState('00');
    const [seconds, setSeconds] = React.useState('00');

    React.useEffect(() => {
        let s = Math.round(Number(value));
        setHours(Math.floor(s / 3600));
        s = s % 3600;
        setMinutes(Math.floor(s / 60).toString().padStart(2, '0'));
        setSeconds((s % 60).toString().padStart(2, '0'));
    }, [value]);
    
    return (
        <div className="timer" tabIndex={0} role='timer' aria-label={ariaPrefix + ', ' + hours + ':' + minutes + ':' + seconds}>
            <span className="timerNum">{hours}</span><span className="timerSep">:</span><span className="timerNum">{minutes}</span><span className="timerSep">:</span><span className="timerNum">{seconds}</span>
        </div>
    );
};

export default Timer;
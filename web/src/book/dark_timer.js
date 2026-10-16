import React from 'react';
import '../css/dark_timer.css';

const DarkTimer = ({value}) => {
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
        <div className="darkTimer">
            <span className="darkTimerNum">{hours}</span><span className="darkTimerSep">:</span><span className="darkTimerNum">{minutes}</span><span className="darkTimerSep">:</span><span className="darkTimerNum">{seconds}</span>
        </div>
    );
};

export default DarkTimer;
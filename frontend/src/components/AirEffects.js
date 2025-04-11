import React, { useState, useEffect } from 'react';
import "./AirEffects.css";

function AirEffects({value, set}){
    const [thresholds, setThresholds] = useState(set);
    const [isSlidingIn, setIsSlidingIn] = useState([false, false, false, false]);

    useEffect(() => {
        setIsSlidingIn(thresholds.map(threshold => value > threshold));
    }, [value, thresholds]);

    return(
        <div className="img-container">
            <div className="img-row">
                {thresholds.map((threshold, index) => (
                <img
                    key={index}
                    className={isSlidingIn[index] ? 'slide-in' : 'slide-out'}
                    src={`/visuals/air/conditions/conditions_${index}.png`}
                    alt={`img ${index}`}
                    style={{
                    transform: isSlidingIn[index]
                        ? 'translateX(0)'
                        : `translateX(${(index - thresholds.length / 2) * 100}px)`,
                    opacity: isSlidingIn[index] ? 1 : 0,
                    zIndex: index, // stack order
                    }}
                />
                ))}
            </div>
        </div>
    );
}

export default AirEffects;
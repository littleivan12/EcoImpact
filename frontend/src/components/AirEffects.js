import React, { useState, useEffect } from 'react';
import "./AirEffects.css";

function AirEffects({value, set}){
    const [thresholds, setThresholds] = useState(set);
    const [isSlidingIn, setIsSlidingIn] = useState([false, false, false]);

    useEffect(() => {
        setIsSlidingIn(thresholds.map(threshold => value > threshold));
    }, [value, thresholds]);

    return(
        <div className="img-container">
            {thresholds.map((threshold,index) => (
                <img
                    key={index}
                    className={isSlidingIn[index] ? 'slide-in' : 'slide-out'}
                    src={`/visuals/air/conditions/conditions_${index}.png`}
                    alt={`img ${index}`}
                    style={{ transform: `translateX(${index * 75}px)` }}
                />
            ))}   
        </div>

        
    );
}

export default AirEffects;
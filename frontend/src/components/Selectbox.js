import React, { useState } from 'react';
import "./Selectbox.css";

function Selectbox({page, label}){
    const img = `/visuals/home/home_${page}.png`
    const idle_anim = `/visuals/home/home_${page}_hover.webm`
    const bg_color = `/visuals/home/home_${page}_bg.png`

    const [isHovered, setIsHovered] = useState(false);

    return (
        <>
            <div className="card-container">
                <div 
                    className="info-card clickable-card image-hover-effect" 
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div className="bg-wrapper">
                        <img 
                            src={bg_color} 
                            alt={`${label} background`} 
                            className="bg-image"
                        />
                    </div>
                    
                    <div className={`media-wrapper ${isHovered ? 'hovered' : ''}`}>
                        <img 
                            src={img} 
                            alt={`${label} image`} 
                            className={`image-resize ${isHovered ? 'hidden' : ''}`}
                        />
                        
                        <video 
                            className={`media-element ${isHovered ? 'visible' : 'hidden'}`}
                            autoPlay
                            loop
                            muted
                            playsInline
                            width="100%"
                        >
                            <source src={idle_anim} type="video/webm" />
                        </video>
                    </div>
                <h2 className="label-format">{label}</h2>
                </div>
            </div>
        </>
    );
}

export default Selectbox;
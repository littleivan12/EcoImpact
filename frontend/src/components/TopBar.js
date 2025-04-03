import React, { useState } from 'react';
import { Link } from "react-router-dom";
import "./TopBar.css";

function TopBar({hex1, hex2}){
    const [color1, setColor1] = useState(hex1);
    const [color2, setColor2] = useState(hex2);
    
    return(
        <div
            className="bar-main"
            style={{
                background: `linear-gradient(45deg, ${color1}, ${color2})`
            }}
        >
            <div className="logo">
                <Link to="/" >
                    <p>EcoImpact</p>
                </Link>
            </div>
        </div>
    )
}

export default TopBar;
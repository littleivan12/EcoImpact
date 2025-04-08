import React, { useState } from 'react';
import { Link } from "react-router-dom";
import "./TopBar.css";

function TopBar({hex1, hex2}){
    const [color1] = useState(hex1);
    const [color2] = useState(hex2);
    
    return(
        <div
            className="bar-main"
            style={{
                background: `linear-gradient(45deg, ${color1}, ${color2})`
            }}
        >
            <div className="logo">
                <Link to="/" >
                    <img src={"./visuals/name.png"} alt="logo" className={"logo"}/>
                </Link>
            </div>
        </div>
    )
}

export default TopBar;
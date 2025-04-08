import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./BackButton.css";

function BackButton({pageType}){
    const page = `/${pageType}`

    return(
        <Link to={page} className="home-icon">
            <img src={"./visuals/arrow.png"} alt="back" className={"home-img"} />
        </Link>
    );
}

export default BackButton;
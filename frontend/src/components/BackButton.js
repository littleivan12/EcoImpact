import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./BackButton.css";

function BackButton({pageType}){
    const page = `/${pageType}`

    return(
        <Link to={page} className="home-icon">Go Back</Link>
    );
}

export default BackButton;
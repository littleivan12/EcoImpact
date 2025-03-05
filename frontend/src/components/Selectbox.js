import React from 'react'
import { FaCloud, FaWater, FaTree, FaMapMarkedAlt, FaSnowflake, FaRecycle, FaTrash } from "react-icons/fa";
import { Link } from 'react-router-dom';

function Selectbox({page, img, idle_anim, bg_color}){
    return(
        <>
            <div className="card-container">
                <div className="info-card clickable-card">
                    
                    <h2>{page}</h2>
                </div>
            </div>
        </>
    );
}

export default Selectbox;
import React from 'react'
import { Link } from 'react-router-dom';

function Selectbox({page, destination}){
    return(
        <>
            <Link to={destination}>
            <button className="select">
                    <div className="select-container">
                        <h1>Click to go to {page} page</h1>
                    </div>
                </button>
            </Link>   
        </>
    );
}

export default Selectbox;
import React from 'react'
import { Link } from 'react-router-dom';

function Selectbox({page}){
    return(
        <>
            <button className="select">
                    <div className="select-container">
                        <h1>Click to go to {page} page</h1>
                    </div>
            </button>   
        </>
    );
}

export default Selectbox;
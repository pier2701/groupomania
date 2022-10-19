import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import Log from '../components/Log';
import { UidContext } from '../components/AppContext';
import UpdateProfil from '../components/Profil/UpdateProfil';
import { useRouteLoaderData } from 'react-router-dom';

const Profil = () => {
    // on déclare notre vérification "user" 
    const uid = useContext(UidContext);

    return (
        <div className="profil-page">
            {/* on met en place la logique d'autorisation */}
            {uid ? (
                <UpdateProfil />
            ) : (
                <div className="log-container">
                    <div className="icon-profil">
                        <NavLink to='/' className='active-left-nav'>
                            <img tabIndex="0" src="./img/icons/new-home.svg" alt="accueil" />
                        </NavLink>
                        <p>Posts</p>
                    </div>
                    {/* on intègre nos "props" */}
                    <Log signin={false} signup={true} />
                </div>
            )}
        </div>
    );
};

export default Profil;
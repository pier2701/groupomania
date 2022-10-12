import React, { useContext } from 'react';
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
                    {/* on intègre nos "props" */}
                    <Log signin={false} signup={true} />
                </div>
            )}
        </div>
    );
};

export default Profil;
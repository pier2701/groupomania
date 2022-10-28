import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from '../Navbar';
import Home from '../../pages/Home';
import Profil from '../../pages/Profil';
import Trending from '../../pages/Trending';
//import { UidContext } from '../components/AppContext';

const index = () => {
    // on vérifie si le "user" est connecté
    //const uid = useContext(UidContext);

    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                {/* on définie "Profil" comme page par défaut */}
                <Route index element={<Profil />} />

                {/* les routes/pages du site  */}
                <Route path="/home" element={<Home />} />
                <Route path="/profil" element={<Profil />} />
                <Route path="/trending" element={<Trending />} />

                {/* cette route gérera les mauvaises saisies et renvoie vers "Home" */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default index;
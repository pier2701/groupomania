import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from '../Navbar';
import Home from '../../pages/Home';
import Profil from '../../pages/Profil';
import Trending from '../../pages/Trending';

const index = () => {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                {/* on définie "Home" comme page par défaut */}
                <Route index element={<Home />} />

                {/* les routes/pages du site  */}
                <Route path="/" element={<Home />} />
                <Route path="/profil" element={<Profil />} />
                <Route path="/trending" element={<Trending />} />

                {/* cette route gérera les mauvaises saisies et renvoie vers "Home" */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default index;
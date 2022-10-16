import React from 'react';
import { NavLink } from 'react-router-dom';

const LeftNav = () => {
    return (
        <div className='left-nav-container'>
            <div className='icons'>
                <div className='icons-bis'>
                    <NavLink to='/' className='active-left-nav'>
                        <img tabIndex="0" src="./img/icons/new-home.svg" alt="accueil" />
                        <p>Posts</p>
                    </NavLink>

                    <br />
                    <NavLink to='/trending' className='active-left-nav'>
                        <img tabIndex="0" src="./img/icons/trending.svg" alt="posts populaires" />
                        <p>Likés</p>
                    </NavLink>
                    <br />
                    <NavLink to='/profil' className='active-left-nav'>
                        <img tabIndex="0" src="./img/icons/user-info.svg" alt="infos utilisateur" />
                        <p>Infos</p>
                    </NavLink>
                </div>
            </div>
        </div>
    );
};

export default LeftNav;
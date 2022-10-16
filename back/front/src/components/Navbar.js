import React, { useContext } from 'react';
import { useSelector } from "react-redux";
import { NavLink } from 'react-router-dom';
import { UidContext } from './AppContext';
import Logout from "./Log/Logout";

const Navbar = () => {
    // on vérifie si le "user" à les autorisations
    const uid = useContext(UidContext);

    // on met à dispodition les "datas" du userReducer pour les afficher
    const userData = useSelector((state) => state.userReducer);

    return (
        <nav>
            <div className="nav-container">
                <div className="logo">
                    <h1><img src="./img/logo-black.svg" alt="logo du site" /></h1>
                </div>
                {uid ? ( // si le "user" est coonnecté
                    <ul>
                        <li></li>
                        <li className='welcome'>
                            <NavLink to="/profil">
                                {/* on passe la "data" */}
                                {(userData.admin === true) && <h2 tabIndex="0">Admin</h2>}
                                {(userData.admin === false) && <h2 tabIndex="0">{userData.pseudo} 👤</h2>}
                            </NavLink>
                        </li>
                        <Logout />
                    </ul>
                ) : ( // sinon on indique le "login"
                    <ul>
                        <li></li>
                        <li>
                            <div className='log-hover'>
                                <NavLink to="/profil">
                                    <img tabIndex="0" className='icon_log' src="./img/icons/log_in.svg" alt="s'enregistrer" />
                                </NavLink>
                                <div className='login-icon'>Se connecter</div>
                            </div>
                        </li>
                    </ul>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
import React, { useContext } from 'react';
import { useSelector } from "react-redux";
import { NavLink } from 'react-router-dom';
import { UidContext } from './AppContext';
import Logout from "./Log/Logout";

const Navbar = () => {
    // on vérifie si le "user" à les autorisations
    const uid = useContext(UidContext);

    // on met à dispodition les "datas" du userReducer
    const userData = useSelector((state) => state.userReducer);

    return (
        <nav>
            <div className="nav-container">
                <div className="logo">
                    <NavLink to="/">
                        <img src="./img/logo-black.svg" alt="logo du site" />
                    </NavLink>
                </div>
                {uid ? ( // si le "user" est coonnecté
                    <ul>
                        <li></li>
                        <li className='welcome'>
                            <NavLink to="/profil">
                                {/* on passe la "data" */}
                                <h5>{userData.pseudo} ✅ </h5>
                            </NavLink>
                        </li>
                        <Logout />
                    </ul>
                ) : ( // sinon on indique le "login"
                    <ul>
                        <li></li>
                        <li>
                            <NavLink to="/profil">
                                <img className='icon_log' src="./img/icons/log_in.svg" alt="login" />
                            </NavLink>
                        </li>
                    </ul>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
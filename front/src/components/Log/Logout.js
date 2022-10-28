import React from 'react';
import axios from 'axios';
import cookie from "js-cookie";

const Logout = () => {
    // on créé la logique pour retirer le cookie via le module
    const removeCookie = (key) => { // key = jwt
        if (window !== "undefined") { // si "key" est présente
            cookie.remove(key, { expires: 1 }); // il expirera en 1 ms.
        }
    }

    // on implémente la logique de déconnection
    const logout = async () => {
        await axios({ // on déconnecte le "user" et on retire le jwt du "backend"
            method: 'get',
            url: "http://localhost:8000/api/user/logout",
            withCredentials: true,
        })
            .then(() => removeCookie('jwt')) // on retire le cookie du "user" de la partie "front"
            .catch((error) => console.log("erreur de logout : " + error))

        // on revient à l'acceuil
        window.location = "/";
    }

    return (
        <div className='log-hover'>
            <li onClick={logout}>
                <img tabIndex="0" className='icon_log' src="./img/icons/log_out.svg" alt="logout" />
            </li>
            <div className='login-icon'>Se déconnecter</div>
        </div>
    );
};

export default Logout;
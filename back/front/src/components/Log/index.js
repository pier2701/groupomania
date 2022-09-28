import React, { Fragment, useState } from 'react';
import SignUpForm from './SignUpForm';
import SignInForm from './SignInForm';

const Log = (props) => {
    // on créé nos states et on récupère nos "props"
    const [singUpModal, setSignUpModal] = useState(props.signup);
    const [singInModal, setSignInModal] = useState(props.signin);

    // on met en place la logique d'affichage alterné via "onClick"
    const handleModals = (e) => {
        if (e.target.id === "register") {
            setSignInModal(false);
            setSignUpModal(true);
        } else if (e.target.id === "login") {
            setSignInModal(true);
            setSignUpModal(false);
        }
    };

    return (
        <Fragment>
            {/* <div>
                {/* cette image vient du dossier public */}
            {/* <img src="./img/logo.png" className="App-logo" alt="logo" />

                <img src="./img/logoName.png" className="App-name" alt="logo_name" /></div>
             
            */}
            <div className="connection-form">
                <div className='display-logo'>
                    <img src="./img/logo.png" className="App-logo" alt="logo" />
                    <img src="./img/logoName.png" className="App-name" alt="logo_name" />
                </div>
                <div className="form-container">
                    <ul>
                        <li
                            id='register'
                            onClick={handleModals}
                            className={singUpModal ? "active-btn" : null}>
                            S'inscrire
                        </li>
                        <li
                            id='login'
                            onClick={handleModals}
                            className={singInModal ? "active-btn" : null}>
                            S'enregistrer
                        </li>
                    </ul>
                    {singUpModal && <SignUpForm />}
                    {singInModal && <SignInForm />}

                </div>
            </div>
        </Fragment>
    );
};

export default Log;
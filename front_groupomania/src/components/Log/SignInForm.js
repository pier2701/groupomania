import React, { useState } from 'react';
import axios from 'axios';

const SignInForm = () => {
    // on déclare nos "hooks"
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // on déclare la logique lors de la "soumission"
    const handleLogin = (e) => {
        e.preventDefault();
        // on stockera les erreurs via des variables
        const emailError = document.querySelector(".email.error");
        const passwordError = document.querySelector(".password.error");
        // on met en place notre logique avec le backend
        axios({
            method: "post",
            url: `http://localhost:8000/api/user/login`,
            withCredentials: true,
            data: {
                email: email,
                password: password,
            },
        })
            .then((res) => {
                console.log(res.data.errors);
                if (res.data.errors) {
                    // on affichera les différents types d'erreurs
                    emailError.textContent = res.data.errors.email;
                    passwordError.textContent = res.data.errors.password;
                } else {
                    // sinon on est redirigé vers la page d'accueil
                    window.location = "/";
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        // le formulaire de connection
        <form action="" onSubmit={handleLogin} id="sign-up-form">
            <label className='label-log' htmlFor="email">Email</label>
            <br />
            <input
                type="text"
                name='email'
                id='email'
                onChange={(e) => setEmail(e.target.value)}
                value={email}
            />
            {/* gestion des erreurs dans "email" */}
            <div className="email error"></div>

            <br />
            <label className='label-log' htmlFor="password">Mot de passe</label>
            <br />
            <input
                type="password" // permet de masquer la saisie du front
                name="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
            />
            {/* gestion des erreurs dans "email" */}
            <div className="password error"></div>

            <br />
            {/* "submit" déclanchera "onSubmit" */}
            <input type="submit" value="Se connecter" />
        </form>
    );
};

export default SignInForm;
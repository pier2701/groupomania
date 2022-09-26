import React, { Fragment, useState } from 'react';
import axios from 'axios';
// on redirige notre "user" pour la création du "token"
import SignInForm from "./SignInForm";

const SignUpForm = () => {
    // les states
    const [formSubmit, setFormSubmit] = useState(false);
    const [pseudo, setPseudo] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [controlPassword, setControlPassword] = useState('');

    // la logique du formulaire
    const handleRegister = async (e) => {
        e.preventDefault();

        // on consigne l'erreur des "pseudo"
        const pseudoError = document.querySelector('.pseudo.error');

        // on consigne l'erreur des "email"
        const emailError = document.querySelector('.email.error');

        // on consigne l'erreur des "password"
        const passwordError = document.querySelector('.password.error');

        // on consigne l'erreur de confirmation des "password"
        const passwordConfirmError = document.querySelector('.password-confirm.error');

        // on enlève le message d'erreur
        passwordConfirmError.textContent = "";

        // on prévient le "user" de l'erreur
        if (password !== controlPassword) {
            passwordConfirmError.textContent = "Les mots de passe ne correspondent";
        } else {
            await axios({
                // on soumet le formulaire au backend via "axios"
                method: "post",
                url: `http://localhost:8000/api/user/register`,
                data: {
                    pseudo: pseudo,
                    email: email,
                    password: password,
                },
            })
                .then((res) => {
                    console.log(res);
                    if (res.data.errors) {
                        console.log(res.data.errors);
                        pseudoError.textContent = res.data.errors.pseudo;
                        emailError.textContent = res.data.errors.email;
                        passwordError.textContent = res.data.errors.password;
                    }
                    else { setFormSubmit(true); }
                })
                .catch((err) => console.log(err));
        }
    };

    return (
        <Fragment>
            {formSubmit ? ( // on affiche le formulaire de connection
                <>
                    <span></span>
                    <SignInForm />
                    <h4 className='create_account'>Compte créé, veuillez-vous connecter</h4>
                </>
            ) : ( // on soumet le formulaire d'inscription
                <form action="" onSubmit={handleRegister} id="sign-up-form">
                    <label htmlFor="pseudo">Votre pseudo</label>
                    <br />
                    <input
                        type="text"
                        name="pseudo"
                        id="pseudo"
                        onChange={(e) => setPseudo(e.target.value)}
                        value={pseudo}
                    />
                    {/* on exploitera les erreurs pour le "user" */}
                    <div className="pseudo error"></div>
                    <br />

                    <label htmlFor="email">Votre email</label>
                    <br />
                    <input
                        type="text"
                        name="email"
                        id="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                    <div className="email error"></div>
                    <br />

                    <label htmlFor="password">Créer votre mot de passe</label>
                    <br />
                    <input // 
                        type="password"
                        name="password"
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                    <div className="password error"></div>
                    <br />

                    <label htmlFor="password-conf">Confirmer votre mot de passe</label>
                    <br />
                    <input
                        type="password"
                        name="password"
                        id="password-conf"
                        onChange={(e) => setControlPassword(e.target.value)}
                        value={controlPassword}
                    />
                    <div className="password-confirm error"></div>
                    <br />

                    <input type="submit" value="Créer votre compte" />
                </form>
            )}
        </Fragment >
    );
};

export default SignUpForm;
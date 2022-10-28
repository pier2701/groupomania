import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import UploadImg from "./UploadImg";
import { updateBio } from '../../actions/user.actions'
import { dateParser } from "../Utils";
import FollowHandler from './FollowHandler';

const UpdateProfil = () => {
    // on met en place la partie "biographie"
    const [bio, setBio] = useState('')

    // mise en place de la condition pour "p" => "textarea"
    const [updateForm, setUpdateForm] = useState(false);

    // on récupère les "data" via redux
    const userData = useSelector((state) => state.userReducer)

    // on récupère les "data" via redux
    const usersData = useSelector((state) => state.usersReducer)

    // on récupère la logique de la gestion "error" via redux
    const error = useSelector((state) => state.errorReducer.userError);

    // on redistribue la "data" via redux
    const dispatch = useDispatch();

    // on met en place la logique d'affichage des "modal" avant le "click" ( false )
    const [followingModal, setFollowingModal] = useState(false);
    const [followersModal, setFollowersModal] = useState(false);

    // la logique lors du "click"
    const handleUpdate = () => { // on importe la logique 
        dispatch(updateBio(userData._id, bio));
        setUpdateForm(false); // on remet notre formulaire
    };

    return (
        <div className='profil-container'>
            <div className="icon-profil">
                <NavLink to='/home' className='active-left-nav'>
                    <img tabIndex="0" src="./img/icons/new-home.svg" alt="accueil" />
                </NavLink>
                <p>Posts</p>
            </div>
            {/* on intègre dynamiquement le "pseudo" */}
            <h2>Profil de {userData.pseudo}</h2>

            <div className="update-container">
                <div className="left-part">
                    {/* <h3>Photo du profil</h3> */}
                    {/* on change dynamiquement la photo */}
                    <img src={userData.picture} alt="photo du profil" />
                    <UploadImg />
                    {/* on implémente les messages "error" */}
                    <p>{error.maxSize}</p>
                    <p>{error.format}</p>
                </div>
                <div className="right-part">
                    <div className="bio-update">
                        {/* <h3>Bio</h3> */}
                        {updateForm === false && (
                            <>
                                {/* les 2 façons pour éditer la "bio" */}
                                <h3 tabIndex="0" onClick={() => setUpdateForm(!updateForm)}>{userData.bio}</h3>
                                <button onClick={() => setUpdateForm(!updateForm)}>
                                    Votre service
                                </button>
                            </>
                        )}
                        {updateForm && ( // si "updateForm" est "true"
                            <>
                                <textarea
                                    tabIndex="2"
                                    typeof='text'
                                    defaultValue={userData.bio} // on modifie à partir de la valeur précèdente
                                    onChange={(e) => setBio(e.target.value)}
                                ></textarea>
                                <button onClick={handleUpdate}>modifier</button>
                            </>
                        )}
                    </div>
                    <h4>Inscrit depuis le {dateParser(userData.createdAt)}</h4>
                    {/* on affichera le modal au "click" */}
                    <h5 tabIndex="0" onClick={() => setFollowingModal(true)}>
                        {userData.following ? userData.following.length : ""} Abonnement{userData.following && userData.following.length > 1 ? "s" : null}
                    </h5>
                    {/* on affichera le modal au "click" */}
                    <h5 tabIndex="0" onClick={() => setFollowersModal(true)}>
                        {userData.followers ? userData.followers.length : ""} Abonné{userData.followers && userData.followers.length > 1 ? "s" : null}
                    </h5>
                </div>
            </div>
            {followingModal && // followingModal = true
                <div className="popup-profil-container">
                    <div className="modal">
                        <h3>Abonnements</h3>
                        <span tabIndex="0" className="cross" onClick={() => setFollowingModal(false)}>
                            {/* code html pour afficher une croix */}
                            &#10005;
                        </span>
                        {/* on affiche les "users" que le profil suit */}
                        <ul>
                            {usersData.map((user) => {
                                for (let i = 0; i < userData.following.length; i++) {
                                    if (user._id === userData.following[i]) {
                                        return (
                                            <li key={user._id}>
                                                <img src={user.picture} alt="user photo" />
                                                <h4>{user.pseudo}</h4>
                                                <div className="follow-handler">
                                                    {/* le "type" définira le type d'affichage */}
                                                    <FollowHandler idToFollow={user._id} type={"suggestion"} />
                                                </div>
                                            </li>
                                        );
                                    }
                                }
                                return null;
                            })}
                        </ul>
                    </div>
                </div>}
            {followersModal && (// followersModal = true
                <div className="popup-profil-container">
                    <div className="modal">
                        <h3>Abonnés</h3>
                        <span tabIndex="0" className="cross" onClick={() => setFollowersModal(false)}>
                            {/* code html pour afficher une croix */}
                            &#10005;
                        </span>
                        {/* on affiche les "users" que le profil suit */}
                        <ul>
                            {usersData.map((user) => {
                                for (let i = 0; i < userData.followers.length; i++) {
                                    if (user._id === userData.followers[i]) {
                                        return (
                                            <li key={user._id}>
                                                <img src={user.picture} alt="user photo" />
                                                <h4>{user.pseudo}</h4>
                                                <div className="follow-handler">
                                                    {/* le "type" définira le type d'affichage */}
                                                    <FollowHandler idToFollow={user._id} type={"suggestion"} />
                                                </div>
                                            </li>
                                        );
                                    }
                                }
                                return null;
                            })}
                        </ul>
                    </div>
                </div>)}
        </div>
    );
};

export default UpdateProfil;
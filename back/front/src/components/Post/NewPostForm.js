import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty, timestampParser } from "../Utils";
import { NavLink } from "react-router-dom";

const NewPostForm = () => {
    // on met en place le "loading-spinner"
    const [isLoading, setIsLoading] = useState(true);

    // on déclare la logique du "message"
    const [message, setMessage] = useState("");

    // on déclare la logique d'une "photo"
    const [postPicture, setPostPicture] = useState(null);

    // on déclare la logique d'une "video"
    const [video, setVideo] = useState();

    // on déclare la logique d'une "image"
    const [file, setFile] = useState();

    // on met à disposition le "store" ("userReducer")
    const userData = useSelector((state) => state.userReducer);

    //
    //const error = useSelector((state) => state.errorReducer.postError);

    //
    const dispatch = useDispatch();


    // on implémente la gestion de l'image au "click"
    const handlePicture = (e) => {

    };

    //
    const handlePost = () => {

    };

    // on implémente la logique pour annuler un "post"
    const cancelPost = () => {
        setMessage("");
        setPostPicture("");
        setVideo("");
        setFile("");
    };

    // on passe le "loading" sur "false" après le chargement des "data"
    useEffect(() => {
        if (!isEmpty(userData))
            setIsLoading(false);
    }, [userData]); // si la "data" évolue, on relance la fonction

    return (
        <div className="post-container">
            {isLoading ? (
                <i className="fas fa-spinner fa-pulse"></i>
            ) : ( // on affiche la "data"
                <>
                    <div className="data">
                        <p>
                            <span>
                                {userData.following ? userData.following.length : 0}
                                {/* on gère le "s" de "Abonnement" */}
                            </span> Abonnement{userData.following && userData.following.length > 1 ? "s" : null}
                        </p>
                        <p>
                            <span>
                                {userData.followers ? userData.followers.length : 0}
                                {/* on gère le "s" de "Abonnement" */}
                            </span> Abonné{userData.followers && userData.followers.length > 1 ? "s" : null}
                        </p>
                    </div>
                    {/* le "user" peut être rediriger vers sa page profil */}
                    {/* <NavLink to="/profil"> */}
                    <div className="user-info">
                        <img src={userData.picture} alt="photo du profil" />
                    </div>
                    {/* </NavLink> */}
                    <div className="post-form">
                        <textarea
                            name="message"
                            id="message"
                            placeholder="Votre post ... 💬"
                            onChange={(e) => setMessage(e.target.value)}
                            value={message} />
                        {/* on propose un rendu provisoire sous conditions */}
                        {message || postPicture || video > 20 ? (
                            <li className="card-container">
                                <div className="card-left">
                                    <img src={userData.picture} alt="user" />
                                </div>
                                <div className="card-right">
                                    <div className="card-header">
                                        <div className="pseudo">
                                            <h3>{userData.pseudo}</h3>
                                        </div>
                                        <span>{timestampParser(Date.now())}</span>
                                    </div>
                                    {/* on affiche le rendu définitif */}
                                    <div className="content">
                                        <p>{message}</p>
                                        <img src={postPicture} alt="" />
                                        {video && (
                                            <iframe
                                                src={video}
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                title={video}
                                            ></iframe>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ) : null}
                        <div className="footer-form">
                            <div className="icon">
                                {isEmpty(video) && (
                                    <>
                                        <img src="./img/icons/picture.svg" alt="icon image" />
                                        <input
                                            type="file"
                                            id="file-upload"
                                            name="file"
                                            accept=".jpg, .jpeg, .png"
                                            onChange={(e) => handlePicture(e)}
                                        />
                                    </>
                                )}
                                {video && (
                                    <button onClick={() => setVideo("")}>
                                        Supprimer vidéo
                                    </button>
                                )}
                            </div>
                            <div className="btn-send">
                                {/* on déclare les conditions pour "annuler" un post */}
                                {message || postPicture || video > 20 ? (
                                    <button className="cancel" onClick={cancelPost}>
                                        annuler 🚫
                                    </button>
                                    // sinon on enlève le "button"
                                ) : null}
                                <button className="send" onClick={handlePost}>
                                    poster 📬
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default NewPostForm;
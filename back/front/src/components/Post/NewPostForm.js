import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty, timestampParser } from "../Utils";
import { addPost, getPosts } from "../../actions/post.actions";

const NewPostForm = () => {
    // on met en place le "loading-spinner"
    const [isLoading, setIsLoading] = useState(true);

    // on déclare la logique du "message"
    const [message, setMessage] = useState("");

    // on déclare la logique d'une "image" pour le "front"
    const [postPicture, setPostPicture] = useState(null);

    // on déclare la logique d'une "video"
    const [video, setVideo] = useState("");

    // on déclare la logique de la gestion d'une "image" à envoyer au "back"
    const [file, setFile] = useState();

    // on met à disposition le "store" ("userReducer")
    const userData = useSelector((state) => state.userReducer);

    // on met à disposition le "store" ("errorReducer")
    const error = useSelector((state) => state.errorReducer.postError);

    // on appelle la fonction pour passer les "actions"
    const dispatch = useDispatch();

    // on implémente la logique pour transmettre les "data" à la base de données
    const handlePost = async () => {
        // on vérifie s'il y a du contenu
        if (message || postPicture || video) {
            const data = new FormData(); // on déclare les "data" à envoyer au "back"
            data.append('userId', userData._id);
            data.append('message', message);
            if (file) data.append("file", file);
            data.append('video', video);

            await dispatch(addPost(data)); // on met à disposition "addPost" pour envoyer "data"
            dispatch(getPosts()); // on met à jour les "posts"
            cancelPost(); // on remet les champs de saisies à jour
        } else {
            alert('votre "post" est vide 📭')
        }
    };


    // on implémente la gestion de l'image au "click"
    const handlePicture = (e) => { // la logique permet de prévisualiser l'image
        setPostPicture(URL.createObjectURL(e.target.files[0]));
        setFile(e.target.files[0]); // on rend l'image disponible via des requêtes ("req.file")
        setVideo(""); // s'il y a une "video", elle sera enlevée
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

        // on implémente la logique pour gérer une "video"
        const handleVideo = () => {
            let findLink = message.split(" "); // on sépare le "message" par un espace
            for (let i = 0; i < findLink.length; i++) {
                if ( // si on trouve des liens avec "youtube"
                    findLink[i].includes("https://www.youtube") ||
                    findLink[i].includes("https://youtube")
                ) { // on rend la "video" accessible dans l'application
                    let embed = findLink[i].replace("watch?v=", "embed/");
                    setVideo(embed.split("&")[0]); // on "split" au niveau du "&" et on garde le début
                    findLink.splice(i, 1); // on splice et supprime le lien "video"
                    setMessage(findLink.join(" ")); // on transmet la "video" sous forme de caractères 
                    setPostPicture(''); // s'il y a une photo, elle sera enlevée
                }
            }
        };

        handleVideo(); // on lance la fonction s'il y a une "video"
    }, [userData, message, video]); // si la "data" évolue, on relance la fonction



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
                                    <img src={userData.picture} alt="photo du profil" />
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
                                                title="Youtube Player">
                                            </iframe>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ) : null}
                        <div className="footer-form">
                            <div className="icon">
                                {isEmpty(video) && ( // sans lien "video", on propose l'icône "images"
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
                                {video && ( // si on a un contenu "video"
                                    <button onClick={() => setVideo("")}>
                                        {/* on propose l'option de suppression "video" */}
                                        <img src="./img/icons/delete.png" alt="annuler la vidéo" />
                                    </button>
                                )}
                            </div>
                            {/* on affiche les "error" s'il y en a */}
                            {!isEmpty(error.format) && <p>{error.format}</p>}
                            {!isEmpty(error.maxSize) && <p>{error.maxSize}</p>}
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
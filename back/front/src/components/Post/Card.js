import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty, dateParser } from '../Utils';
import FollowHandler from '../Profil/FollowHandler';
import LikeButton from "./LikeButton";
import { getPosts, updatePost } from '../../actions/post.actions';
import DeleteCard from './DeleteCard';
import CardComments from './CardComments';

const Card = ({ post }) => {
    // on met en place un loading spinner
    const [isLoading, setIsLoading] = useState(true);

    // on implémente une variable pour la mise à jour 
    const [isUpdated, setIsUpdated] = useState(false);

    // on implémente une variable pour sauvegarder le nouveau "text"
    const [textUpdate, setTextUpdate] = useState(null);

    // on déclare la logique de la gestion d'une "image" à envoyer au "back"
    const [file, setFile] = useState();

    // on implémente la logique pour afficher les commentaires
    const [showComments, setShowComments] = useState(false);

    // on implémente la logique pour afficher la "data" des "user"
    const usersData = useSelector((state) => state.usersReducer);

    // on implémente la logique pour afficher la data du "user"
    const userData = useSelector((state) => state.userReducer);

    // on appelle "dispatch" pour déclencher les "actions"
    const dispatch = useDispatch();

    // on implémente la fonction pour mettre à jour le "text"
    const updateItem = async () => {
        if (textUpdate || file) { // s'il y a du contenu à modifier
            const data = new FormData();
            data.append('message', textUpdate);
            data.append('file', file);
            await dispatch(updatePost(post._id, data)) // mise à jour du "text" via le userId du post
            dispatch(getPosts()); // on met à jour les "posts"
        }
        setIsUpdated(false); // on enlève la partie "édition" de texte
    };

    // on créé la logique pour enlever le spinner et afficher les "data"
    useEffect(() => {
        !isEmpty(usersData[0]) && setIsLoading(false)
    }, [usersData]); // le callback

    return (
        <li className='card-container' key={post._id}>
            {isLoading ? ( // le spinner est "true" en attendant la "data"
                <i className="fas fa-spinner fa-spin"></i>
            ) : (
                <>
                    <div className="card-left">
                        <img src={
                            !isEmpty(usersData[0]) &&
                            usersData.map((user) => { // on affiche les "post" à jour
                                // on met en place la condition d'affichage
                                if (user._id === post.userId)
                                    return user.picture;
                                else return null;
                            }).join("") // permet d'enlever les virgules lors du "map" 
                        } alt="photo user" />

                    </div>
                    <div className="card-right">
                        <div className="card-header">
                            <div className="pseudo">
                                <h2>
                                    {/* on indique la condition pour éviter de s'abonner soi-même */}
                                    {post.userId !== userData._id && (
                                        <FollowHandler idToFollow={post.userId} type={"card"} />
                                    )}
                                    {/* on affiche le "pseudo" */}
                                    {!isEmpty(usersData[0]) &&
                                        usersData.map((user) => {
                                            if (user._id === post.userId) return user.pseudo;
                                            else return null;
                                        }).join("")}
                                    <br />
                                    <span>
                                        {/* on indique le "service" des employés */}
                                        Service : {!isEmpty(usersData[0]) &&
                                            usersData.map((user) => {
                                                if (user._id === post.userId) return user.bio;
                                                else return null;
                                            }).join("")}
                                    </span>
                                </h2>
                            </div>
                            {/* on implémente la date via "dateParser" */}
                            <span>{dateParser(post.createdAt)}</span>
                            {/* on implémente le nombre d'abonnés et d'abonnements */}
                            <span className='follow'>
                                {!isEmpty(usersData[0]) &&
                                    usersData.map((user) => {
                                        if (user._id === post.userId) return user.following.length;
                                        else return null;
                                    }).join("")} Abonnement(s)
                                <br />
                                {!isEmpty(usersData[0]) &&
                                    usersData.map((user) => {
                                        if (user._id === post.userId) return user.followers.length;
                                        else return null;
                                    }).join("")} Abonné(s)
                            </span>
                        </div>
                        {/* s'il n'y a pas de modifications => false && <p> */}
                        {isUpdated === false && <h2>{post.message}</h2>}
                        {isUpdated && ( // "isUpdated" => true
                            <div className="update-post">
                                <textarea
                                    defaultValue={post.message} // message initial
                                    onChange={(e) => setTextUpdate(e.target.value + " ( modifié )")} // on indique en front la modification
                                />
                                <div className="icon">
                                    <>
                                        <img src="./img/icons/picture1.svg" alt="icon paysage" />
                                        <input
                                            aria-label="ajouter une image"
                                            type="file"
                                            id="file-upload"
                                            name="file"
                                            accept=".jpg, .jpeg, .png"
                                            onChange={(e) => setFile(e.target.files[0])}
                                        />
                                    </>
                                    <span className='add-img'>changer l'image</span>
                                </div>
                                <div className="button-container">
                                    <button className='btn' onClick={updateItem}>
                                        Changer le post
                                    </button>
                                </div>
                            </div>
                        )}
                        {/* on implémente nos fichiers */}
                        {post.imageUrl && <img src={post.imageUrl} alt="image du post" className='card-pic' />}
                        {userData._id === post.userId && userData.admin === false && ( // on vérifie que les 2 id soient identiques
                            <div className="button-container">
                                <div onClick={() => setIsUpdated(!isUpdated)}>
                                    {/* on inverse les états au click => toggle  */}
                                    <img src="./img/icons/edit.svg" alt="changer le texte" />
                                </div>
                                <DeleteCard id={post._id} />
                            </div>
                        )}
                        {userData.admin === true && (
                            <div className="button-container">
                                <div onClick={() => setIsUpdated(!isUpdated)}>
                                    <img src="./img/icons/edit.svg" alt="modifier le commentaire" />
                                </div>
                                <DeleteCard id={post._id} />
                            </div>
                        )}
                        <div className="card-footer">
                            <div className="comment-icon">
                                {/* "onClick" aura l'effet d'un "toggle" et inversera l'état de "showComments" */}
                                <img tabIndex="0" onClick={() => setShowComments(!showComments)} src="./img/icons/message.svg" alt="commentaire" />
                                <span>{post.comments.length}</span>
                            </div>
                            {/* on récupère en "props" les "data" */}
                            <LikeButton post={post} />
                        </div>
                        {/* si "showComments" = true => on affichera le composant <CardComments /> */}
                        {showComments && <CardComments post={post} />}
                    </div>
                </>
            )}
        </li>
    );
};

export default Card;
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty, dateParser } from '../Utils';
import FollowHandler from '../Profil/FollowHandler';
import LikeButton from "./LikeButton";
import { updatePost } from '../../actions/post.actions';
import DeleteCard from './DeleteCard';
import CardComments from './CardComments';


const Card = ({ post }) => {
    // on met en place un loading spinner
    const [isLoading, setIsLoading] = useState(true);

    // on implémente une variable pour la mise à jour 
    const [isUpdated, setIsUpdated] = useState(false);

    // on implémente une variable pour sauvegarder le nouveau "text"
    const [textUpdate, setTextUpdate] = useState(null);

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
        if (textUpdate) { // s'il y a du contenu à modifier
            dispatch(updatePost(post._id, textUpdate)) // mise à jour du "text" via le userId du post
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
                                <h3>
                                    {!isEmpty(usersData[0]) &&
                                        usersData.map((user) => {
                                            if (user._id === post.userId) return user.pseudo;
                                            else return null;
                                        }).join("")}
                                </h3>
                                {/* on indique la condition pour éviter de s'abonner soi-même */}
                                {post.userId !== userData._id && (
                                    <FollowHandler idToFollow={post.userId} type={"card"} />
                                )}
                            </div>
                            {/* on implémente la date via "dateParser" */}
                            <span>{dateParser(post.createdAt)}</span>
                        </div>
                        {/* s'il n'y a pas de modifications => false && <p> */}
                        {isUpdated === false && <p>{post.message}</p>}
                        {isUpdated && ( // "isUpdated" => true
                            <div className="update-post">
                                <textarea
                                    defaultValue={post.message} // message initial
                                    onChange={(e) => setTextUpdate(e.target.value)} />
                                <div className="button-container">
                                    <button className='btn' onClick={updateItem}>
                                        Changer le message
                                    </button>
                                </div>
                            </div>
                        )}
                        {/* on implémente nos fichiers */}
                        {post.imageUrl && <img src={post.imageUrl} alt="image du post" className='card-pic' />}
                        {userData._id === post.userId && ( // on vérifie que les 2 id soient identiques
                            <div className="button-container">
                                <div onClick={() => setIsUpdated(!isUpdated)}>
                                    {/* on inverse les états au click => toggle  */}
                                    <img src="./img/icons/edit.svg" alt="changer le texte" />
                                </div>
                                <DeleteCard id={post._id} />
                            </div>
                        )}
                        <div className="card-footer">
                            <div className="comment-icon">
                                {/* "onClick" aura l'effet d'un "toggle" et inversera l'état de "showComments" */}
                                <img onClick={() => setShowComments(!showComments)} src="./img/icons/message1.svg" alt="commentaire" />
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
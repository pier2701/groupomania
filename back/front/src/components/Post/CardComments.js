import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addComment, getPosts } from '../../actions/post.actions';
import FollowHandler from "../Profil/FollowHandler";
import { isEmpty, timestampParser } from "../Utils";
import EditDeleteComment from './EditDeleteComment';

const CardComments = ({ post }) => {
    // on déclare la variable pour stocker le "commentaire" 
    const [text, setText] = useState("");

    // on récupère les "data" via les 2 variables
    const usersData = useSelector((state) => state.usersReducer);
    const userData = useSelector((state) => state.userReducer);

    // on utlisera "dispatch" pour déclencher les actions 
    const dispatch = useDispatch();

    // on implémente la logique au "click"
    const handleComment = (e) => {
        e.preventDefault();

        // si le "form" contient de la "data"
        if (text) { // on passe les "data" en paramètre
            dispatch(addComment(post._id, userData._id, text, userData.pseudo))
                .then(() => dispatch(getPosts())) // on récèpere les nouvelles "data" générées du "comment"
                .then(() => setText('')) // on réinitialise le champ "input"
        }
    }

    return (
        <div className="comments-container">
            {/* on récupère les "comments" */}
            {post.comments.map((comment) => {
                return ( // on utlise la condition "ternaire" pour afficher 2 styles différents
                    <div className={comment.commenterId === userData._id ?
                        "comment-container client" : // le "comment du "user"
                        "comment-container"} key={comment._id} // les "comments"
                    >
                        <div className="left-part">
                            {/* on implémente la même logique d'affichage de l'image que dans <Card /> */}
                            <img src={!isEmpty(usersData[0]) &&
                                usersData.map((user) => {
                                    if (user._id === comment.commenterId)
                                        return user.picture;
                                    else return null;
                                }).join("")}
                                alt="photo de l'utilisateur qui commente" />
                        </div>
                        <div className="right-part">
                            <div className="comment-header">
                                <div className="pseudo">
                                    <h3>{comment.commenterPseudo}</h3>
                                    {/* on met en place la condition pour ne pas se "follow" soi-même */}
                                    {comment.commenterId !== userData._id &&
                                        <FollowHandler idToFollow={comment.commenterId} type={"card"} />}
                                </div>
                                {/* on indique la date traitée via => "timestampParser" */}
                                <span>{timestampParser(comment.timestamp)}</span>
                            </div>
                            <p>{comment.text}</p>
                            {/* on passe les "props" pour la mise à jour */}
                            <EditDeleteComment comment={comment} postId={post._id} />
                        </div>
                    </div>
                );
            })}
            {userData._id && ( // le "user" doit être connecté
                <form action="" onSubmit={handleComment} className="comment-form">
                    <input
                        aria-label="ajouter un message"
                        type="text"
                        name="text"
                        onChange={(e) => setText(e.target.value)} // on stockera dans les "states"
                        value={text}
                        placeholder="exprimez-vous ici 💬" />
                    <br />
                    <input type="submit" value="poster 📬" />
                </form>
            )}
        </div>
    );
};

export default CardComments;
import React, { useContext, useState, useEffect } from 'react';
import { UidContext } from '../AppContext';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { useDispatch } from "react-redux";
import { likePost, unlikePost } from "../../actions/post.actions";

// on créé la logique via le "props"
const LikeButton = ({ post }) => {
    // on determine l'état du "like" par défaut "false"
    const [liked, setLiked] = useState(false);

    // on récupère le "userId"
    const uid = useContext(UidContext);

    // on déclare la fonction pour accèder au "store"
    const dispatch = useDispatch();

    // la logique du "like" au click
    const like = () => {
        dispatch(likePost(post._id, uid)) // on récupère la logique et met à jour le [likers]
        setLiked(true); // on modifie le coeur en "front"
    };

    // la logique du "unlike" au click
    const unlike = () => {
        dispatch(unlikePost(post._id, uid)) // on récupère la logique et met à jour le [likers]
        setLiked(false); // on modifie le coeur en "front"
    };


    // on teste le "like" 
    useEffect(() => {
        if (post.likers.includes(uid))
            setLiked(true); // on passe le like en "true"
        else setLiked(false); // on passe le like en "false"
    }, [uid, post.likers, liked]); // 3 conditions de relance du "useEffect"

    return (
        <div className="like-container">
            {uid === null && ( // condition "connecté" pour "liker/disliker" un post
                <Popup
                    trigger={<img src="./img/icons/heart.svg" alt="like" />}
                    position={["bottom center", "bottom right", "bottom left"]}
                    closeOnDocumentClick>
                    <div className='popup'>Vous n'êtes pas encore connecté 🤓</div>
                </Popup>
            )}
            {uid && liked === false && ( // si "connecté" et pas encore "liker"
                <img src="./img/icons/heart.svg" onClick={like} alt="like" />
            )}
            {uid && liked && ( // si "connecté" et déjà "liker"
                <img src="./img/icons/heart-filled.svg" onClick={unlike} alt="unlike" />
            )}
            {/* le nombre de "like" */}
            <span>{post.likers.length}</span>
        </div>
    );
};

export default LikeButton;
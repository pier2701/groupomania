import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty, dateParser } from '../Utils';
import FollowHandler from '../Profil/FollowHandler';
import LikeButton from "./LikeButton";


const Card = ({ post }) => {
    // on met en place un loading spinner
    const [isLoading, setIsLoading] = useState(true);

    // on implémente la logique pour afficher la "data" des "user"
    const usersData = useSelector((state) => state.usersReducer);

    // on implémente la logique pour afficher la data du "user"
    const userData = useSelector((state) => state.userReducer);

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
                        <p>{post.message}</p>
                        {/* on implémente nos fichiers */}
                        {post.imageUrl && <img src={post.imageUrl} alt="image du post" className='card-pic' />}
                        {post.video && (
                            <iframe
                                width="500"
                                height="300"
                                src={post.video}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title={post._id}
                            ></iframe>
                        )}
                        <div className="card-footer">
                            <div className="comment-icon">
                                <img src="./img/icons/message1.svg" alt="commentaire" />
                                <span>{post.comments.length}</span>
                            </div>
                            {/* on récupère en "props" les "data" */}
                            <LikeButton post={post} />
                            <img src="./img/icons/share.svg" alt="partager" />
                        </div>
                    </div>
                </>
            )}
        </li>
    );
};

export default Card;
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { followUser, unfollowUser } from '../../actions/user.actions';
import { isEmpty } from '../Utils';

const FollowHandler = ({ idToFollow, type }) => { // on passe en "props" => "type"
    // on récupère les "data" du "user" via le "store"
    const userData = useSelector((state) => state.userReducer);

    // on met en la place la logique du "modal"
    const [isFollowed, setIsFollowed] = useState(false);

    // on met en la place un "hook"
    const dispatch = useDispatch();

    // la logique pour suivre un "user"
    const handleFollow = () => {
        dispatch(followUser(userData._id, idToFollow));
        setIsFollowed(true); // on change dynamiquement le bouton
    };

    // la logique pour ne plus suivre un "user"
    const handleUnfollow = () => {
        dispatch(unfollowUser(userData._id, idToFollow));
        setIsFollowed(false) // on change dynamiquement le bouton
    };

    // la logique qui permettra d'avoir une condition true/false de type "toggle"
    useEffect(() => {
        if (!isEmpty(userData.following)) { // on indique une "data" pour lancer la fonction
            if (userData.following.includes(idToFollow)) {
                setIsFollowed(true);
            } else setIsFollowed(false);
        }
    }, [userData, idToFollow]) // le callback relancera la fonction à chaque modification 

    return (
        <>
            {isFollowed && !isEmpty(userData) && ( // si "true" ("Abonné") alors on affiche la <span>
                // on se désabonne au "click"
                <span onClick={handleUnfollow}>
                    {/* on définit l'affichage en fonction de la "props" du component */}
                    {type === "suggestion" && <button className='unfollow-btn'>Ne pas suivre</button>}
                    {type === "card" && (
                        <div className='follow-icon'>
                            <img tabIndex="0" src='./img/icons/checked1.svg' alt='checked' />
                            <span className='follow-text'>Ne pas suivre</span>
                        </div>
                    )}
                </span>
            )}
            {isFollowed === false && !isEmpty(userData) && ( // si "false" ("pas Abonné")alors on affiche la <span>
                // on s'abonne au "click"
                <span onClick={handleFollow}>
                    {/* on définit l'affichage en fonction de la "props" du component */}
                    {type === "suggestion" && <button className='follow-btn'>Suivre</button>}
                    {type === "card" && (
                        <div className='follow-icon'>
                            <img tabIndex="0" src="./img/icons/check1.svg" alt="check" />
                            <span className='follow-text'>Suivre</span>
                        </div>
                    )}
                </span>
            )}
        </>
    );
};

export default FollowHandler;
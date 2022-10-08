import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { isEmpty } from "../Utils";
import FollowHandler from "./FollowHandler";

// on implémente la logique pour "follow" les "user"
const FriendList = () => {
    // on met en place le "loading spinner"
    const [isLoading, setIsLoading] = useState(true);

    // on relance la logique que s'il y a une mise à jour 
    const [playOnce, setPlayOnce] = useState(true);

    // on implèmente un [] pour intégrer les "data"
    const [friendList, setFriendList] = useState([]);

    // on récupère la "data" du "user"
    const userData = useSelector((state) => state.userReducer);

    // on récupère la "data" des "user"
    const usersData = useSelector((state) => state.usersReducer);

    // 
    useEffect(() => {
        // on implémente la logique pour afficher les "user unfollow"
        const notFriendList = () => {
            let array = [];
            usersData.map((user) => {
                // on retire le "user" de la liste des "user" et des "followers"
                if (user._id !== userData._id && !user.followers.includes(userData._id))
                    return array.push(user._id); // on met dans un [] les "user"
            });
            // on rend aléatoire la liste de résultat
            array.sort(() => 0.5 - Math.random());
            array.length = 5;
            setFriendList(array); // on récupère le [] dans la fonction
        };

        if (playOnce && !isEmpty(usersData[0]) && !isEmpty(userData._id)) {
            notFriendList(); // on affiche les "unfollow" 
            setIsLoading(false); // on arrête le "loading spinner"
            setPlayOnce(false); // on arrête la fonction 
        }
    }, [usersData, userData, playOnce]); // "useEffect" se relancera selon les "update"

    return (
        <div className="get-friends-container">
            <h4>Vos collègues...</h4>
            {isLoading ? ( // le "loading spinner" se lance sans "data"
                <div className="icon">
                    <i className="fas fa-spinner fa-pulse"></i>
                </div>
            ) : (
                <ul>
                    {/* on récupère les "user" */}
                    {friendList && friendList.map((user) => {
                        for (let i = 0; i < usersData.length; i++) {
                            // on récupère les "data" depuis les "usersData"
                            if (user === usersData[i]._id) {
                                return (
                                    <li className="user-hint" key={user}>
                                        <img src={usersData[i].picture} alt="photo du profil" />
                                        <p>{usersData[i].pseudo}</p>
                                        <FollowHandler idToFollow={usersData[i]._id} type={"suggestion"} />
                                    </li>
                                );
                            }
                        }
                    })}
                </ul>
            )}
        </div>
    );
};

export default FriendList;
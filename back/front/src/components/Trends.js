import React, { useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTrends } from "../actions/post.actions";
import { isEmpty } from "./Utils";
import { NavLink } from "react-router-dom";
import FriendsHint from "./Profil/FriendsList";
import { UidContext } from "./AppContext";

const Trends = () => {
    // on récupère le "userId" 
    const uid = useContext(UidContext);

    // on récupère les "post"
    const posts = useSelector((state) => state.allPostsReducer);

    // on récupère les données du "user"
    const usersData = useSelector((state) => state.usersReducer);

    // on récupère les données des 5 tendances via le "store"
    const trendList = useSelector((state) => state.trendingReducer);

    // on déclare la logique pour passer les "actions"
    const dispatch = useDispatch();

    // on déclare la logique pour utiliser le "hook" selon l'état du composant
    useEffect(() => {
        if (!isEmpty(posts[0])) { // on part de la 1ère valeur
            // on attribue une "key" aux "post" via un []
            const postsArr = Object.keys(posts).map((i) => posts[i]);
            // on trie le [] du plus grand au plus petit nombre
            let sortedArray = postsArr.sort((a, b) => {
                return b.likers.length - a.likers.length;
            });
            // on adaptera l'affichage si le "user" est connecté ou pas
            (!isEmpty(uid)) ? sortedArray.length = 3 : sortedArray.length = 7;
            // on transmet les "data" au "store"
            dispatch(getTrends(sortedArray));
        }
    }, [posts, dispatch])

    return (
        <div className="trending-container">
            <div className="trending-like">
                <h4>Posts les plus likés</h4>
                <img src="./img/icons/trending.svg" alt="posts populaires" />
            </div>
            <NavLink to="/trending">
                <ul>
                    {trendList.length &&
                        trendList.map((post) => { // on affiche la liste des tendnaces
                            return (
                                <li tabIndex="0" key={post._id}>
                                    <div>
                                        {/* on affiche la photo du "post" */}
                                        {post.imageUrl && <img src={post.imageUrl} alt="photo du post" />}
                                        {/* on affiche la photo du profil */}
                                        {isEmpty(post.imageUrl) && (
                                            <img src={usersData[0] && usersData.map((user) => {
                                                if (user._id === post.userId) {
                                                    return user.picture;
                                                } else return null;
                                            }).join("")
                                            } alt="photo du profil" />
                                        )}
                                    </div>
                                    <div className="trend-content">
                                        <p>{post.message}</p>
                                        <span>{post.likers.length} <img src="./img/icons/heart-filled.svg" alt="coeur" /></span>
                                    </div>
                                </li>
                            );
                        })}
                </ul>
            </NavLink>
        </div>
    );
};

export default Trends;
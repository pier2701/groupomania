import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPosts } from '../actions/post.actions';
import Card from "./Post/Card";
import { isEmpty } from "./Utils";

const Thread = () => {
    // on implémente la logique pour charger les "post"
    const [loadPost, setLoadPost] = useState(true);

    // on implémente le nombre de "post" à afficher (5)
    const [count, setCount] = useState(5);

    // on déclare "dispatch" pour envoyer "action"
    const dispatch = useDispatch();

    // on implémente la logique pour afficher la "data"
    const posts = useSelector((state) => state.postReducer);

    // la logique pour afficher plus de "post"
    const loadMore = () => { // le "scrollTop" dépasse de 1px => setLoadPost =true => + 5 "post" à afficher
        if (window.innerHeight + document.documentElement.scrollTop + 1 > document.scrollingElement.scrollHeight) {
            setLoadPost(true);
        }
    }

    useEffect(() => {
        if (loadPost) {
            dispatch(getPosts(count)) // requête "axios" pour les 5 premiers "post"
            setLoadPost(false); // "false" nous évitera un 2ème "if"
            setCount(count + 5); // on incrémente de 5 "post" le tour suivant
        }
        // la logique pour afficher les "post" par 5
        window.addEventListener('scroll', loadMore);
        return () => window.removeEventListener('scroll', loadMore);
    }, [loadPost, dispatch]);

    return (
        <div className="thread-container">
            <ul>
                {/* on vérifie qu'il y a des "post" */}
                {!isEmpty(posts[0]) &&
                    posts.map((post) => { // on affiche les "post" via "map"
                        {/* on indique toute la "data" du "post" et une "key" unique */ }
                        return <Card post={post} key={post._id} />;
                    })}
            </ul>
        </div>
    );
};

export default Thread;
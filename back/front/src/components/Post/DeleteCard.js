import React from 'react';
import { useDispatch } from "react-redux";
import { deletePost } from '../../actions/post.actions';

const DeleteCard = (props) => {
    // on déclare la fonction qui déclenchera l'action
    const dispatch = useDispatch();

    // on récupère la logique via le "store" 
    const deleteQuote = () => dispatch(deletePost(props.id))

    return (
        <div onClick={() => { // on fait confirmer le "user" avant la suppression
            if (window.confirm('Vous êtes sur le point de supprimer ce "post", voulez-vous continuer?')) {
                deleteQuote();
            }
        }}>
            <img src="./img/icons/trash.svg" alt="supprimer" />
        </div>
    );
};

export default DeleteCard;
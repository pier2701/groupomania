import React, { useContext, useEffect, useState } from 'react';
import { deleteComment, editComment } from '../../actions/post.actions';
import { useDispatch, useSelector } from "react-redux";
import { UidContext } from "../AppContext";

const EditDeleteComment = ({ comment, postId }) => {
    // on vérifie l'identité du "user" qui modifiera le "comment"
    const [isAuthor, setIsAuthor] = useState(false);

    // on met à disposition la possibilité d'éditer un "comment"
    const [edit, setEdit] = useState(false);

    // on stocker le "comment" dans une variable vide pour recevoir le texte edité
    const [text, setText] = useState("");

    // on récupère le userId via "UidContext"
    const uid = useContext(UidContext);

    // on met à disposition les actions via le "hook"
    const dispatch = useDispatch();

    // on récupère le userData via le "store"
    const userData = useSelector((state) => state.userReducer);

    // on implémente au "click" la modification
    const handleEdit = (e) => {
        e.preventDefault();
        if (text) {
            // on met en action "editComment" via le "dispatch"
            dispatch(editComment(postId, comment._id, text));
            setText(""); // on réinitialise le champ de saisie
            setEdit(false); // on enlève le champ de saisie
        }
    }

    // on implémente au "click" la suppression
    const handleDelete = () => {
        dispatch(deleteComment(postId, comment._id));
    }

    // on vérifie que les 2 identités du "user" soient identiques
    useEffect(() => {
        const checkAuthor = () => {
            if (uid === comment.commenterId) {
                setIsAuthor(true);
            }
        };
        // la fonction se lance
        checkAuthor();
        // les 2 arguments qui permettent de relancer la fonction
    }, [uid, comment.commenterId]);

    return (
        <div className="edit-comment">
            {/* si "isAuthor" = true */}
            {isAuthor && edit === false && userData.admin === false && ( // au click on affichera le champ "edit"
                // on affichera l'édition de texte sous ces 2 conditions
                <span onClick={() => setEdit(!edit)}>
                    <img tabIndex="0" src="./img/icons/edit.svg" alt="modifier le commentaire" />
                </span>
            )}
            {userData.admin === true && edit === false && (
                <span onClick={() => setEdit(!edit)}>
                    <img tabIndex="0" src="./img/icons/edit.svg" alt="modifier le commentaire" />
                </span>
            )}
            {isAuthor && edit && userData.admin === false && ( // si "edit" = true, au "click" on affichera l'icône 
                <form action="" onSubmit={handleEdit} className="edit-comment-form">
                    <label tabIndex="1" htmlFor="text" onClick={() => setEdit(!edit)}>
                        modifier le texte
                    </label>
                    <br />
                    <input // champ de mise à jour du "text" à modifier
                        type="text"
                        name="text"
                        // on récupère la "data" pour mettre à jour notre database
                        onChange={(e) => setText(e.target.value + " ( modifié )")}
                        // on modifie le texte en cours
                        defaultValue={comment.text}
                    />
                    <br />
                    <div className="btn">
                        <span // 
                            onClick={() => {
                                if (window.confirm("Confirmer la suppression de ce commentaire ?")) {
                                    handleDelete();
                                }
                            }}
                        >
                            <img tabIndex="1" src="./img/icons/trash.svg" alt="supprimer" />
                        </span></div>
                    <input type="submit" value="confirmer" />

                </form>
            )}
            {userData.admin === true && edit && (
                <form action="" onSubmit={handleEdit} className="edit-comment-form">
                    <label tabIndex="1" htmlFor="text" onClick={() => setEdit(!edit)}>
                        modifier le texte
                    </label>
                    <br />
                    <input
                        type="text"
                        name="text"
                        onChange={(e) => setText(e.target.value + " ( modifié )")}
                        defaultValue={comment.text}
                    />
                    <br />
                    <div className="btn">
                        <span
                            onClick={() => {
                                if (window.confirm("Confirmer la suppression de ce commentaire ?")) {
                                    handleDelete();
                                }
                            }}
                        >
                            <img src="./img/icons/trash.svg" alt="supprimer" />
                        </span>
                        <input type="submit" value="modifier" />
                    </div>
                </form>
            )}
        </div>
    );
};

export default EditDeleteComment;
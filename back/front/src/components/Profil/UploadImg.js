import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
// on importe l'action créée
import { uploadPicture } from "../../actions/user.actions";

const UploadImg = () => {
    // on met en place la logique pour remplacer le fichier
    const [file, setFile] = useState();
    // pour envoyer l'image dans le back
    const dispatch = useDispatch();

    // on accède aux "data" du "user"
    const userData = useSelector((state) => state.userReducer);

    // on met la logique pour récupèrer le fichier
    const handlePicture = (e) => {

        e.preventDefault();
        // on met à jour les "data"
        const data = new FormData();
        data.append("name", userData.pseudo); // indique la référence de l'image
        data.append("userId", userData._id); // le userId 
        data.append("file", file); // l'image
        console.log(file);
        console.log(userData)
        // on met en place l'action
        dispatch(uploadPicture(data, userData._id))
    };
    return (
        <form action="" onSubmit={handlePicture} className="upload-pic" encType="multipart/form-data">
            <label tabIndex="0" htmlFor="file">Changer d'avatar</label>
            <br />
            <input
                type='file'
                id='file'
                name='file'
                accept='.jpg, .jpeg, .png'
                onChange={(e) => setFile(e.target.files[0])}
            />
            <br />
            <input type="submit" value="Confirmer" />
        </form>
    );
};

export default UploadImg;
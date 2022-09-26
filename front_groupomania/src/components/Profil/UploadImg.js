import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";

const UploadImg = () => {
    // on met en place la logique pour remplacer le fichier
    const [file, setFile] = useState();

    //
    const dispatch = useDispatch();

    //
    const userData = useSelector((state) => state.useReducer)

    // on met la logique pour récupèrer le fichier
    const handlePicture = (e) => {
        e.preventDefault();
    }
    return (
        <form action="" onSubmit={handlePicture} className="upload-pic">
            <label htmlFor="file">Changer d'avatar</label>
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
import axios from 'axios';

export const GET_USER = 'GET_USER';
export const UPLOAD_PICTURE = 'UPLOAD_PICTURE';

// on affiche le "user"
export const getUser = (uid) => {
    return (dispatch) => {
        return axios
            .get(`http://localhost:8000/api/user/${uid}`)
            .then((res) => {
                dispatch({ type: GET_USER, payload: res.data });
            })
            .catch((err) => console.log(err));
    };
};

// on affiche la nouvelle image du profil
export const uploadPicture = (data, id) => {
    return (dispatch) => { // dispatch envoie les "data" au "reducer"
        return axios
            .post(`http://localhost:8000/api/user/upload`, data) // on envoie la data vers le "back"
            .then((res) => {
                return axios
                    .get(`http://localhost:8000/api/user/${id}`) // on récupère la "data" depuis le "back"
                    .then((res) => {
                        dispatch({ type: UPLOAD_PICTURE, payload: res.data.picture }) // on met à disposition l'image
                    });
            })
            .catch((err) => console.log(err));
    }
};
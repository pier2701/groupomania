import axios from 'axios';

// action à exporter au "userReducer"
export const GET_USER = 'GET_USER';
export const UPLOAD_PICTURE = 'UPLOAD_PICTURE';
export const UPDATE_BIO = "UPDATE_BIO";
export const FOLLOW_USER = "FOLLOW_USER";
export const UNFOLLOW_USER = "UNFOLLOW_USER";

// on affiche le "user"
export const getUser = (uid) => {
    return (dispatch) => {
        return axios
            .get(`http://localhost:8000/api/user/${uid}`) // on autorise la navigation en fonction de "uid"
            .then((res) => { // on renvoie la "data"
                dispatch({ type: GET_USER, payload: res.data });
            })
            .catch((err) => console.log(err));
    };
};

// on affiche la nouvelle image du profil
export const uploadPicture = (data, id) => {
    return (dispatch) => { // dispatch envoie les "data" au "reducer"
        return axios
            .post("http://localhost:8000/api/user/upload", data) // on envoie la data vers le "back"
            .then((res) => {
                return axios
                    .get(`http://localhost:8000/api/user/${id}`) // on récupère la "data" depuis le "back"
                    .then((res) => {
                        dispatch({ type: UPLOAD_PICTURE, payload: res.data.picture }) // on met à jour l'image
                    });
            })
            .catch((err) => console.log(err));
    }
};

// action réalisé en cas de modifications
export const updateBio = (userId, bio) => {
    return (dispatch) => {
        return axios({ // on fait un requête pour mettre à jour la "bio"
            method: "put",
            url: "http://localhost:8000/api/user/" + userId,
            data: { bio },
        })
            .then((res) => { // le payload correspondra à la "data" à transmettre
                dispatch({ type: UPDATE_BIO, payload: bio });
            })
            .catch((err) => console.log(err));
    };
};

// action pour suivre un "user"
export const followUser = (followerId, idToFollow) => {
    return (dispatch) => {
        return axios({
            method: "patch",
            url: "http://localhost:8000/api/user/follow/" + followerId,
            data: { idToFollow },
        })
            .then((res) => {
                dispatch({ type: FOLLOW_USER, payload: { idToFollow } });
            }) // on met à jour la data du "user" via le store
            .catch((err) => console.log(err));
    };
};

// action pour ne plus suivre un "user"
export const unfollowUser = (followerId, idToUnfollow) => {
    return (dispatch) => {
        return axios({
            method: "patch",
            url: "http://localhost:8000/api/user/unfollow/" + followerId,
            data: { idToUnfollow },
        })
            .then((res) => {
                dispatch({ type: UNFOLLOW_USER, payload: { idToUnfollow } });
            }) // on met à jour la data du "user" via le store
            .catch((err) => console.log(err));
    };
};
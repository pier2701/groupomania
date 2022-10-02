import axios from 'axios';

// on récupère touts les "users"
export const GET_USERS = "GET_USERS";

export const getUsers = () => {
    return (dispatch) => {
        return axios
            .get("http://localhost:8000/api/user") // on requête les "user"
            .then((res) => { // on passe les "data" dans le "store"
                dispatch({ type: GET_USERS, payload: res.data });
            })
            .catch((err) => console.log(err));
    };
}
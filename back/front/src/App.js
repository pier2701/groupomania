import React, { useEffect, useState } from 'react';
import { UidContext } from './components/AppContext';
import Routes from './components/Routes'
import axios from 'axios';
import { useDispatch } from "react-redux";
import { getUser } from "./actions/user.actions";

const App = () => {
  // on déclare un "state" vide qui sera "set" après la la requête. 
  const [uid, setUid] = useState(null);

  // on lance la fonction 
  const dispatch = useDispatch();

  // on implémente les conditions pour autoriser la navigation via le "token"
  useEffect(() => {
    // on récupère le userId pour autoriser la navigation
    const getToken = async () => {
      await axios({
        method: "get",
        url: "http://localhost:8000/jwtid",
        withCredentials: true,
      })
        .then((res) => {
          setUid(res.data);
        })
        .catch((error) => console.log("pas de token" + error));
    };
    getToken();

    if (uid) dispatch(getUser(uid))
  }, [uid, dispatch]);

  return (
    <UidContext.Provider value={uid}>
      <Routes />
    </UidContext.Provider>
  )
}

export default App;

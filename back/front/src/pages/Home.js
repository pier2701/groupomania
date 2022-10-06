import React, { useContext } from 'react';
import { UidContext } from '../components/AppContext';
import LeftNav from '../components/LeftNav';
import NewPostForm from "../components/Post/NewPostForm";
import Thread from '../components/Thread';
import Log from "../components/Log";

const Home = () => {
    // on vérifie si le "user" est connecté
    const uid = useContext(UidContext);

    return (
        <div className="home">
            <LeftNav />
            <div className="main">
                <div className="home-header">
                    {/* si le "user" est connecté ou pas */}
                    {uid ? <NewPostForm /> : <Log signin={true} signup={false} />}
                </div>
                <Thread />
            </div>
        </div>
    );
};

export default Home;
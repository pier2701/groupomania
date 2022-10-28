import React, { useContext } from 'react';
import { UidContext } from '../components/AppContext';
import LeftNav from '../components/LeftNav';
import NewPostForm from "../components/Post/NewPostForm";
import Thread from '../components/Thread';
import Log from "../components/Log";
import Trends from '../components/Trends';
import FriendsList from "../components/Profil/FriendsList";
import Profil from './Profil';


const Home = () => {
    // on vérifie si le "user" est connecté
    const uid = useContext(UidContext);

    return (
        <>
            {(uid) ?
                (<div className="home">
                    <LeftNav />
                    <div className="main"><NewPostForm />
                        <Thread />
                    </div>
                    <div className="right-side">
                        <div className="right-side-container">
                            <div className="wrapper">
                                <Trends />
                                <FriendsList />
                            </div>
                        </div>
                    </div>
                </div>) :
                (<Profil />)
            }
        </>
    );
};

export default Home;
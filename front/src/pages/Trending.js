import React, { useContext } from 'react';
import { useSelector } from "react-redux";
import { UidContext } from "../components/AppContext";
import LeftNav from '../components/LeftNav';
import { isEmpty } from "../components/Utils";
import Card from "../components/Post/Card";
import Trends from "../components/Trends";
import FriendsList from "../components/Profil/FriendsList";
import Profil from './Profil';

const Trending = () => {
    // on récupère le "userId" 
    const uid = useContext(UidContext);

    // on récupère les "data" des tendances
    const trendList = useSelector((state) => state.trendingReducer);

    return (
        <>
            {(uid) ?
                (<div className="trending-page">
                    <LeftNav />
                    <div className="main">
                        <ul>
                            {/* s'il y a de la "data", elle sera affiché */}
                            {!isEmpty(trendList[0]) &&
                                // on récupère les "Card" via les 'props' + 'key' unique (pour map)
                                trendList.map((post) => <Card post={post} key={post._id} />)}
                        </ul>
                    </div>
                    <div className="right-side">
                        <div className="right-side-container">
                            {/* on affiche les + "likés" */}
                            <Trends />
                            {/* si le user est connecté, on affichera les autres "user" */}
                            {uid && <FriendsList />}
                        </div>
                    </div>
                </div>) : (<Profil />)
            }
        </>
    )
};

export default Trending;
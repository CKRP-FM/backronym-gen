import { FaRegTrashAlt, FaRegHeart } from 'react-icons/fa';
import firebase from '../firebase';
import { getDatabase, ref, onValue, remove, update } from 'firebase/database';
import { Link, useParams } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import { useEffect, useState } from 'react';

import ErrorPage from '../pages/ErrorPage';

function UserProfile() {
    const [gallery, setGallery] = useState([]);
    const { user, deleteProfile } = useUserAuth();
    const [error, setError] = useState('');
    const [backronymKeys, setBackronymKeys] = useState([]);
    const { uid } = useParams();

    //updating like count
    function handleLike(resultKey, resultLikes) {
        const updatedLikes = {
        likes: resultLikes + 1,
        };

        const database = getDatabase(firebase);
        const childRef = ref(database, `/${resultKey}`);
        update(childRef, updatedLikes);
    }

    // delete entry
    function handleDelete(e, resultKey) {
        e.preventDefault();
        const database = getDatabase(firebase);
        const dbRef = ref(database, `/${resultKey}`);
        remove(dbRef);
    }

    // delete user's of backronyms
    function handleDeleteBackronyms(backronymKeyList) {
        if (backronymKeyList.length > 0) {
            const database = getDatabase(firebase);
            for (let key of backronymKeyList) {
                const dbRef = ref(database, `/${key}`);
                remove(dbRef);
            }
        }
    }

    // delete account
    const handleUserAccountDeletion = async (e) => {
        
        handleDeleteBackronyms(backronymKeys);

        setError('');
        try {
            await deleteProfile();
        } catch (err) {
            setError(err.message);
        }
    }

    useEffect(() => {
        // database details
        const database = getDatabase(firebase);
        const dbRef = ref(database);
            
        onValue(dbRef, (response) => {
            const newState = [];
            const tempKeyState = []
            const data = response.val();
            for(let key in data) {

                if (data[key].email === user.email || (data[key].email === 'anonymous' && user.email === null)) {
                    tempKeyState.push(key);
                }

                newState.push({
                    key: key,
                    timestamp: data[key].timestamp,
                    email: data[key].email,
                    userInput: data[key].userInput,
                    results: data[key].results,
                    likes: data[key].likes,
                })
            }
            setBackronymKeys(tempKeyState);
            setGallery(newState);
        })
    }, []);

    return(
        <div className='wrapper userProfile'>
            <h2>Profile</h2>
            <ul className="resultsDisplay">
                {
                    uid === user.uid ?
                    gallery.map((result) => {
                        return(
                            (result.email === user.email || (result.email === 'anonymous' && user.email === null)) ?
                            <li className="galleryCard" key={result.key}>
                                <div className="userGalleryControls">

                                    <button className="deleteBtn" onClick={(e) => handleDelete(e, result.key)}>
                                        <span className="sr-only">Delete</span>
                                        <FaRegTrashAlt />
                                    </button>

                                    <button
                                        className="likeBtn"
                                        onClick={() => {
                                            handleLike(result.key, result.likes);
                                        }}
                                        >
                                        <FaRegHeart />
                                        <p className="likeCount">{result.likes}</p>
                                    </button>

                                </div>
                                <h3>{result.userInput}</h3>
                                {
                                    result.results.map((initialWord, index) => {
                                        return <p key={`${result.key}-${index}`}>{initialWord}</p>;
                                    })
                                }
                            </li> : ""
                        )
                    }) : <ErrorPage />
                }
            </ul>

            <div className='profileButtons'>
                <Link to="/">
                    <button className='backButton'>Back</button>
                </Link>
                <Link to="/login">
                    <button className='deleteProfileButton' onClick={(e) => handleUserAccountDeletion(e)}
                    >Delete Account</button>
                </Link>
            </div>
        </div>
    )
}

export default UserProfile;
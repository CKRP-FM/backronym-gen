import firebase from '../firebase';
import { getDatabase, ref, onValue, remove } from 'firebase/database';

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
                                <button className="deleteBtn" onClick={(e) => handleDelete(e, result.key)}>
                                    X
                                </button>
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
                    <button>Back</button>
                </Link>
                <Link to="/">
                    <button onClick={(e) => handleUserAccountDeletion(e)}
                    >Delete Account</button>
                </Link>
            </div>
        </div>
    )
}

export default UserProfile;
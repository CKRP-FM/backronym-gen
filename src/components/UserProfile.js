import { FaRegTrashAlt } from 'react-icons/fa';
import firebase from '../firebase';
import { getDatabase, ref, onValue, remove, update } from 'firebase/database';
import { Link, useParams } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import { useEffect, useState } from 'react';

import ErrorPage from '../pages/ErrorPage';
import DeleteConfirmation from './DeleteConfirmation';

// test
import Loading from './Loading';

function UserProfile() {
    const [gallery, setGallery] = useState([]);
    const { user, deleteProfile } = useUserAuth();
    const [error, setError] = useState('');
    const [backronymKeys, setBackronymKeys] = useState([]);
    const [deleteWarning, setDeleteWarning] = useState(false);
    const [deleteID, setDeleteID] = useState('');
    const [deleteAccountAttempt, setDeleteAccountAttempt] = useState(false);
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

        setDeleteID('');
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
            const data = response.val();
            for(let key in data) {
                newState.push({
                    key: key,
                    timestamp: data[key].timestamp,
                    email: data[key].email,
                    userInput: data[key].userInput,
                    results: data[key].results,
                    likes: data[key].likes,
                })
            }
            setGallery(newState);
        })
    }, []);

    useEffect(() => {
        const tempKeyState = [];
            gallery.forEach((result) => {
                if (result.email === user.email || (result.email === 'anonymous' && user.email === null)) {
                    tempKeyState.push(result.key);
                }
            })
        setBackronymKeys(tempKeyState);
    }, [gallery]);

    return(
        <section className="userProfile">

            <Loading />

            <div className={`accountDeleteBanner ${deleteAccountAttempt ? `addHeight` : ``}`}>
                {
                    <div className='deleteMessageContainer wrapper'>
                        <p>Deleting your account is permanent and will erase ALL your backronyms. Are you sure you would like to proceed?</p>
                        <div className='deleteButtonContainer'>
                        <Link to="/login">
                            <button onClick={(e) => handleUserAccountDeletion(e)}>Confirm</button>
                        </Link>
                        <button onClick={() => setDeleteAccountAttempt(false)}>Cancel</button>
                        </div>
                        
                    </div>
                }
            </div>
            <div className="wrapper">
                <h2>Your Profile</h2>
                {
                    uid === user.uid && backronymKeys.length === 0 ?
                    <div className="emptyProfileMessage">
                        <h3>Oops! Looks like you don't have any backronyms created. Go back to the main page to get started!</h3>
                    </div>
                    : null
                }

                <ul className="resultsDisplay">
                    {
                        uid === user.uid ?
                        gallery.map((result) => {
                            return(
                                (result.email === user.email || (result.email === 'anonymous' && user.email === null)) ?
                                <li className="galleryCard" key={result.key}>
                                    <div className="userGalleryControls">

                                        <button className="deleteBtn" onClick={(e) => {
                                            setDeleteWarning(true);
                                            setDeleteID(result.key);
                                            }}>

                                            <span className="sr-only">Delete</span>
                                            <FaRegTrashAlt />

                                        </button>

                                        {deleteWarning ? (
                                            <DeleteConfirmation
                                            setDeleteWarning={setDeleteWarning}
                                            handleDelete={handleDelete}
                                            deleteID={deleteID}
                                            />
                                        ) : null}

                                        <button
                                        className="likeBtn"
                                        onClick={() => {
                                            handleLike(result.key, result.likes);
                                        }}>
                                            <span className="sr-only">Like</span>
                                        </button>
                                        <p className="likeCount">{result.likes}</p>
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
                    <button className='deleteProfileButton' onClick={() => setDeleteAccountAttempt(true)}
                    >Delete Account</button>
                </div>
            </div>
        </section>
    )
}

export default UserProfile;
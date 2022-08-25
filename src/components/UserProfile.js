import firebase from '../firebase';
import { getDatabase, ref, onValue, remove } from 'firebase/database';

import { Link } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import { useEffect, useState } from 'react';

function UserProfile() {
    const [gallery, setGallery] = useState([]);
    const { user } = useUserAuth();
    // console.log(user.email);

    // delete entry
    function handleDelete(e, resultKey) {
        e.preventDefault();
        const database = getDatabase(firebase);
        const dbRef = ref(database, `/${resultKey}`);
        remove(dbRef);
    }

    useEffect(() => {
        // console.log('run once')
        // database details
        const database = getDatabase(firebase);
        const dbRef = ref(database);
        
        onValue(dbRef, (response) => {
            // console.log(response.val());
            const newState = [];
            const data = response.val();
            for(let key in data) {
                // console.log(data[key].email)
                if (data[key].email === user.email || (data[key].email === 'anonymous' && user.email === null)) {
                    newState.push({
                        key: key,
                        // author: key.author, //for auth
                        timestamp: data[key].timestamp,
                        email: data[key].email,
                        userInput: data[key].userInput, //["k", "e", "o", "n"]
                        results: data[key].results, // ["key", "eel", "on", "new"]
                    })
                }
            }
            setGallery(newState);
        })
    }, []);

    return(
        <div className='wrapper'>
            <h2>Profile</h2>
            <ul className="resultsDisplay">
                {
                    gallery.map((result) => {
                        return (
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
                            </li>
                        )
                    })
                }
            </ul>

            <Link to="/">
                <button>Back</button>
            </Link>
        </div>
    )
}

export default UserProfile;
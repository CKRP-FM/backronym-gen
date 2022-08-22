import firebase from '../firebase';

import { getDatabase, ref, onValue } from 'firebase/database';
import { useEffect, useState } from 'react';

function Gallery() {
    //useState for gallery of user's backronym
    const [gallery, setGallery] = useState([]);
   
    //connect to firebase when Gallery component mounts
    useEffect(() => {
        // database details
        const database = getDatabase(firebase);
        const dbRef = ref(database);

        //for every change in the firebase db, push the new value into our gallery state
        onValue(dbRef, (response) => {
            console.log(response.val());
            const newState = [];
            const data = response.val();
            for (let key in data) {
                newState.push(
                    {
                        key: key,
                        author: key.author, //for auth
                        userInput: data[key].userInputSplit, //["k", "e", "o", "n"]
                        results: data[key].results, // ["key", "eel", "on", "new"]
                    }
                )
            }

            //setting the user's fb submission to our gallery state
            setGallery(newState);
            console.log(gallery)
        })
    }, []);

    return (
        <ul className="resultsDisplay">
            {
                // map over the gallery state (from firebase). Results is each submission
                gallery.map((result) => {
                    return (
                        <li key={result.key}>
                            <h3>{result.userInput}</h3>

                            {/* mapping over each user's submission results array item (each word in array is the initial) */}
                            {result.results.map(initialWord => {
                                return (
                                    <p>{initialWord}</p>
                                )
                            })}
                        </li>
                    )
                })
            }
        </ul>        
    )
}

export default Gallery;
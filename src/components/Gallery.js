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
                        author: key.author,
                        userInput: data[key].userInput,
                        userInputSplit: data[key].userInputSplit,
                        results: data[key].results,
                    }
                )
            }
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
                            {/* <p>{result.results.join(' ')}</p> */}

                            {/* mapping over each user's submission results array item (each word in array is the initial) */}
                            {result.results.map(initial => {
                                return (
                                    <p>{initial}</p>
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
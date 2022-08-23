import firebase from '../firebase';

import { getDatabase, ref, onValue, remove } from 'firebase/database';
import { useEffect, useState } from 'react';

function Gallery() {
  //useState for gallery of user's backronym
  const [gallery, setGallery] = useState([]);

  // delete entry
  function handleDelete(e, resultKey) {
    e.preventDefault();
    const database = getDatabase(firebase);
    const dbRef = ref(database, `/${resultKey}`);
    remove(dbRef);
  }

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
        newState.push({
          key: key,
          // author: key.author, //for auth
          userInput: data[key].userInput, //["k", "e", "o", "n"]
          results: data[key].results, // ["key", "eel", "on", "new"]
        });
      }

      //setting the user's fb submission to our gallery state
      setGallery(newState);
      console.log(gallery);
    });
  }, []);

  return (
    <div className="wrapper">
      <h2>Backronym Gallery</h2>
      <p className="galleryDesc">WOW. Wall of Wisdom. Check out these cool backronyms!</p>

      <ul className="resultsDisplay">
        {
          // map over the gallery state (from firebase). Results is each submission
          gallery.map((result) => {
            return (
              <li key={result.key}>
                <button onClick={(e) => handleDelete(e, result.key)}>X</button>
                <h3>{result.userInput}</h3>

                <div className="userBackronym"></div>
                {/* mapping over each user's submission results array item (each word in array is the initial) */}
                {result.results.map((initialWord, index) => {
                  return <p key={`${result.key}-${index}`}>{initialWord}</p>;
                })}
              </li>
            );
          })
        }
      </ul>
    </div>
  );
}

export default Gallery;

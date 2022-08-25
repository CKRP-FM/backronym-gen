import firebase from '../firebase';

import { getDatabase, ref, onValue, remove } from 'firebase/database';
import { useEffect, useState } from 'react';
import { useUserAuth } from '../context/UserAuthContext.js';

function Gallery({ closeGallery, showGallery }) {
  //useState for gallery of user's backronym
  const [gallery, setGallery] = useState([]);
  const [backronymFilter, setBackronymFilter] = useState('recent');
  let { user } = useUserAuth();

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
          timestamp: data[key].timestamp,
          email: data[key].email,
          userInput: data[key].userInput, //["k", "e", "o", "n"]
          results: data[key].results, // ["key", "eel", "on", "new"]
        });
      }

      if (backronymFilter === 'recent') {
        newState.sort((a, b) => b.timestamp - a.timestamp);
      } else if (backronymFilter === 'oldest') {
        newState.sort((a, b) => a.timestamp - b.timestamp);
      } else if (backronymFilter === 'alphabetical') {
        newState.sort((a, b) => {
          return a.userInput.join('').localeCompare(b.userInput.join(''), { ignorePunctuation: true });
        });
      }
      //setting the user's fb submission to our gallery state
      setGallery(newState);
      console.log(gallery);
    });
  }, [backronymFilter]);

  const setFilter = (e) => {
    setBackronymFilter(e.target.value);
  };

  return (
    <section className={showGallery ? 'gallery openAnimate' : 'gallery openAnimate closeAnimate'}>
      <div className="galleryModalBackground">
        <div className="galleryModal">
          <button
            className="closeGalleryBtn"
            onClick={(e) => {
              closeGallery(e);
              // document.body.classList.remove('modalActive');
            }}
          >
            Close Gallery
          </button>
          <h2>Backronym Gallery</h2>
          <p className="galleryDesc">WOW. Wall of Wisdom. Check out these cool backronyms!</p>
          <p>
            Note: You can only delete your own posts as a logged in user or other anonymous posts if you are logged in
            anonymously.
          </p>

          <div className="sortingContainer">
            <label htmlFor="filter">Sort by: </label>
            <select id="filter" onChange={setFilter} value={backronymFilter}>
              <option value="recent">Most Recent</option>
              <option value="alphabetical">Alphabetical</option>
              <option value="oldest">Oldest to Newest</option>
            </select>
          </div>

          <ul className="resultsDisplay">
            {
              // map over the gallery state (from firebase). Results is each submission
              gallery.map((result) => {
                return (
                  <li className="galleryCard" key={result.key}>
                    {user === null ? (
                      ''
                    ) : user.email === result.email ? (
                      <button className="deleteBtn" onClick={(e) => handleDelete(e, result.key)}>
                        X
                      </button>
                    ) : user.email === null && result.email === 'anonymous' ? (
                      <button className="deleteBtn" onClick={(e) => handleDelete(e, result.key)}>
                        X
                      </button>
                    ) : (
                      ''
                    )}
                    <h3>{result.userInput}</h3>
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
      </div>
    </section>
  );
}

export default Gallery;

import firebase from '../firebase';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useEffect, useState } from 'react';
import GalleryCard from './GalleryCard';
import { FaArrowDown } from "react-icons/fa";

function Gallery({ closeGallery, showGallery }) {
  //useState for gallery of user's backronym
  const [gallery, setGallery] = useState([]);
  const [backronymFilter, setBackronymFilter] = useState('recent');

  //connect to firebase when Gallery component mounts
  useEffect(() => {
    // database details
    const database = getDatabase(firebase);
    const dbRef = ref(database);

    //for every change in the firebase db, push the new value into our gallery state
    onValue(dbRef, (response) => {
      const newState = [];
      const data = response.val();
      for (let key in data) {
        newState.push({
          key: key,
          timestamp: data[key].timestamp,
          email: data[key].email,
          userInput: data[key].userInput, //["k", "e", "o", "n"]
          results: data[key].results, // ["key", "eel", "on", "new"]
          likes: data[key].likes,
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
      } else if (backronymFilter === 'highest') {
        newState.sort((a, b) => b.likes - a.likes);
      }

      //setting the user's fb submission to our gallery state
      setGallery(newState);
    });
  }, [backronymFilter]);

  const setFilter = (e) => {
    setBackronymFilter(e.target.value);
  };

  return (
    <section
      className={`gallery ${showGallery === 1 ? 'openAnimate' : ''} ${
        showGallery === 0 ? 'openAnimate closeAnimate' : ''
      }`}
    >
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
          <p className="deleteNote">
            Note: You can only delete your own posts as a logged in user or other anonymous posts if you are logged in
            anonymously.
          </p>

          <div className="sortingContainer">
            <label htmlFor="filter" className='sr-only'>Sort by: </label>
            <select id="filter" onChange={setFilter} value={backronymFilter}>
              <option value="recent">Most Recent</option>
              <option value="highest">Most Liked</option>
              <option value="alphabetical">Alphabetical</option>
              <option value="oldest">Oldest to Newest</option>
            </select>
          </div>

          <ul className="resultsDisplay">
            {
              // map over the gallery state (from firebase). Results is each submission
              gallery.map((result) => {
                return <GalleryCard result={result} key={result.key} />;
              })
            }
          </ul>

          <p className="scrollLabel"><FaArrowDown />Scroll to see backronyms!<FaArrowDown /></p>
        </div>
      </div>
    </section>
  );
}

export default Gallery;

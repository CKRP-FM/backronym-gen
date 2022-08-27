import { FaRegTrashAlt } from 'react-icons/fa';
import DeleteConfirmation from './DeleteConfirmation.js';
import { getDatabase, ref, remove, update } from 'firebase/database';
import { useState } from 'react';
import firebase from '../firebase.js';
import { useUserAuth } from '../context/UserAuthContext.js';

function GalleryCard({ result }) {
  const [deleteWarning, setDeleteWarning] = useState(false);
  const [deleteID, setDeleteID] = useState('');
  // // track whether user has already liked a backronym
  // const [likedStatus, setLikedStatus] = useState('');

  let { user } = useUserAuth();

  // delete entry
  function handleDelete(e, resultKey) {
    e.preventDefault();
    const database = getDatabase(firebase);
    const dbRef = ref(database, `/${resultKey}`);
    remove(dbRef);

    //reset delete ID state
    setDeleteID('');
  }

  //updating like count
  function handleLike(resultKey, resultLikes) {
    const updatedLikes = {
      likes: resultLikes + 1,
    };

    const database = getDatabase(firebase);
    const childRef = ref(database, `/${resultKey}`);
    update(childRef, updatedLikes);
  }
  return (
    <li className="galleryCard" key={result.key}>
      <h3>{result.userInput}</h3>
      {/* mapping over each user's submission results array item (each word in array is the initial) */}
      {result.results.map((initialWord, index) => {
        return <p key={`${result.key}-${index}`}>{initialWord}</p>;
      })}

      <div className="userGalleryControls">
        {user === null ? (
          ''
        ) : user.email === result.email ? (
          <button
            className="deleteBtn"
            onClick={(e) => {
              setDeleteWarning(true);
              setDeleteID(result.key);
            }}
          >
            <span className="sr-only">Delete</span>
            <FaRegTrashAlt />
          </button>
        ) : user.email === null && result.email === 'anonymous' ? (
          <button
            className="deleteBtn"
            onClick={(e) => {
              setDeleteWarning(true);
              setDeleteID(result.key);
            }}
          >
            <span className="sr-only">Delete</span>
            <FaRegTrashAlt />
          </button>
        ) : (
          ''
        )}

        {deleteWarning ? (
          <DeleteConfirmation setDeleteWarning={setDeleteWarning} handleDelete={handleDelete} deleteID={deleteID} />
        ) : null}

        {user ? (
          <button
            className="likeBtn"
            onClick={() => {
              handleLike(result.key, result.likes);
            }}
          >
            <span className="sr-only">Like</span>
          </button>
        ) : null}

        <p className="likeCount">{result.likes}</p>
      </div>
    </li>
  );
}

export default GalleryCard;

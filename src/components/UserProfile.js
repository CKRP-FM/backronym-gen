import firebase from '../firebase';
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import { Link, useParams } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import { useEffect, useState } from 'react';

import ErrorModal from './ErrorModal';
import ErrorPage from '../pages/ErrorPage';
import GalleryCard from './GalleryCard';
import Loading from './Loading';
import NavBar from './NavBar';

import timeout from '../utilities/timeout';

function UserProfile() {
  const [gallery, setGallery] = useState([]);
  const { user, deleteProfile } = useUserAuth();
  const [error, setError] = useState('');
  const [backronymKeys, setBackronymKeys] = useState([]);
  const [deleteAccountAttempt, setDeleteAccountAttempt] = useState(false);
  const [loading, setLoading] = useState(true);
  const { uid } = useParams();

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

  // set loading state to false
  function handleLoading() {
    setLoading(false);
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
  };

  useEffect(() => {
    // timeout function that will change loading state to false after X milliseconds
    timeout(handleLoading, 800);

    // database details
    const database = getDatabase(firebase);
    const dbRef = ref(database);

    onValue(dbRef, (response) => {
      const newState = [];
      const data = response.val();
      for (let key in data) {
        newState.push({
          key: key,
          timestamp: data[key].timestamp,
          email: data[key].email,
          userInput: data[key].userInput,
          results: data[key].results,
          likes: data[key].likes,
        });
      }
      setGallery(newState);
    });
  }, []);

  useEffect(() => {
    const tempKeyState = [];
    gallery.forEach((result) => {
      if (result.email === user.email || (result.email === 'anonymous' && user.email === null)) {
        tempKeyState.push(result.key);
      }
    });
    setBackronymKeys(tempKeyState);
  }, [gallery, user.email]);

  return (
    <div>
      {error ? <ErrorModal errorMsg={error} setError={setError} /> : null}

      {loading ? (
        <section className="loadingSection userLoading">
          <Loading />
        </section>
      ) : (
        <section className="userProfile">
          <div className={`accountDeleteBanner ${deleteAccountAttempt ? `addHeight` : ``}`}>
            <div className="deleteMessageContainer wrapper">
              <p>
                Deleting your account is permanent and will erase ALL your backronyms. Are you sure you would like to
                proceed?
              </p>
              <div className="deleteButtonContainer">
                <Link to="/login">
                  <button onClick={(e) => handleUserAccountDeletion(e)}>Confirm</button>
                </Link>
                <button onClick={() => setDeleteAccountAttempt(false)}>Cancel</button>
              </div>
            </div>
          </div>

          <NavBar />

          <div className="wrapper">
            <h2>Your Profile</h2>
            {uid === user.uid && backronymKeys.length === 0 ? (
              <div className="emptyProfileMessage">
                <h3>
                  Oops! Looks like you don't have any backronyms created. Go back to the main page to get started!
                </h3>
              </div>
            ) : null}

            <ul className="resultsDisplay">
              {uid === user.uid ? (
                gallery.map((result) => {
                  return result.email === user.email || (result.email === 'anonymous' && user.email === null) ? (
                    <GalleryCard result={result} key={result.key} />
                  ) : (
                    ''
                  );
                })
              ) : (
                <ErrorPage />
              )}
            </ul>

            {uid === user.uid ? (
              <div className="profileButtons">
                {/* <Link to="/">
                  <button className="backButton">Back</button>
                </Link> */}
                <button className="deleteProfileButton" onClick={() => setDeleteAccountAttempt(true)}>
                  Delete Account
                </button>
              </div>
            ) : null}
          </div>
        </section>
      )}
    </div>
  );
}

export default UserProfile;

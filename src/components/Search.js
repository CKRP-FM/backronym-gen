import axios from 'axios';
import { useState, useEffect } from 'react';
import shuffle from '../utilities/shuffle.js';
import firebase from '../firebase.js';
import { getDatabase, ref, push } from 'firebase/database';
import { useUserAuth } from '../context/UserAuthContext.js';
import ErrorModal from './ErrorModal.js';
import Loading from './Loading.js';
import timeout from '../utilities/timeout.js';

function Search() {
  const [currentIndex, setCurrentIndex] = useState('');
  const [wordInput, setWordInput] = useState(''); // state to store word entered in input field
  const [selectedWord, setSelectedWord] = useState([]); // a state to store the word, split into a character array
  const [randomArray, setRandomArray] = useState([]);
  const [backronym, setBackronym] = useState([]); // a state that stores the user's chosen words to make up the backronym
  const [checkedWord, setCheckedWord] = useState('');
  const [error, setError] = useState('');

  //useState to disable btn (once submitted to firebase)
  const [hideBtn, setHideBtn] = useState(false);

  //useState to toggle loading
  const [loading, setLoading] = useState(false);

  // const [isProfane, setIsProfane] = useState(false);

  // variable to track if word is profane
  let isProfane = false;

  const setIsProfane = (status) => {
    isProfane = status;
  }

  // Returns a copy of an array that includes the first 10 elements
  function subArray(array) {
    // remove single character results unless they are 'a' or 'i' or 'o' which are the only valid single letter words in english, source: https://english.stackexchange.com/questions/225537/one-letter-words-in-english-language
    let newArray = array.filter(
      (str) => str.word.length > 1 || str.word === 'a' || str.word === 'i' || str.word === 'o'
    );
    // only get the first 10 results
    return newArray.slice(0, 10);
  }

  const { user } = useUserAuth();

  // set loading state to false
  function handleLoading() {
    setLoading(false);
  }

  // check if string only contains letters, from https://bobbyhadz.com/blog/javascript-check-if-string-contains-only-letters#:~:text=Use%20the%20test()%20method,only%20letters%20and%20false%20otherwise.&text=Copied!
  // regex explanation: https://stackoverflow.com/questions/33022051/regex-explanation

  async function isValidInput(str) {

    await profanityFilter(str);

    return !isProfane && /^[a-zA-Z]+$/.test(str) && str.length < 10 && str.length > 1;
  }

  // Break down string into array of chars
  function splitIntoChars(string) {
    return string.split('');
  }

  function handleInput(e) {
    setWordInput(e.target.value);
  }

  // async
  async function handleSearchSubmit(e) {
    e.preventDefault();
    setCheckedWord('');

    const confirmation = await isValidInput(wordInput);
    
    if (confirmation) {
      const clone = wordInput;
      setSelectedWord(splitIntoChars(clone));

      setBackronym([]);
      setHideBtn(false);
      setLoading(true);
      setCurrentIndex(0);
      setWordInput('');
    } 
    else if (isProfane === true) {
      setError('Please refrain from using inappropriate language!');
    } else {
      setError('Your input has to be a word between 2 and 10 characters!');
    }
  }

  function handleRefresh(e) {
    e.preventDefault();
    setCheckedWord('');
    getWords();
  }

  useEffect(() => {
    // timeout function that will change loading state to false after X milliseconds
    timeout(handleLoading, 500);
    getWords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, selectedWord]);

  function getWords() {
    if (selectedWord[currentIndex] !== undefined) {
      // if first word, just fetch random words
      if (currentIndex === 0) {
        fetchRandomWords();
      } else {
        fetchRelatedWords();
      }
    }
  }

  const profanityFilter = async (word) => {
    await axios
      .get(
        `https://www.purgomalum.com/service/containsprofanity?text=${word}`
      )
      .then((response) => {
        console.log("success: " + response.data);
        setIsProfane(response.data);
      })
      .catch((error) => {
        setError(error)
      }
    );
  }


  // function to fetch random words that start with a specific letter
  function fetchRandomWords() {
    axios({
      url: `https://api.datamuse.com/words?sp=${selectedWord[currentIndex]}*`,
      method: 'GET',
      dataResponse: 'json',
    })
      .then((response) => {
        setRandomArray(subArray(shuffle(response.data)));
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  // function to fetch words that often come after the previous saved word and start with a specific letter
  function fetchRelatedWords() {
    axios({
      url: `https://api.datamuse.com/words?lc=${backronym[currentIndex - 1]}&sp=${selectedWord[currentIndex]}*`,
      method: 'GET',
      dataResponse: 'json',
    })
      .then((response) => {
        // if no words related are found, just return random words
        if (response.data.length === 0) {
          fetchRandomWords();
        } else {
          setRandomArray(subArray(shuffle(response.data)));
        }
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  // handle save word
  // store the chosen word (state current chosen word) into the backronym array
  // locks in the letter, push letter to letterArr
  // randomArray([])
  // incraement current index

  function handleSaveWord(e) {
    e.preventDefault();
    // take the checkedword and push it to the backronym
    let clone = [...backronym, checkedWord];
    setBackronym(clone);
    setRandomArray([]);
    setCheckedWord('');
    setLoading(true);
    let increment = currentIndex + 1;
    setCurrentIndex(increment);
  }

  // on change checked
  // everything else gets greyed (setting ischecked to true)
  function handleCheckbox(e) {
    if (checkedWord === '') {
      // setIsChecked(e.target.checked);
      setCheckedWord(e.target.value);
    } else {
      setCheckedWord('');
    }
  }

  function handleFirebase() {
    //create a reference to fb
    const database = getDatabase(firebase);
    const dbRef = ref(database);

    //temp object to inject into firebase
    const tempObj = {
      email: user.email || 'anonymous',
      userInput: selectedWord,
      results: backronym,
      timestamp: Date.now(),
      likes: 0,
    };

    //push to firebase
    push(dbRef, tempObj);

    // after the push to firebase, disable btn to prevent multiple submissions
    setHideBtn(true);
    // reset
    setBackronym([]);
    setSelectedWord([]);

    // let the user know that their submission to fb is successful
    setError(`Your backronym has been saved!`);
  }

  return (
    <header>
      <div className="wrapper">
        {error ? <ErrorModal errorMsg={error} setError={setError} setIsProfane={setIsProfane} /> : null}

        <div className="mainSearch">
          <form>
            <h1>
              Backronym <span>Generator</span>
            </h1>

            <fieldset>
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <input
                id="search"
                className="searchInput"
                type="text"
                onChange={handleInput}
                placeholder="Enter your word..."
                value={wordInput}
              />
              <button onClick={(e) => handleSearchSubmit(e)}>Search</button>
            </fieldset>
          </form>

          <div className="headerImgContainer">
            <img
              src={require('../assets/pen-bulb.png')}
              alt="3D render of a pen with a light bulb attached to the end"
            />
          </div>
        </div>

        <div className="backronymSelect">
          <p className="userBackronym">
            {selectedWord !== undefined || selectedWord.length !== 0
              ? selectedWord.map((letter, index) => {
                  return (
                    <span key={index} className={index === currentIndex ? 'highlightColor' : 'defaultColor'}>
                      {letter}
                    </span>
                  );
                })
              : null}
          </p>

          <ul>
            {loading ? (
              <div key={`loading` + currentIndex} className="loadingSection searchLoading">
                <Loading />
              </div>
            ) : (
              randomArray?.map((word) => {
                return (
                  <li key={word.word + word.score}>
                    <input
                      value={word.word}
                      id={word.word}
                      type="checkbox"
                      // checked={isChecked}
                      className="wordListItem"
                      onChange={(e) => handleCheckbox(e)}
                      disabled={checkedWord !== '' && checkedWord !== word.word}
                    />
                    <label htmlFor={word.word}>{word.word}</label>
                  </li>
                );
              })
            )}
          </ul>

          {currentIndex !== '' && currentIndex < selectedWord.length && checkedWord === '' ? (
            <button
              className="refreshBtn"
              onClick={(e) => {
                handleRefresh(e);
              }}
            >
              Refresh Words
            </button>
          ) : null}

          {checkedWord !== '' ? (
            <button className="saveWordButton" autoFocus={true} onClick={(e) => handleSaveWord(e)}>
              Save Word
            </button>
          ) : // <button disabled={true} onClick={(e) => handleSaveWord(e)}>Save Word</button>
          null}

          {backronym.length >= 1 ? (
            <p className="generatedBackronym">
              Your backronym is: <span>{backronym.join(' ')}</span>
            </p>
          ) : null}

          {/* save to firebase btn */}
          {currentIndex === selectedWord.length ? (
            <button onClick={handleFirebase} disabled={hideBtn}>
              Save Backronym!
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export default Search;

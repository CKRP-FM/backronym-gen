import axios from 'axios';
import { useState, useEffect } from 'react';
import shuffle from '../utilities/shuffle.js';
import firebase from '../firebase.js';
import { getDatabase, ref, push } from 'firebase/database';

function Search() {
  // const [letter, setLetter] = useState('');
  const [currentIndex, setCurrentIndex] = useState('');
  const [wordInput, setWordInput] = useState(''); // state to store word entered in input field
  const [selectedWord, setSelectedWord] = useState([]); // a state to store the word, split into a character array
  const [randomArray, setRandomArray] = useState([]);
  const [backronym, setBackronym] = useState([]); // a state that stores the user's chosen words to make up the backronym
  const [checkedWord, setCheckedWord] = useState('');
  // const [isChecked, setIsChecked] = useState(false);

  //useState to disable btn (once submitted to firebase)
  const [hideBtn, setHideBtn] = useState(false);

  // Returns a copy of an array that includes the first 10 elements
  function subArray(array) {
    return array.slice(0, 10);
  }

  // check if string only contains letters, regex from https://bobbyhadz.com/blog/javascript-check-if-string-contains-only-letters#:~:text=Use%20the%20test()%20method,only%20letters%20and%20false%20otherwise.&text=Copied!
  // regex explanation: https://stackoverflow.com/questions/33022051/regex-explanation
  function onlyLetters(str) {
    return /^[a-zA-Z]+$/.test(str);
  }

  // Break down string into array of chars
  function splitIntoChars(string) {
    return string.split('');
  }

  function handleInput(e) {
    setWordInput(e.target.value);
  }

  // async
  function handleSearchSubmit(e) {
    e.preventDefault();

    if (onlyLetters(wordInput)) {
      const clone = wordInput;
      setSelectedWord(splitIntoChars(clone));

      setBackronym([]);
      setHideBtn(false);
      setCurrentIndex(0);
      setWordInput('');
    } else {
      alert('Please do not leave a blank input and limit your input to letters!');
    }
  }

  function handleRefresh(e) {
    e.preventDefault();
    setCheckedWord('');
    getWords();
  }

  useEffect(() => {
    getWords();
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
        console.log(error);
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
        console.log(error);
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
      userInput: selectedWord,
      results: backronym,
    };

    //push to firebase
    push(dbRef, tempObj);

    //after the push to firebase, disable btn to prevent multiple submissions
    setHideBtn(true);
  }

  return (
    <div>
      <form>
        <label htmlFor="search">Search</label>
        <input
          id="search"
          className="searchInput"
          type="text"
          onChange={handleInput}
          placeholder="Enter a word"
          value={wordInput}
        />
        <button onClick={(e) => handleSearchSubmit(e)}>Search Word</button>
      </form>

      <div>
        {selectedWord !== undefined || selectedWord.length !== 0
          ? selectedWord.map((letter, index) => {
              return (
                <span key={index} className={index === currentIndex ? 'highlightColor' : 'defaultColor'}>
                  {letter}
                </span>
              );
            })
          : null}
        <ul>
          {randomArray?.map((word) => {
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
          })}
        </ul>
        {currentIndex !== '' && currentIndex < selectedWord.length && checkedWord === '' ? (
          <button
            onClick={(e) => {
              handleRefresh(e);
            }}
          >
            Refresh
          </button>
        ) : (
          <button disabled={true}>Refresh</button>
        )}

        {checkedWord !== '' ? (
          <button onClick={(e) => handleSaveWord(e)}>Save Word</button>
        ) : // <button disabled={true} onClick={(e) => handleSaveWord(e)}>Save Word</button>
        null}

        <div>Your backronym is: {backronym.join(' ')}</div>

        {/* save to firebase btn */}
        {currentIndex === selectedWord.length ? (
          <button onClick={handleFirebase} disabled={hideBtn}>
            Save Backronym!
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default Search;

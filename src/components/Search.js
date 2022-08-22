import axios from 'axios';
import { useState, useEffect } from 'react';
import shuffle from '../utilities/shuffle.js';

function Search() {
  // const [letter, setLetter] = useState('');
  const [currentIndex, setCurrentIndex] = useState('');
  const [wordInput, setWordInput] = useState(''); // state to store word entered in input field
  const [selectedWord, setSelectedWord] = useState([]); // a state to store the word, split into a character array
  const [randomArray, setRandomArray] = useState([]);
  const [backronym, setBackronym] = useState([]); // a state that stores the user's chosen words to make up the backronym
  const [checkedWord, setCheckedWord] = useState('');
  // const [isChecked, setIsChecked] = useState(false);

  // Returns a copy of an array that includes the first 10 elements
  function subArray(array) {
    return array.slice(0, 10);
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

    const clone = wordInput;
    setSelectedWord(splitIntoChars(clone));

    setBackronym([]);
    setCurrentIndex(0);
  }

  function handleRefresh(e) {
    e.preventDefault();
    setCheckedWord('');
    getWords();
  }

  useEffect(() => {
    getWords();
  }, [currentIndex]);

  function getWords() {
    if (selectedWord[currentIndex] !== undefined) {
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
    // getWords();
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

  return (
    <div>
      <form>
        <label htmlFor="search">Search</label>
        <input id="search" className="searchInput" type="text" onChange={handleInput} placeholder="Enter a word" />
        <button onClick={(e) => handleSearchSubmit(e)}>Search Word</button>
      </form>

      <div>
        {selectedWord !== undefined || selectedWord.length !== 0 ? selectedWord : null}
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
        ) : (
          <button disabled={true}>Save Word</button>
        )}

        <div>Your backronym is: {backronym.join(' ')}</div>
      </div>
    </div>
  );
}

export default Search;

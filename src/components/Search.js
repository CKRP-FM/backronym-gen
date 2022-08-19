import axios from 'axios';
import { useState } from 'react';
import shuffle from '../utilities/shuffle.js';

function Search() {
  // const [letter, setLetter] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wordInput, setWordInput] = useState('');
  const [selectedWord, setSelectedWord] = useState([]);
  const [randomArray, setRandomArray] = useState([]);
  const [backronym, setBackronym] = useState([]);
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

  async function handleSearchSubmit(e) {
    e.preventDefault();

    const clone = wordInput;
    setSelectedWord(splitIntoChars(clone));

    getWords();
  }

  function getWords() {
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
    let increment = currentIndex + 1;
    setCurrentIndex(increment);
    setRandomArray([]);
    getWords();
    setCheckedWord('');
  }

  // on change checked
  // everything else gets greyed (setting ischecked to true)
  function handleCheckbox(e) {
    if (checkedWord === '') {
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
          {randomArray?.map((word, index) => {
            return (
              <li key={index}>
                <input
                  value={word.word}
                  id="word"
                  type="checkbox"
                  className="wordListItem"
                  onChange={(e) => handleCheckbox(e)}
                  disabled={checkedWord !== '' && checkedWord !== word.word}
                />
                <label htmlFor="word">{word.word}</label>
              </li>
            );
          })}
        </ul>
        {/* <button
          onClick={(e) => {
            // setCheckedWord('');
            handleSearchSubmit(e);
          }}
        >
          Refresh
        </button> */}
        {checkedWord !== '' ? (
          <button onClick={(e) => handleSaveWord(e)}>Save Word</button>
        ) : (
          <button disabled={true} onClick={(e) => handleSaveWord(e)}>
            Save Word
          </button>
        )}

        <div>Your backronym is: {backronym.join(' ')}</div>
      </div>
    </div>
  );
}

export default Search;

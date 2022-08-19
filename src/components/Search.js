import axios from 'axios';
import { useState } from 'react';
import shuffle from '../utilities/shuffle.js';

function Search() {
  const [letter, setLetter] = useState('');
  const [letterArr, setLetterArr] = useState([]);
  const [randomArray, setRandomArray] = useState([]);
  const [chosenWords, setChosenWords] = useState([]);
  

  // Returns a copy of an array that includes the first 10 elements
  function subArray(array) {
    return array.slice(0, 10);
  }

  function handleInput(e) {
    setLetter(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();

    axios({
      url: `https://api.datamuse.com/words?sp=${letter}*`,
      method: 'GET',
      dataResponse: 'json'
    }).then((response) => {
      setRandomArray(subArray(shuffle(response.data)));
    }).catch((error) => {
      console.log(error);
    })
  }
 

  return (
    <div>
      <form>
        <label htmlFor='search'>Search</label>
        <input id='search' className='searchInput' type='text' onChange={handleInput} placeholder='Enter a letter'/>
        <button onClick={(e) => handleSubmit(e)}>hi</button>
      </form>

      <div>
        <ul>
        
        {
          randomArray?.map((word) => {
            return(
                <li key={word.score}>
                  <input id='word' type='checkbox' className='wordListItem'/>
                  <label htmlFor='word'>{word.word}</label>
                </li>           
            )
          })
      }
        </ul>
        <button onClick={(e) => handleSubmit(e)}>Refresh</button>
      </div>
    </div>
    
  )
}

export default Search;

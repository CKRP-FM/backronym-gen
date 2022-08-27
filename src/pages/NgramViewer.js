import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import firebase from '../firebase';
import ErrorModal from '../components/ErrorModal';

function NgramViewer() {
  const [currentInput, setCurrentInput] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [gallery, setGallery] = useState([]);
  const [error, setError] = useState('');

  //connect to firebase when NgramViewer component mounts
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
      setGallery(newState);
    });
  }, []);

  // useEffect(() => {
  //   axios({
  //     url: `https://intense-dusk-96795.herokuapp.com/https://books.google.com/ngrams/json?content=${searchInput}&year_start=1800&year_end=2000&corpus=26&smoothing=3`,
  //     method: 'GET',
  //     dataResponse: 'json',
  //   })
  //     .then((response) => {
  //       console.log(response);
  //     })
  //     .catch((error) => {
  //       setError(error.message);
  //     });
  // }, [searchInput]);

  const getNgram = async () => {
    await axios
      .get(
        `https://intense-dusk-96795.herokuapp.com/https://books.google.com/ngrams/json?content=${searchInput}&year_start=1800&year_end=2000&corpus=26&smoothing=3`
      )
      .then((response) => {
        if (response.data.length > 0) {
          console.log(response.data);
        } else {
          setError('No results found. Please try a different input!');
        }
      })
      .catch((err) => setError(err.message, 'No results found. Please try a different input!'));
  };

  const handleInput = (e) => {
    setCurrentInput(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (currentInput !== '') {
      setSearchInput(currentInput);
      getNgram();
    } else {
      setError('Select a word or phrase to search for their frequency!');
    }
  };

  return (
    <div className="ngramViewer">
      {error ? <ErrorModal errorMsg={error} setError={setError} /> : null}
      <NavBar />
      <main className="wrapper">
        <section className="ngramViewerContent">
          <h1>Ngram Viewer</h1>
          <p>Powered by Google Ngram Viewer API</p>
          <h2>What is the Google Ngram Viewer?</h2>
          <p>
            It is an online search engine that charts the frequencies of any set of search strings, like words or a
            phrase, using a yearly count of{' '}
            <span className="tooltip">
              n-grams
              <span className="tooltipText">
                In the fields of computational linguistics and probability, an n-gram is a contiguous sequence of n
                items from a given sample of text or speech. Source:{' '}
                <a href="https://en.wikipedia.org/wiki/N-gram">Wikipedia</a>
              </span>
            </span>{' '}
            found in printed sources (e.g. books) published between 1500 and 2019. The program can search for a word or
            a phrase, including misspellings or gibberish. The n-grams are matched with the text within the selected
            corpus (e.g. English) and, if found in 40 or more books, are then displayed as a graph.{' '}
            <span>
              Source: <a href="https://en.wikipedia.org/wiki/Google_Ngram_Viewer">Wikipedia</a>
            </span>
          </p>
          <div className="visualizerContainer">
            <form className="ngramForm">
              {/* If user wants to search for ANY word or phrase */}
              <fieldset>
                <legend>Enter a word, several words (seperated by a comma) or a phrase:</legend>
                <label htmlFor="searchNgram" className="sr-only">
                  Search for a word or phrase
                </label>
                <input
                  type="text"
                  id="searchNgram"
                  onChange={handleInput}
                  placeholder="Frankenstein, Dracula..."
                  // value={currentInput}
                />
              </fieldset>

              {/* If user wants to select from our list of saved backronyms */}
              <fieldset>
                <legend>Or pick from our existing backronyms and check their frequency in printed sources! </legend>
                <label htmlFor="savedBackronyms" className="sr-only">
                  Search for the frenquency of a saved backronym
                </label>
                <select
                  name="savedBackronyms"
                  id="savedBackronyms"
                  defaultValue={'default'}
                  // value={currentInput}
                  onChange={handleInput}
                >
                  <option value="default" disabled>
                    Select your option
                  </option>
                  {gallery.map((result) => {
                    return (
                      <option value={result.userInput} key={result.key}>
                        {result.userInput}
                      </option>
                    );
                  })}
                </select>
              </fieldset>
              <button onClick={(e) => handleSearchSubmit(e)}>Search</button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default NgramViewer;

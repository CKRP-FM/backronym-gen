import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import firebase from '../firebase';
import ErrorModal from '../components/ErrorModal';
import { Link } from 'react-router-dom';

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
        // if (response.data.length > 0) {
        console.log(response.data);
        // } else {
        //   setError('No results found. Please try a different input!');
        // }
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
      <main className="wrapper ngramViewerMain">
        <section className="ngramViewerContent">
          <h1>Ngram Viewer</h1>
          <p>Powered by Google Ngram Viewer API</p>
          <h2>What is the Google Ngram Viewer?</h2>
          <p>
            It is an online search engine that draws data from Google Books, which contains a digital archive of books
            that ranges from 1500 to the present. It charts the frequencies of any set of search strings, like words or
            a phrase, using a yearly count of{' '}
            <span className="tooltip">
              n-grams
              <span className="tooltipText">
                In the fields of computational linguistics and probability, an n-gram is a contiguous sequence of n
                items from a given sample of text or speech. Source:{' '}
                <a href="https://en.wikipedia.org/wiki/N-gram">Wikipedia</a>
              </span>
            </span>{' '}
            found in printed sources (e.g. books). This means you can plug in words (or phrases, using comma-delimited
            search strings) and chart the popular usage of these words over the course of history. Basically, by
            searching specific terms, it is possible to identify historical trends.{' '}
            <span>
              Source: <a href="https://en.wikipedia.org/wiki/Google_Ngram_Viewer">Wikipedia</a> and{' '}
              <a href="https://uwaterloo.ca/writing-and-communication-centre/blog/post/experiment-google-ngram-viewer-or-how-i-learned-stop">
                University of Waterloo
              </a>
            </span>
          </p>
          <div className="visualizerContainer">
            <div className="userNgramInputBox">
              <form className="ngramForm">
                {/* If user wants to search for ANY word or phrase */}
                <fieldset>
                  <legend>Enter a word, several words seperated by a comma, or a phrase:</legend>
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
                  <legend>
                    Or pick from our existing backronyms: (psst, you can add a new one <Link to="/">here</Link>)
                  </legend>
                  <label htmlFor="savedBackronyms" className="sr-only">
                    Search for the frequency of a saved backronym
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
            <div className="ngramGraphBox">
              <h3>Usage Frequency Graph</h3>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default NgramViewer;

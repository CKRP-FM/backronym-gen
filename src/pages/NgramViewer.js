import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import firebase from '../firebase';
import ErrorModal from '../components/ErrorModal';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

function NgramViewer() {
  const [currentInput, setCurrentInput] = useState('');
  const [currentSelection, setCurrentSelection] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [gallery, setGallery] = useState([]);
  const [error, setError] = useState('');

  // for chart js
  const [datesData, setDatesData] = useState([]);
  const [frequencyData, setFrequencyData] = useState([]);

  const data = {
    labels: datesData,
    datasets: [
      {
        label: 'Frequency of the word or phrase',
        data: frequencyData,
        backgroundColor: '#ff5e5b',
        borderColor: 'black',
        borderWidth: 2,
      },
    ],
  };

  const setDatesLabel = (start, end) => {
    let datesArray = [];
    for (let i = start; i <= end; i++) {
      datesArray.push(i);
    }
    setDatesData(datesArray);
  };

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

  function isValidInput(str) {
    // allow text, numbers and spaces
    return /^[a-zA-Z_]+( [a-zA-Z_]+)*$/.test(str) && str.length > 1;
  }

  const getNgram = async () => {
    await axios
      .get(
        `https://intense-dusk-96795.herokuapp.com/https://books.google.com/ngrams/json?content=${searchInput}&year_start=1919&year_end=2019&corpus=26&smoothing=3`
      )
      .then((response) => {
        setFrequencyData(response.data[0].timeseries);
        setDatesLabel(1919, 2019);
      })
      .catch((err) => setError(err.message, 'No results found. Please try a different input!'));
  };

  const handleInput = (e) => {
    setCurrentInput(e.target.value);
  };

  const handleSelection = (e) => {
    const selectionString = [...e.target.value];
    setCurrentSelection(selectionString.join('').replaceAll(',', ''));
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (currentInput !== '') {
      if (isValidInput(currentInput)) {
        setSearchInput(currentInput);
        await getNgram();
        setCurrentInput('');
      } else {
        setError('Only text inputs over one character are allowed!');
      }
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
            that ranges from years 1500 to 2019. It charts the frequencies of any set of search strings, like words or a
            phrase, using a yearly count of{' '}
            <span className="tooltip">
              n-grams
              <span className="tooltipText">
                In the fields of computational linguistics and probability, an n-gram is a contiguous sequence of n
                items from a given sample of text or speech. Source:{' '}
                <a href="https://en.wikipedia.org/wiki/N-gram" target="_blank" rel="noopener noreferrer">
                  Wikipedia
                </a>
              </span>
            </span>{' '}
            found in printed sources (e.g. books). This means you can plug in words (or phrases, using comma-delimited
            search strings) and chart the popular usage of these words over the course of history. Basically, by
            searching specific terms, it is possible to identify historical trends.{' '}
            <span>
              Source:{' '}
              <a href="https://en.wikipedia.org/wiki/Google_Ngram_Viewer" target="_blank" rel="noopener noreferrer">
                Wikipedia
              </a>{' '}
              and{' '}
              <a
                href="https://uwaterloo.ca/writing-and-communication-centre/blog/post/experiment-google-ngram-viewer-or-how-i-learned-stop"
                target="_blank"
                rel="noopener noreferrer"
              >
                University of Waterloo
              </a>
            </span>
          </p>
          <div className="visualizerContainer wrapper">
            <div className="userNgramInputBox">
              <form className="ngramForm">
                {/* If user wants to search for ANY word or phrase */}
                <fieldset>
                  <legend>Enter a word or a phrase:</legend>
                  <label htmlFor="searchNgram" className="sr-only">
                    Search for a word or phrase
                  </label>
                  <input
                    type="text"
                    id="searchNgram"
                    onChange={(e) => handleInput(e)}
                    placeholder="Frankenstein, Dracula..."
                    value={currentInput}
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
                    // value={currentSelection}
                    onChange={(e) => handleSelection(e)}
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
            <div className="ngramGraphBox wrapper">
              <h3>Usage Frequency Graph</h3>
              <h4>Results between the years 1919 and 2019</h4>
              <div className="chartJsContainer">
                <Line data={data} />
              </div>
              <p>
                More information on the Google Ngram Viewer{' '}
                <a href="https://books.google.com/ngrams/info" target="_blank" rel="noopener noreferrer">
                  here
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default NgramViewer;

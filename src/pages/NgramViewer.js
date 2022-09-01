import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import firebase from '../firebase';
import ErrorModal from '../components/ErrorModal';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
// load state
import Loading from '../components/Loading';
import timeout from '../utilities/timeout';

function NgramViewer() {
  const [currentInput, setCurrentInput] = useState('');
  const [currentSelection, setCurrentSelection] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectOptions, setSelectOptions] = useState([]);
  const [error, setError] = useState('');

  // for chart js
  const [datesData, setDatesData] = useState([]);
  const [frequencyData, setFrequencyData] = useState([]);

  // API loading state
  const [loading, setLoading] = useState(false);

  // to scroll down to graph when search is pressed
  const graphRef = useRef(null);

  function scrollToGraph() {
    graphRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  const data = {
    labels: datesData,
    datasets: [
      {
        label: `Frequency of "${searchInput}"`,
        data: frequencyData,
        backgroundColor: '#ff5e5b',
        borderColor: 'black',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    // responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Word or Phrase Frequency Between 1959 and 2019',
      },
    },
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

    // db listener, for every change in the firebase db, push the new value into our gallery state
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

      // result.userinput comes in ["k", "e", "o", "n"] form, need to join them as a string and remove commas
      let optionsArray = newState.map((result) => result.userInput.join('').replaceAll(',', ''));
      // removes duplicates to keep unique values
      // ES6 has a native object Set to store unique values
      let uniqueOptionsArray = optionsArray.filter((value, index, arr) => arr.indexOf(value) === index);
      setSelectOptions(uniqueOptionsArray);
    });
  }, []);

  // set loading state to false
  function handleLoading() {
    setLoading(false);
  }

  function isValidInput(str) {
    // allow text, numbers and spaces and only words over 1 character, regex from https://stackoverflow.com/questions/15472764/regular-expression-to-allow-spaces-between-words
    return /^[a-zA-Z_]+( [a-zA-Z_]+)*$/.test(str) && str.length > 1;
  }

  const getNgram = async (word) => {
    await axios
      .get(
        `https://intense-dusk-96795.herokuapp.com/https://books.google.com/ngrams/json?content=${word}&year_start=1959&year_end=2019&corpus=26&smoothing=3`
      )
      .then((response) => {
        setFrequencyData(response.data[0].timeseries);
        setDatesLabel(1959, 2019);
      })
      .catch(() => {
        setError('No results found. Please try a different input!');
      });
  };

  const handleInput = (e) => {
    setCurrentInput(e.target.value);
  };

  const resetGraph = () => {
    setFrequencyData([]);
    setDatesLabel([]);
  };

  const handleSelection = (value) => {
    setCurrentSelection(value);
  };

  const resetForm = (e) => {
    e.preventDefault();
    setCurrentSelection('');
    setCurrentInput('');
    setSearchInput('');
  };

  const handleSearchSubmit = (e, userInput) => {
    e.preventDefault();
    if (currentInput !== '' && currentSelection === '') {
      if (isValidInput(userInput)) {
        resetGraph();
        setSearchInput(userInput);
        setLoading(true);
        timeout(handleLoading, 3000);
        getNgram(userInput);
        scrollToGraph();
        setCurrentInput('');
      } else {
        setError('Only text inputs over one character are allowed! Special characters are not allowed!');
      }
    } else if (currentInput === '' && currentSelection !== '') {
      resetGraph();
      setSearchInput(currentSelection);
      setLoading(true);
      timeout(handleLoading, 3000);
      getNgram(currentSelection);
      scrollToGraph();
      setCurrentSelection('');
    } else {
      setError('Select a word or phrase to search for their frequency!');
    }
  };

  return (
    <div className="ngramViewer">
      {error ? <ErrorModal errorMsg={error} setError={setError} /> : null}
      <NavBar />
      <main className="ngramViewerMain">
        <section className="ngramViewerContent wrapper">
          <div className="ngramViewerHeading">
            <h1>Ngram Viewer</h1>
            <p>Powered by Google Ngram Viewer API</p>
          </div>

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
                  {/* Only let user input new word if no selected word has been selected in the dropdown */}
                  {currentSelection === '' ? (
                    <input
                      type="text"
                      id="searchNgram"
                      onChange={(e) => handleInput(e)}
                      placeholder="Bitcoin..."
                      value={currentInput}
                    />
                  ) : (
                    <input
                      type="text"
                      id="searchNgram"
                      onChange={(e) => handleInput(e)}
                      placeholder="Bitcoin..."
                      value={currentInput}
                      disabled
                    />
                  )}
                </fieldset>

                {/* If user wants to select from our list of saved backronyms */}
                <fieldset>
                  <legend>
                    Or pick from our existing backronyms: (psst, you can add a new one <Link to="/">here</Link>)
                  </legend>
                  <label htmlFor="savedBackronyms" className="sr-only">
                    Search for the frequency of a saved backronym
                  </label>
                  {currentInput === '' ? (
                    <select
                      name="savedBackronyms"
                      id="savedBackronyms"
                      value={currentSelection}
                      onChange={(e) => handleSelection(e.target.value)}
                    >
                      <option value="" disabled>
                        Select your option
                      </option>
                      {selectOptions.map((option, index) => {
                        return (
                          <option value={option} key={index}>
                            {option}
                          </option>
                        );
                      })}
                    </select>
                  ) : (
                    <p>Please clear your input above before selecting a saved word.</p>
                  )}
                </fieldset>
                <button
                  onClick={(e) => {
                    handleSearchSubmit(e, currentInput);
                  }}
                >
                  Search
                </button>
                {/* resets the dropdown field */}
                <button onClick={(e) => resetForm(e)}>Reset form</button>
              </form>
            </div>
            <div className="ngramGraphBox">
              <h3>Usage Frequency Graph</h3>
              <h4>Results between the years 1959 and 2019</h4>
              {loading ? (
                <div className="loadingSection">
                  <Loading />
                </div>
              ) : (
                <div className="chartJsContainer">
                  <Line data={data} options={options} />
                </div>
              )}
              <p ref={graphRef}>
                Search for other date ranges or languages{' '}
                <a href="https://books.google.com/ngrams" target="_blank" rel="noopener noreferrer">
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

import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import axios from 'axios';
import { useEffect } from 'react';

function NgramViewer() {
  // useEffect(() => {
  //   axios({
  //     url: 'https://books.google.com/ngrams/json?content=Churchill&year_start=1800&year_end=2000&corpus=26&smoothing=3',
  //     method: 'GET',
  //     dataResponse: 'json',
  //   })
  //     .then((response) => {
  //       console.log(response);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, []);

  // const getNgram = async () => {
  //   await axios
  //     .get('https://books.google.com/ngrams/json?content=Churchill&year_start=1800&year_end=2000&corpus=26&smoothing=3')
  //     .then((response) => console.log(response))
  //     .catch((err) => console.log(err));
  // };

  // getNgram();

  return (
    <div className="ngramViewer">
      <NavBar />
      <main className="wrapper">
        <section className="ngramViewerContent">
          <h1>Ngram Viewer</h1>
          <p>Powered by Google Ngram Viewer API</p>
          <h2>What is the Google Ngram Viewer?</h2>
          <p>
            It is an online search engine that charts the frequencies of any set of search strings using a yearly count
            of{' '}
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
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default NgramViewer;

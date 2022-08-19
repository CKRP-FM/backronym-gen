import './App.css';
import firebase from './firebase';
import { getDatabase, ref, onValue, push } from 'firebase/database';
import { useEffect, useState } from 'react';


function App() {
  const [gallery, setGallery] = useState([]);
  const [userInput, setUserInput] = useState('');
  useEffect( () => {
    // database details
    const database = getDatabase(firebase)
    const dbRef = ref(database);
    onValue(dbRef, (response) => {
      console.log(response.val());
      const newState = [];
      const data = response.val();
      for (let key in data) {
        newState.push(
          {
            key: key,
            author: key.author,
            userInput: data[key].userInput,
            userInputSplit: data[key].userInputSplit,
            results: data[key].results,
          }
        )
      }
      setGallery(newState);
      console.log(gallery)
    })
  }, [gallery]);

  // create reference to the databse 
  const database = getDatabase(firebase)
  const dbRef = ref(database)
  if (userInput) {
    //add userInput to our firebase
    push(dbRef, userInput)
    // clear userInput
    setUserInput('');
  }

    return (
      <div>
        <div className="App">
          <h1>Backronym Generator</h1>
          <ul className="resultsDisplay">
            {
              gallery.map( (result) => {
                return (
                  <li key={result.key}>
                    <h3>{result.userInput}</h3>
                    <p>{result.results.join(' ')}</p>
                  </li>                                 
                )
              })
            }
          </ul>          
        <label htmlFor=""></label>
        <input type="text" />  
      </div>

      </div>

    );
}






export default App;

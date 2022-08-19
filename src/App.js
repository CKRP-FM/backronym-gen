import './App.css';
import Gallery from './components/Gallery';
import firebase from './firebase';
// import { getDatabase, ref, onValue, push } from 'firebase/database';
// import { useEffect, useState } from 'react';


function App() {
  // const [userInput, setUserInput] = useState('');

  

  // // create reference to the databse 
  // const database = getDatabase(firebase)
  // const dbRef = ref(database)
  // if (userInput) {
  //   //add userInput to our firebase
  //   push(dbRef, userInput)
  //   // clear userInput
  //   setUserInput('');
  // }

    return (
      <div>
        <div className="App">
          <h1>Backronym Generator</h1>

          <Gallery />
            
        {/* <label htmlFor=""></label>
        <input type="text" />   */}
      </div>

      </div>

    );
}






export default App;

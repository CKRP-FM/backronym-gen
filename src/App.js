import './App.scss';
import { useState } from 'react'
import Gallery from './components/Gallery';
import Search from './components/Search';
import AboutModal from './components/AboutModal';
import Footer from './components/Footer';


function App() {
  const [show, setShow] = useState(false)

  return (
    <div className="App">
      <h1>Backronym Generator</h1>
      <button onClick={ () => setShow(true) }>❓</button>
      {/* whenever this method is called it will close the modal */}
      <AboutModal onClose={() => setShow(false)} show={show} />

      <Search />

      <Gallery />
      
      <Footer />
    </div>
  );
}

export default App;

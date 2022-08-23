import './App.scss';
import { useState } from 'react'
import Gallery from './components/Gallery';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Search from './components/Search';
import AboutModal from './components/AboutModal';
import Footer from './components/Footer';
import { UserAuthContextProvider } from './context/UserAuthContext';

function App() {
  const [show, setShow] = useState(false)

  return (
    <UserAuthContextProvider>
      <div className="App">
        {/* <Login />
        <SignUp /> */}
      <button onClick={ () => setShow(true) }>❓</button>
      {/* whenever this method is called it will close the modal */}
      <AboutModal onClose={() => setShow(false)} show={show} />

        <Search />

        <Gallery />
      
      <Footer />
      </div>
    </UserAuthContextProvider>
  );
}

export default App;

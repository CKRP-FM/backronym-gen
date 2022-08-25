import './App.scss';
import Gallery from './components/Gallery';
import Search from './components/Search';
import Footer from './components/Footer';
import { UserAuthContextProvider } from './context/UserAuthContext';
import NavBar from './components/NavBar';

function App() {
  return (
    <UserAuthContextProvider>
      <div className="App">
        <NavBar />

        <Search />

        <Gallery />

        <Footer />
      </div>
    </UserAuthContextProvider>
  );
}

export default App;

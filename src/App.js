import './App.scss';
import Gallery from './components/Gallery';
import Search from './components/Search';
import { UserAuthContextProvider } from './context/UserAuthContext';

function App() {
  return (
    <UserAuthContextProvider>
      <div className="App">
        <h1>Backronym Generator</h1>

        <Search />

        <Gallery />
      </div>
    </UserAuthContextProvider>
  );
}

export default App;

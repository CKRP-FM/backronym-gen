import './App.css';
import Gallery from './components/Gallery';
import Search from './components/Search';

function App() {
  return (
    <div className="App">
      <h1>Backronym Generator</h1>

      <Search />

      <Gallery />
    </div>
  );
}

export default App;

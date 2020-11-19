import './App.css';
import MainComponent from './components/MainComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom';
function App() {
  return (
    <BrowserRouter>
      <div>
        <MainComponent />
      </div>
    </BrowserRouter>
  );
}

export default App;

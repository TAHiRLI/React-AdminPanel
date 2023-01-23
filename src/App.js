import './App.scss';
import { GeneralContextProvider } from './Components/Context/GeneralContext';
import Routes from './Components/Route';

function App() {
  return (
     <GeneralContextProvider>
      <Routes/>
    </GeneralContextProvider>
  );
}

export default App;

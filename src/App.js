import { Provider } from 'react-redux';
import './App.scss';
import { GeneralContextProvider } from './Components/Context/GeneralContext';
import Routes from './Components/Route';
import { MyStore } from './Reducers/loginReducer';

function App() {
  return (
    <Provider store={MyStore}>
     <GeneralContextProvider>
      <Routes/>
    </GeneralContextProvider>
    </Provider>
  );
}

export default App;

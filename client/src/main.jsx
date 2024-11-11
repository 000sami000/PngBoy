
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux';
 
 import { legacy_createStore as createStore,applyMiddleware,compose} from 'redux'
 import {thunk} from 'redux-thunk'
 import reducers from './reducers/';
 const composeEnhancers=window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store =createStore(reducers,composeEnhancers(applyMiddleware(thunk)))
ReactDOM.createRoot(document.getElementById('root')).render(
 
  <Provider store={store}>
    <App />
    </Provider>
  
)

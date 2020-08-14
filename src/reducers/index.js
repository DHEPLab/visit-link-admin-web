import { combineReducers } from 'redux';
import users from './users';
import networks from './networks';
import components from './components';
import modules from './modules';

export default combineReducers({
  users,
  networks,
  components,
  modules,
});

import { combineReducers } from 'redux';
import users from './users';
import networks from './networks';
import components from './components';

export default combineReducers({
  users,
  networks,
  components,
});

import { combineReducers } from 'redux';
import users from './users';
import networks from './networks';

export default combineReducers({
  users,
  networks,
});

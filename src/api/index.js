import Axios from 'axios';
import { apiAccountProfile } from '../actions';

export function ApiAccountProfile() {
  return Axios.get('/api/account/profile').then((r) => dispatch(apiAccountProfile(r)));
}

import { combineReducers } from "redux";
import networks from "./networks";
import components from "./components";
import modules from "./modules";

export default combineReducers({
  networks,
  components,
  modules,
});

export default function (state = { activeName: "" }, action) {
  switch (action.type) {
    case "ACTIVE_COMPONENT":
      return Object.assign({}, state, {
        activeName: action.payload,
      });
    default:
      return state;
  }
}

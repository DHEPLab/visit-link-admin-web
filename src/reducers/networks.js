export default function (state = { total: 0 }, action) {
  switch (action.type) {
    case 'HTTP_REQUEST_START':
      return Object.assign({}, state, {
        total: state.total + 1,
        [action.payload]: (state[action.payload] || 0) + 1,
      });
    case 'HTTP_REQUEST_END':
      return Object.assign({}, state, {
        total: state.total - 1,
        [action.payload]: (state[action.payload] || 1) - 1,
      });
    default:
      return state;
  }
}

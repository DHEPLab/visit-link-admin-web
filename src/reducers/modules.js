export default function (state = [], action) {
  switch (action.type) {
    case 'MODULE_FINISH_ACTION_OPTIONS':
      return action.payload;
    default:
      return state;
  }
}

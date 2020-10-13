export default function (state = { user: {}, authorized: false }, action) {
  switch (action.type) {
    case "LOAD_PROFILE_SUCCESS":
      return {
        user: action.payload,
        authorized: true,
      };
    case "LOAD_PROFILE_FAILURE":
      return {
        user: {},
        authorized: false,
      };
    default:
      return state;
  }
}

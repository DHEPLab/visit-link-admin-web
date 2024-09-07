import { useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  return (
    <h3>
      No match for <code>{location.pathname}</code>
    </h3>
  );
};

export default NotFound;

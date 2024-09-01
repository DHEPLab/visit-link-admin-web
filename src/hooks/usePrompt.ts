import { useBlocker, useLocation } from "react-router-dom";
import type { Location } from "react-router-dom";

interface usePromptParams {
  when: boolean;
  message: ((location: Location) => string) | string;
}

const usePrompt = ({ when, message }: usePromptParams) => {
  const location = useLocation();
  const messageContent = typeof message === "string" ? message : message(location);
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) => when && currentLocation.pathname !== nextLocation.pathname,
  );

  if (blocker.state === "blocked") {
    const confirm = window.confirm(messageContent);
    if (confirm) {
      blocker.proceed();
    } else {
      blocker.reset();
    }
  }
};

export default usePrompt;

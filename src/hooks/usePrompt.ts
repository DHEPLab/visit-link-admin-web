import type { BlockerFunction } from "react-router-dom";
import { useBlocker } from "react-router-dom";
import { useEffect } from "react";

interface usePromptParams {
  when: BlockerFunction;
  message: string;
}

const usePrompt = ({ when, message }: usePromptParams) => {
  const blocker = useBlocker(when);

  useEffect(() => {
    if (blocker.state === "blocked") {
      const confirm = window.confirm(message);
      if (confirm) {
        blocker.proceed();
      } else {
        blocker.reset();
      }
    }
  }, [blocker]);
};

export default usePrompt;

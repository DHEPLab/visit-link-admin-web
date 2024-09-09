import { SurveyCheckboxComponent, SurveyRadioComponent, SurveyTextComponent } from "@/models/res/Survey";

function createQuestionText(): SurveyTextComponent {
  return {
    type: "Text",
    key: Date.now(),
    value: {
      title: "",
    },
  };
}

function createQuestionRadio(): SurveyRadioComponent {
  return {
    type: "Radio",
    key: Date.now(),
    value: {
      title: "",
      options: [],
    },
  };
}

function createQuestionCheckbox(): SurveyCheckboxComponent {
  return {
    type: "Checkbox",
    key: Date.now(),
    value: {
      title: "",
      options: [],
    },
  };
}

const SurveyFactory = {
  createQuestionText,
  createQuestionRadio,
  createQuestionCheckbox,
};

export default SurveyFactory;

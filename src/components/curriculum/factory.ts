import { ModuleMediaComponent, ModuleTextComponent } from "@/models/res/Moduel";

// React render key
function generateKey() {
  return Date.now();
}

function createMedia(): ModuleMediaComponent {
  return {
    type: "Media",
    key: generateKey(),
    value: {
      type: "",
      file: "",
      text: "",
    },
  };
}

function createText(): ModuleTextComponent {
  return {
    type: "Text",
    key: generateKey(),
    value: {
      // script, instruction, refrence
      type: "script",
      html: "",
    },
  };
}

function createQuestionText() {
  return {
    type: "Text",
    key: generateKey(),
    value: {
      title: "",
    },
  };
}

function createQuestionRadio() {
  return {
    type: "Radio",
    key: generateKey(),
    value: {
      title: "",
      options: [],
    },
  };
}

function createQuestionCheckbox() {
  return {
    type: "Checkbox",
    key: generateKey(),
    value: {
      title: "",
      options: [],
    },
  };
}

function createSwitch() {
  return {
    type: "Switch",
    key: generateKey(),
    value: {
      question: createText().value,
      cases: [createCase()],
    },
  };
}

function createPageFooter() {
  return {
    type: "PageFooter",
    key: generateKey(),
  };
}

function createCase() {
  return {
    key: generateKey(),
    text: "",
    finishAction: [],
    components: [createText()],
  };
}

const Factory = {
  createText,
  createMedia,
  createSwitch,
  createQuestionText,
  createQuestionRadio,
  createQuestionCheckbox,
  createCase,
  createPageFooter,
};

export default Factory;

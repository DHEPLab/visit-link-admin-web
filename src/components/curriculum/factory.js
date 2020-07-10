// React render key
function generateKey() {
  return Date.now();
}

function createMedia() {
  return {
    type: 'Media',
    key: generateKey(),
    value: {
      type: '',
      file: '',
      text: '',
    },
  };
}

function createText() {
  return {
    type: 'Text',
    key: generateKey(),
    value: {
      // script, instruction, refrence
      type: 'script',
      html: '',
    },
  };
}

function createSwitch() {
  return {
    type: 'Switch',
    key: generateKey(),
    value: {
      question: createText().value,
      cases: [createCase()],
    },
  };
}

function createPageFooter() {
  return {
    type: 'PageFooter',
    key: generateKey(),
  };
}

function createCase() {
  return { key: generateKey(), text: '', finishAction: '', components: [createText()] };
}

export default { createText, createMedia, createSwitch, createCase, createPageFooter };

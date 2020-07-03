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
      type: '',
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
      cases: [
        {
          key: generateKey(),
          text: '',
          redirectTo: '',
          components: [createText()],
        },
      ],
    },
  };
}

export default { createText, createMedia, createSwitch };

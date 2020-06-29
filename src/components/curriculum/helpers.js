function generateKey() {
  return Date.now();
}

function addText(components) {
  components.push({
    type: 'Text',
    key: generateKey(),
    value: {
      type: '',
      html: '',
    },
  });
}

function addMedia(components) {
  components.push({
    type: 'Media',
    key: generateKey(),
    value: {
      type: '',
      file: '',
      alt: '',
    },
  });
}

function removeComponent(components, index) {
  components.splice(index, 1);
}

export default { addText, addMedia, removeComponent };

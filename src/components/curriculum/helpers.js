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

export default { addText };

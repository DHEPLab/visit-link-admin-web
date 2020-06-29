import helpers from './helpers';

it('should add Text component to array components', () => {
  let components = [];
  helpers.addText(components);
  expect(components.length).toBe(1);

  const [component] = components;
  expect(component.type).toBe('Text');
  expect(component.key).toBeDefined();
  expect(component.value).toBeDefined();
  expect(component.value.type).toBeDefined();
  expect(component.value.html).toBeDefined();
});

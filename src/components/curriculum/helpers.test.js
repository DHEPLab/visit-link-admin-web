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

it('should add Media component to array components', () => {
  let components = [];
  helpers.addMedia(components);
  expect(components.length).toBe(1);

  const [component] = components;
  expect(component.type).toBe('Media');
  expect(component.key).toBeDefined();
  expect(component.value).toBeDefined();
  expect(component.value.type).toBeDefined();
  expect(component.value.file).toBeDefined();
  expect(component.value.alt).toBeDefined();
});

it('should remove index 1 component', () => {
  let components = [1, 2, 3];
  helpers.removeComponent(components, 1);

  expect(components).toStrictEqual([1, 3]);
});

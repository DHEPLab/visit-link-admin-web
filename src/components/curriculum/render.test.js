import { render } from '@testing-library/react';

import renderComponents from './render';
import { Text, Media, Switch, PageFooter } from './*';

test('should render components', () => {
  const children = renderComponents(components).props.children;

  expect(children[0].type).toEqual(Text);
  expect(children[1].type).toEqual(Media);
  expect(children[2].type).toEqual(Switch);
  expect(children[3].type).toEqual(PageFooter);
});

test('should render unknow type component', () => {
  const { container } = render(
    renderComponents([
      {
        type: 'React',
        props: {
          key: 1,
        },
      },
    ])
  );

  expect(container.firstChild).toMatchInlineSnapshot(`
    <div>
      UNKNOWN Type 
      React
    </div>
  `);
});

const components = [
  {
    type: 'Text',
    props: {
      key: 1,
    },
  },
  {
    type: 'Media',
    props: {
      key: 2,
    },
  },
  {
    type: 'Switch',
    props: {
      key: 3,
    },
  },
  {
    type: 'PageFooter',
    props: {
      key: 4,
    },
  },
];

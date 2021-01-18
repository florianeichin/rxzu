import { addDecorator } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { themes } from '@storybook/theming';

addDecorator(withKnobs);

export const parameters = {
  docs: {
    theme: themes.dark,
  },
  options: {
    storySort: {
      order: [
        'Getting Started',
        'Node',
        'Link',
        'Port',
        'Label',
        'Actions',
        'Plugins',
        'Examples',
      ],
    },
  },
};

import * as React from 'react';
import { DefaultNodeStory } from './default/DefaultWidget';

export default {
  title: 'Node',
};

export const Default = () => DefaultNodeStory();
export const Custom = () => <div>Button</div>;

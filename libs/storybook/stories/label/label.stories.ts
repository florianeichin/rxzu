import { Meta, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { DefaultLinkTemplate, CustomLinkTemplate } from './label.template';
import { DefaultLabelStoryComponent } from './default/default.component';
import { CustomLabelComponent } from './custom/custom-label.component';
import {
  DefaultLinkComponent,
  DefaultNodeComponent,
  DefaultLabelComponent,
  DefaultPortComponent,
  NgxDiagramsModule
} from '@ngx-diagrams/angular';

export default {
  title: 'Label',
  component: DefaultLinkComponent,
  parameters: { docs: { iframeHeight: '400px' } },
  decorators: [
    moduleMetadata({
      declarations: [
        DefaultNodeComponent,
        CustomLabelComponent,
        DefaultLabelStoryComponent,
        DefaultLinkComponent,
        DefaultLabelComponent,
        DefaultPortComponent
      ],
      imports: [CommonModule, NgxDiagramsModule],
      entryComponents: [
        DefaultNodeComponent,
        DefaultLinkComponent,
        CustomLabelComponent,
        DefaultLabelComponent,
        DefaultPortComponent
      ]
    })
  ]
} as Meta;

export const Default = DefaultLinkTemplate.bind({});

export const Custom = CustomLinkTemplate.bind({});

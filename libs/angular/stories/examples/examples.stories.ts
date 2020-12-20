import { Meta, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import {
  AutoArrangeDiagramTemplate,
  BasicDiagramTemplate,
  PerformanceDiagramTemplate,
  SerializationDiagramTemplate,
  SmartRoutingDiagramTemplate
} from './examples.template';
import { BasicExampleStoryComponent } from './basic/basic.component';
import { SerializationExampleStoryComponent } from './serialization/serialization.component';
import { AutoArrangeExampleStoryComponent } from './auto-arrange/auto-arrange.component';
import { SmartRoutingExampleStoryComponent } from './smart-routing/smart-routing.component';
import { PerformanceExampleStoryComponent } from './performance/performance.component';
import {
  DefaultLinkComponent,
  DefaultNodeComponent,
  DefaultLabelComponent,
  DefaultPortComponent,
  DagreEngine,
  NgxDiagramsModule
} from '@ngx-diagrams/angular';

export default {
  title: 'Examples',
  component: DefaultLinkComponent,
  parameters: { docs: { iframeHeight: '400px' } },
  decorators: [
    moduleMetadata({
      declarations: [
        DefaultNodeComponent,
        BasicExampleStoryComponent,
        SerializationExampleStoryComponent,
        AutoArrangeExampleStoryComponent,
        SmartRoutingExampleStoryComponent,
        PerformanceExampleStoryComponent,
        DefaultLinkComponent,
        DefaultLabelComponent,
        DefaultPortComponent
      ],
      providers: [DagreEngine],
      imports: [CommonModule, NgxDiagramsModule],
      entryComponents: [DefaultNodeComponent, DefaultLinkComponent, DefaultLabelComponent, DefaultPortComponent]
    })
  ]
} as Meta;

export const Basic = BasicDiagramTemplate.bind({});

export const Serialization = SerializationDiagramTemplate.bind({});

export const AutoArrange = AutoArrangeDiagramTemplate.bind({});

export const SmartRouting = SmartRoutingDiagramTemplate.bind({});

export const Performance = PerformanceDiagramTemplate.bind({});

import { ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { EntityMap, LabelModel, NodeModel, PortModel, LinkModel } from '@ngx-diagrams/core';
import { AbstractNodeFactory, AbstractLabelFactory, AbstractLinkFactory, AbstractPortFactory } from '../factories';
import { NgxDiagramsModule } from '../ngx-diagrams.module';

@Injectable({ providedIn: NgxDiagramsModule })
export class FactoriesService {
  protected nodeFactories = new Map<string, AbstractNodeFactory>();
  protected labelFactories = new Map<string, AbstractLabelFactory>();
  protected linkFactories = new Map<string, AbstractLinkFactory>();
  protected portFactories = new Map<string, AbstractPortFactory>();

  // LABELS
  registerLabelFactory(labelFactory: AbstractLabelFactory) {
    this.labelFactories.set(labelFactory.type, labelFactory);
  }

  getLabelFactories(): EntityMap<AbstractLabelFactory> {
    return this.labelFactories;
  }

  getLabelFactory(type: string): AbstractLabelFactory {
    if (this.labelFactories.has(type)) {
      return this.labelFactories.get(type);
    }
    throw new Error(`cannot find factory for node of type: [${type}]`);
  }

  getFactoryForLabel(label: LabelModel): AbstractLabelFactory | null {
    return this.getLabelFactory(label.getType());
  }

  generateWidgetForLabel(label: LabelModel, labelHost: ViewContainerRef): ComponentRef<LabelModel> | null {
    const labelFactory = this.getFactoryForLabel(label);
    if (!labelFactory) {
      throw new Error(`Cannot find widget factory for node: ${label.getType()}`);
    }
    return labelFactory.generateWidget(label, labelHost);
  }

  // NODES
  registerNodeFactory(nodeFactory: AbstractNodeFactory) {
    this.nodeFactories.set(nodeFactory.type, nodeFactory);
  }

  getNodeFactories(): EntityMap<AbstractNodeFactory> {
    return this.nodeFactories;
  }

  getNodeFactory(type: string): AbstractNodeFactory {
    if (this.nodeFactories.has(type)) {
      return this.nodeFactories.get(type);
    }
    throw new Error(`cannot find factory for node of type: [${type}]`);
  }

  getFactoryForNode(node: NodeModel): AbstractNodeFactory | null {
    return this.getNodeFactory(node.getType());
  }

  generateWidgetForNode(node: NodeModel, nodesHost: ViewContainerRef): ComponentRef<NodeModel> | null {
    const nodeFactory = this.getFactoryForNode(node);
    if (!nodeFactory) {
      throw new Error(`Cannot find widget factory for node: ${node.getType()}`);
    }
    return nodeFactory.generateWidget(node, nodesHost);
  }

  // PORTS
  registerPortFactory(factory: AbstractPortFactory) {
    this.portFactories.set(factory.type, factory);
  }

  getPortFactories() {
    return this.portFactories;
  }

  getPortFactory(type: string): AbstractPortFactory {
    if (this.portFactories.has(type)) {
      return this.portFactories.get(type);
    }
    throw new Error(`cannot find factory for port of type: [${type}]`);
  }

  getFactoryForPort(port: PortModel): AbstractPortFactory | null {
    return this.getPortFactory(port.getType());
  }

  generateWidgetForPort(port: PortModel, portsHost: ViewContainerRef): ComponentRef<PortModel> | null {
    const portFactory = this.getFactoryForPort(port);
    if (!portFactory) {
      throw new Error(`Cannot find widget factory for port: ${port.getType()}`);
    }
    return portFactory.generateWidget(port, portsHost);
  }

  // LINKS
  getLinkFactories(): EntityMap<AbstractLinkFactory> {
    return this.linkFactories;
  }

  registerLinkFactory(factory: AbstractLinkFactory) {
    this.linkFactories.set(factory.type, factory);
  }

  getLinkFactory(type: string): AbstractLinkFactory {
    if (this.linkFactories.has(type)) {
      return this.linkFactories.get(type);
    }
    throw new Error(`cannot find factory for link of type: [${type}]`);
  }

  getFactoryForLink(link: LinkModel): AbstractLinkFactory | null {
    return this.getLinkFactory(link.getType());
  }

  generateWidgetForLink(link: LinkModel, linksHost: ViewContainerRef): ComponentRef<LinkModel> | null {
    const linkFactory = this.getFactoryForLink(link);
    if (!linkFactory) {
      throw new Error(`Cannot find link factory for link: ${link.getType()}`);
    }
    return linkFactory.generateWidget(link, linksHost);
  }
}

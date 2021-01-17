import * as React from 'react';
import { DefaultNodeModel } from '@rxzu/core';
import { DefaultPortWidget } from './DefaultPortWidget';
import styled from '@emotion/styled';

const S = {
  Node: styled.div<{
    background: string;
    height: number;
    width: number;
    selected: boolean;
  }>`
    height: ${(p) => p.height}px;
    width: ${(p) => p.width}px;
    background-color: ${(p) => (p.selected ? 'white' : p.background)};
    pointer-events: all;
    width: 100%;
    border-radius: 10px;
    user-select: none;
    cursor: auto;
  `,

  Ports: styled.div`
    display: flex;
    background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2));
  `,

  PortsContainer: styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    &:first-of-type {
      margin-right: 10px;
    }
    &:only-child {
      margin-right: 0px;
    }
  `,
};

export const DefaultNodeWidget = (node: DefaultNodeModel) => {
  return (
    <S.Node
      data-default-node-name={node.name}
      height={node.getHeight()}
      width={node.getWidth()}
      selected={node.getSelected()}
      background={node.color}
    >
      <S.Ports>
        <S.PortsContainer>
          {node.getPortsArray().map((port) => DefaultPortWidget(port))}
        </S.PortsContainer>
      </S.Ports>
    </S.Node>
  );
};

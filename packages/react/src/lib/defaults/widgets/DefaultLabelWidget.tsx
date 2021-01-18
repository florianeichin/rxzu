import * as React from 'react';
import styled from '@emotion/styled';
import { Coords, DefaultLabelModel } from '@rxzu/core';

const S = {
  Label: styled.div<{ coords: Coords }>`
    transform: 'translate(${(p) => p.coords.x}px,  ${(p) => p.coords.y}px);
    position: absolute;
  `,
};

export const DefaultLabelWidget = (label: DefaultLabelModel) => {
  return <S.Label coords={label.getCoords()}>{label.getLabel()}</S.Label>;
};

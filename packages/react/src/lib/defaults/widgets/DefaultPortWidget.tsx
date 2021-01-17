import * as React from 'react';
import { DefaultPortModel } from '@rxzu/core';
import styled from '@emotion/styled';

const S = {
  Port: styled.div`
    width: 15px;
    height: 15px;
    background: rgba(255, 255, 255, 0.1);
    &:hover {
      background: rgb(192, 255, 0);
    }
  `,
};

export const DefaultPortWidget = (port: DefaultPortModel) => {
  return (
    <S.Port
      data-name={port.getName()}
      data-nodeid={port.getNode().id}
      {...port}
    ></S.Port>
  );
};

import * as React from 'react';
import { DefaultLinkModel } from '@rxzu/core';
import styled from 'styled-components';

const S = {
  Link: styled.div`
    position: absolute;
  `,
};

export const DefaultLinkWidget = (link: DefaultLinkModel) => {
  return <S.Link>Link</S.Link>;
};

import React from 'react';
import styled from 'styled-components';

/* eslint-disable-next-line */
export interface ReactProps {}

const StyledReact = styled.div`
  color: pink;
`;

export function RxZu(props: ReactProps) {
  return (
    <StyledReact>
      <h1>Welcome to react!</h1>
    </StyledReact>
  );
}

export default RxZu;

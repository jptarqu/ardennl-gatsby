import styled from '@emotion/styled';
import { graphql } from 'gatsby';
import React from 'react';

import Default from '../components/Layouts/Default';
import { ContentLimit, GridBase } from '../helpers/grid';
import { colorScheme } from '../helpers/styleSettings';
import { AllFile } from '../types';

const NotFoundWrap = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: ${colorScheme.text};
  ${GridBase};

  h1 {
    font-size: 2em;
    margin: 0;
    color: ${colorScheme.support};
    @media (min-width: 768px) {
      font-size: 3em;
    }
  }

  p {
    font-size: 1.25em;
    line-height: 1.55;
  }
`;

const NotFoundimage = styled.img`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  object-fit: cover;
  z-index: -1;
`;

const NotFoundContent = styled.div`
  ${ContentLimit};
`;

interface NotFoundPageProps {
  data: {
    allFile: AllFile;
  };
}
const NotFoundPage = ({ data }: NotFoundPageProps) => {
  const { edges } = data.allFile;
  const bg = edges.find(edge =>
    edge.node.name ? edge.node.name.includes('arden') : false
  );
  return (
    <Default>
      <NotFoundWrap>
        {bg && bg.node.childImageSharp && bg.node.childImageSharp.fluid && (
          <NotFoundimage src={bg.node.childImageSharp.fluid.tracedSVG} />
        )}
        <NotFoundContent>
          <h1>404 - NOT FOUND</h1>
          <p>This page does not exist. Maybe it never has.</p>
        </NotFoundContent>
      </NotFoundWrap>
    </Default>
  );
};

export default NotFoundPage;

export const query = graphql`
  query errorQuery {
    allFile(filter: { name: { eq: "arden" } }) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

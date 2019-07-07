import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { graphql, Link } from 'gatsby';
import * as React from 'react';

import Default from '../components/Layouts/Default';
import { ContentLimit, GridBase } from '../helpers/grid';
import { colorScheme } from '../helpers/styleSettings';
import { AllFile, AllMarkdownRemark } from '../types';
import { goToPage, preventWidow } from '../helpers/helpers';

export interface HomeProps {
  data: {
    allMarkdownRemark: AllMarkdownRemark;
  };
}

const Home = (props: HomeProps) => {
  const { allMarkdownRemark } = props.data;

  const bg = allMarkdownRemark.edges.map(edge => (
    <Link key={edge.node.id} to={edge.node.fields.slug}>
      {preventWidow(edge.node.frontmatter.title)}
    </Link>
  ));
  return (
    <div>
      <h1>Hello</h1> {bg}
    </div>
  );
};

export default Home;

export const query = graphql`
  query {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      totalCount
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            title
            tags
            date(formatString: "MMMM YYYY")
          }
          excerpt
        }
      }
    }
  }
`;

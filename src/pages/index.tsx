import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { graphql, Link } from 'gatsby';
import * as React from 'react';

import Default from '../components/Layouts/Default';
import { ContentLimit, GridBase } from '../helpers/grid';
import { colorScheme } from '../helpers/styleSettings';
import { AllFile, AllMarkdownRemark, MarkdownRemark } from '../types';
import { goToPage, preventWidow } from '../helpers/helpers';

export interface HomeProps {
  data: {
    allMarkdownRemark: AllMarkdownRemark;
  };
}

function createPostItem(edge: MarkdownRemark, reviewedAuthorSet: Set<string>): JSX.Element {
  if (edge.node.frontmatter.reviewedAuthor) {
    reviewedAuthorSet.add(edge.node.frontmatter.reviewedAuthor);
  }
  return (<li key={edge.node.id}>
    <Link to={edge.node.fields.slug}>
      {preventWidow(edge.node.frontmatter.title)}
    </Link>
  </li>);
}

const Home = (props: HomeProps) => {
  const { allMarkdownRemark } = props.data;

  const reviewedAuthorSet = new Set<string>();
  const bg = allMarkdownRemark.edges.map(edge => createPostItem(edge, reviewedAuthorSet));
  return (
    <div>
      <h1>Hello</h1>
      <ul>{bg}</ul>
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
            reviewedAuthor
            reviewedTitle
          }
          excerpt
        }
      }
    }
  }
`;


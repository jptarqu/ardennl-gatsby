import React from 'react';
import Helmet from 'react-helmet';
import { graphql, Link } from 'gatsby';

import { AllMarkdownRemark } from '../types';

import Default from '../components/Layouts/Default';
import config from '../../config/site-config';
import '../graphql/archive';
import { preventWidow } from '../helpers/helpers';

interface ReviewedAuthorTemplateProps {
  data: {
    allMarkdownRemark: AllMarkdownRemark;
  };
  pageContext: {
    reviewedAuthor: string;
  };
}
const ReviewedAuthorTemplate = ({ data, pageContext }: ReviewedAuthorTemplateProps) => {
  const { edges } = data.allMarkdownRemark;
  const { reviewedAuthor } = pageContext;

  const posts = edges.map(edge => (
    <li>
      <Link key={edge.node.id} to={edge.node.fields.slug}>
        {preventWidow(edge.node.frontmatter.title)}
      </Link>
    </li>
  ));
  return (
    <div>
      <p>Posts for Author ${reviewedAuthor}:</p>
      <ul>
        {posts}
      </ul>
    </div>
  );
};

export default ReviewedAuthorTemplate;

export const query = graphql`
  query ReviewedAuthorArchive($reviewedAuthor: String) {
    allMarkdownRemark(
      limit: 1000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { reviewedAuthor: { eq: $reviewedAuthor } } }
    ) {
      totalCount
      edges {
        node {
          ...defaultArchiveQuery
        }
      }
    }
  }
`;

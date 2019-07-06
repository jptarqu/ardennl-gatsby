import '../graphql/post';
import './b16-tomorrow-dark.css';

import styled from '@emotion/styled';
import { graphql } from 'gatsby';
import React, { useEffect, useState } from 'react';
import Helmet from 'react-helmet';

import Default from '../components/Layouts/Default';
import { MarkdownRemarkNode } from '../types';

const Article = styled.article`
  padding-bottom: 4em;
`;

interface BlogPostProps {
  data: { markdownRemark: MarkdownRemarkNode };
}

const BlogPost: React.SFC<BlogPostProps> = props => {
  const [fadeIn, setFadeIn] = useState(false);
  const { frontmatter, html } = props.data.markdownRemark;
  const { published } = frontmatter;

  useEffect(() => {
    setFadeIn(true);
  }, []);
  return (
    <Default>
      <Article>
        {!published && (
          <Helmet>
            <meta name="robots" content="noindex" />
          </Helmet>
        )}
      </Article>
    </Default>
  );
};

export default BlogPost;

// export const query = graphql`
//   query BlogPostQuery($slug: String!) {
//     markdownRemark(fields: { slug: { eq: $slug } }) {
//       ...postQuery
//     }
//   }
// `;

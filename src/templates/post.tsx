import '../graphql/post';
import './b16-tomorrow-dark.css';

import { graphql } from 'gatsby';
import React, { useEffect, useState } from 'react';

import { MarkdownRemarkNode } from '../types';

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
    <div>
      <h1>{frontmatter.title}</h1>
      <p><strong>Title</strong>: {frontmatter.reviewedTitle}</p>
      <p><strong>Author</strong>: {frontmatter.reviewedAuthor}</p>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};

export default BlogPost;

export const query = graphql`
  query BlogPostQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      ...postQuery
    }
  }
`;

import { graphql } from 'gatsby';

export const defaultPostQuery = graphql`
  fragment postQuery on MarkdownRemark {
    html
    excerpt
    fields {
      slug
    }
    frontmatter {
      title
      published
      date(formatString: "DD MMMM, YYYY")
      tags
      reviewedAuthor
      reviewedTitle
    }
  }
`;

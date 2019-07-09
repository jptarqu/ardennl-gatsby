import { graphql } from 'gatsby';

export const archiveQuery = graphql`
  fragment defaultArchiveQuery on MarkdownRemark {
    fields {
      slug
    }
    excerpt
    frontmatter {
      title
      tags
      published
      date(formatString: "DD MMMM, YYYY")
      
    }
  }
`;

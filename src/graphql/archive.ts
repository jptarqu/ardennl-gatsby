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
      category
      published
      date(formatString: "DD MMMM, YYYY")
      cover {
        id
        relativePath
      }
    }
  }
`;

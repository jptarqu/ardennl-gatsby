import React from 'react';
import styled from '@emotion/styled';
import Link from 'gatsby-link';

const TagListWrap = styled.div`
  display: flex;

  span {
    margin-right: 1ch;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
  }

  a {
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  li {
    &::after {
      content: ',';
      margin-right: 1ch;
    }

    &:last-child {
      &::after {
        content: '';
        margin: 0;
      }
    }
  }
`;

const TagList = ({ tags }: { tags: [string] }) => (
  <TagListWrap>
    <span>Tagged:</span>
    <ul>
      {tags.map(tag => (
        <li key={tag}>
          <Link to={`/tags/${tag}`}>{tag}</Link>
        </li>
      ))}
    </ul>
  </TagListWrap>
);

export default TagList;

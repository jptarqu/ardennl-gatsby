import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { graphql, Link } from 'gatsby';
import * as React from 'react';

import Layout from '../components/Layouts/Layout';
import styles from './index.module.scss'
import { AllFile, AllMarkdownRemark, MarkdownRemark } from '../types';
import { goToPage, preventWidow } from '../helpers/helpers';

export interface HomeProps {
  data: {
    allMarkdownRemark: AllMarkdownRemark;
  };
}
export interface ReviewLink {
  readonly slug: string
  readonly title: string
  readonly id: string
}
export interface ReviewLinkCollection {
  [letter: string]: Array<ReviewLink>;
}

function addToLinkCollection(col: ReviewLinkCollection, index: string, newValue: ReviewLink) {
  console.log('addToLinkCollection -> ' + index)
  if (!col[index]) {
    col[index] = new Array<ReviewLink>();
  }
  col[index].push(newValue)

}
function createPostLink(articleLink: ReviewLink) {
  return (<li key={articleLink.id}>
    <Link to={articleLink.slug}>
      {preventWidow(articleLink.title)}
    </Link>
  </li>);
}
function createPostItem(edge: MarkdownRemark, indexByAuthorName: ReviewLinkCollection): JSX.Element {
  const authorName = edge.node.frontmatter.reviewedAuthor
  const articleLink = { slug: edge.node.fields.slug, title: edge.node.frontmatter.title, id: edge.node.id }

  authorName
    .toUpperCase()
    .split(' ')
    .filter(s => s.length > 1)
    .map(s => s.substr(0, 1))
    .forEach(initial => addToLinkCollection(indexByAuthorName, initial, articleLink))

  return createPostLink(articleLink);
}
function getSortedKeys(index: {}) {
  const keys = Array<string>()
  for (const key in index) {
    if (index.hasOwnProperty(key)) {
      keys.push(key)
    }
  }
  return keys.sort();
}
function keyClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
  const elemClicked = event.target as HTMLAnchorElement;
  const articleList = (elemClicked.parentElement as HTMLAnchorElement).nextElementSibling
  if (articleList) {
    if (articleList.classList.contains(styles.hideletter)) {
      articleList.classList.remove(styles.hideletter)
      articleList.classList.add(styles.showletter)
    }
    else {
      articleList.classList.add(styles.hideletter)
      articleList.classList.remove(styles.showletter)
    }
  }
  event.preventDefault();
}
function buildIndex(index: ReviewLinkCollection): JSX.Element[] {
  const keys = getSortedKeys(index)
  const lettersUl = keys.map(key => {
    const element = index[key];
    const newUl = (
      <div key={key}>
        <a href="#" onClick={keyClick}><h3>{key}</h3>
        </a>
        <ul className={styles.hideletter}>{key}{element.map(createPostLink)}</ul>
      </div>)
    return newUl
  }
  )
  return lettersUl;
}


const Home = (props: HomeProps) => {
  const { allMarkdownRemark } = props.data;

  const indexByAuthorName: ReviewLinkCollection = {};
  const bg = allMarkdownRemark.edges.map(edge => createPostItem(edge, indexByAuthorName));
  const indexByAuthorNameList = buildIndex(indexByAuthorName)
  return (
    <Layout>
      <h1>Hello</h1>
      <ul>{bg}</ul>
      <h2>Index by Author Name</h2>
      <ul>{indexByAuthorNameList}</ul>
    </Layout>
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


import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { graphql } from 'gatsby';
import * as React from 'react';

import Default from '../components/Layouts/Default';
import { ContentLimit, GridBase } from '../helpers/grid';
import { colorScheme } from '../helpers/styleSettings';
import { AllFile, AllMarkdownRemark } from '../types';

export interface HomeProps {
  data: {
    allFile: AllFile;
    allMarkdownRemark: AllMarkdownRemark;
  };
}

const Home = (props: HomeProps) => {
  const { allFile, allMarkdownRemark } = props.data;
  const bg = allFile.edges.find(edge =>
    edge.node.name ? edge.node.name.includes('bg') : false
  );
  return <h1>Hello</h1>;
};

export default Home;

export const query = graphql`
  query Index_2_Query($category: String) {
    {
        allMarkdownRemark(sort: {fields: [frontmatter___date], order: DESC}) {
                totalCount
                edges {
                  node {
                    id
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
    }
    
  
`;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import SEO from '../components/SEO/SEO';
import ArticleHero from '../components/Article/ArticleHero';
import ArticleContent from '../components/Article/ArticleContent';
import '../graphql/post';
import './b16-tomorrow-dark.css';

const TestPost = (props) => {
    console.log(props.data);
    return (
        <div> bla</div>
    );
};

// TestPost.propTypes = {
//     data: PropTypes.object.isRequired,
// };

export default TestPost;

export const query = graphql`
    query TestPostQuery($slug: String!) {
        contentfulBlogPost(fields: { slug: { eq: $slug } }) {
            title
            heroImage {
                sizes {
                    base64
                    aspectRatio
                    src
                    srcSet
                    sizes
                }
            }
        }
    }
`;

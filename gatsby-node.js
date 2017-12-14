const path = require('path');
const _ = require('lodash');
const webpackLodashPlugin = require('lodash-webpack-plugin');

const postNodes = [];

exports.onCreateNode = ({ node, getNode, boundActionCreators }) => {
    const { createNodeField } = boundActionCreators;
    let slug;

    if (node.internal.type === 'MarkdownRemark') {
        const fileNode = getNode(node.parent);
        if (fileNode.internal.type !== 'contentfulBlogPostContentTextNode') {
            const parsedFilePath = path.parse(fileNode.relativePath);
            if (
                Object.prototype.hasOwnProperty.call(node, 'frontmatter') &&
                    Object.prototype.hasOwnProperty.call(node.frontmatter, 'title')
            ) {
                slug = `/${_.kebabCase(node.frontmatter.title)}`;
            } else if (parsedFilePath.name !== 'index' && parsedFilePath.dir !== '') {
                slug = `/${parsedFilePath.dir}/${parsedFilePath.name}/`;
            } else if (parsedFilePath.dir === '') {
                slug = `/${parsedFilePath.name}/`;
            } else {
                slug = `/${parsedFilePath.dir}/`;
            }
            if (
                Object.prototype.hasOwnProperty.call(node, 'frontmatter') &&
                    Object.prototype.hasOwnProperty.call(node.frontmatter, 'slug')
            ) {
                slug = `/${_.kebabCase(node.frontmatter.slug)}`;
            }
        }
    } else if (node.internal.type === 'ContentfulBlogPost') {
        console.log('HIEROOOOO ContentfulBlogPost', node.title);
        slug = `/${_.kebabCase(node.title)}`;
    }
    createNodeField({ node, name: 'slug', value: slug });
    postNodes.push(node);
};

exports.createPages = ({ graphql, boundActionCreators }) => {
    const { createPage } = boundActionCreators;
    return new Promise((resolve, reject) => {
        graphql(`
            {
                allMarkdownRemark(filter: { id: { regex: "/posts/" } }) {
                    edges {
                        node {
                            frontmatter {
                                tags
                                category
                                published
                            }
                            fields {
                                slug
                            }
                        }
                    }
                }
                allContentfulBlogPost {
                    edges {
                        node {
                            fields {
                                slug
                            }
                            id
                            title                        
                        }
                    }
                }
            }
      `).then((result) => {
            if (result.errors) {
                console.log(result.errors);
                reject(result.errors);
            }
            // console.log('testerDIDIEI', result.data.allContentfulBlogPost.edges);
            result.data.allContentfulBlogPost.edges.forEach(({ node }) => {
                console.log('contentful node', node);
                createPage({
                    path: node.fields.slug,
                    component: path.resolve('./src/templates/test.js'),
                    context: {
                        // Data passed to context is available in page queries as GraphQL variables.
                        slug: node.fields.slug,
                    },
                });
            });
            const tagSet = new Set();
            const categorySet = new Set();
            result.data.allMarkdownRemark.edges.forEach(({ node }) => {
                // console.log(node);
                if (node.frontmatter.tags) {
                    node.frontmatter.tags.forEach((tag) => {
                        tagSet.add(tag);
                    });
                }

                if (node.frontmatter.category) {
                    categorySet.add(node.frontmatter.category);
                }

                createPage({
                    path: node.fields.slug,
                    component: path.resolve('./src/templates/post.js'),
                    context: {
                        // Data passed to context is available in page queries as GraphQL variables.
                        slug: node.fields.slug,
                    },
                });


                const tagList = Array.from(tagSet);
                tagList.forEach((tag) => {
                    createPage({
                        path: `/tags/${_.kebabCase(tag)}/`,
                        component: path.resolve('./src/templates/tag.js'),
                        context: {
                            tag,
                        },
                    });
                });

                const categoryList = Array.from(categorySet);
                categoryList.forEach((category) => {
                    createPage({
                        path: `/categories/${_.kebabCase(category)}/`,
                        component: path.resolve('./src/templates/category.js'),
                        context: {
                            category,
                        },
                    });
                });
            });
            resolve();
        });
    });
};

exports.modifyWebpackConfig = ({ config, stage }) => {
    if (stage === 'build-html') {
        config.loader('null', {
            test: /intersection-observer/,
            loader: 'null-loader',
        });
    }
};

exports.modifyWebpackConfig = ({ config, stage }) => {
    if (stage === 'build-javascript') {
        config.plugin('Lodash', webpackLodashPlugin, null);
    }
};

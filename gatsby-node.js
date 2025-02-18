const path = require('path');
const _ = require('lodash');
// const webpackLodashPlugin = require('lodash-webpack-plugin');

const postNodes = [];

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  let slug;
  if (node.internal.type === 'MarkdownRemark') {
    const fileNode = getNode(node.parent);
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
    createNodeField({ node, name: 'slug', value: slug });
    postNodes.push(node);
  }
};

exports.createPages = ({ graphql, actions }) => {
  const { createPage, createRedirect } = actions;
  // const extRedirects = [
  //   { from: '/ts', to: 'https://github.com/aderaaij/totallystatical' },
  //   { from: '/aww', to: 'https://www.awwwards.com/sites/cfye-magazine' },
  //   {
  //     from: '/gss',
  //     to: 'https://github.com/aderaaij/gatsby-starter-skeleton-markdown'
  //   },
  //   { from: '/sia', to: 'https://superinteractive.com/' },
  //   { from: '/gh', to: 'https://github.com/aderaaij/' },
  //   { from: '/li', to: 'https://www.linkedin.com/in/ardenderaaij/' },
  //   { from: '/aa', to: 'https://abroad.arden.nl' }
  // ];
  // extRedirects.forEach(({ from, to }) => {
  //   createRedirect({
  //     fromPath: from,
  //     toPath: to,
  //     isPermanent: true
  //   });
  // });

  return new Promise((resolve, reject) => {
    graphql(`
      {
        allMarkdownRemark {
          edges {
            node {
              frontmatter {
                tags
                reviewedAuthor
                published
              }
              fields {
                slug
              }
            }
          }
        }
      }
    `).then(result => {
      if (result.errors) {
        const Console = console;
        Console.error(result.errors);
        reject(result.errors);
      }
      const tagSet = new Set();
      const reviewedAuthorSet = new Set();
      result.data.allMarkdownRemark.edges.forEach(({ node }) => {
        if (node.frontmatter.tags) {
          node.frontmatter.tags.forEach(tag => {
            tagSet.add(tag);
          });
        }

        if (node.frontmatter.reviewedAuthor) {
          reviewedAuthorSet.add(node.frontmatter.reviewedAuthor);
        }
        createPage({
          path: node.fields.slug,
          component: path.resolve('src/templates/post.tsx'),
          context: {
            // Data passed to context is available in page queries as GraphQL variables.
            slug: node.fields.slug
          }
        });

        // const tagList = Array.from(tagSet);
        // tagList.forEach(tag => {
        //   createPage({
        //     path: `/tags/${_.kebabCase(tag)}/`,
        //     component: path.resolve('src/templates/tag.tsx'),
        //     context: {
        //       tag
        //     }
        //   });
        // });

        const reviewedAuthorList = Array.from(reviewedAuthorSet);
        reviewedAuthorList.forEach(reviewedAuthor => {
          createPage({
            path: `/authors/${_.kebabCase(reviewedAuthor)}/`, //e.g. /authors/jude-watson/
            component: path.resolve('src/templates/reviewedAuthor.tsx'),
            context: {
              reviewedAuthor
            }
          });
        });
      });
      resolve();
    });
  });
};

exports.onCreateWebpackConfig = ({ stage, actions }) => {
  if (stage === 'build-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /intersection-observer/,
            use: ['null-loader']
          }
        ]
      }
    });

    // getConfig.loader('null', {
    //   test: /intersection-observer/,
    //   loader: 'null-loader'
    // });
  }
};

// exports.onCreateWebpackConfig = ({ getConfig, stage }) => {
//   console.log(getConfig());
//   if (stage === 'build-javascript') {
//     getConfig.plugin('Lodash', webpackLodashPlugin, null);
//   }
// };

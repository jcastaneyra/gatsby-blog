const { paginate } = require('gatsby-awesome-pagination')
const { forEach, uniq, filter, not, isNil, flatMap } = require('rambdax')
const path = require('path')
const { toKebabCase } = require('./src/helpers')

const pageTypeRegex = /src\/(.*?)\//
const getType = node => node.fileAbsolutePath.match(pageTypeRegex)[1]

const pageTemplate = path.resolve(`./src/templates/page.js`)
const indexEnTemplate = path.resolve(`./src/templates/index.en.js`)
const indexEsTemplate = path.resolve(`./src/templates/index.es.js`)
const tagsEnTemplate = path.resolve(`./src/templates/tags.en.js`)
const tagsEsTemplate = path.resolve(`./src/templates/tags.es.js`)

const createPagination = (createPage, posts, template, postsPerPage, prefix) => {
  paginate({
    createPage,
    items: posts,
    component: template,
    itemsPerPage: postsPerPage,
    pathPrefix: prefix,
  })
}

const createSortedPages = (createPage, sortedPages) => {
  forEach(({ node }, index) => {
    const previous = index === 0 ? null : sortedPages[index - 1].node
    const next =
      index === sortedPages.length - 1 ? null : sortedPages[index + 1].node
    const isNextSameType = getType(node) === (next && getType(next))
    const isPreviousSameType =
      getType(node) === (previous && getType(previous))

    createPage({
      path: node.fields.slug,
      component: pageTemplate,
      context: {
        type: getType(node),
        next: isNextSameType ? next : null,
        previous: isPreviousSameType ? previous : null,
        langKey: node.fields.langKey,
      },
    })
  }, sortedPages)
}

const createTagPages = (createPage, tags, posts, template, postPerPage, prefix) => {
  forEach(tag => {
    const postsWithTag = posts.filter(
      post =>
        post.frontmatter.tags && post.frontmatter.tags.indexOf(tag) !== -1,
    )

    paginate({
      createPage,
      items: postsWithTag,
      component: template,
      itemsPerPage: postPerPage,
      pathPrefix: `${prefix}/tag/${toKebabCase(tag)}`,
      context: {
        tag,
      },
    })
  }, tags) 
}

exports.createPages = ({ actions, graphql, getNodes }) => {
  const { createPage } = actions
  const allNodes = getNodes()

  return graphql(`
    {
      allMarkdownRemark(
        sort: { fields: [frontmatter___date], order: DESC }
        limit: 1000
      ) {
        edges {
          node {
            frontmatter {
              path
              title
              tags
            }
            fileAbsolutePath
            fields {
              langKey
              slug
            }
          }
        }
      }
      site {
        siteMetadata {
          postsPerPage
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors)
    }

    const {
      allMarkdownRemark: { edges: markdownPages },
      site: { siteMetadata },
    } = result.data

    const sortedPages = markdownPages.sort((pageA, pageB) => {
      const typeA = getType(pageA.node)
      const typeB = getType(pageB.node)

      return (typeA > typeB) - (typeA < typeB)
    })

    const enPosts = allNodes.filter(
      ({ internal, fileAbsolutePath, fields}) =>
        internal.type === 'MarkdownRemark' &&
        fileAbsolutePath.indexOf('/posts/') !== -1 &&
        fields.langKey === 'en'
    )

    // Create posts index with pagination
    createPagination(createPage, enPosts, indexEnTemplate, siteMetadata.postsPerPage, '/')

    const esPosts = allNodes.filter(
      ({ internal, fileAbsolutePath, fields }) =>
        internal.type === 'MarkdownRemark' &&
        fileAbsolutePath.indexOf('/posts/') !== -1 &&
        fields.langKey === 'es'
    )

    createPagination(createPage, esPosts, indexEsTemplate, siteMetadata.postsPerPage, '/es')

    const enSortedPages = sortedPages.filter(
      ({node}) =>
        node.fields.langKey === 'en'
    )

    // Create each markdown page and post
    createSortedPages(createPage, enSortedPages)

    const esSortedPages = sortedPages.filter(
      ({node}) =>
        node.fields.langKey === 'es'
    )

    // Create each markdown page and post
    createSortedPages(createPage, esSortedPages)

    // Create tag pages
    const tags = filter(
      tag => not(isNil(tag)),
      uniq(flatMap(post => post.frontmatter.tags, enPosts)),
    )

    const enTags = filter(
      tag => not(isNil(tag)),
      uniq(flatMap(post => post.frontmatter.tags, enPosts)),
    )

    //createTagPages(createPage, enTags, enPosts, tagsEnTemplate, siteMetadata.postPerPage, '')

    const esTags = filter(
      tag => not(isNil(tag)),
      uniq(flatMap(post => post.frontmatter.tags, esPosts)),
    )

    //createTagPages(createPage, esTags, esPosts, tagsEsTemplate, siteMetadata.postPerPage, '/es')

    forEach(tag => {
      const postsWithTag = enPosts.filter(
        post =>
          post.frontmatter.tags && post.frontmatter.tags.indexOf(tag) !== -1,
      )

      paginate({
        createPage,
        items: postsWithTag,
        component: tagsEnTemplate,
        itemsPerPage: siteMetadata.postsPerPage,
        pathPrefix: `/tag/${toKebabCase(tag)}`,
        context: {
          tag,
        },
      })
    }, enTags)

    forEach(tag => {
      const postsWithTag = esPosts.filter(
        post =>
          post.frontmatter.tags && post.frontmatter.tags.indexOf(tag) !== -1,
      )

      paginate({
        createPage,
        items: postsWithTag,
        component: tagsEsTemplate,
        itemsPerPage: siteMetadata.postsPerPage,
        pathPrefix: `/es/tag/${toKebabCase(tag)}`,
        context: {
          tag,
        },
      })
    }, esTags)

    return {
      sortedPages,
      tags,
    }
  })
}

exports.sourceNodes = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
    type MarkdownRemark implements Node {
      frontmatter: Frontmatter!
    }

    type Frontmatter {
      title: String!
      author: String
      date: Date! @dateformat
      path: String!
      tags: [String!]
      excerpt: String
      coverImage: File @fileByRelativePath
    }
  `
  createTypes(typeDefs)
}


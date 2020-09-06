import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import SEO from '../components/seo'
import Layout from '../components/layout'
import Post from '../components/post'
import Navigation from '../components/navigation'

const Index = props => {
  const { data, pageContext: { nextPagePath, previousPagePath } } = props

  const {
    allMarkdownRemark: { edges: posts },
  } = data

  return (
    <>
      <SEO />
      <Layout {...props}>
        {posts.map(({ node }) => {
          const {
            id,
            excerpt: autoExcerpt,
            frontmatter: {
              title,
              date,
              author,
              coverImage,
              excerpt,
              tags,
            },
            fields: {
              langKey,
              slug,
            },
          } = node

          return (
            <Post
              key={id}
              title={title}
              date={date}
              path={slug}
              author={author}
              coverImage={coverImage}
              tags={tags}
              excerpt={excerpt || autoExcerpt}
              langKey={langKey}
            />
          )
        })}

        <Navigation
          previousPath={previousPagePath}
          previousLabel="Posts nuevos"
          nextPath={nextPagePath}
          nextLabel="Posts anteriores"
        />
      </Layout>
    </>
  )
}

Index.propTypes = {
  data: PropTypes.object.isRequired,
  pageContext: PropTypes.shape({
    nextPagePath: PropTypes.string,
    previousPagePath: PropTypes.string,
  }),
}

export const postsQuery = graphql`
  query($limit: Int!, $skip: Int!) {
    allMarkdownRemark(
      filter: { 
        fileAbsolutePath: { regex: "//posts//" } 
        fields: { langKey: { eq: "es" } }
      }
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          id
          excerpt
          frontmatter {
            title
            date(formatString: "YYYY/MM/DD")
            path
            author
            excerpt
            tags
            coverImage {
              childImageSharp {
                fluid(maxWidth: 800) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
          fields {
            langKey
            slug
          }
        }
      }
    }
  }
`

export default Index

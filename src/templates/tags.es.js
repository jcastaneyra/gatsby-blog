import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import SEO from '../components/seo'
import Layout from '../components/layout'
import Post from '../components/post'
import Navigation from '../components/navigation'

import '../styles/layout.css'

const Tags = props => {
  const {
    data,
    pageContext: { nextPagePath, previousPagePath, tag },
  } = props

  const {
    allMarkdownRemark: { edges: posts },
 
 } = data

  return (
    <>
      <SEO />
      <Layout {...props}>
        <div className="infoBanner">
          Posts con tag: <span>#{tag}</span>
        </div>

        {posts.map(({ node }) => {
          const {
            id,
            excerpt: autoExcerpt,
            frontmatter: {
              title,
              date,
              path,
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
              tags={tags}
              coverImage={coverImage}
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

Tags.propTypes = {
  data: PropTypes.object.isRequired,
  pageContext: PropTypes.shape({
    nextPagePath: PropTypes.string,
    previousPagePath: PropTypes.string,
  }),
}

export const postsQuery = graphql`
  query($limit: Int!, $skip: Int!, $tag: String!) {
    allMarkdownRemark(
      filter: { 
        frontmatter: { tags: { in: [$tag] } }
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

export default Tags

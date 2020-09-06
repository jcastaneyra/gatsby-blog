import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

const Footer = ({ copyrights }) => (
  <footer>
    {copyrights ? (
      <div
        dangerouslySetInnerHTML={{
          __html: copyrights,
        }}
      />
    ) : (
      <>
        <span className="footerCopyrights">
          © 2020 <FormattedMessage id="builtWith" /> <a href="https://www.gatsbyjs.org">Gatsby</a>
        </span>
        <span className="footerCopyrights">
          <FormattedMessage id="starterCreatedBy" /> <a href="https://radoslawkoziel.pl">panr</a>
        </span>
      </>
    )}
  </footer>
)

Footer.propTypes = {
  copyrights: PropTypes.string,
}

export default Footer

import React from "react";
import PropTypes from "prop-types";
import { getCurrentLangKey, getLangs, getUrlForLang } from "ptz-i18n";
import { useStaticQuery, graphql } from "gatsby";
import { IntlProvider } from 'react-intl'
import i18nMessages from '../data/messages'

import Header from "./header";
import Footer from "./footer";

import "../styles/layout.css";

const Layout = ({ children, location }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
          logo {
            src
            alt
          }
          logoText
          defaultTheme
          copyrights
          mainMenu {
            title
            path
          }
          showMenuItems
          menuMoreText
          languages {
            defaultLangKey
            langs
          }
        }
      }
    }
  `);
  const {
    title,
    logo,
    logoText,
    defaultTheme,
    mainMenu,
    showMenuItems,
    menuMoreText,
    copyrights,
  } = data.site.siteMetadata;

  const url = location.pathname
  const { langs, defaultLangKey } = data.site.siteMetadata.languages
  const langKey = getCurrentLangKey(langs, defaultLangKey, url)
  const homeLink = `/${langKey}/`.replace(`/${defaultLangKey}/`, "/")
  const langsMenu = getLangs(langs, langKey, getUrlForLang(homeLink, url)).map(
    item => ({ ...item, link: item.link.replace(`/${defaultLangKey}/`, "/") }),
  )

  return (
    <IntlProvider locale={langKey} messages={i18nMessages[langKey]}>
      <div className="container">
        <Header
          siteTitle={title}
          siteLogo={logo}
          logoText={logoText}
          defaultTheme={defaultTheme}
          mainMenu={mainMenu}
          mainMenuItems={showMenuItems}
          menuMoreText={menuMoreText}
          langs={langsMenu}
          homeLink={homeLink}
        />
        <div className="content">{children}</div>
        <Footer copyrights={copyrights} />
      </div>
    </IntlProvider>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;

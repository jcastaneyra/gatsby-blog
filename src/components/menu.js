import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'

import Icon from './icon'

import style from '../styles/menu.module.css'

const MainMenu = ({ mainMenu, mainMenuItems, isMobileMenu }) => {
  const menu = mainMenu.slice(0)
  !isMobileMenu && menu.splice(mainMenuItems)

  return menu.map((menuItem, index) => (
    <li key={index}>
      <Link to={menuItem.path}>{menuItem.title}</Link>
    </li>
  ))
}

const SubMenu = ({ mainMenu, mainMenuItems, onToggleSubMenu }) => {
  const menu = mainMenu.slice(0)
  menu.splice(0, mainMenuItems)

  const items = menu.map((menuItem, index) => (
    <li key={index}>
      <Link to={menuItem.path}>{menuItem.title}</Link>
    </li>
  ))

  return (
    <>
      {items}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <div
        className={style.subMenuOverlay}
        role="button"
        tabIndex={0}
        onClick={onToggleSubMenu}
      />
    </>
  )
}

const menuIcon = `M4 34H40V30H4V34ZM4 24H40V20H4V24ZM4 10V14H40V10H4Z`
const toggleIcon = `M22 41C32.4934 41 41 32.4934 41 22C41 11.5066 32.4934 3 22
3C11.5066 3 3 11.5066 3 22C3 32.4934 11.5066 41 22 41ZM7 22C7
13.7157 13.7157 7 22 7V37C13.7157 37 7 30.2843 7 22Z`

const twitterIcon = `M48 10.613c-1.763 0.787-3.666 1.313-5.653 1.547 2.034-1.219 3.591-3.15 4.331-5.447-1.903 1.125-4.012 1.95-6.253 2.391-1.8-1.912-4.359-3.103-7.191-3.103-5.438 0-9.844 4.406-9.844 9.844 0 0.769 0.084 1.519 0.253 2.241-8.184-0.413-15.441-4.331-20.297-10.294-0.844 1.453-1.331 3.15-1.331 4.95 0 3.413 1.734 6.431 4.378 8.194-1.613-0.047-3.131-0.497-4.463-1.228 0 0.038 0 0.084 0 0.122 0 4.772 3.394 8.756 7.903 9.656-0.825 0.225-1.697 0.347-2.597 0.347-0.637 0-1.247-0.066-1.856-0.178 1.256 3.909 4.894 6.759 9.197 6.844-3.375 2.644-7.612 4.219-12.234 4.219-0.797 0-1.575-0.047-2.353-0.141 4.369 2.803 9.544 4.425 15.103 4.425 18.113 0 28.022-15.009 28.022-28.022 0-0.431-0.009-0.853-0.028-1.275 1.922-1.378 3.591-3.113 4.912-5.091z`

const Menu = ({
  mainMenu,
  mainMenuItems,
  menuMoreText,
  isMobileMenuVisible,
  isSubMenuVisible,
  onToggleMobileMenu,
  onToggleSubMenu,
  onChangeTheme,
}) => {
  const isSubMenu = !(mainMenuItems >= mainMenu.length) && mainMenuItems > 0

  return (
    <>
      <div className={style.mobileMenuContainer}>
        <>
          {isMobileMenuVisible ? (
            <>
              {/* eslint-enable */}
              <ul className={style.mobileMenu}>
                <MainMenu mainMenu={mainMenu} isMobileMenu />
              </ul>
              {/* eslint-disable */}
              <div
                onClick={onToggleMobileMenu}
                className={style.mobileMenuOverlay}
              />
            </>
          ) : null}
          <button
            className={style.menuTrigger}
            style={{ color: 'inherit' }}
            onClick={onToggleMobileMenu}
            type="button"
            aria-label="Menu"
          >
            <Icon style={{ cursor: 'pointer' }} size={24} d={menuIcon} />
          </button>
        </>
      </div>
      <div className={style.desktopMenuContainer}>
        <ul className={style.menu}>
          <MainMenu mainMenu={mainMenu} mainMenuItems={mainMenuItems} />
          {isSubMenu ? (
            <>
              <button
                className={style.subMenuTrigger}
                onClick={onToggleSubMenu}
                type="button"
                aria-label="Menu"
              >
                {menuMoreText || 'Menu'}{' '}
                <span className={style.menuArrow}>></span>
              </button>
              {isSubMenuVisible ? (
                <ul className={style.subMenu}>
                  <SubMenu
                    mainMenu={mainMenu}
                    mainMenuItems={mainMenuItems}
                    onToggleSubMenu={onToggleSubMenu}
                  />
                </ul>
              ) : null}
            </>
          ) : null}
        </ul>
      </div>
      <button
        className={style.themeToggle}
        onClick={onChangeTheme}
        type="button"
        aria-label="Theme toggle"
      >
        <Icon style={{ cursor: 'pointer' }} size={24} d={toggleIcon} />
      </button>
    </>
  )
}

Menu.propTypes = {
  mainMenu: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      path: PropTypes.string,
    }),
  ),
  mainMenuItems: PropTypes.number,
  menuMoreText: PropTypes.string,
  isMobileMenuVisible: PropTypes.bool,
  isSubMenuVisible: PropTypes.bool,
  onToggleMobileMenu: PropTypes.func,
  onToggleSubMenu: PropTypes.func,
  onChangeTheme: PropTypes.func,
}

SubMenu.propTypes = {
  mainMenu: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      path: PropTypes.string,
    }),
  ),
  mainMenuItems: PropTypes.number,
  onToggleSubMenu: PropTypes.func,
}

export default Menu

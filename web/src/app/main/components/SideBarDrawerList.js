import React from 'react'
import { PropTypes as p } from 'prop-types'
import Divider from '@mui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core'
import { styles as globalStyles } from '../../styles/materialStyles'
import {
  Build as WizardIcon,
  Feedback as FeedbackIcon,
  Group as UsersIcon,
  Layers as EscalationPoliciesIcon,
  Notifications as AlertsIcon,
  PowerSettingsNew as LogoutIcon,
  RotateRight as RotationsIcon,
  Today as SchedulesIcon,
  VpnKey as ServicesIcon,
  Settings as AdminIcon,
  AccountTree as SuperServicesIcon,
  SpeakerNotes as MessagingIcon,
  Assessment as ReportsIcon,
} from '@mui/icons-material'

import routeConfig, { getPath } from '../routes'

import { Router } from 'wouter'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import { CurrentUserAvatar } from '../../util/avatars'
import { authLogout } from '../../actions'
import { useDispatch } from 'react-redux'
import RequireConfig, { Config } from '../../util/RequireConfig'
import { useConfigValue, useSessionInfo } from '../../util/RequireConfig'
import NavSubMenu from './NavSubMenu'
import logo from '../../public/goalert-alt-logo.png'
import AppLink from '../../util/AppLink'
//TLMT-4860
import { GLASS_TEMPLATES_VIEW_CREATE,GLASS_TEMPLATES_IC,GLASS_TEMPLATES_ITSD,GLASS_TEMPLATES_TOC,GLASS_TEMPLATES_ERE, GLASS_TEMPLATES_DR } from '../../env'

const navIcons = {
  Alerts: AlertsIcon,
  Rotations: RotationsIcon,
  Schedules: SchedulesIcon,
  'Escalation Policies': EscalationPoliciesIcon,
  Services: ServicesIcon,
  Users: UsersIcon,
  Admin: AdminIcon,
  'Super Groups': SuperServicesIcon,
  'Messaging' : MessagingIcon,
  'Reports' : ReportsIcon
}

const useStyles = makeStyles((theme) => ({
  ...globalStyles(theme),
  logoDiv: {
    ...theme.mixins.toolbar,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navIcon: {
    width: '1em',
    height: '1em',
    fontSize: '24px',
  },
  list: {
    padding: 0,
  },
}))

export default function SideBarDrawerList(props) {
  const { closeMobileSidebar } = props
  const classes = useStyles()
  const dispatch = useDispatch()
  const logout = () => dispatch(authLogout(true))

  //TLMT-3195 - Authorization
  const { groups, ready } = useSessionInfo()

  function renderSidebarItem(IconComponent, label) {
    //TLMT-3195 - Authorization
    //TLMT-4860
   // if((label !== 'Messaging' && label !== 'Reports') || 
    //((label === 'Messaging' || label === 'Reports') && (groups && (groups.indexOf(GLASS_TEMPLATES_VIEW_CREATE) !== -1 || groups.indexOf(GLASS_TEMPLATES_IC) !== -1 || groups.indexOf(GLASS_TEMPLATES_TOC) !== -1 || groups.indexOf(GLASS_TEMPLATES_ITSD) !== -1 || groups.indexOf(GLASS_TEMPLATES_ERE) !== -1 || groups.indexOf(GLASS_TEMPLATES_DR) !== -1))))
   //{
      return (
        <ListItem button tabIndex={-1}>
          <ListItemIcon>
            <IconComponent className={classes.navIcon} />
          </ListItemIcon>
          <ListItemText
            disableTypography
            primary={
              <Typography variant='subtitle1' component='p'>
                {label}
              </Typography>
            }
          />
        </ListItem>
      )
    //}
  }

  function renderSidebarLink(icon, path, label, props = {}) {
    return (
      <AppLink to={path} className={classes.nav} {...props}>
        {renderSidebarItem(icon, label)}
      </AppLink>
    )
  }

  function renderSidebarNavLink(icon, path, label, key) {
    return (
      <Router
        key={key}
        to={path}
        className={classes.nav}
        activeClassName={classes.navSelected}
        onClick={closeMobileSidebar}
      >
        {renderSidebarItem(icon, label)}
      </Router>
    )
  }

  function renderAdmin() {
    const cfg = routeConfig.find((c) => c.title === 'Admin')

    return (
      <NavSubMenu
        parentIcon={navIcons[cfg.title]}
        parentTitle={cfg.title}
        path={getPath(cfg)}
        subMenuRoutes={cfg.subRoutes}
        closeMobileSidebar={closeMobileSidebar}
      >
        {renderSidebarItem(navIcons[cfg.title], cfg.title)}
      </NavSubMenu>
    )
  }

  function renderFeedback(url) {
    return (
      <AppLink to={url} className={classes.nav} newTab data-cy='feedback-link'>
        {renderSidebarItem(FeedbackIcon, 'Feedback')}
      </AppLink>
    )
  }

  return (
    <React.Fragment>
      <div aria-hidden className={classes.logoDiv}>
        <img height={38} src={logo} alt='GoAlert Logo' />
      </div>
      <Divider />
      <nav>
        <List role='navigation' className={classes.list} data-cy='nav-list'>
          {routeConfig
            .filter((cfg) => cfg.nav !== false)
            .map((cfg, idx) => {
              if (cfg.subRoutes) {
                return (
                  <NavSubMenu
                    key={idx}
                    parentIcon={navIcons[cfg.title]}
                    parentTitle={cfg.title}
                    path={getPath(cfg)}
                    subMenuRoutes={cfg.subRoutes}
                  >
                    {renderSidebarItem(navIcons[cfg.title], cfg.title)}
                  </NavSubMenu>
                )
              }
              return renderSidebarNavLink(
                navIcons[cfg.title],
                getPath(cfg),
                cfg.title,
                idx,
              )
            })}
          <RequireConfig isAdmin>
            <Divider aria-hidden />
            {renderAdmin()}
            <Divider aria-hidden />
              {renderSidebarNavLink(WizardIcon, '/wizard', 'Wizard')}
              <Config>
                {(cfg) =>
                  cfg['Feedback.Enable'] &&
                  renderFeedback(
                  cfg['Feedback.OverrideURL'] ||
                    'https://www.surveygizmo.com/s3/4106900/GoAlert-Feedback',
                  )
                }
              </Config>
          </RequireConfig>

          
          {renderSidebarLink(LogoutIcon, '/api/v2/identity/logout', 'Logout', {
            onClick: (e) => {
              e.preventDefault()
              logout()
            },
          })}
          {renderSidebarNavLink(CurrentUserAvatar, '/profile', 'Profile')}
        </List>
      </nav>
    </React.Fragment>
  )
}

SideBarDrawerList.propTypes = {
  closeMobileSidebar: p.func.isRequired,
}
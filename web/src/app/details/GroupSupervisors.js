//RBAC - TLMT-3810
import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { PropTypes as p } from 'prop-types'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import { UserAvatar } from '../util/avatars'
import { makeStyles } from '@mui/styles'
import { styles as globalStyles } from '../styles/materialStyles'
import { Error } from '@mui/icons-material'
import Grid from '@mui/material/Grid'
import { CircularProgress } from '@mui/material'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Markdown from '../util/Markdown'

import _ from 'lodash'

const useStyles = makeStyles((theme) => {
  const { cardHeader } = globalStyles(theme)

  return {
    cardHeader,
  }
})

export default function GroupSupervisors({ resource,adgroup }) {
  const classes = useStyles()

  return (
    <Card>
      <CardContent className={classes.headerContent}>
        <Typography
          component='div'
          variant='subtitle1'
          color='textSecondary'
          data-cy='details'
        >
          <div>
          {adgroup != ""? <div>
          To get edit access for this {resource}, please raise :
           <a href='https://itsmprod-usf.myloweslife.com/dwp/app/#/srm/profile/SRGAA5V0H29D2APQ5Y08PP8LO6T5HN/srm' target='_blank'> Windows 309 request</a>
            <b><div>AD Group : {adgroup}</div></b>
          </div>:
           <div>No AD-Group assigned to this {resource}. If this {resource} belongs to your team, please update the team AD-Group to restrict the edit access.
           <br/></div>}
           For support contact administrators - teams channel - <a href="https://teams.microsoft.com/l/channel/19%3aa5e3f147fe0a43eb981d0f5d71fba7ee%40thread.tacv2/support-glass?groupId=b0b87b7a-951d-479e-b55e-06ed312443d6&tenantId=bcfa3e87-841e-48c7-983b-584159dd1a69" target='_blank'>support-glass</a>
           </div>
        </Typography>
      </CardContent>
    </Card>
  )
}
GroupSupervisors.propTypes = {
  serviceID: p.string.isRequired,
}
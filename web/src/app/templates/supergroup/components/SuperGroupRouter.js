import React from 'react'
import { Switch, Route } from 'react-router-dom'
import SuperGroupList from './SuperGroupList'
import { PageNotFound } from '../../../error-pages/Errors'
import { useSessionInfo } from '../../../util/RequireConfig'
import Spinner from '../../../loading/components/Spinner'
import SuperGroupCreateDialog from './SuperGroupCreateDialog'
import SuperGroupDetails from './SuperGroupDetails'
import SuperGroupAlerts from './SuperGroupAlerts'

//TLMT-2546
export default function SuperGroupRouter() {
  const { userID } = useSessionInfo()

  function renderAlerts({ match }) {
    //TLMT-4645
    return <SuperGroupAlerts groupID={match.params.groupID} pageName={`Super Group Alerts for ID ${match.params.groupID}`}  pageTitle={`Super Group Alerts for ID ${match.params.groupID}`}/>
  }

  function renderDetails({ match }) {
    //TLMT-4645
    return <SuperGroupDetails groupID={match.params.groupID} pageName={`Super Group for ID ${match.params.groupID}`}  pageTitle={`Super Group for ID ${match.params.groupID}`}/>
  }

  return (
    <Switch>
      <Route exact path='/super-groups' component={SuperGroupList} />
      <Route exact path='/super-groups/create' component={SuperGroupCreateDialog} />
      <Route exact path='/super-groups/:groupID/alerts' render={renderAlerts} />
      <Route exact path='/super-groups/:groupID' component={renderDetails} />
      <Route component={PageNotFound} />
    </Switch>
  )
}

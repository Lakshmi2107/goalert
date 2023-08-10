import React, { useState, useEffect } from 'react'
import { Switch, Route } from 'react-router-dom'
import MIMTemplateList from './MIMTemplateList'
import { PageNotFound } from '../../../error-pages/Errors'
import { useSessionInfo } from '../../../util/RequireConfig'
import Spinner from '../../../loading/components/Spinner'
import MIMTemplateCreate from './MIMTemplateCreate'
import MessagingReports from './MessagingReports'
import MessagingDetails from './MessagingDetails'
import { useSelector, useDispatch } from 'react-redux';
import PaasSnackbar from '../../common/Snackbars'
import { resetNotification } from '../../action/commonActions'
import Loader from '../../common/Loader'

export default function MIMRouter() {
  const { userID } = useSessionInfo()
  const commonData = useSelector(state => state.common);
  const [snackbarOpenStatus, setSnackbarOpenStatus] = useState(false); 
  const [snackbarSeverity, setSnackbarSeverity] = useState(''); 
  const [snackbarMessage, setSnackbarMessage] = useState(''); 
  const dispatch = useDispatch();

  const closeSnackbar = () => {
    setSnackbarOpenStatus(false)
    dispatch(resetNotification())
  }

  useEffect(() => {
    if(!_.isEmpty(commonData.notification)) {
      setSnackbarOpenStatus(commonData.notification.status)
      setSnackbarSeverity(commonData.notification.type)
      setSnackbarMessage(commonData.notification.message)
    }
  },[commonData.notification])
  
  return (
    <React.Fragment>
      <PaasSnackbar 
        openStatus={snackbarOpenStatus}
        severity={snackbarSeverity}
        message={snackbarMessage}
        closeCB={closeSnackbar}
      />
      {commonData.loaderStatus && 
        <Loader />
      }
      <Switch>
        <Route exact path='/messaging' component={MIMTemplateList} />
        <Route
          exact
          path='/messaging/create/:tempID'
          component={MIMTemplateCreate}
        />
        <Route
          exact
          path='/messaging/create/:tempID/:alertID'
          component={MIMTemplateCreate}
        />
        <Route
          exact
          path='/reports'
          component={MessagingReports}
        />
        <Route
          exact
          path='/reports/:alertID'
          component={MessagingDetails}
        />
        <Route component={PageNotFound} />
      </Switch>
    </React.Fragment>
  )
}

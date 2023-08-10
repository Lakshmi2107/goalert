import React, { useState } from 'react'
import { gql, useQuery } from 'urql'
import { Edit, Delete } from '@mui/icons-material'
import DetailsPage from '../../../details/DetailsPage'
import ServicesListAlerts from './ServicesListAlerts'
import CreateFAB from '../../../lists/CreateFAB'
import CreateAlertDialog from '../../../alerts/CreateAlertDialog/CreateAlertDialog'
import { setPageLoadToPharos } from '../../../actions'
import Spinner from '../../../loading/components/Spinner'
import { GenericError, ObjectNotFound } from '../../../error-pages'
import _ from 'lodash'
/*
TLMT-2546
*/
const query = gql`
  query superservice($groupID: ID!) {
    superservice(id: $groupID) {
      id
      name
      description
      services {
        id
        name
        description
      }
    }
  }
`
//TLMT-4645
export default function SuperGroupAlerts(props: {
  groupID: string
}): JSX.Element {  
  const { groupID } = props

    const [showCreate, setShowCreate] = useState(false)
    const [{ data, fetching, error }] = useQuery({
      query,
      variables: { groupID },
    })
  if (fetching && !_.get(data, 'superservice.id')) return <Spinner />
  if (error) return <GenericError error={error.message} />

  let servicesList = ''
  //TLMT-4645-start
  //TLMT-4645-end
  if(data?.superservice?.services) {
      data.superservice.services.map((opt) => {
        servicesList = (servicesList === '') ? opt.id : servicesList+","+opt.id
      })
  }

  return (
    <React.Fragment>
      <ServicesListAlerts data={data} />
      <CreateFAB
        title='Create Alert'
        //transition={isXs && showAlertActionSnackbar}
        onClick={() => setShowCreate(true)}
      />
      {showCreate && (
        <CreateAlertDialog
          onClose={() => setShowCreate(false)}
          serviceID={servicesList}
        />
      )}
    </React.Fragment>
  )
}

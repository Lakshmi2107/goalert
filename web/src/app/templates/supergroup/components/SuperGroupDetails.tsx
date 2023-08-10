import React, { useState } from 'react'
import { gql, useQuery } from 'urql'
import { Redirect } from 'wouter'
import _ from 'lodash'
import { Button } from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import ServicesList from './ServicesList'
import GroupSupervisors from '../../../details/GroupSupervisors'
import Spinner from '../../../loading/components/Spinner'
import { GenericError, ObjectNotFound } from '../../../error-pages'
import DetailsPage from '../../../details/DetailsPage'
import SuperGroupEditDialog from './SuperGroupEditDialog'
import SuperGroupDeleteDialog from './SuperGroupDeleteDialog'

interface AlertNode {
  id: string
  status: string
}

const query = gql`

  query superservice($groupID: ID!) {
    superservice(id: $groupID) {
      id
      name
      adgroup
      permission
      description
      services {
        id
        name
        description
      }
    }
  }
`

export default function ServiceDetails(props: {
  groupID: string
}): JSX.Element {
  const { groupID } = props
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [showMaintMode, setShowMaintMode] = useState(false)
  const [{ data, fetching, error }] = useQuery({
    query,
    variables: { groupID },
  })
  if (fetching && !_.get(data, 'superservice.id')) return <Spinner />
  if (error) return <GenericError error={error.message} />

  if (!_.get(data, 'superservice.id')) {
    return showDelete ? <Redirect to='/superservices' /> : <ObjectNotFound />
  }
 console.log("data",data)
  return (
    <React.Fragment>
      <DetailsPage
        title={data.superservice.name}
        subheader=""
        details={data.superservice.description}
        pageContent={<React.Fragment> <GroupSupervisors resource="super group" adgroup={data.superservice.adgroup} /> <br/> <ServicesList groupID={groupID} /></React.Fragment>}
        secondaryActions={[
          {
            label: 'Edit',
            icon: <Edit />,
            handleOnClick: () => setShowEdit(true),
          },
          {
            label: 'Delete',
            icon: <Delete />,
            handleOnClick: () => setShowDelete(true),
          }
        ]}
        links={[
          {
            label: 'Alerts',
            url: 'alerts',
            subText: 'Manage alerts specific to this service',
          },
         
        ]}
      />
      {showEdit && (
        <SuperGroupEditDialog
        data={data}
          onClose={() => setShowEdit(false)}
          groupID={groupID}
        />
      )}
      {showDelete && (
        <SuperGroupDeleteDialog
          onClose={() => setShowDelete(false)}
          groupID={groupID}
        />
      )}
    </React.Fragment>
  )
}

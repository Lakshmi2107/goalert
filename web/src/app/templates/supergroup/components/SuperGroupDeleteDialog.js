import React, { useState } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'
import p from 'prop-types'

import { fieldErrors, nonFieldErrors } from '../../../util/errutil'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Typography from '@mui/material/Typography'
import FormDialog from '../../../dialogs/FormDialog'
import Spinner from '../../../loading/components/Spinner'
import _ from 'lodash'
import { Redirect } from 'wouter'

/*
TLMT-2546
*/
const mutation = gql`
  mutation delete($input: [TargetInput!]!) {
    deleteAll(input: $input)
  }
`

export default function SuperGroupDeleteDialog({ groupID, onClose, groupName }) {
  //const [deleteEP, setDeleteEP] = useState(true)
 
  const input = [{ type: 'superService', id: groupID }]
  const [deleteService, deleteServiceStatus] = useMutation(mutation, {
    variables: { input },
    onCompleted: onClose,
  })

  if (deleteServiceStatus.called) {
    return <Redirect push to={`/superservices/`} />
  }
  
  return (
    <FormDialog
      title='Are you sure?'
      confirm
      subTitle={
        <Typography>
          This will delete the service: {groupName}
        </Typography>
      }
      caption='Deleting a Super Group will also delete all associated services mapping.'
      loading={deleteServiceStatus.loading}
      errors={nonFieldErrors(deleteServiceStatus.error)}
      onClose={onClose}
      onSubmit={() => deleteService()}
    />
  )
}
SuperGroupDeleteDialog.propTypes = {
  serviceID: p.string.isRequired,
  onClose: p.func,
}

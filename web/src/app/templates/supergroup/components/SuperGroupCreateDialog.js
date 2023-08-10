import React, { useState } from 'react'
import { gql, useMutation } from '@apollo/client'

import p from 'prop-types'

import { Redirect } from 'wouter'

import { fieldErrors, nonFieldErrors } from '../../../util/errutil'

import FormDialog from '../../../dialogs/FormDialog'
import SuperGroupForm from './SuperGroupForm'
/*
TLMT-2546
*/
const createMutation = gql`
  mutation createSuperService($input: CreateSuperServiceInput!) {
    createSuperService(input: $input) {
      id
    }
  }
`

function inputVars({ name, description,adgroup, services }, attempt = 0) {
  const vars = {
    name,
    description,
    adgroup,
    services,
  }
  /*if (!vars.escalationPolicyID) {
    vars.newEscalationPolicy = {
      name: attempt ? `${name} Policy ${attempt}` : name + ' Policy',
      description: 'Auto-generated policy for ' + name,
      steps: [
        {
          delayMinutes: 5,
          targets: [
            {
              type: 'user',
              id: '__current_user',
            },
          ],
        },
      ],
    }
  }*/

  return vars
}

export default function SuperGroupCreateDialog(props) {
  const [value, setValue] = useState({
    name: '',
    description: '',
    adgroup:'',
    services: '',
  })

  const [createKey, createKeyStatus] = useMutation(createMutation)

  const { loading, data, error } = createKeyStatus
  if (data && data.createSuperService) {
    return <Redirect push to={`/super-groups/${data.createSuperService.id}`} />
  }

  const fieldErrs = fieldErrors(error)

  return (
    <FormDialog
      title='Create New Super Group'
      loading={loading}
      errors={nonFieldErrors(error)}
      onClose={props.onClose}
      onSubmit={() => {
        let n = 1

        return createKey({
          variables: {
            input: inputVars(value),
          },
        }).then(null)
      }}
      form={
        <SuperGroupForm
          errors={fieldErrs}
          disabled={loading}
          value={value}
          require={true}
          onChange={(val) => setValue(val)}
        />
      }
    />
  )
}

SuperGroupCreateDialog.propTypes = {
  onClose: p.func,
}

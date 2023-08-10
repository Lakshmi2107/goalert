import React, { useState } from 'react'
import { gql, useQuery, useMutation } from 'urql'

import { fieldErrors, nonFieldErrors } from '../../../util/errutil'

import FormDialog from '../../../dialogs/FormDialog'
import Spinner from '../../../loading/components/Spinner'
import SuperGroupForm from './SuperGroupForm'

interface Value {
  name: string
  description: string
  escalationPolicyID?: string
}

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
const mutation = gql`
mutation updateSuperService($input: UpdateSuperServiceInput!) {
  updateSuperService(input: $input)
}
`

export default function SuperServiceEditDialog(props: {
  groupID: string
  onClose: () => void
}): JSX.Element {
  const { groupID } = props
  const [value, setValue] = useState<Value | null>(null)
  const [{ data, fetching: dataFetching, error: dataError }] = useQuery({
    query,
    variables: { groupID },
  })

  const [saveStatus, save] = useMutation(mutation)

  if (dataFetching && !data) {
    return <Spinner />
  }
  var servicesList = new Array<string>();

  data.superservice.services.map((opt) => {
    servicesList.push(opt.id)
  })
console.log("data",data)
  const defaultValue = {
    name: data?.superservice?.name,
    description: data?.superservice?.description,
    services: servicesList
  }

  const fieldErrs = fieldErrors(saveStatus.error)

  return (
    <FormDialog
      title='Edit Super Service'
      loading={saveStatus.fetching || (!data && dataFetching)}
      errors={nonFieldErrors(saveStatus.error).concat(
        nonFieldErrors(dataError),
      )}
      onClose={props.onClose}
      onSubmit={() => {
        save(
          {
            input: {
              ...value,
              id: props.groupID,
            },
          },
          {
            additionalTypenames: ['Super Service'],
          },
        ).then((res) => {
          if (res.error) return
          props.onClose()
        })
      }}
      form={
        <SuperGroupForm
          errors={fieldErrs}
          disabled={Boolean(
            saveStatus.fetching || (!data && dataFetching) || dataError,
          )}
          value={value || defaultValue}
          onChange={(value) => setValue(value)}
        />
      }
    />
  )
}

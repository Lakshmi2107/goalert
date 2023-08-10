import React from 'react'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import { EscalationPolicySelect } from '../../../selection/EscalationPolicySelect'
import { FormContainer, FormField } from '../../../forms'
import { FieldError } from '../../../util/errutil'
import { ServiceSelect } from '../../../selection'

export interface Value {
  name: string
  description: string
  escalationPolicyID?: string
}

interface SuperServiceFormProps {
  value: Value

  errors: FieldError[]

  onChange: (val: Value) => void

  disabled?: boolean

}

export default function SuperGroupForm(props: SuperServiceFormProps): JSX.Element {
  const {  ...containerProps } = props
  return (
    <FormContainer {...containerProps}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormField
            fullWidth
            label='Name'
            name='name'
            required
            component={TextField}
          />
        </Grid>
        <Grid item xs={12}>
          <FormField
            fullWidth
            label='Description'
            name='description'
            multiline
            component={TextField}
          />
        </Grid>
        <Grid item xs={12}>
          <FormField
            fullWidth
            label='Services'
            name='services'
            component={ServiceSelect}
            required
            multiple
          />
        </Grid>
      </Grid>
    </FormContainer>
  )
}

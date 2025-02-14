import React, { useState } from 'react'
import { Grid, IconButton } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import { Theme } from '@mui/styles'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { ISODateTimePicker } from '../../util/ISOPickers'
import Search from '../../util/Search'

interface DebugMessageControlsValue {
  search: string
  start: string
  end: string
}
interface Props {
  value: DebugMessageControlsValue
  onChange: (newValue: DebugMessageControlsValue) => void
}

const useStyles = makeStyles((theme: Theme) => {
  return {
    filterContainer: {
      display: 'flex',
      flexDirection: 'row',
    },
    resetButton: {
      height: 'min-content',
      alignSelf: 'center',
    },
    card: {
      padding: theme.spacing(2),
    },
    cardHeader: {
      padding: 0,
      paddingBottom: '1em',
    },
  }
})

export default function DebugMessagesControls({
  value,
  onChange,
}: Props): JSX.Element {
  const classes = useStyles()
  const [key, setKey] = useState(0)

  const resetFilters = (): void => {
    onChange({ ...value, start: '', end: '' })
    // The ISODateTimePicker doesn't update to changes in its `value` prop. It only uses its internal state.
    // This key is a hotfix to set the ISODateTimePicker's value by just completely re-rendering it.
    setKey(key + 1)
  }

  return (
    <Card className={classes.card}>
      <CardHeader
        title='Outgoing Message Logs'
        className={classes.cardHeader}
      />
      <Grid container spacing={2} key={key}>
        <Grid item container direction='column' sx={{ width: 'fit-content' }}>
          <Grid item>
            <ISODateTimePicker
              placeholder='Start'
              name='startDate'
              value={value.start}
              onChange={(newStart) =>
                onChange({ ...value, start: newStart as string })
              }
              label='Created after'
              margin='dense'
              size='small'
              variant='outlined'
            />
          </Grid>
          <Grid item>
            <ISODateTimePicker
              placeholder='End'
              name='endDate'
              value={value.end}
              label='Created before'
              onChange={(newEnd) =>
                onChange({ ...value, end: newEnd as string })
              }
              margin='dense'
              size='small'
              variant='outlined'
            />
          </Grid>
        </Grid>
        <Grid item xs={1} sx={{ display: 'flex' }}>
          <IconButton
            className={classes.resetButton}
            type='button'
            onClick={resetFilters}
          >
            <RestartAltIcon />
          </IconButton>
        </Grid>
        <Grid item sx={{ flex: 1 }} />
        <Grid item>
          <Search />
        </Grid>
      </Grid>
    </Card>
  )
}

import React, {
    useEffect,
    useState,
    ReactNode,
    ReactElement,
    ChangeEvent,
  } from 'react'
  import {
    TextField,
    MenuItem,
    ListItemIcon,
    Typography,
    Paper,
    Chip,
    InputProps,
  } from '@mui/material'
  import { makeStyles } from '@mui/styles'
  import { Alert, Autocomplete } from '@mui/material'
  import { useSessionInfo } from '../util/RequireConfig'
  import {AD_GROUP_FREETEXT_PERMIT} from '../env'
  
  const useStyles = makeStyles({
    listItemIcon: {
      minWidth: 0,
    },
    menuItem: {
      display: 'flex',
      flex: 1,
      justifyContent: 'space-between',
      wordBreak: 'break-word',
      whiteSpace: 'pre-wrap',
    },
    clearIndicator: {
      display: 'none',
    },
    padding0: {
      padding: 0,
    },
  })
  
  interface AutocompleteInputProps extends InputProps {
    'data-cy': string
  }
  
  interface SelectOption {
    icon?: ReactElement
    isCreate?: boolean
    label: string
    value: string
  }
  
  interface CommonSelectProps {
    disabled?: boolean
    error?: boolean
    isLoading?: boolean
    label?: string
    noOptionsText?: ReactNode
    noOptionsError?: Error
    name?: string
    required?: boolean
    onInputChange?: (value: string) => void
    options: SelectOption[]
    placeholder?: string
  }
  
  interface SingleSelectProps {
    multiple: false
    value: SelectOption
    onChange: (value: SelectOption | null) => void
  }
  
  interface MultiSelectProps {
    multiple: true
    value: SelectOption[]
    onChange: (value: SelectOption[]) => void
  }
  
  export default function MaterialAutoSelect(
    props: CommonSelectProps & (MultiSelectProps | SingleSelectProps),
  ): JSX.Element {
    const classes = useStyles()
    const {
      disabled,
      error,
      isLoading,
      label,
      multiple,
      name,
      noOptionsText,
      noOptionsError,
      onChange,
      onInputChange = () => {},
      options: _options,
      placeholder,
      required,
      value,
    } = props
  
    // getInputLabel will return the label of the current value.
    //
    // If in multi-select mode an empty string is always returned as selected values
    // are never preserved in the input field (they are chips instead).
    const getInputLabel = (): string =>
      multiple || Array.isArray(value) ? '' : value?.label || ''
  
    const [focus, setFocus] = useState(false)
    const [inputValue, _setInputValue] = useState(getInputLabel())
  
    const setInputValue = (input: string): void => {
      _setInputValue(input)
      onInputChange(input)
    }
  
    const multi = multiple ? { multiple: true, filterSelectedOptions: true } : {}
  
    useEffect(() => {
      if (!focus) setInputValue(getInputLabel())
      if (multiple) return
      if (!value) setInputValue('')
    }, [value, multiple, focus])
  
    // merge selected values with options to avoid annoying mui warnings
    // https://github.com/mui-org/material-ui/issues/18514
    let options = _options
    if (value && Array.isArray(value)) {
      options = [...options, ...value]
    } else if (!inputValue && value && !Array.isArray(value) && !options.length) {
      options = [value]
    }
  
    const customCSS: Record<string, string> = {
      option: classes.padding0,
      clearIndicator: classes.clearIndicator,
    }
  
    if (noOptionsError) {
      customCSS.noOptions = classes.padding0
    }

    const { groups } = useSessionInfo()
    let freeTextStatus = false
    if(groups && groups.length>0) {
      groups.map((gObj) => {
        if(AD_GROUP_FREETEXT_PERMIT.indexOf(gObj) !== -1) {
          freeTextStatus = true
        }
      })
    }

  
    return (
      <Autocomplete
        freeSolo={freeTextStatus}
        defaultValue={value}
        data-cy='material-select'
        data-cy-ready={!isLoading}
        classes={customCSS}
        onChange={(e,value) => {
            setInputValue(value as string)
            onChange(value as string)
        }
        }
        loading={isLoading}
        options={options}
        renderInput={(params) => <TextField {...params} onChange={(event: any) => {
          if(freeTextStatus) {
            setInputValue(event.target.value as string)
            onChange(event.target.value as string)
          }
        }
        }  label={label}/>}
        renderOption={(params) => {
            return (
          <MenuItem
            component='span'
            className={classes.menuItem}
            data-cy='search-select-item'
          >
            <Typography noWrap>{params}</Typography>
          </MenuItem>
        )}}
        PaperComponent={(params) => (
          <Paper data-cy='select-dropdown' {...params} />
        )}
      />
    )
  }
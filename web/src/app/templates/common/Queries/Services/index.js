import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { CircularProgress } from '@material-ui/core'
import { convertStampDate } from '../../Utils'
import { CheckCircle, Error } from '@material-ui/icons'

export function getAllServices () {
    const query = gql`
    query servicesQuery {
      listServiceNames {        
                id
                name
                intKey   
        }
    }           
`
  const { data, loading, error } = useQuery(query, {
      variables: {}
  })

  let items = []
  const style = {}
  if (error) {
    items = [
      {
        title: 'Error: ' + error.message,
        icon: <Error />,
      },
    ]
    style.color = 'gray'
  } else if (!data && loading) {
    items = [
      {
        title: 'Fetching users...',
        icon: <CircularProgress />,
      },
    ]
    style.color = 'gray'
  } else {
      data.listServiceNames.map((opt) => {
          const newObj = {
            value: opt.id,
            label: opt.name,
            integrationToken: opt.intKey
          }
          items.push(newObj)
        
      })
      
  }
  
  return items
}

export function getAllLabels () {
  

const query = gql`
  query Label {
    labels {
      nodes {
        key
        value
      }
    }
  }
`

  const { data, loading, error } = useQuery(query, {
    variables: {}
  })
  let items = []
  const style = {}
  if (error) {
    items = [
      {
        title: 'Error: ' + error.message,
        icon: <Error />,
      },
    ]
    style.color = 'gray'
  } else if (!data && loading) {
    items = [
      {
        title: 'Fetching users...',
        icon: <CircularProgress />,
      },
    ]
    style.color = 'gray'
  } else {
      data.labels.nodes.map((opt) => {
          const newObj = {
            key: opt.ley,
            value: opt.value
          }
          items.push(newObj)
      })
    
  }
  
  return items 
}

export function getAppSystems () {
  const query = gql`
  query {
    appSystems {
        name
      }
  }           
`
const { data, loading, error } = useQuery(query, {
    variables: {}
})

let items = []
const style = {}
if (error) {
  items = [
    {
      title: 'Error: ' + error.message,
      icon: <Error />,
    },
  ]
  style.color = 'gray'
} else if (!data && loading) {
  items = [
    {
      title: 'Fetching users...',
      icon: <CircularProgress />,
    },
  ]
  style.color = 'gray'
} else {
    data.appSystems.map((opt) => {
        const newObj = {
          value: opt.name,
          label: opt.name
        }
        items.push(newObj)
    })
  
}

return items
}

export function getAlertLogs(alertId, serviceName, limit) {

const query = gql`
  query getAlert($id: Int!, $input: AlertRecentEventsOptions) {
    alert(id: $id) {
      recentEvents(input: $input) {
        nodes {
          timestamp
          message
          state {
            details
            status
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`
const { data, loading, error } = useQuery(query, {
    variables: {
      id: alertId,
      //id: 79672,
      input: {
        limit: limit
      }
    }
})

let items = []
const style = {}
if (error) {
  items = [
    {
      id: 'error',
      title: 'Error: ' + error.message,
      icon: <Error />,
    },
  ]
  style.color = 'gray'
  } else if (!data && loading) {
    items = [
      {
        id: 'loading',
        title: 'Fetching users...',
        icon: <CircularProgress />,
      },
    ]
    style.color = 'gray'
  } else {
    if(data.alert) {
      data.alert.recentEvents.nodes.map((opt, key) => {
          let curStatus = ''
          /*if(opt.state) {
            if(opt.state.status === 'Error') {
              curStatus = <div>
                <Error /> {opt.state.details}
              </div>
            } else {
              curStatus = <div>
                <CheckCircle /> {opt.state.details}
              </div>
            }
          }*/
          curStatus = opt.state ? opt.state.status+" ("+opt.state.details+")" : ''
          const logObj = {
            id: key+1,
            time: convertStampDate(opt.timestamp),
            auditMessage: opt.message,
            status: curStatus,
            service: serviceName
          }
          items.push(logObj)
      })
    }
  }
return items

}

export function getDirectAlertLogs(alertId, serviceName, limit) {

  const query = gql`
    query getAlert($id: Int!, $input: DirectAlertLogInput) {
      directAlert(id: $id) {
        alertLogs(input: $input) {
          nodes {
            timestamp
            message
            state {
              details
              status
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }
  `
  const { data, loading, error } = useQuery(query, {
      variables: {
        id: alertId,
        //id: 79672,
        input: {
          limit: limit
        }
      }
  })
  
  let items = []
  const style = {}
  if (error) {
    items = [
      {
        id: 'error',
        title: 'Error: ' + error.message,
        icon: <Error />,
      },
    ]
    style.color = 'gray'
    } else if (!data && loading) {
      items = [
        {
          id: 'loading',
          title: 'Fetching users...',
          icon: <CircularProgress />,
        },
      ]
      style.color = 'gray'
    } else {
      if(data.directAlert) {
        data.directAlert.alertLogs.nodes.map((opt, key) => {
            let curStatus = ''
            curStatus = opt.state ? opt.state.status+" ("+opt.state.details+")" : ''
            const logObj = {
              id: key+1,
              time: convertStampDate(opt.timestamp),
              auditMessage: opt.message,
              status: curStatus,
              service: serviceName
            }
            items.push(logObj)
        })
      }
    }
  return items
}
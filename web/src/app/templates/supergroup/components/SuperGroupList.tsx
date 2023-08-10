import React from 'react'
import _ from 'lodash'
import { gql } from '@apollo/client'

import SimpleListPage from '../../../lists/SimpleListPage'
import SuperGroupCreateDialog from './SuperGroupCreateDialog'

/*
TLMT-2546
*/


/*const query = gql`
  query Label {
    data: labels {
      nodes {
        key
        value
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`*/
/*
const query = gql`
  query {
    superservices {
      nodes {
        id
        name
        description
      }
    }
  }
`
*/
const query = gql`
  query superservicesQuery($input: SuperServiceSearchOptions) {
    data: superservices(input: $input) {
      nodes {
        id
        name
        description
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`

function SuperGroupList(): JSX.Element {
  
  return (

      <SimpleListPage
        pageName='Super Group List'
        pageTitle='Super Group List'
        query={query}
        variables={{ input: { } }}
        mapDataNode={(n) => ({
          title: n.name,
          subText: n.description,
          url: n.id
        })}
        createDialogComponent={SuperGroupCreateDialog}
        createLabel='Super Group'
      />
  )
}

export default SuperGroupList

/*import React from 'react'
import { gql, useQuery } from '@apollo/client'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import { CircularProgress, makeStyles } from '@material-ui/core'
import { styles as globalStyles } from '../../../styles/materialStyles'
import FlatList from '../../../lists/FlatList'
import { Error } from '@material-ui/icons'
import _ from 'lodash'

const useStyles = makeStyles((theme) => {
  const { cardHeader } = globalStyles(theme)

  return {
    cardHeader,
  }
})

const query = gql`
  query Label {
    labels {
      nodes {
        key
        value
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`


export default function SuperServicesList() {
  const classes = useStyles()
  const { data, loading, error } = useQuery(query, {
    variables: {}
  })

  console.log('data <>M<<>', data)

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
    items = _.chain(data?.labels?.nodes)
      .groupBy('key')
      .mapValues((v) => ({
        key: v[0].key,
        value: v[0].value
      }))
      .values()
      .sortBy('name')
      .map((u) => ({
        title: u.key,
        subText: "desc comes here",
        url: `/super-groups/${u.value}`,
      }))
      .value()
  }
  console.log('items ><<>',items)

  return (
    <Card>
      <CardHeader
        className={classes.cardHeader}
        component='h3'
        title='Super Groups'
      />
      <FlatList
        emptyMessage='No Super Groups assiociated'
        items={items}
      />
    </Card>
  )
}
*/
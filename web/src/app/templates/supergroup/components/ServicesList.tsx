import React from 'react'
import { gql, useQuery } from 'urql'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import { CircularProgress } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { styles as globalStyles } from '../../../styles/materialStyles'
import FlatList from '../../../lists/FlatList'
import { Error } from '@mui/icons-material'
import Spinner from '../../../loading/components/Spinner'
import { GenericError, ObjectNotFound } from '../../../error-pages'
import _ from 'lodash'

/*
TLMT-2546
*/
const useStyles = makeStyles((theme) => {
  const { cardHeader } = globalStyles(theme)

  return {
    cardHeader,
  }
})

const query = gql`
  query listservices($groupID:ID!){
    listservices(id: $groupID) {
      id 
      name
      description
    } 
  }
`


export default function ServicesList(props: {
  groupID: string
}): JSX.Element {
  const classes = useStyles()
  const { groupID } = props

  const [{ data, fetching, error }] = useQuery({
    query,
    variables: { groupID },
  })
  if (fetching && !_.get(data, 'superservice.id')) return <Spinner />
  if (error) return <GenericError error={error.message} />

  let items = []
  const style = {}
  if (error) {
    items = [
      {
        title: 'Error: ' + error.message,
        icon: <Error />,
      },
    ]
  } else if (!data && loading) {
    items = [
      {
        title: 'Fetching users...',
        icon: <CircularProgress />,
      },
    ]
  } else {
    items = _.chain(data?.listservices)
      .groupBy('id')
      .mapValues((v) => ({
        id: v[0].id,
        name: v[0].name,
        description: v[0].description
      }))
      .values()
      .sortBy('name')
      .map((u) => ({
        title: u.name,
        subText: u.description,
        url: `/services/${u.id}`,
      }))
      .value()
  }

  return (
    <Card>
      <CardHeader
        className={classes.cardHeader}
        component='h3'
        title='Services List'
      />
      <FlatList
        emptyMessage='No Sercices assiociated'
        items={items}
      />
    </Card>
  )
}

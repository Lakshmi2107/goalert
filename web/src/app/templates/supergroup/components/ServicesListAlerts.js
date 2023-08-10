import React from 'react'
import { gql, useQuery } from '@apollo/client'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import { CircularProgress } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { styles as globalStyles } from '../../../styles/materialStyles'
import FlatList from '../../../lists/FlatList'
import { Error } from '@mui/icons-material'
import _ from 'lodash'
import DetailsPage from '../../../details/DetailsPage'

/*
TLMT-2546
*/
const useStyles = makeStyles((theme) => {
  const { cardHeader } = globalStyles(theme)

  return {
    cardHeader,
  }
})




export default function ServicesList({ data }) {
  const classes = useStyles()
  
  let items = []
  const style = {}
  
    items = _.chain(data?.superservice?.services)
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
        url: `/services/${u.id}/alerts`,
      }))
      .value()

  return (
      <React.Fragment>
          <DetailsPage
          avatar=""
          title={data.superservice.name}
          subheader=""
          details={data.superservice.description}
          pageContent=''
        />
        <br />
        <Card>
            <CardHeader
            className={classes.cardHeader}
            component='h3'
            title="Services Alert List"
            />
            <FlatList
            emptyMessage='No Sercices assiociated'
            items={items}
            />
        </Card>
      </React.Fragment>
  )
}

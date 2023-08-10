import { Grid, Typography } from '@material-ui/core';
import _ from 'lodash'
import React, { PropsWithChildren } from 'react';
import { MemoryRouter } from 'react-router';
import { Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

/*import postgresImg from '../../../images/postgresql.png'
import mongodbImg from '../../../images/mongodb.png'
import elasticsearchImg from '../../../images/elasticsearch.png'
import slackImg from '../../../images/slack.png'*/
import MailOutlineIcon from '@material-ui/icons/MailOutline';

const useStyles = makeStyles((theme) => ({
    divRoot: {
      marginBottom: 20,
      marginLeft: '-8px',
      marginTop: '-10px',
      width: 250
    },
    imgBlock: {
      border: '1px solid #000',
      width: 222,
      height: 90
  },
  info: {
    fontSize: 12
  },
  iconBlock: {
    width: 22,
    height: 22
  },
  iconStyle: {
    color: '#025b4c',
    fontSize: 35,
    paddingTop: 10
  },
  iconStyleSmall: {
    color: '#025b4c',
    fontSize: 18,
  },
  glStyle: {
    paddingBottom: 10,
    fontSize: 12,
    display: 'inline'
  },
  glStyleIcon: {
    maringTop: 10,
    display: 'inline'
  },
  iconPadding: {
    padding: '0px 0px 0px 4px !important'
  },
  slackPadding: {
    padding: '8px 0px 0px 15px !important'
  },
  groupDLText: {
    fontSize: 11,
    paddingTop: '15px !important',
    paddingLeft: '15px !important'
  },
  slackText: {
    paddingTop: '12px !important',
    paddingLeft: '18px !important',
    fontSize: 13
  },
  paddingTop10: {
    padding: '10px 0px 0px 0px !important'
  }
  }));


export const ProvisioningInfo = ({ formData, platformKind, tokenObj }) => {
    const classes = useStyles();
    const platformKindObj = _.find(formData, (n) => { return n.name === 'platformKind'})
    let platformKindInfo = _.find(platformKindObj.options, (n) => { return n.value === platformKind})
    let imgUrl = ''
    /*switch(platformKind) {
      case 'postgres':
        imgUrl = postgresImg
        break;
      case 'mongodb':
        imgUrl = mongodbImg
        break;
      case 'elasticsearch':
        imgUrl = elasticsearchImg
        break;
      default:
        imgUrl = ''
        break;
    }*/

    if(!_.isEmpty(tokenObj.globalObj)) {
      platformKindInfo.info = tokenObj.globalObj[platformKind]
    }
    

    return (
        <div className={classes.divRoot}>
          <Paper>
            {imgUrl && 
              <img src={imgUrl} title={platformKind} className={classes.imgBlock}  />
            }
            
            <div className={classes.info} >
              <Grid container>
                <Grid item md={12} xs={12}>
                    <b>Version:</b> {platformKindInfo.info.version}
                  </Grid>
                  {platformKindInfo.info.gropupDL && 
                    <Grid item md={12} xs={12} className={classes.iconPadding}>
                      <Grid container>
                        <Grid item md={1} xs={1} className={classes.iconPadding}><MailOutlineIcon className={classes.iconStyle} /></Grid>
                        <Grid item md={11} xs={11} className={classes.groupDLText}>{platformKindInfo.info.gropupDL}</Grid>
                      </Grid>
                    </Grid>
                  }
                  {platformKindInfo.info.slackChannel &&
                    <Grid item md={12} xs={12} className={classes.paddingTop10}>
                      <Grid container>
                        <Grid item md={1} xs={1} className={classes.slackPadding}><a href={platformKindInfo.info.slackChannelLink} target="_blank"><img src={slackImg} className={classes.iconBlock}/></a></Grid>
                        <Grid item md={11} xs={11} className={classes.slackText}><a href={platformKindInfo.info.slackChannelLink} target="_blank">{platformKindInfo.info.slackChannel}</a></Grid>
                      </Grid>
                    </Grid>
                }
              </Grid>
            </div>
          </Paper>
        </div>
    )
}   

export default ProvisioningInfo 

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import ProgressCard from './progressCard'
import ProvisioningInfo from './provisioningInfo'

const useStyles = makeStyles((theme) => ({
    divRoot: {
        width: '100%',
    },
    bgOne: {
        background: '#ebebeb'
    },
    bgTwo: {
        background: "#f4f4f4"
    },
    gridContainer: {
        margin: 1,
        width: '100%'
    },
    mTop8: {
        marginTop: 8
    },
    divContainer: {
        margin: '0px'
    }
}));

const PreviewForm = ({ onBoardInfo, formData, originalData, platformKind, tokenObj }) => {
  const classes = useStyles();
  let fieldCount = 0
  let updatedFieldCount = 0

    let previewColSize = 12
    let processColSize = 12
    if(originalData.isPreviewRequired && originalData.isProgressRequired) {
        previewColSize = 9 
        processColSize = 3
    } 

    return (
      <div className={classes.divRoot}>
        <Grid container className={classes.divContainer}>
            {originalData.isPreviewRequired &&
                <Grid item md={previewColSize} xs={previewColSize}>
                    {formData.map((opt, key) => {
                        if(opt.display !== 'none' && (!opt.disabled || opt.name === 'env')) {
                            if(opt.field !== 'Group') {
                                fieldCount++
                                let dispValue = onBoardInfo[opt.name]
                                if(opt.field === 'Select' || opt.field === 'Radio') {
                                    const dispValueObj = _.find(opt.options, (n) => { return n.value === onBoardInfo[opt.name] })
                                    dispValue = dispValueObj ? dispValueObj.label : dispValue
                                    dispValue = dispValue === 'GCP' ? 'On-Premise' : dispValue
                                    dispValue = dispValue === 'PCI' ? 'None' : dispValue
                                } 
                                dispValue ? updatedFieldCount++ : updatedFieldCount
                                return(<Grid container className={classes.gridContainer} key={key}>
                                        <Grid item md={6} xs={6} className={classes.bgOne}>{opt.label}</Grid>
                                        <Grid item md={6} xs={6} className={classes.bgTwo}>{dispValue}</Grid>
                                    </Grid>)
                            } else {
                                return opt.fields.map((mainObj, mindex) => { // Fields iteration
                                    fieldCount++
                                    let labelObj = ''
                                    let valueObj = ''
                                    let checkUpdated = true
                                    mainObj.map((obj, index) => { // Field objects iteration
                                        if(labelObj === '') {
                                            labelObj = obj.label
                                            valueObj = onBoardInfo[obj.name]
                                        } else {
                                            labelObj =  labelObj+" - "+obj.label
                                            valueObj =  valueObj+" - "+onBoardInfo[obj.name]
                                        }
                                        if(!onBoardInfo[obj.name]) {
                                            checkUpdated = false
                                        }
                                    })
                                    if(checkUpdated) { 
                                        updatedFieldCount++
                                    }
                                    return(<Grid container className={classes.gridContainer} key={key}>
                                        <Grid item md={6} xs={6} className={classes.bgOne}>{labelObj}</Grid>
                                        <Grid item md={6} xs={6} className={classes.bgTwo}>{valueObj}</Grid>
                                    </Grid>)
                                })
                            }
                        }
                    })}
                </Grid>
            }
            {(originalData.isProgressRequired || originalData.isProvisioningInfoRequired) &&
                <Grid item md={processColSize} xs={processColSize}>
                    {originalData.isProvisioningInfoRequired &&
                        <ProvisioningInfo formData={formData} platformKind={platformKind} tokenObj={tokenObj} />
                    }
                    {originalData.isProgressRequired &&
                        <ProgressCard onBoardInfo={onBoardInfo} formData={formData} title="Input Progress" />
                    }
                </Grid>
            }           
        </Grid>
      </div>
    );
}

export default PreviewForm;
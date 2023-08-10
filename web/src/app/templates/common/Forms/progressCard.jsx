import React, { PropsWithChildren } from 'react';
import { Grid } from '@material-ui/core';

const Wrapper = ({ children }) => (
      <Grid container spacing={2}>
        {children}
      </Grid>
  );

const ProgressCard = ({ onBoardInfo, formData, title }) => {
    let fieldCount = 0
    let updatedFieldCount = 0
    formData.map((opt, key) => {
        if(opt.display !== 'none' && (!opt.disabled || opt.name === 'env')) {
            if(opt.field !== 'Group') {
                fieldCount++
                onBoardInfo[opt.name] ? updatedFieldCount++ : updatedFieldCount
            } else {
                opt.fields.map((mainObj, mindex) => { // Fields iteration
                    fieldCount++
                    let checkUpdated = true
                    mainObj.map((obj, index) => { // Field objects iteration
                        if(!onBoardInfo[obj.name]) {
                            checkUpdated = false
                        }
                    })
                    if(checkUpdated) { 
                        updatedFieldCount++
                    }
                })
            }
        }
    })

    return (
        <Wrapper>
            <div>Progress : {updatedFieldCount/fieldCount}</div>
        </Wrapper>
)};

export default ProgressCard 
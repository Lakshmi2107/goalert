import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom'
import DetailedAccordion from '../../common/PaaSAccordion/detailed'
import { Button as MuiBtn } from '@material-ui/core';
import PostAdd from '@material-ui/icons/PostAdd';
import ResponsiveDialog from '../../common/Modals/responsiveDialog'
import AddComment from './AddComment'
import { getPathParams, convertStampDate } from '../../common/Utils'
import { useSelector, useDispatch } from 'react-redux';
import { getActionStore } from '../../action/formActions'

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    btnBlock: {
        textAlign: 'right'
    },
    gridStyle: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        padding: 5,
        fontSize: 15,
        flexBasis: '100%',
        maxWidth: '100%'
    },
    gridBorder: {
        borderRight: '2px solid #ebebeb'
    },
    commentBlock: {
        padding: "5px 0px",
        textAlign: 'justify'
    },
    commentedBy: {
        textAlign: "right",
        display: 'block'
    },
    commentedDate: {
        textAlign: "right",
        display: 'block',
        fontSize: 11
    }
    

  }));

export default function Comments() {
    const history = useHistory()    
    const classes = useStyles();
    const [dialogOpenStatus, setDialogOpenStatus] = React.useState(false); 
    const [dialogContent, setDialogContent] = React.useState(''); 
    const [dialogTitle, setDialogTitle] = React.useState(''); 
    const dispatch = useDispatch();

    const pathParams = getPathParams(window.location.pathname)
    let alertId = pathParams[2]

    const [apiCalled, setApiCalled] = useState(false); // integer state

    const getComments = () => {
        const getApiUrl = "/api/v1/templates/alerts/"+alertId+"/comment"
        dispatch(getActionStore(getApiUrl, 'COMMENTS_LIST', {}, {}, '', history))
    }
    
    if(!apiCalled) {
      getComments()
      setApiCalled(true)
    }
    

    const templatesData = useSelector(state => state.templates);

    const closeDialogCB = (reloadFlag) => {
        setDialogOpenStatus(false)
        setDialogContent('')
        setDialogTitle('')
        if(reloadFlag) {
            getComments()
        }
    }

    const handleAddComment = () => {
        setDialogOpenStatus(true)
        setDialogContent(<AddComment closeDialogCB={closeDialogCB} />)
        setDialogTitle('Add Comment')
    }

    const listComments = templatesData.commentsList ? templatesData.commentsList : []

    const getContent = () => {
        const CommentsContent = <Grid container>
            <Grid item xs={12} className={classes.btnBlock}>
                <MuiBtn  variant="outlined" color="primary"  onClick={handleAddComment} style={{margin: '5px'}} startIcon={<PostAdd />}>
                    Add Comment
                </MuiBtn>
            </Grid>
            <Grid item xs={9} className={classes.gridStyle}>
                {listComments.map((commentObj) => {
                    return (
                        <div className={classes.commentBlock}>
                            {commentObj.comment}
                            <span className={classes.commentedBy}><i> - {commentObj.createdBy}</i></span>
                            <span className={classes.commentedDate}><i>{convertStampDate(commentObj.createdAt)}</i></span>
                        </div>
                    )
                })}
            </Grid>
        </Grid>
        return CommentsContent
    }
  
  return (
    <React.Fragment>
       <DetailedAccordion
          title = "Comments"
          content = {getContent()}
          expandFlag = {false}
      />
        <ResponsiveDialog
            dialogOpenStatus={dialogOpenStatus}
            dialogContent={dialogContent}
            dialogTitle={dialogTitle}
            closeDialogCB={closeDialogCB}
        />
    </React.Fragment>
  )
}

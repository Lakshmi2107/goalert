import React from 'react';
import LoaderImg from './loading-buffering.gif'
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
    centered: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    },
    visibleDiv: {
        zIndex: 99999,
        position: 'absolute',
        top: 0,
        left: 0,
        //height: '100%',
        minHeight: '400vh',
        width: '100%',
        filter: 'alpha(opacity=50)',
        opacity: 0.6,
        backgroundColor: '#999'
    
    }
}))

const Loader = () => {
    const classes = useStyles();
    return (
        <div className={classes.visibleDiv}>
            <div className={classes.centered}>
                <img src={LoaderImg} />
            </div>
        </div>
    );
};

export default Loader
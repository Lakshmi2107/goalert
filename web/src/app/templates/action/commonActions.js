import {
    ERROR_STATUS,
    LOADER_STATUS,
    SUCCESS_STATUS,
    POP_STATUS,
    PAAS_NOTIFICATION,
    PAAS_OPTIONS_REMOVE,
    CHECK_AVAILABILITY_REMOVE,
    INVALID_TOKEN,
    MSTEAM_DATA
} from './actionTypes';
//import { postActionRedirect } from './formActions'
import { authLogout } from '../../actions'

// This will change the loader status 
export function togglePopUp(status, msg) {
    return {
        type: POP_STATUS,
        status,
        msg
    }
}

export function toggleSuccess(status, msg) {
    return {
        type: SUCCESS_STATUS,
        status,
        msg
    }
}

export function toggleError(status, msg) {
    return {
        type: ERROR_STATUS,
        status,
        msg
    }
}

export function toggleLoader(status) {
    return {
        type: LOADER_STATUS,
        status,
    }
}

export function resetNotification() {
    let payload = {
        status: false,
        type: '',
        message: '',
        title: ''
    }
    return {
        type: PAAS_NOTIFICATION,
        payload
    }
}

export function faulireNotification(error, history) {
    return dispatch => {
        let message = (error && error.response && error.response.data) ? error.response.data.message : 'Server issue, please contact admin'
        let payload = {
            status: true,
            type: 'error',
            message,
            title: "Error"
        }
        dispatch({
            type: PAAS_NOTIFICATION,
            payload
        })

        if (error && error.response && error.response.status === 401) {
            //dispatch(postActionRedirect({}, "/api/v2/identity/logout", {}, {}, {}))
            dispatch(authLogout(true))
            /*setTimeout(() => {
                history.push("/login")
            }, 3000);*/
        }
    }
}

export function successNotification(message) {
    let payload = {
        status: true,
        type: 'success',
        message,
        title: "Success"
    }
    return {
        type: PAAS_NOTIFICATION,
        payload
    }
}

export function infoNotification(message) {
    let payload = {
        status: true,
        type: 'info',
        message,
        title: "Information"
    }
    return {
        type: PAAS_NOTIFICATION,
        payload
    }
}

export function removePaasOptions() {
    return {
        type: PAAS_OPTIONS_REMOVE,
        payload: {}
    }
}

export function removeCheckAvailability() {
    return {
        type: CHECK_AVAILABILITY_REMOVE,
        payload: {}
    }
}

export function getUpdatedToken(error, payload) {
    let message = (error && error.response && error.response.data) ? error.response.data.message : ''
    if(message === 'Invalid access token' && window.location.hostname !== 'localhost') {
        return {
            type: INVALID_TOKEN,
            payload
        }
    } else {
        return {
            type: INVALID_TOKEN,
            payload: {}
        }
    }
}

export function resetInvalidToken() {
    return {
        type: INVALID_TOKEN,
        payload: {}
    }
}

export function removeMsteamData() {
    return {
        type: MSTEAM_DATA,
        payload: {}
    }
}

export function addSampleMsTeamData(payload) {
    return {
        type: MSTEAM_DATA,
        payload
    }
}



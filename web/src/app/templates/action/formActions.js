import {
    LOADER_STATUS,
    INVALID_TOKEN
} from './actionTypes';
import * as API from '../service/indexAxios'
import { toggleLoader, faulireNotification, successNotification, getUpdatedToken } from './commonActions'
import Config from '../service/config'
import { axiosApiRoot } from '../../env'
//import { useAccessToken, testFun } from '../components/common/Auth/useAccessToken'

export function postActionRedirect(payload, apiUrl, history, redirectUrl, tokenObj) {
    return dispatch => {
        dispatch(toggleLoader(true))
       const postUrl = axiosApiRoot + apiUrl
       
       //const postUrl = "http://localhost:8082/api/v1/provisioning"
      return API.postCommService(postUrl, payload, tokenObj).then(response => {
            // dispatch
            dispatch(toggleLoader(false))
            const successMsg = (payload.comment) ? 'Comment successfully added' : 'Form submitted successfully'
            dispatch(successNotification(successMsg))
            if(redirectUrl) {
              history.push(redirectUrl)
            }

        }).catch(error => {
          dispatch(toggleLoader(false))
          
          dispatch(faulireNotification(error, history))
      })
    }
} 

export function postActionStore(payload, apiUrl, type, refFields, tokenObj, onboardText, history={}) {
  return dispatch => {
      dispatch(toggleLoader(true))
      const postUrl = axiosApiRoot + apiUrl

      dispatch({
        type: type,
        payload: [],
        refFields: refFields
      })

      return API.postCommService(postUrl, payload, tokenObj).then(response => {
          // dispatch
          dispatch(toggleLoader(false))
          dispatch({
            type: type,
            payload: response,
            refFields: refFields
          })
          if(type !== 'TEMPLATE_PREVIEW') {
            const successMsg = (payload.comment) ? 'Comment successfully added' : 'Form submitted successfully'
            dispatch(successNotification(successMsg))
          }
      }).catch(error => {
        dispatch(toggleLoader(false))

        /*if(error && error.response && error.response.data && error.response.data.message === 'Invalid access token') {
          const errorPayload = {
            status: true,
            callBackFun : postActionStore,
            params: [{payload}, {apiUrl}, {type}, {refFields}, {tokenObj}]
          }
          dispatch(getUpdatedToken(error, errorPayload))
        } else { */
         
          dispatch(faulireNotification(error, history))
        //}
    })  
  };
} 

export function getActionStore(apiUrl, type, refFields, tokenObj, onloadText, history={}) {
    return dispatch => {
        dispatch(toggleLoader(true))
        const getUrl = axiosApiRoot + apiUrl 
        //const getUrl = "https://goalert.sadc-tlmy-dev01.carbon.lowes.com/"+apiUrl
        //const getUrl = apiUrl
        /*if(type !== 'CHECK_AVAILABILITY') {
          dispatch({
            type: type,
            payload: [],
            refFields: refFields
          })
        }*/
        return API.getCommService(getUrl, tokenObj).then(response => {
           dispatch(toggleLoader(false))
            dispatch({
              type: type,
              payload: response,
              refFields: refFields
            })
                        
            //dispatch(successNotification('Data loaded successfully'))
        }).catch(error => {
          dispatch(toggleLoader(false))
          

          /*if(error && error.response && error.response.data && error.response.data.message === 'Invalid access token') {
            const errorPayload = {
              status: true,
              callBackFun : getActionStore,
              params: [{apiUrl}, {type}, {refFields}, {tokenObj}]
            }
            dispatch(getUpdatedToken(error, errorPayload))
          } else { */
            if(type !== 'CHECK_AVAILABILITY') {
              dispatch(faulireNotification(error, history))
            }
          //}
        }) 
    };   
}

export function deleteAction(apiUrl, tokenObj, callbackFun, callbackFunParams, deleteText, history={}) {
  return dispatch => {
    dispatch(toggleLoader(true))
    const deleteUrl = axiosApiRoot + apiUrl
    return API.deleteCommService(deleteUrl, tokenObj).then(response => {
        dispatch(callbackFun(callbackFunParams.url, callbackFunParams.type, {}, tokenObj))
        dispatch(toggleLoader(false))
        
        dispatch(successNotification('Provisioning successfully deleted'))
    }).catch(error => {
      dispatch(toggleLoader(false))
      
      

      /*if(error && error.response && error.response.data && error.response.data.message === 'Invalid access token') {
        const errorPayload = {
          status: true,
          callBackFun : deleteAction,
          params: [{apiUrl}, {tokenObj}, {callbackFun}, {callbackFunParams}]
        }
        dispatch(getUpdatedToken(error, errorPayload))
      } else { */
        dispatch(faulireNotification(error, history))
      //}
    }) 
  }; 
}

export function putActionRedirect(payload, apiUrl, navigate, redirectUrl, tokenObj, onboardText, history={}) {
  return dispatch => {
      dispatch(toggleLoader(true))
      const postUrl = axiosApiRoot + apiUrl
     
     //const postUrl = "http://localhost:8082/api/v1/provisioning"
    return API.putCommService(postUrl, payload, tokenObj).then(response => {
          // dispatch
          dispatch(toggleLoader(false))
          //redirectUrl = window.location.host.indexOf('localhost') === -1 ? '/paasui'+redirectUrl : redirectUrl
          dispatch(successNotification('Form submitted successfully.'))
         
          //history.pushState(null,'',redirectUrl)
          navigate(redirectUrl)
      }).catch(error => {
        dispatch(toggleLoader(false))

        /*if(error && error.response && error.response.data && error.response.data.message === 'Invalid access token') {
          const errorPayload = {
            status: true,
            callBackFun : putActionRedirect,
            params: [{payload}, {apiUrl}, {type}, {refFields}, {tokenObj}]
          }
          dispatch(getUpdatedToken(error, errorPayload))
        } else { */
          
          dispatch(faulireNotification(error, history))
        //}
    })
  }
} 





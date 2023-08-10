//import axios from 'axios'
import { apiRoot } from '../../env'

function getHeaderInfo(tokenObj) {
    
    const headerInfo = {
        credentials: 'include',
        headers : {
            "Access-Control-Allow-Origin": "*",
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true
        }
    }
    return headerInfo
}

export function postCommService(serviceUrl, payload, tokenObj) {
    // return axios.post(serviceUrl, payload, getHeaderInfo(tokenObj)).then(resp => {
    //     return resp.data;
    // })
}

export function putCommService(serviceUrl, payload) {
    // return axios.put(serviceUrl, payload, getHeaderInfo()).then(resp => {
    //     return resp.data;
    // })
}

export function getCommService(serviceUrl, tokenObj) {
    // return axios.get(serviceUrl, getHeaderInfo(tokenObj)).then(resp => {
    //     return resp.data;
    // })
    /*return axios.get(serviceUrl).then(resp => {
        return resp.data;
    })*/
}

export function deleteCommService(serviceUrl, tokenObj) {
    // return axios.delete(serviceUrl, getHeaderInfo(tokenObj)).then(resp => {
    //     return resp.data;
    // })
}




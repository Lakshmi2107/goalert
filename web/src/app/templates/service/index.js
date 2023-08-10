import Config from './config'

export function postCommService(serviceUrl, payload, tokenObj) {
    let postUrl = Config.baseUrl+serviceUrl

    fetch(postUrl, {
        credentials: 'same-origin',
        method: 'POST',
        body: JSON.stringify(payload)
      }).then(resp => {
        return resp.data;
    })
}

export function putCommService(serviceUrl, payload) {
    fetch(serviceUrl, {
        credentials: 'same-origin',
        method: 'PUT',
        body: JSON.stringify(payload)
      }).then(resp => {
        return resp.data;
    })
}

export function getCommService(serviceUrl, tokenObj) {
    fetch(serviceUrl, {
        credentials: 'same-origin',
        method: 'GET',
      }).then(resp => {
        return resp.data;
    })
}

export function deleteCommService(serviceUrl, tokenObj) {
    fetch(serviceUrl, {
        credentials: 'same-origin',
        method: 'DELETE',
      }).then(resp => {
        return resp.data;
    })
}




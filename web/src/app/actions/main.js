export const SET_SHOW_NEW_USER_FORM = 'SET_SHOW_NEW_USER_FORM'
import Pharos from '@lowes/pharos'
import { PHAROS_ENABLE_STATUS } from '../util/constants'

export const setUserToPharos = (data) => {
  if (PHAROS_ENABLE_STATUS) {
    Pharos.setUser({
      firstname: data.name,
      id: data.salesID,
      emailid: data.email
    });
  }
}

export const setPageLoadToPharos = (data) => {
  if (PHAROS_ENABLE_STATUS) {
    const pharosObj = {
      pageName: data.pageName,
      pageTitle: data.pageTitle,
    }
    Pharos.setPageDetails(pharosObj);
  }
}

export const setUserClicksToPharos = (eventName, pageData, pageUrl) => {
  if (PHAROS_ENABLE_STATUS) {
    const pharosObj = {
      data: pageData,
      url: pageUrl,
    }
    Pharos.trackClick(eventName, pharosObj);
  }
}
//TLMT-4645 - end
export function setShowNewUserForm(search) {
  return {
    type: SET_SHOW_NEW_USER_FORM,
    payload: search,
  }
}

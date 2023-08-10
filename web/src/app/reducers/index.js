import { combineReducers } from 'redux'
import auth from './auth'
import main from './main'
import templates from '../templates/reducers/mimReducer'
import common from '../templates/reducers/commonReducer'

export default function createRootReducer() {
  return combineReducers({
    auth, // auth status
    main, 
    templates,
    common// reducer for new user setup flag
  })
}

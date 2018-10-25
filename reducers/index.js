import { combineReducers } from 'redux';
import { startGameReducer } from './gamePlayReducer';
import { LOG_OUT } from '../actions';

const appReducer = combineReducers({
    startGameReducer,
});

export default rootReducer = (state, action)=>{
    if(action.type === LOG_OUT){
        state = undefined;
    }
    return appReducer(state, action);
}
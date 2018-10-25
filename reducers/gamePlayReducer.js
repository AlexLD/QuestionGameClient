import { START_GAME, LOAD_GAMES, BEGIN_LOAD_GAMES, JOIN_GAME, CREATE_GAME, START_SOCKET, NEW_PLAYER } from '../actions';
import { ListView } from 'react-native';


const ds = new ListView.DataSource({rowHasChanged:(r1,r2)=>r1!==r2});

const initialState = {
    isLoading: false,
    dataSource: ds.cloneWithRows([]),
    gameSession: undefined,
    gameSessionStarted: false,
    isCreatorOfGame: false,
    joined: false,
    gameServerSocket: undefined,
    players: {},
}

export const startGameReducer = (state=initialState, action)=>{
    switch(action.type){
        case BEGIN_LOAD_GAMES:
            return {
                ...state,
                isLoading:true,
            }
        case LOAD_GAMES:
            return {
                ...state,
                dataSource: ds.cloneWithRows(action.payload.games?action.payload.games:[]),
                isLoading: false,
                gameSession: undefined,
                gameSessionStarted: false,
                isCreatorOfGame: false,
            }
        case CREATE_GAME:
            return {
                ...state,
                gameSession: action.payload.gameSession,
                isLoading: false,
                isCreatorOfGame: true,
            }
        case START_GAME:
            return {
                ...state,
                gameSession: action.payload.gameSession,
                isLoading: false,
                gameSessionStarted: action.payload.gameSessionStarted,
                joined: action.payload.joined,
                isCreatorOfGame: action.payload.isCreatorOfGame,
                players: action.payload.players,
            }
        case JOIN_GAME:
            return {
                ...state,
                joined: action.payload.joined,
                gameSession: action.payload.gameSession,
                gameServerSocket: action.payload.gameService,
            }
        case START_SOCKET:
            return {
                ...state,
                gameServerSocket: action.payload.gameService,
            }
        case NEW_PLAYER:
            return {
                ...state,
                players: {...action.payload},
            }
        default:
            return state;
    }
}
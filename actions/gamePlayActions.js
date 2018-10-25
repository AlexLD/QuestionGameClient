import { START_GAME, LOAD_GAMES, BEGIN_LOAD_GAMES, JOIN_GAME, CREATE_GAME, START_SOCKET, SOCKET_READY } from './index';
import { load_games } from '../server/loadContent';
import { createGameServer, loadMyGameSession, startGameServer, joinGameServer } from '../server/gameSessions';
import gameService from '../server/gameService';

function beginLoadGames(){
    return {
        type: BEGIN_LOAD_GAMES,
    }
}
export const loadGames = ()=> dispatch =>{
    dispatch(beginLoadGames());
    let payload = {};
   
    loadMyGameSession().then(result=>{
        if(result && result.success && result.gameSession){
            payload.gameSession = result.gameSession.game_session;
            payload.gameSessionStarted = result.gameSession.status==="started";
            payload.joined = result.gameSession.joined;
            payload.isCreatorOfGame = result.gameSession.isCreatorOfGame;
            payload.players = result.gameSession.players;
            dispatch({
                type: START_GAME,
                payload: payload,
            })
        }else{
            load_games().then(results=>{
                if(results.success && results.games){
                    payload.games = results.games;
                    dispatch({
                        type: LOAD_GAMES,
                        payload: payload,
                    })
                }
            }).catch(err=>{
                payload.errMsg = err.message;
                dispatch({
                    type: LOAD_GAMES,
                    payload: payload,
                })
            })
        }
    });
}

export const createGame = (game_id) => dispatch =>{
    dispatch(beginLoadGames());
    let payload = {};
    createGameServer(game_id).then(result=>{
        if(result.success){
            payload.gameSession = result.gameSession;
            payload.gameSessionStarted = false;
            dispatch({
                type: CREATE_GAME,
                payload: payload,
            })
        }else{

        }
    }).catch(err=>{
        console.log(err);
    });
}

export const startGame = (game_session) => dispatch => {
    let payload = {};
    startGameServer(game_session).then(result=>{
        if(result.success){
            payload.gameSession = game_session;
            payload.gameSessionStarted = true;
            dispatch({
                type: START_GAME,
                payload: payload,
            })
        }
    }).catch(err=>{
        console.log(err);
    })
}

export const joinGame = (game_session) => dispatch => {
    return new Promise((resolve,reject)=>{
        let payload = {};
        joinGameServer(game_session).then(result=>{
            if(result.success){
                payload.joined = true;
                payload.gameSession = game_session;
                payload.gameService = new gameService();
                payload.gameService.init(game_session, ()=>{
                    dispatch({
                        type: SOCKET_READY,
                    })
                })
                dispatch({
                    type: JOIN_GAME,
                    payload: payload,
                })
                resolve();
            }else{
                reject();
            }
        }).catch(err=>{
            console.log(err);
            reject();
        })
    })
}

export const startSocket = (game_session) => dispatch => {
    let payload = {};
    payload.gameService = new gameService();
    payload.gameService.init(game_session, ()=>{
        dispatch({
            type: SOCKET_READY,
        })
    })
    dispatch({
        type: START_SOCKET,
        payload: payload,
    });
    
}
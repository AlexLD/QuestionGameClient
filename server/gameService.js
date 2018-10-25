import socketIo from 'socket.io-client';
import config from './config.json';
import { AsyncStorage } from 'react-native';
import { SOCKET_READY, NEW_PLAYER } from '../actions';

const server = config.gameServer;

export default class gameService{
    constructor(){
    }

    init(gameSession, callback) {
        this.initSocket(gameSession).then(()=>{
            callback();
        })
    }

    async initSocket(gameSession){
        let jwt = await AsyncStorage.getItem('jwt');
        this.socket = socketIo.connect(server, {query: 'auth_token='+jwt});
        this.socket.on('connect',()=>{
            this.onConnected(gameSession);
        })
        this.socket.on('disconnect',()=>{
            this.onDisconnected();
        })
    }

    onConnected(gameSession){
        console.log('connected');
        this.socket.emit('JoinGame',gameSession);
    }

    onDisconnected(){
        console.log('disconnected');
    }
}

export const gameServiceMiddleware = ()=>{
    return ({dispatch, getState}) => next => action =>{
        if(action.type == SOCKET_READY){
            let socket = getState().startGameReducer.gameServerSocket.socket;
            let players = getState().startGameReducer.players;
            if(socket){
                socket.on('JoinGame',(id, name)=>{
                    players[id]=name;
                    dispatch({
                        type: NEW_PLAYER,
                        payload: players,
                    })
                    console.log(name + " joined");
                })
                
            }
        }
        return next(action);
    }
}

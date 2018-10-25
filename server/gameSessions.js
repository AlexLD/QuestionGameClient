import config from './config.json';
import { AsyncStorage } from 'react-native';
const server = config.server;

export const createGameServer = (game_id)=>{
    return new Promise((resolve, reject)=>{
        AsyncStorage.getItem('jwt').then(jwt=>{
            fetch(`${server}/GamePlay/createGame?game_id=${game_id}`,{
                method:'GET',
                headers:{
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' +jwt, 
                },
            })
            .then(response=>response.json())
            .then(result=>{
                resolve(result);
            })
            .catch(err=>{
                reject(err);
            })
        });
        
    })
}

export const startGameServer = (game_session)=>{
    return new Promise((resolve, reject)=>{
        AsyncStorage.getItem('jwt').then(jwt=>{
            fetch(`${server}/GamePlay/startGame?game_session=${game_session}`,{
                method:'GET',
                headers:{
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' +jwt, 
                },
            })
            .then(response=>response.json())
            .then(result=>{
                resolve(result);
            })
            .catch(err=>{
                reject(err);
            })
        });
        
    })
}

export const joinGameServer = (game_session)=>{
    console.log("fdads");
    return new Promise((resolve, reject)=>{
        AsyncStorage.getItem('jwt').then(jwt=>{
            fetch(`${server}/GamePlay/joinGame`,{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' +jwt, 
                },
                body: JSON.stringify({
                    game_session,
                })
            })
            .then(response=>response.json())
            .then(result=>{
                resolve(result);
            })
            .catch(err=>{
                reject(err);
            })
        });
        
    })
}

export const loadMyGameSession = ()=>{
    return new Promise((resolve, reject)=>{
        AsyncStorage.getItem('jwt').then(jwt=>{
            fetch(`${server}/GamePlay/myGameSession`,{
                method:'GET',
                headers:{
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' +jwt, 
                },
            })
            .then(response=>response.json())
            .then(result=>{
                resolve(result);
            })
            .catch(err=>{
                reject(err);
            })
        });
        
    })
}


import config from './config.json';
import { AsyncStorage } from 'react-native';
const server = config.server;

export const saveGame = (game)=>{
    return new Promise((resolve, reject)=>{
        AsyncStorage.getItem('jwt').then((jwt)=>{
            fetch(`${server}/Games`,{
                method:'PUT',
                headers:{
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' +jwt, 
                },
                body:JSON.stringify(game),
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

export const saveQuestion = (question, game_id)=>{
    return new Promise((resolve, reject)=>{
        AsyncStorage.getItem('jwt').then((jwt)=>{
            fetch(`${server}/Questions`,{
                method:'PUT',
                headers:{
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' +jwt, 
                },
                body:JSON.stringify({question,game_id}),
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

export const deleteQuestion = (question)=>{
    return new Promise((resolve, reject)=>{
        AsyncStorage.getItem('jwt').then((jwt)=>{
            fetch(`${server}/Questions/${question._id}`,{
                method:'DELETE',
                headers:{
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' +jwt, 
                }
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
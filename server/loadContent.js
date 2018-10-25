import config from './config.json';
import { AsyncStorage } from 'react-native';
const server = config.server;

export const load_games = ()=>{
    return new Promise((resolve, reject)=>{
        AsyncStorage.getItem('jwt').then((jwt)=>{
            fetch(`${server}/Games`,{
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

export const load_questions = (game_id)=>{
    return new Promise((resolve,reject)=>{
        AsyncStorage.getItem('jwt').then(jwt=>{
            fetch(`${server}/Questions/loadQuestions?game_id=${game_id}`,{
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
        })
    })
}
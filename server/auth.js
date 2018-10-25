const config = require('./config.json');
import { AsyncStorage } from 'react-native';

const server = config.server;

/*
resolve:{
    success: true,    
    user: {
        id,
        username,
        email,
    },
    token: jwt token
}

reject:{
    success: false,
    message
}
*/
export const login = (username, password)=>{
    const FETCH_TIMEOUT = 8000;
    let didTimeout = false;

    return new Promise((resolve, reject)=>{
        const timeout = setTimeout(() => {
            didTimeout = true;
            reject(new Error('Request timed out.'));
        }, FETCH_TIMEOUT);

        const url = `${server}/Login`;
        fetch(url,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                username,
                password,
            })
        })
        .then(response=>response.json())
        .then(result=>{
            clearTimeout(timeout);
            if(!didTimeout){
                resolve(result);
            }
        })
        .catch(err=>{
            if(!didTimeout){
                reject(err);
            }
        })
    })
}

export const registerUser = (user)=>{
    return new Promise((resolve,reject)=>{
        fetch(`${server}/Signup`,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(user),
        })
        .then(response=>response.json())
        .then(result=>{
            resolve(result);
        })
        .catch(err=>{
            reject(err);
        })
    })
}

export const logout = async ()=>{
    await AsyncStorage.clear();
}

export const resendEmail = (username)=>{
    return new Promise((resolve,reject)=>{
        fetch(`${server}/ResendEmail?username=${username}`,{
            method:'GET',
            headers:{
                'Content-Type': 'application/json',
            }
        })
        .then(response=>response.json())
        .then(result=>{
            resolve(result);
        })
        .catch(err=>{
            reject(err);
        })
    })
}
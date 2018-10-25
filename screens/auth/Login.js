import React, { Component } from 'react';
import { View, Text, Image, ActivityIndicator, KeyboardAvoidingView, TouchableOpacity, StyleSheet, Alert, AsyncStorage } from 'react-native';
import TextField from '../../components/TextField';
import { login, resendEmail } from '../../server/auth';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username:"",
            password:"",
            usernameError:"",
            passwordError:"",
            isLoggingin:false,
        };
    }

    resendEmail = ()=>{
        resendEmail(this.state.username).then((result)=>{
            Alert.alert(
                result.success?'Done':'Failed',
                result.message,
                [
                    {text:'Done', style:'cancel'}
                ]
            )
        });
    }
    tryLogin = ()=>{
        if(!this.validateFields()) return;
        this.setState({isLoggingin:true});
        login(this.state.username,this.state.password).then((result)=>{
            if(result.success){
                const user = result.user;
                const jwt = result.token;
                AsyncStorage.multiSet([['jwt',jwt],['user_id',user.id]]).then(()=>{
                    this.props.navigation.navigate('Main');
                });
            }else if(result.verifyEmail){
                Alert.alert(
                    result.message,
                    'Go to your email account and activate your user.',
                    [
                        {text:'Resend email', onPress:this.resendEmail},
                        {text:'Ok', style:'cancel'}
                    ]
                )
            }else{
                Alert.alert(
                    result.message,
                    'Sorry, your entered information is incorrect. Please try again or create a new account.',
                    [
                        {text:'Create A New Account', onPress:()=>{this.props.navigation.navigate('Signup')}},
                        {text:'Try Again', style:'cancel'}
                    ]
                )
            }
            this.setState({isLoggingin:false});
        }).catch(err=>{
            this.setState({isLoggingin:false});
            Alert.alert(
                'Error',
                err.message,
                [
                    {text:'Ok', style:'cancel'}
                ]
            )
        });
    }

    validateFields = ()=>{
        let isValid = true;
        if(!this.state.username){
            this.setState({usernameError:"Enter user name or email"});
            isValid = false;
        }else{
            this.setState({usernameError:""});
        }
        if(!this.state.password.length){
            this.setState({passwordError:"Enter password"});
            isValid = false;
        }else{
            this.setState({passwordError:""});
        }
        return isValid;
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../../assets/images/icon.png')}
                        style={styles.logo}
                    />
                    <Text style={styles.title}>SFCC Game</Text>
                    {this.state.isLoggingin?(<ActivityIndicator color="#FFF" size="large"></ActivityIndicator>):null}
                </View>
                <KeyboardAvoidingView behavior="padding" style={styles.form}>
                    <TextField
                        placeholder="Username or Email"
                        returnKeyType="next"
                        ref={field=>this.usernameInput = field}
                        onSubmitEditing={()=>this.passwordInput.textInput.focus()}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        onChangeText={username=>this.setState({username})}
                        error={this.state.usernameError}
                    />
                    <TextField
                        placeholder="Password"
                        secureTextEntry={true}
                        returnKeyType="go"
                        ref={field=>this.passwordInput = field}
                        onSubmitEditing={()=>this.loginButton.props.onPress()}
                        onChangeText={password=>this.setState({password})}
                        error={this.state.passwordError}
                    />
                    <TouchableOpacity 
                        style={styles.buttonContainer} 
                        ref={button=>this.loginButton = button}
                        onPress={this.tryLogin}
                        >
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.buttonContainer} 
                        ref={button=>this.signupButton = button}
                        onPress={()=>this.props.navigation.navigate('Signup')}
                        >
                        <Text style={styles.buttonText}>Create Account</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#74b9ff',
    },
    logoContainer:{
        alignItems: 'center',
        flexGrow: 1,
        justifyContent:'center'
    },
    logo:{
        height:100,
        width:100,
    },
    title:{
        color:'#FFF',
        marginTop: 10,
    },
    form:{
        padding:20,
        marginBottom: 20,
    },
    buttonContainer:{
        backgroundColor: '#0984e3',
        paddingVertical: 15,
        marginBottom:10,
    },
    buttonText:{
        textAlign:'center',
        color:'#FFF',
        fontWeight: '700',
    }
})


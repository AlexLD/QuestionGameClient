import React, { Component } from 'react';
import { View, Text, ActivityIndicator, StatusBar, AsyncStorage } from 'react-native';

export default class AuthLoading extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    
  }

  componentWillMount(){
      this._bootstrapAsync();
  }
  _bootstrapAsync = async ()=>{
      const jwt = await AsyncStorage.getItem('jwt');
      this.props.navigation.navigate(jwt? 'Main':'Login')
  }

  render() {
    return (
      <View style={{flex:1, flexDirection:'column', justifyContent:'center'}}>
        <ActivityIndicator/>
        <StatusBar barStyle='default'/>
      </View>
    );
  }
}

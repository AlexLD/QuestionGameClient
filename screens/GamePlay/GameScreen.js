import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default class GameScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{flex:1, flexDirection:'column'}}>
        <TouchableOpacity style={[styles.fatBtn, styles.startBtn]} onPress={()=>this.props.navigation.navigate('StartGame')}>
            <Text style={styles.text}>Start Game</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.fatBtn, styles.joinBtn]} onPress={()=>this.props.navigation.navigate('JoinGame')}>
            <Text style={styles.text}>Join Game</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  fatBtn:{
    flex:1,  
    alignItems:'center', 
    justifyContent: 'center'
  },
  startBtn:{
    backgroundColor:'#74b9ff',
  },
  joinBtn:{
    backgroundColor:'#81ecec'
  },
  text:{
    fontWeight:'bold', 
    fontSize:20, 
    color:'#2d3436'
  }
})

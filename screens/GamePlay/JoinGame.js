import React, { Component } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, StatusBar, Alert, Platform } from 'react-native';
import { Container, Header, Body, Content, Right, Icon } from 'native-base';
import { connect } from 'react-redux';
import { startGame, startSocket, joinGame} from '../../actions/gamePlayActions';
import TextField from '../../components/TextField';

class JoinGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      joinSession: "",
      joinError: "",
    }
    if(!this.props.gameService && this.props.joined){
      this.props.startSocket(this.props.gameSession);
    }
  }

  _startGame = () => {
    Alert.alert(
      "Start Play", 
      "Additional players won't be able to join once started.",
      [
        {text: 'Start', onPress: ()=>{this.props.startGame(this.props.gameSession)}},
        {text: 'Cancel', style:'cancel'}
      ]
    );
  }

  _joinGame = () => {
    console.log(this.props.joined);
    console.log(this.state.joinSession);
    console.log(this.props.gameSession);
    if (!this.props.joined) {
      if(this.props.gameSession){
        console.log("game ser")
        this.props.joinGame(this.props.gameSession).catch(()=>{
          this.setState({joinError: "Join failed"});
        });;
      }else if(this.state.joinSession){
        console.log("state ses")
        this.props.joinGame(this.state.joinSession).catch(()=>{
          this.setState({joinError: "Join failed"});
        });
      }
    }
  }

  _exitGame = ()=>{
    this.props.gameService.socket.emit('message','a random message');
  }

  _renderJoinGame = () => {
    return (
    <Container style={styles.container}>
        <Header style={{ backgroundColor: '#0984e3', paddingTop: StatusBar.currentHeight, height: 80 }}>
          <Body>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Join Game</Text>
          </Body>
        </Header>
        <Content style={styles.content}>
          <View style={{ alignItems: 'center' }}>
            <Image
              source={require('../../assets/images/robot-dev.png')}
              style={styles.logo}
            />
          </View>
          <TextField
            style={styles.textInput}
            placeholderTextColor='#2d3436'
            placeholder="Enter game session code"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={value=>this.setState({joinSession: value})}
            error={this.state.joinError}/>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={this._joinGame}>
            <Text style={styles.buttonText}>Join Game</Text>
          </TouchableOpacity>
        </Content>
      </Container>
    )
  }

  _renderGameControl = ()=>{
    return (
      <View>
        {this.props.gameSessionStarted ? (      //if my game session has already started => only option is to leave game
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={this._exitGame}>
              <Text style={styles.buttonText}>Exit Game</Text>
            </TouchableOpacity>
          ) : (                                 //game hasn't started yet
              <View>

                {this.props.isCreatorOfGame ? (     //if i'm the creator of the game => either join game or start game
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', paddingVertical: 10 }}>Game Session Code: {this.props.gameSession}</Text>
                    <Text style={{ color: '#7f8c8d' }}>
                      {this.props.joined?"Wait for all players to join the game, then press Start Play":"Click Join Game to join"}
                    </Text>
                  </View>
                  ) : null}
                {this.props.joined?(                     //if I have already joined the game and is creator of game=> start game
                  this.props.isCreatorOfGame?( 
                    <TouchableOpacity
                      style={styles.buttonContainer}
                      onPress={this._startGame}>
                      <Text style={styles.buttonText}>Start Play</Text>
                    </TouchableOpacity>
                  ):null
                ):(                                       //haven't joined the game => join game
                  <TouchableOpacity
                    style={styles.buttonContainer}
                    onPress={this._joinGame}>
                    <Text style={styles.buttonText}>Join Game</Text>
                  </TouchableOpacity>
                )}
                {this.props.isCreatorOfGame ? (     //if i'm the creator => I can cancel the game
                  <TouchableOpacity
                    style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>Cancel Game</Text>
                  </TouchableOpacity>
                ):null}
              </View>

            )}
      </View>
    )
  }
  _renderGame = () => {
    return (
      <Container style={styles.container}>
        <Header style={{ backgroundColor: '#0984e3', paddingTop: StatusBar.currentHeight, height: 80 }}>
          <Body>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Players: {Object.keys(this.props.players).length}</Text>
          </Body>
          <Right>
            <TouchableOpacity style={{width:40}} onPress={()=>this.props.navigation.navigate('PlayersScreen')}>
              <Icon name={Platform.OS==='ios'?'ios-more':'md-more'} style={{color:"#FFFFFF", alignSelf: 'center',}}/>
            </TouchableOpacity>
          </Right>
        </Header>
        <Content style={styles.content}>
          <View style={{ alignItems: 'center' }}>
            <Image
              source={require('../../assets/images/robot-dev.png')}
              style={styles.logo}
            />
          </View>
          {this._renderGameControl()}
        </Content>
      </Container>
    )
  }

  render() {
    if (this.props.gameSession) {
      return this._renderGame();
    } else {
      return this._renderJoinGame();
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    padding: 10,
  },
  buttonContainer: {
    backgroundColor: '#0984e3',
    paddingVertical: 15,
    marginTop: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: '#FFF',
    fontWeight: '700',
  },
  textInput: {
    backgroundColor: '#dfe6e9',
    color: '#2d3436',
    height:40,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  logo: {
    margin: 10,
    height: 100,
    width: 100
  }
});

const mapStateToProps = (state, ownProps) => ({
  gameSession: state.startGameReducer.gameSession,
  isCreatorOfGame: state.startGameReducer.isCreatorOfGame,
  gameSessionStarted: state.startGameReducer.gameSessionStarted,
  joined: state.startGameReducer.joined,
  gameService: state.startGameReducer.gameServerSocket,
  players: state.startGameReducer.players,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  startGame: (gameSession) => dispatch(startGame(gameSession)),
  startSocket: (gameSession)=> dispatch(startSocket(gameSession)),
  joinGame: (gameSession) => dispatch(joinGame(gameSession)),
})

export default connect(mapStateToProps, mapDispatchToProps)(JoinGame);
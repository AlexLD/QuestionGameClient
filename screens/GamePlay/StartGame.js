import React, { Component } from 'react';
import { View, Text, ListView, StatusBar, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { Container, Content, Header, Left, Body, Right, ListItem } from 'native-base';
import { connect } from 'react-redux';
import { loadGames, createGame, joinGame } from '../../actions/gamePlayActions';

class StartGame extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this._loadGames();
    }

    _loadGames = () => {
        this.props.loadGames();
    }

    _onGameSelected = (game) => {
        this.props.createGame(game._id);
    }

    _joinGame = () => {
        if (!this.props.joined) {
            this.props.joinGame(this.props.gameSession).then(()=>{
                this.props.navigation.navigate('JoinGame');
            }).catch(()=>{
                console.log("failed to join");
            });
        }else{
            this.props.navigation.navigate('JoinGame');
        }
    }

    _renderRow = (game) => {
        return (
            <ListItem style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }} onPress={() => this._onGameSelected(game)}>
                <Text>{game.title}</Text>
            </ListItem>
        )
    }

    _renderPickGame = () => {
        return (
            <Container>
                <Header style={{ backgroundColor: '#0984e3', paddingTop: StatusBar.currentHeight, height: 80 }}>
                    <Body>
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Pick a game</Text>
                    </Body>
                </Header>
                <Content style={styles.content}>
                    {this.props.isLoading ? (
                        <ActivityIndicator size="large" />
                    ) : null}
                    <ListView
                        enableEmptySections={true}
                        dataSource={this.props.dataSource}
                        renderRow={this._renderRow}
                    />
                </Content>
            </Container>
        )
    }

    _renderStartGame = () => {
        return (
            <Container>
                <Header style={{ backgroundColor: '#0984e3', paddingTop: StatusBar.currentHeight, height: 80 }}>
                    <Body>
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Use game session code to join</Text>
                    </Body>
                </Header>
                <Content style={styles.content}>
                    <View>
                        <View style={{ alignItems: 'center' }}>
                            <Image
                                source={require('../../assets/images/robot-dev.png')}
                                style={styles.logo}
                            />
                            <Text style={{ fontSize: 18, fontWeight: 'bold', paddingVertical: 10 }}>{this.props.gameSession}</Text>
                            <Text style={{ textAlign: 'center', color: '#7f8c8d' }}>
                                {this.props.gameSessionStarted ? "Game already started." : (
                                    this.props.joined ? "Already joined game." : "Click Join Game to join."
                                    ) + "Other players join the game with the session code above."}
                            </Text>
                        </View>
                        {this.props.gameSessionStarted ? (
                            <TouchableOpacity
                                style={styles.buttonContainer}
                                onPress={this._joinGame}
                            >
                                <Text style={styles.buttonText}>{this.props.joined ? "Return to Game" : "Too Late to the Game"}</Text>
                            </TouchableOpacity>
                        ) : (
                                <TouchableOpacity
                                    style={styles.buttonContainer}
                                    onPress={this._joinGame}
                                >
                                    <Text style={styles.buttonText}>{this.props.joined ? "Play Game" : "Join Game"}</Text>
                                </TouchableOpacity>
                            )}
                    </View>
                </Content>
            </Container>
        )
    }
    render() {
        if (this.props.gameSession) {
            return this._renderStartGame();
        } else {
            return this._renderPickGame();
        }
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
        backgroundColor: '#fff',
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
    clickContainer: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        margin: 10,
        height: 100,
        width: 100
    }
});

const mapStateToProps = (state, ownProps) => ({
    isLoading: state.startGameReducer.isLoading,
    dataSource: state.startGameReducer.dataSource,
    gameSession: state.startGameReducer.gameSession,
    gameSessionStarted: state.startGameReducer.gameSessionStarted,
    joined: state.startGameReducer.joined,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
    loadGames: () => dispatch(loadGames()),
    createGame: (gameId) => dispatch(createGame(gameId)),
    joinGame: (gameSession) => dispatch(joinGame(gameSession)),
})

export default connect(mapStateToProps, mapDispatchToProps)(StartGame);
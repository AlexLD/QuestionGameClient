import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StatusBar, StyleSheet, Platform } from 'react-native';
import { Container, Header, Left, Body, Right, Icon, Content, List, ListItem} from 'native-base';
import { connect } from 'react-redux';

class PlayersScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <Container style={styles.container}>
            <Header style={{flexDirection:'row', backgroundColor: '#0984e3', paddingTop: StatusBar.currentHeight, height: 80 }}>
                <Left style={{flex: 1}}>
                    <TouchableOpacity style={{width:40, height:40, justifyContent:'center'}} onPress={()=>this.props.navigation.goBack()}>
                        <Icon name={Platform.OS==='ios'?'ios-arrow-back':'md-arrow-back'} style={{color:"#FFFFFF"}}/>
                    </TouchableOpacity>
                </Left>
                <Body style={{flex: 6}}>
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Current Players</Text>
                </Body>
            </Header>
            <Content>
                <List>
                    {Object.keys(this.props.players).map(key=>{
                        return (
                            <ListItem key={key}>
                                <Text>
                                    {this.props.players[key]}
                                </Text>
                            </ListItem>
                        )
                    })}
                </List>
            </Content>
        </Container>
    );
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
})

const mapStateToProps = (state, ownProps) =>({
    players: state.startGameReducer.players,
})
export default connect(mapStateToProps)(PlayersScreen);
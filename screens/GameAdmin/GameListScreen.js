import React, { Component } from 'react';
import { ScrollView, View, StatusBar, Text, StyleSheet, ListView, RefreshControl, Platform, TouchableOpacity, TouchableHighlight } from 'react-native';
import { ListItem, Icon, Header, Container, Content, Left, Body, Right } from 'native-base';
import { load_games } from '../../server/loadContent';

export default class GameListScreen extends Component {
    constructor(props){
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: (r1,r2)=>r1!==r2});
        this.state = {
            isLoading: false,
            dataSource:this.ds.cloneWithRows([]),
        }
    }

    componentDidMount(){
        this._loadGames();
    }

    _loadGames = ()=>{
        this.setState({isLoading:true});
        load_games().then(results=>{
            if(results.success && results.games){
                this.setState({dataSource: this.ds.cloneWithRows(results.games)});
            }
            this.setState({isLoading:false});
        }).catch(err=>{
            console.log(err);
            this.setState({isLoading:false});
        })
    }

    _refresh = ()=>{
        this._loadGames();
    }

    _editGame = (game)=>{
        this.props.navigation.navigate('QuestionList',{newGame: false, game: game});
    }

    _newGame = ()=>{
        this.props.navigation.navigate('QuestionList',{newGame: true})
    }

    _renderRow = (game)=>{
        return (
            
            <ListItem style={{flex:1, flexDirection:'row', justifyContent:'space-between'}}>
                <Text>{game.title}</Text>
                <TouchableHighlight style={styles.clickContainer} onPress={()=>this._editGame(game)}>
                    <Text style={{color:'#0984e3'}}>Edit</Text>
                </TouchableHighlight>
            </ListItem>
        )
    }

    render() {
        return (
            <Container>
                <Header style={{backgroundColor:'#FFF', paddingTop: StatusBar.currentHeight, height: 80}}>
                    <Body>
                        <Text>Manage Games</Text>
                    </Body>
                </Header>
                <ScrollView>
                    <TouchableOpacity style={styles.buttonContainer} onPress={this._newGame}>
                        <Text style={styles.buttonText}>Add new game</Text>
                    </TouchableOpacity>
                    <ListView style={styles.container}
                        refreshControl={
                        <RefreshControl
                            refreshing = {this.state.isLoading}
                            onRefresh = {this._refresh}
                        />
                        }
                        enableEmptySections={true}
                        dataSource={this.state.dataSource}
                        renderRow={this._renderRow}
                    />
                </ScrollView>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
        backgroundColor: '#fff',
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
    },
    clickContainer:{
        width:50, 
        height:50, 
        alignItems:'center', 
        justifyContent:'center'
    }
});


import React, { Component } from 'react';
import { ScrollView, Label, View, Text, StyleSheet, StatusBar, TextInput, ListView, RefreshControl, Platform, TouchableOpacity } from 'react-native';
import { ListItem, List, Icon, Container, Header, Left, Body, Right } from 'native-base';
import QuestionEditCard from './QuestionEditCard';
import { saveGame, saveQuestion, deleteQuestion } from '../../server/saveContent';
import { load_questions } from '../../server/loadContent';

export default class QuestionListScreen extends Component {
    constructor(props){
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: (r1,r2)=>r1!==r2});
        this.state = {
            newGame: false,
            game: {},
            dataSource: this.ds.cloneWithRows([]), 
            isLoading:false,
            questions: [],
            editGameTitle: false,
            gameTitle: '',
            addNewQuestion: false,
        };
        this.textInputRefs = [];
    }

    componentWillMount(){
        const {navigation} = this.props;
        if(navigation.getParam('newGame')){
            this.setState({newGame: true});
            this.setState({editGameTitle: true});
        }else{
            const game = navigation.getParam('game');
            this.setState({game: game});
            this.setState({gameTitle: game.title});
            this._loadQuestions(game._id);
        }
    }

    //save game title change
    _nameGame = ()=>{
        let obj = {...this.state.game};
        obj.title = this.state.gameTitle;
        this.setState({game: obj},()=>{
            saveGame(this.state.game).then(result=>{
                console.log(result);
            }).catch(err=>{
                console.log(err);
            })
        });
        
        this.setState({editGameTitle:false})  //close the game title change dialog
    }

    //update header to reflect game title change
    _changeGameTitle =(text)=>{
        this.setState({gameTitle: text});
    }

    _loadQuestions = (game)=>{
        this.setState({isLoading:true});
        load_questions(game).then(result=>{
            if(result.success && result.questions){
                this.setState({questions:result.questions, dataSource: this.ds.cloneWithRows(result.questions)});
            }
            this.setState({isLoading:false});
        }).catch(err=>{
            console.log(err);
            this.setState({isLoading:false});
        })
    }

    _refresh = ()=>{
        this.load_questions();
    }

    _editQuestion = (rowID)=>{
        //this.props.navigation.navigate('QuestionEdit',{newQuestion: false, question: question});
        let newQuestions = this.state.questions;
        newQuestions[rowID].editable = !newQuestions[rowID].editable;
        this.setState({questions: newQuestions, dataSource: this.ds.cloneWithRows(newQuestions)});
    }

    //save new question or update existing question
    _saveQuestion = (question, rowID)=>{
        let array = [...this.state.questions];
        if(rowID){   //updating existing question
            array[rowID].editable = false;
        }else{      //adding new question
            array.push({
                content: question.content,
                editable: false
            });
            this.setState({addNewQuestion:false});
        }
        saveQuestion(question, this.state.game._id);
        this.setState({questions: array, dataSource: this.ds.cloneWithRows(array)});
    }

    _deleteQuestion = (question, rowID)=>{
        if(question._id && rowID){  //delete question
            let array = [...this.state.questions];
            array.splice(rowID,1);
            deleteQuestion(question);
            this.setState({questions: array, dataSource: this.ds.cloneWithRows(array)});
        }else{                     //cancel new question
            this.setState({addNewQuestion: false});
        }
    }

    _renderRow = (question, sectionID, rowID)=>{
        return (
            <ListItem style={{flex:1, flexDirection:'column', alignItems:'stretch'}}>
                <View style={{flex:1, flexDirection:'row', justifyContent: 'space-between', alignContent:'center'}}>
                    <Text style={{textAlignVertical:'center', flex:5}}>{question.content}</Text>
                    <TouchableOpacity style={[styles.clickContainer, {flex:1}]} onPress={()=>this._editQuestion(rowID)}>
                        {question.editable?(
                                <Icon name={Platform.OS==='ios'?'ios-arrow-dropleft':'md-arrow-dropleft'}/>
                            ):(
                                <Icon name={Platform.OS==='ios'?'ios-arrow-dropdown':'md-arrow-dropdown'}/>
                            )}
                    </TouchableOpacity>
                </View>
                {question.editable?(
                    <QuestionEditCard 
                        question={question}
                        rowID={rowID}
                        saveQuestion={(question, row)=>this._saveQuestion(question, row)}
                        deleteQuestion={(question, row)=> this._deleteQuestion(question, row)}
                    />
                ):null}
            </ListItem>
        )
    }

    render() {
        return (
            <Container>
                <Header style={{backgroundColor:'#FFF', paddingTop: StatusBar.currentHeight, height: 80}}>
                    <Left>
                        <TouchableOpacity style={styles.clickContainer} onPress={()=>this.props.navigation.goBack()}>
                            <Icon name='md-arrow-back'/>
                        </TouchableOpacity>
                    </Left>
                    <Body>
                        <Text>{this.state.game.title? this.state.game.title: 'New Game'}</Text>
                    </Body>
                    <Right>
                        <TouchableOpacity style={styles.clickContainer}  onPress={()=>this.setState({editGameTitle: !this.state.editGameTitle})}>
                            {this.state.editGameTitle?(
                                <Icon name={Platform.OS==='ios'?'ios-arrow-dropleft':'md-arrow-dropleft'}/>
                            ):(
                                <Icon name={Platform.OS==='ios'?'ios-arrow-dropdown':'md-arrow-dropdown'}/>
                            )}
                        </TouchableOpacity>
                    </Right>
                </Header>
                <View style={styles.container}>
                    {this.state.editGameTitle? (
                        <View >
                            <TextInput value={this.state.gameTitle} onChangeText={(text)=>this._changeGameTitle(text)} style={{fontSize:20}} placeholder="Enter a game name" underlineColorAndroid='transparent'></TextInput>
                            <TouchableOpacity style={{backgroundColor:'#0984e3', width:80, paddingVertical: 10, margin:20, alignSelf:'flex-end'}} onPress={this._nameGame}>
                                <Text style={styles.buttonText}>Done</Text>
                            </TouchableOpacity>
                        </View>) : null}
                    {this.state.game.title? (
                        <ScrollView>
                            <TouchableOpacity style={styles.buttonContainer} onPress={()=>this.setState(prev=>({addNewQuestion: !prev.addNewQuestion}))}>
                                <Text style={styles.buttonText}>Add new question</Text>
                            </TouchableOpacity>
                            {this.state.addNewQuestion?(
                                <QuestionEditCard
                                    question={
                                        {
                                            content: ''
                                        }
                                    }
                                    saveQuestion={(question)=>this._saveQuestion(question)}
                                    deleteQuestion={(question)=>this._deleteQuestion(question)}
                                />
                            ):null}
                            <ListView
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
                    ):null}
                </View>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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


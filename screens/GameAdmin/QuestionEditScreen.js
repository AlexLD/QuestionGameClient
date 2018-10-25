import React, { Component } from 'react';
import { View, Text, ListView, TextInput, ScrollView, StatusBar, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { Card, Icon, Textarea, CardItem, Body, Left, Right, Container, Header } from 'native-base';

export default class GameEditScreen extends Component {
    static navigationOptions = ({navigation}) => {
        const params = navigation.state.params;
        return {
            title: params.newQuestion? "New Question" : `Edit Question (${params.question.title})`
        }
    };
    constructor(props) {
        super(props);
        this.state = {
            newQuestion: false,
            question: {
                text: "",
                editable: false,
            }
        };
    }

    componentWillMount(){
        const {navigation} = this.props;
        if(navigation.getParam('newQuestion')){
            this.setState({newQuestion: true});
        }else{
            const question = navigation.getParam('question');
            this.setState({question: question});
            this._loadQuestion();
        }
    }

    _loadQuestion = ()=>{
        let question = {
            text: 'this is a question',
            editable: false
        }
        this.setState({question: question});
    }

    _updateQuestion = (text)=>{
        let question = this.state.question;
        question.text = text,
        this.setState({question: question})
    }

    _changeEditStatus = (editable)=>{
        let question = this.state.question;
        this.setState({question: {
            text:question.text,
            editable: editable,
        }})
        if(editable) this.textRef.focus();
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
                        <Text>{this.state.newQuestion? "New Question" : `Edit Question (${this.props.navigation.getParam('question').title})`}</Text>
                    </Body>
                    <Right>
                        <Icon name='md-options'/>
                    </Right>
                </Header>
                <ScrollView>
                    <Card>
                        <CardItem>
                            <Body>
                                <TextInput
                                    multiline={true}
                                    numberOfLines={5} 
                                    underlineColorAndroid="transparent"
                                    style={styles.questionText} 
                                    borderColor={'#CCCCCC'} 
                                    borderWidth={1}
                                    value={this.state.question.text}
                                    onChangeText={text=>this._updateQuestion(text)}
                                    editable={this.state.question.editable}
                                    textAlignVertical={'top'}
                                    ref={(input)=>{this.textRef = input}}
                                />
                            </Body>
                        </CardItem>
                        <CardItem>
                            <Left>
                                {this.state.question.editable?(
                                    <TouchableOpacity style={styles.buttonContainer} onPress={()=>this._changeEditStatus(false)}>
                                        <Text style={styles.buttonText}>Save</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity style={styles.buttonContainer} onPress={()=>this._changeEditStatus(true)}>
                                        <Text style={styles.buttonText}>Edit</Text>
                                    </TouchableOpacity>
                                )}
                                
                                
                            </Left>
                            <Right>
                                <TouchableOpacity style={[styles.buttonContainer, {backgroundColor:'#ff7675'}]} >
                                    <Text style={styles.buttonText}>Delete</Text>
                                </TouchableOpacity>
                            </Right>
                        </CardItem>
                    </Card>
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
        paddingVertical: 10,
        width:60,
    },
    buttonText:{
        textAlign:'center',
        color:'#FFF',
        fontWeight: '700',
    },
    questionText:{
        padding: 4,
        fontSize: 17,
        color: 'rgba(96,100,109, 1)',
        lineHeight: 24,
        alignSelf:'stretch'
    },
    clickContainer:{
        width:50, 
        height:50, 
        alignItems:'center', 
        justifyContent:'center'
    }
});
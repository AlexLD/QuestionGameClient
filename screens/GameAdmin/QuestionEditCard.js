import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Card, CardItem, Body, Left, Right} from 'native-base';

export default class QuestionEditCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
        question: this.props.question,
        rowID: this.props.rowID,
    }
  }

  _updateQuestion =(text)=>{
    let newQuestion = this.state.question;
    newQuestion.content = text;
    this.setState({question:newQuestion});
  }

  _saveQuestion = ()=>{
      this.props.saveQuestion(this.state.question, this.state.rowID);
  }

  _deleteQuestion = ()=>{
      this.props.deleteQuestion(this.state.question, this.state.rowID);
  }

  render() {
    return (
        <Card styles={styles.container}>
            <CardItem>
                <Body>
                    <TextInput
                        multiline={true}
                        numberOfLines={5} 
                        underlineColorAndroid="transparent"
                        style={styles.questionText} 
                        borderColor={'#CCCCCC'} 
                        borderWidth={1}
                        value={this.state.question.content}
                        onChangeText={text=>this._updateQuestion(text)}
                        textAlignVertical={'top'}
                        ref={(input)=>{this.textRef = input}}
                    />
                </Body>
            </CardItem>
            <CardItem>
                <Left>
                    <TouchableOpacity style={styles.buttonContainer} onPress={this._saveQuestion}>
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                </Left>
                <Right>
                    <TouchableOpacity style={[styles.buttonContainer, {backgroundColor:'#ff7675'}]} onPress={this._deleteQuestion} >
                        <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                </Right>
            </CardItem>
        </Card>
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
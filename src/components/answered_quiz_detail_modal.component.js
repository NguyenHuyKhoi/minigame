import React,{Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TextInput 
} from 'react-native'

import {GREEN, WHITE, DARK} from '../utils/palette'
import Button from './button.component'
import HeaderText from './header_text.component'
import gameStore from '../stores/game.store'
import uIStore from '../stores/ui.store'
export default class AnswerQuizDetailModal extends Component{
    render(){
        const quiz=this.props.quiz
        console.log('AnswerQuizDetailModal :',quiz)
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.props.visible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                }}>
                <View style={styles.container}>
                    <View style={styles.modal_view}>
                        <View style={styles.body}>
                            <HeaderText label={'Quiz '+quiz.quiz_index}/>
                            <Text style={styles.text} >
                                {quiz.content}
                            </Text>
                            <Text style={styles.text}>
                                Correct Answer : {quiz.correct_answer}
                            </Text>
                            <Text style={styles.text}>
                                 {quiz.solved_by_user_name!==undefined?
                                    'Answer By :'+quiz.solved_by_user_name
                                    :'( Opened after guessing keyword )'}
                            </Text>

                            <Text style={styles.text}>
                                 {quiz.solved_by_team_name!==undefined?'On Team :'+quiz.solved_by_team_name:''}
                            </Text>

                        </View>
                        <View style={styles.footer}>
                            <Button 
                                custom_width={120}
                                label='Close'
                                onPress={this.props.closeModal}/>

                        </View>
                </View>
                </View>
        </Modal>
        )
    }
}

const styles=StyleSheet.create({

    container: {
        flex:1,
        justifyContent: "center",
        alignItems: "center",
      },
      modal_view: {
        width:'50%',
        height:'60%',
        backgroundColor: WHITE,
        borderRadius: 20,
        padding: 15,
        flexDirection:'column',
        alignItems:'center'
      },
      body:{
        flex:5,
        width:'100%',
        flexDirection:'column',
        alignItems:'center'
      },
      text:{
          fontSize:16,
          color:DARK,
          marginVertical:2
      },

      footer:{
        flex:1,
        flexDirection:'row',
        width:'100%',
        justifyContent:'center',
        alignItems:'center'
    },
})
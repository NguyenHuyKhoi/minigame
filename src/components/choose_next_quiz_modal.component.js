import React,{Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TextInput,
    FlatList,
    Alert,
    TouchableOpacity
} from 'react-native'

import {GREEN, WHITE, GRAY} from '../utils/palette'
import Button from './button.component'
import gameStore from '../stores/game.store'
import RemainTime from './remain_time.component'
import { observer } from 'mobx-react'
import HeaderText from './header_text.component'

class QuizItem extends Component{
    render(){
        console.log(`QuizItem quiz ${this.props.label} ,disable = ${this.props.disabled}`)
        return (
            <TouchableOpacity style={{width:50,height:50,
                backgroundColor:this.props.disabled?GRAY:GREEN,
                borderRadius:10,marginHorizontal:10,marginVertical:5,
                justifyContent:'center',alignItems:'center'}}
                onPress={this.props.onPress}
                disabled={this.props.disabled}
            >
                <Text style={{fontSize:30,color:WHITE}}>{this.props.label}</Text>
            </TouchableOpacity>
        )
    }
}

@observer
export default class ChooseNextQuizModal extends Component{
    onPressRandomQuiz=()=>{
        let quiz=gameStore.pick_random_quiz
        if (!quiz) return ;
        this.props.onPressQuiz(quiz)
    }
    
    render(){
        return (
            <Modal
                animationType="slide"
                transparent={this.props.visible}
                visible={this.props.visible}>
                <View style={styles.container}>
                    <View style={styles.modal_view}>
                        <View style={styles.header}>
                            <Text style={{fontSize:16}} >Please choose next quiz</Text>
                            <RemainTime/>
                        </View>


                        {
                            gameStore && gameStore.current_round?
                            <View style={styles.body}>
                                <FlatList 
                                    style={{margin:10}}
                                    data={this.props.quizzes}
                                    keyExtractor={(item) => item.id}
                                    numColumns={4}
                                    renderItem={({item})=>(
                                        <QuizItem
                                            quiz={item} 
                                            disabled={item.is_picked}
                                            label={item.quiz_index}
                                            onPress={()=>this.props.onPressQuiz(item)}
                                            />
                                    )}/>
                            </View>
                            :null
                        }

                        <View style={styles.footer}>
                            <Button 
                                custom_width={120}
                                label='Random'
                                onPress={()=>this.onPressRandomQuiz()}/>
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
        backgroundColor: WHITE,
        borderRadius: 20,
        padding: 20,
        flexDirection:'column',
        alignItems:'center'
      },
      header:{
          width:'100%',
          flexDirection:'column',
          justifyContent:'center',
          alignItems:'center'
      },
      body:{
        width:'100%',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center'
      },

      footer:{
        flexDirection:'row',
        width:'100%',
        justifyContent:'space-around',
        alignItems:'center'
    },
})
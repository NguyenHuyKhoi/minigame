import React,{Component}from 'react'
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    FlatList
} from 'react-native'


export default class AnswerScreen extends Component{
    render(){
        console.log('current_quiz:',quiz.answers.length);
        quiz.answers.forEach(item=>{
            console.log(item.team_index)
        })
        return (
            <View style={styles.container}>
                <View style={styles.quiz_container}>
                    <Text>{quiz.content}</Text>
                </View>

                <View style={styles.answers_container}>
                    <View style={styles.team_container}>
                        <Text >TeamA</Text>
                        {
                            console.log('length_',quiz.answers.length)
                        }
                        {
                            quiz.answers.forEach(item=>{
                                console.log(item.team_index)
                            })
                        } 
                        {
                            quiz.answers.map(item=>(
                                <Text>{item.team_index===0 ?'TeamA':null}</Text>
                            ))
                        }
                    </View>

                    <View style={styles.team_container}>
                        <Text >TeamB</Text>
                        {
                            quiz.answers.map(item=>(
                                <Text>{item.team_index===1 ?'TeamB':null}</Text>
                            ))
                        }
                    </View>
                </View>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column'
    },
    quiz_container:{
        width:'100%',
        height:80,
        justifyContent:'center',
        alignItems:'center'
    },
    answers_container:{
        flex:1,
        flexDirection:'row'
    },
    team_container:{
        flex:1,
        flexDirection:'column'
    }
})
import React,{Component}from 'react'
import {
    View,
    Text,
    StyleSheet
} from 'react-native'
import HintImageScreen from './hint_image.screen'
import CurrentQuizScreen from './current_quiz.screen'
import AllQuizScreen from './all_quiz.screen'
// import roundStore from '../stores/round.store'

export default class GameScreen extends Component{
    render(){
        console.log('roundStore on gameScene :',roundStore)
        return(
        <View style={styles.container}>
            <View style={styles.col1}>
                    <HintImageScreen style={styles.image}/>
                    <CurrentQuizScreen style={styles.currentQuiz}/>
            </View>
            <AllQuizScreen style={styles.col2}/>

        </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'row'
    },
    col1:{
        flex:1,
        flexDirection:'column'
    },
    image:{
        flex:1
    },
    currentQuiz:{
        flex:1
    },
    col2:{
        flex:1
    }
})
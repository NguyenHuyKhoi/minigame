import React,{Component}from 'react'
import {
    View,
    Text,
    StyleSheet,
    Alert
} from 'react-native'
import HintImageScreen from './hint_image.screen'
import CurrentQuizScreen from './current_quiz.screen'
import AllQuizScreen from './all_quiz.screen'
import fireStoreHelper from '../utils/firestore.helper'
import gameStore from '../stores/game.store'
import userStore from '../stores/user.store'
export default class GameScreen extends Component{
    goToAnswer=()=>{
        Alert.alert('Press Answer')
        this.props.navigation.navigate('answer')
    }

    render(){
        return(
        <View style={styles.container}>
            <View style={styles.col1}>
                    <HintImageScreen style={styles.image}/>
                     <CurrentQuizScreen onPressAnswer={()=>this.goToAnswer()} 
                        style={styles.currentQuiz}/> 

                  
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
        width:'50%',
        flexDirection:'column'
    },
    image:{
        flex:1,
        height:'50%'
    },
    currentQuiz:{
        flex:1,
        height:'50%'
    },
    col2:{
        flex:1,
        width:'50%',
    }
})
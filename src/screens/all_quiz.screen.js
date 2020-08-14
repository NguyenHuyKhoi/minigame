import React,{Component}from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList
} from 'react-native'

import gameStore from '../stores/game.store'
import {observer} from 'mobx-react'

@observer
export default class AllQuizScreen extends Component{

    constructor(props){
        super(props)
    }

    goToAnswer=()=>{
        console.log('GoToAnswer()')
        this.props.navigation.navigate('answer')
    }

    renderQuizzes=()=>{
        return (
            gameStore.current_round.quizzes.map(quiz=>
                <TouchableOpacity style={{marginVertical:10}}
                    onPress={()=>this.goToAnswer()}>
                    <Text >Quiz  {quiz.quiz_index} :
                         {quiz.is_picked ? quiz.is_solved ?quiz.correct_answer :'?????????':'No picked '}</Text>
                </TouchableOpacity>    
            )
        )
    }
    render(){
        return (
            <View style={styles.container}>
                {
                    this.renderQuizzes()
                }
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
        margin:20,
        justifyContent:'center',
        alignItems:'center'
    }
})
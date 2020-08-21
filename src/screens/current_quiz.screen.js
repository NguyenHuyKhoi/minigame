import React,{Component}from 'react'
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    FlatList,
    TouchableOpacity
    
} from 'react-native'
import gameStore from '../stores/game.store'
import userStore from '../stores/user.store'
import answerTimerStore from '../stores/answer_timer.store'
import { observer } from 'mobx-react'
import fireStoreHelper from '../utils/firestore.helper'

@observer
export default class CurrentQuizScreen extends Component{
    constructor(props){
        super(props)
        this.state={
            remaining_answer_time:0
        }
    }

  
    

    
    render(){
        return (
            <View style={styles.container}>
                <View style={{width:'100%',flexDirection:'row',justifyContent:'flex-end'}}>
                    <TouchableOpacity style={{width:100,height:40,borderRadius:10,backgroundColor:'green',justifyContent:'center',alignItems:'center'}}
                        onPress={this.props.onPressAnswer}>
                        <Text>Answer</Text>
                    </TouchableOpacity>
                </View>

                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                 
                    <Text>
                        {
                            !gameStore.is_keyword_answer_time?
                            gameStore.current_quiz.content
                            :'Guess keyword'
                        }
                    </Text>

                    <Text>
                        Remaining Time : {answerTimerStore.remaining_time} s
                    </Text>
                    <Text>
                        Quiz: {gameStore.current_round.current_quiz_index} 
                    </Text>
                    <Text>
                        Round: {gameStore.game.current_round_index} s
                    </Text>
                </View>
                
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
    }
})
import React,{Component}from 'react'
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    TouchableOpacity
    
} from 'react-native'
import gameStore from '../stores/game.store'
import userStore from '../stores/user.store'
import { observer } from 'mobx-react'
import fireStoreHelper from '../utils/firestore.helper'
import { GRAY } from '../utils/palette'
import HeaderText from '../components/header_text.component'
import Button from '../components/button.component'
import RemainTime from '../components/remain_time.component'
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
                 { !gameStore.is_keyword_answer_time?
                    <View style={{position:'absolute',right:10,bottom:10}}>
                        <Button custom_width={100}
                            onPress={this.props.onPressAnswer}
                            disabled={gameStore.is_keyword_answer_time}
                            hight_light={!gameStore.is_keyword_answer_time}
                            label="Answer"/>
                    </View>
                    :null
                }

                <HeaderText label={ !gameStore.is_keyword_answer_time?
                            'Quiz '+gameStore.current_quiz.quiz_index
                            :'Guess keyword'}/>

                <Text style={{fontSize:15,textAlign:'center'}}>
                    { !gameStore.is_keyword_answer_time?
                            gameStore.current_quiz.content
                            :''}
                </Text>

                <RemainTime />
                    {/* <Text>
                        Team A : {gameStore.count_members_can_answer(0)} / {gameStore.count_total_members(0)}
                    </Text>
                    <Text>
                        Team B : {gameStore.count_members_can_answer(1)} / {gameStore.count_total_members(1)}
                    </Text> */}
                
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
        backgroundColor:GRAY,
        alignItems:'center',
        paddingHorizontal:20
    }
})
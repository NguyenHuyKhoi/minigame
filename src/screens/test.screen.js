import React,{Component}from 'react'
import {
    View,
    StyleSheet,
    Alert,
    Text
} from 'react-native'
import fireStoreHelper from '../utils/firestore.helper'
import database from '@react-native-firebase/database'
import storage from '@react-native-firebase/storage'
import {observer} from 'mobx-react'
import gameStore from '../stores/game.store'
import { GRAY } from '../utils/palette'
import Orientation from 'react-native-orientation-locker'
import Button from '../components/button.component'
import KeywordAnswerModal from '../components/keyword_answer_modal.component'
import ChooseNextQuizModal from '../components/choose_next_quiz_modal.component'
import RemainTime from '../components/remain_time.component'

@observer
export default class TestScreen extends Component{

    componentDidMount=async ()=>{
        await fireStoreHelper.findGame({
            game_id:0,
        });
        Alert.alert('Load data successfully')
    }

    render(){
        return (
            <View style={styles.container}>    

                    <RemainTime/>

            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:GRAY
    }
})
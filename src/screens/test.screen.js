import React,{Component}from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
    FlatList
} from 'react-native'
import fireStoreHelper from '../utils/firestore.helper'
import database from '@react-native-firebase/database'
import storage from '@react-native-firebase/storage'
import answerTimerStore from '../stores/answer_timer.store'
import {observer} from 'mobx-react'
import gameStore from '../stores/game.store'

@observer
export default class TestScreen extends Component{
    constructor(props){
        super(props)
    }

    componentDidMount=async()=>{
        fireStoreHelper.listenAnswerTimer()
    }

    render(){
        return (
            <View style={styles.container}>

                <View style={{flexDirection:'row',margin:50}}>
                    <TouchableOpacity style={styles.button}
                        onPress={()=>answerTimerStore.start()}>
                            <Text>Start</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button}
                        onPress={()=>answerTimerStore.stop()}>
                            <Text>Stop</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button}
                        onPress={()=>answerTimerStore.reset()}>
                            <Text>Reset</Text>
                    </TouchableOpacity>
                </View>
              
                <Text>Remaining Time : {answerTimerStore.time} s</Text>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
        alignItems:'center',
    },
    button:{
        marginHorizontal:50,
        width:100,
        height:40,
        borderRadius:10,
        backgroundColor:'green',
        justifyContent:'center',
        alignItems:'center',
        marginHorizontal:10,
    },
})
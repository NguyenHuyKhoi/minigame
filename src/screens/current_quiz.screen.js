import React,{Component}from 'react'
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    FlatList
} from 'react-native'
import gameStore from '../stores/game.store'
import { observer } from 'mobx-react'

@observer
export default class CurrentQuizScreen extends Component{
    render(){
        return (
            <View style={styles.container}>
                <Text>
                    {gameStore.current_quiz.content}
                </Text>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
})
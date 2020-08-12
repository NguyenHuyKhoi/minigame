import React,{Component}from 'react'
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    FlatList
} from 'react-native'

export default class AllQuizScreen extends Component{
    render(){
        return (
            <View style={styles.container}>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'blue',
        justifyContent:'center',
        alignContent:'center'
    }
})
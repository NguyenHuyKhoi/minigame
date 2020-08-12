import React,{Component}from 'react'
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    FlatList
} from 'react-native'
import pushTestData from '../utils/push_test_data.hepler'
import fireStoreHelper from '../utils/firestore.helper'

export default class TestScreen extends Component{
    constructor(props){
        super(props)
        pushTestData.pushAllData();
        fireStoreHelper.gameDataSync({
            game_id:0,
            team_index:0
        })
    }

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
        justifyContent:'center',
        alignContent:'center'
    }
})
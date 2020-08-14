import React,{Component}from 'react'
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    FlatList
} from 'react-native'
import fireStoreHelper from '../utils/firestore.helper'
import database from '@react-native-firebase/database'
export default class TestScreen extends Component{
    constructor(props){
        super(props)
    }

    render(){
        database().ref('/games')
            .on('value',snapshot=>{
                console.log('data_changed :',snapshot.val())
            });

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
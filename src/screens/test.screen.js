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
import storage from '@react-native-firebase/storage'
export default class TestScreen extends Component{
    constructor(props){
        super(props)
    }

    componentDidMount=async()=>{
        const url =await storage().ref('/hint_images/tornado.jpg').getDownloadURL();
        console.log('URL',url)
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
import React,{Component}from 'react'
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    FlatList
} from 'react-native'
import pushTestData from '../utils/push_test_data.hepler'

export default class TestScreen extends Component{
    constructor(props){
        super(props)
        pushTestData.pushAllData();
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
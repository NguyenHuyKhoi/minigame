import React,{Component} from 'react'
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet
} from 'react-native'
import data from '../sample_data/sample_data.json'
import fireStoreHelper from '../utils/firestore.helper';
export default class SetTimeButton extends Component{

   
    render(){
        return (
            <TouchableOpacity style={styles.button} onPress={this.props.setTime}>
                <Text>Set Time</Text>
            </TouchableOpacity>
        )
    }
}

const styles=StyleSheet.create({
    button:{
        width:100,
        height:40,
        borderRadius:10,
        backgroundColor:'green',
        justifyContent:'center',
        alignItems:'center',
        marginHorizontal:10,
    },
})
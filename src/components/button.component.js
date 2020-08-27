import React,{Component} from 'react'
import {
    TouchableOpacity,
    Text,
    StyleSheet
} from 'react-native'
import {GREEN,WHITE,GRAY, DARK} from '../utils/palette'

export default class Button extends Component{
    render(){
        return(
            <TouchableOpacity 
                style={[styles.container,
                     {width:this.props.custom_width!==undefined?this.props.custom_width:'100%'},
                     {backgroundColor:this.props.hight_light!==undefined?
                        this.props.hight_light?GREEN:DARK
                        :GREEN}
                ]} 
                disabled={this.props.disabled!==undefined?this.props.disabled:false}
                onPress={this.props.onPress}>
                <Text style={styles.label}>
                    {this.props.label}
                </Text>
            </TouchableOpacity>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        width:'100%',
        height:40,
        borderRadius:10,
        backgroundColor:GREEN,
        justifyContent:'center',
        alignItems:'center',
    },
    label:{
        fontSize:16,
        color:WHITE,
        textAlign:'center'
    }

})
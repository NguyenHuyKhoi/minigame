import React,{Component} from 'react'
import {
    TouchableOpacity,
    TextInput,
    Image,
    Text,
    StyleSheet
} from 'react-native'
import {WHITE,GRAY, BLACK} from '../utils/palette'

export default class UserInput extends Component{
    render(){
        return(
            <TouchableOpacity style={styles.container} >
                <Image style={styles.icon} source={this.props.icon} />
                {/* <TextInput style={styles.input} 
                    placeholder={this.props.placeholder}
                    placeholderTextColor={BLACK}
                    onChangeText={text=>this.props.onChangeText(text)}/> */}

                <TextInput style={styles.input}
                    placeholder={this.props.placeholder}
                    onChangeText={text=>this.props.onChangeText(text)}
                />
            </TouchableOpacity>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        width:'100%',
        marginBottom:20,
        borderRadius:10,
        backgroundColor:WHITE,
        justifyContent:'center',
        alignItems:'center',
        paddingHorizontal:10,
        flexDirection:'row'
    },
    icon:{
        width:25,
        height:25,
        marginRight:10
    },
    input: {
        flex:1,
        padding:5
     },

})
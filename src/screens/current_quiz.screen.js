import React,{Component}from 'react'
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    FlatList
} from 'react-native'

export default class CurrentQuizScreen extends Component{
    render(){
        return (
            <View style={styles.container}>
                <Text>
                    {/* {this.props.quiz} */}
                    Question 1:...f3 oieghgregh4hg98 h9hhg9 gh984gh43h8h g8h3h4hg8
                </Text>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'green',
        justifyContent:'center',
        alignContent:'center'
    }
})
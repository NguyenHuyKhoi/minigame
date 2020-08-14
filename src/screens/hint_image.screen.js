import React,{Component}from 'react'
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    FlatList
} from 'react-native'

//need pass data :
const data ={
    url:'https://scx2.b-cdn.net/gfx/news/hires/2019/2-nature.jpg',
    size_width:3,
    size_height:3,
    hidden:[0,1,4,5,6]
}

export default class HintImageScreen extends Component{
    render(){
        let arr=[];
        for (let i=0;i<data.size_height*data.size_width;i++) arr.push('visible')
        for (let i of data.hidden) arr[data.hidden[i]]='hidden'
        return (
            <View style={styles.container}>
                <ImageBackground style={styles.image}
                    source={{uri:data.url}}>
                    {arr.map(({item})=>(
                            <View style={{width:600/data.size_width,height:450/data.size_height,
                            backgroundColor:item==='hidden'?'gray':'transparent'}}/>
                        )
                    )}
                </ImageBackground>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        margin:30,
        justifyContent:'center',
        alignItems:'center'
    },
    image:{
        width:400,
        height:250,
        resizeMode:'contain'
    }
})
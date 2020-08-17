import React,{Component}from 'react'
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    FlatList,
    Alert,
    TouchableOpacity
} from 'react-native'

import storage from '@react-native-firebase/storage'
import {observer} from 'mobx-react'
import gameStore from '../stores/game.store'

@observer
export default class HintImageScreen extends Component{


    render(){
        const hint_image=gameStore.current_round.hint_image;
        // console.log('hint_image :',hint_image);

        return (
            <View style={styles.container}>
                {
                    hint_image.url!==null?
                        <ImageBackground style={styles.image}
                            source={{uri:hint_image.url}}>
                            <FlatList
                                data={hint_image.piece_status}   
                                keyExtractor={(item,index)=>index}
                                renderItem={({item,index}) => (
                                    <TouchableOpacity
                                        onPress={()=>{}}
                                        style={{width:300/hint_image.piece_columns,height:200/hint_image.piece_rows,
                                        backgroundColor: (item===0?'gray':'transparent')}}>

                                    </TouchableOpacity>
                     
                                )
                                }
                                key={hint_image.piece_columns}
                                numColumns={hint_image.piece_columns}
                            />
                 
                        </ImageBackground>
                        :
                        null
                }
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
     
        justifyContent:'center',
        alignItems:'center'
    },
    image:{
        width:300,
        height:200,
        resizeMode:'contain'
    }
})
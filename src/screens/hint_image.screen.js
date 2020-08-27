import React,{Component}from 'react'
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    FlatList,
    Alert,
    Image,
    TouchableOpacity,
    Dimensions
} from 'react-native'

import storage from '@react-native-firebase/storage'
import {observer} from 'mobx-react'
import gameStore from '../stores/game.store'
import { GRAY } from '../utils/palette'
import { HIDDEN_IMG } from '../assets'

const image_size={
    //need to fix to resize with multi screens
    width:Dimensions.get('window').width*0.4,
    height:Dimensions.get('window').height*0.4
}
@observer
export default class HintImageScreen extends Component{


    render(){
        const hint_image=gameStore.current_round.hint_image;
        // console.log('hint_image :',hint_image);

        return (
            <View style={styles.container}>
                {
                    hint_image.url!==null?
                        <ImageBackground style={[styles.image,{backgroundColor:'red'}]}
                            source={{uri:hint_image.url}}>
                            <FlatList
                                data={hint_image.piece_status}   
                                keyExtractor={(item,index)=>index}
                                renderItem={({item,index}) => (
                                    <Image
                                        onPress={()=>{}}
                                        source={item===0?HIDDEN_IMG:null}
                                        style={{width:image_size.width/hint_image.piece_rows,
                                        resizeMode:'center',
                                        height:image_size.height/hint_image.piece_columns,
                                        borderWidth:2,
                                        borderColor:GRAY}}>
                                    </Image>
                     
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
        backgroundColor:GRAY,
        justifyContent:'center',
        alignItems:'center'
    },
    image:{
        width:image_size.width,
        height:image_size.height,
        resizeMode:'center'
    }
})
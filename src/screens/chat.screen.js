import React,{Component}from 'react'
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    FlatList,
    TouchableOpacity,
    TextInput,
    Alert,
    ScrollView
} from 'react-native'

import gameStore from '../stores/game.store';
import userStore from '../stores/user.store'
import {observer}from 'mobx-react'
import fireStoreHelper from '../utils/firestore.helper';
import {parseValues} from '../utils/custom_func'

@observer
export default class ChatScreen extends Component{

    constructor(props){
        super(props);
        this.state={
            message :''
        }
    }
    switchChatType=(chat_type)=>{
        console.log('switchChatType :',chat_type)
        gameStore.updateChatType(chat_type)
    }

    updateMessage=(message)=>{
        this.setState({
            message:message
        })
    }
    

    renderMessages=()=>{
        const chat_index=gameStore.user_chat_index;
        console.log('chat_index,',chat_index,gameStore.chat_type);
        const chat=gameStore.game.chats[chat_index]
        console.log('renderMessages :',gameStore.game.chats[chat_index])
        const messages= parseValues(chat.messages);
        return (
            messages!==null?messages.map(message =>
    
                    <View style={[styles.message_container,{backgroundColor:'transparent',alignItems:message.user_id===userStore.user.user_id?'flex-end':'flex-start'}]}>
                        <Text>{message.user_id===userStore.user.user_id?'Me':message.user_name}</Text>
                        <Text>{message.content}</Text>
                    </View>
            
            )
            :null
        )
    }


    
    sendMessage=async ()=>{
        Alert.alert('Send message :',this.state.message);
        if (this.state.message===''){
            Alert.alert('message is empty ');
        }
        else {
           await fireStoreHelper.sendMessage({
                game_id:gameStore.game.game_id,
                chat_index:gameStore.user_chat_index,
                message:this.state.message,
                user:userStore.user
            });

            await this.setState({
                message:''
            })
        }
        
    }

    goToGame=()=>{
        this.props.navigation.navigate('game')
    }

    goToAnswer=()=>{
        this.props.navigation.navigate('answer',{})
    }

    render(){
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.button} onPress={()=>this.switchChatType('team')}>
                        <Text>Team </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={()=>this.switchChatType('all')}>
                        <Text>All </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={()=>this.switchChatType('team')}
                        onPress={()=>{this.goToGame()}}>
                        <Text>Game </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={()=>this.switchChatType('all')}
                         onPress={()=>{this.goToAnswer()}}>
                        <Text>Answer </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.body}>
                    <ScrollView style={{flex:1,padding:10}}>
                        {
                            this.renderMessages()
                        }
                    </ScrollView>
                </View>
           

                    <View style={styles.footer}>
                        <TextInput 
                         style={styles.message_edit}
                         value={this.state.message}
                         onChangeText={(text)=>this.updateMessage(text)} />

                         <TouchableOpacity style={styles.button} 
                            onPress={()=>this.sendMessage()}>
                                <Text>Send</Text>
                         </TouchableOpacity>
                    </View>

            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column'
    },
    header:{
        width:'50%',
        flexDirection:'row',
        alignItems:'center'
    },
    body:{
        flex:1,
        flexDirection:'column',
       
    },
    footer:{
        width:'100%',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
      //  backgroundColor:'red'
    },
    message_edit:{
        flex:8,
        backgroundColor:'gray'
    },
    button:{
        width:100,
        height:40,
        borderRadius:10,
        backgroundColor:'green',
        justifyContent:'center',
        alignItems:'center',
        marginHorizontal:10,
    },
    message_container:{
        marginVertical:10,
        flexDirection:'column'
    }
})
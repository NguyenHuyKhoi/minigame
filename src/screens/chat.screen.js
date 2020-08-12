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
import chatStore from '../stores/chat.store'
import userStore from '../stores/user.store'
import {observer}from 'mobx-react'
import fireStoreHelper from '../utils/firestore.helper';

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
        if (chat_type!==chatStore.chat_type){
            fireStoreHelper.findChat({
                game_id:chatStore.game_id,
                team_index:chat_type==='all'?2:0,
                chat_type:chat_type
            })
        }
    }

    updateMessage=(message)=>{
        this.setState({
            message:message
        })
    }
    

    renderMessages=()=>{
        console.log('chatStore on renderMessages :',chatStore.toString())
        const messages= chatStore.messages;
        return (
            messages!==null?messages.map(message=>
    
                    <View style={[styles.message_container,{backgroundColor:'transparent',alignItems:message.user_id===userStore.user_id?'flex-end':'flex-start'}]}>
                        <Text>{message.user_id===userStore.user_id?'Me':message.user_name}</Text>
                        <Text>{message.content}</Text>
                    </View>
            
            )
            :null
        )
    }


    
    sendMessage=()=>{
        Alert.alert('Send message :',this.state.message);
        if (this.state.message===''){
            Alert.alert('message is empty ');
        }
        else {
    
            fireStoreHelper.sendNewMessage(this.state.message);
        }
        
    }
    render(){
        console.log('current_messages',chatStore.messages)
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.button} onPress={()=>this.switchChatType('team')}>
                        <Text>Team </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={()=>this.switchChatType('all')}>
                        <Text>All </Text>
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
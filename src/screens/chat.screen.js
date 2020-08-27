import React,{Component}from 'react'
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
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
import UserInput from '../components/user_input.component'
import Button from '../components/button.component'
import TextLink from '../components/text_link.component'
import HeaderText from '../components/header_text.component'
import {GRAY} from '../utils/palette'

import { CHAT_IC } from '../assets';
import Message from '../components/message.component';

@observer
export default class ChatScreen extends Component{

    constructor(props){
        super(props);
        this.state={
            message :''
        }
    }
    switchChatType=()=>{
        console.log('switchChatType :',gameStore.chat_type)
        if (gameStore.chat_type==='all') gameStore.updateChatType('team')
            else gameStore.updateChatType('all')
    }

    updateMessage=(message)=>{
        this.setState({
            message:message
        })
    }
    

    renderMessages=()=>{
        const messages= parseValues(gameStore.current_chat.messages);
        return (
            messages!==null?messages.map(message =>
                    <Message
                        on_left={message.user_id!==userStore.user.user_id}
                        chat_type={gameStore.chat_type}
                        message={message}
                        is_me={message.user_id===userStore.user.user_id}
                        is_opposite_team={message.team_index!==undefined && message.team_index!==gameStore.user_team_index}
                        />      
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
                user:userStore.user,
                message_time:(new Date()).toString(),
                team_index:gameStore.user_team_index
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
                <ScrollView style={styles.scroll_view}>
                    <View style={{position:'absolute',left:10,top:0}}>
                        <Button custom_width={100}
                            onPress={()=>this.goToGame()}
                            label="Game"/>
                    </View>

                    <View style={{position:'absolute',right:10,top:0}}>
                        <Button custom_width={100}
                            onPress={()=>this.goToAnswer()}
                            label="Answer"/>
                    </View>

                    <HeaderText label={gameStore.chat_type==='team'?'Chat Team':'Chat all'}/>

                    <View style={{width:'100%',flexDirection:'row',justifyContent:'space-around',marginTop:10}}>
                        <TextLink 
                            font_size={20}
                            label={gameStore.chat_type==='team'?'Switch to Chat All':'Switch to Chat team'}
                            onPressLink={()=>this.switchChatType()}/>
                    </View>

                    <View style={styles.body}>
                            {
                                this.renderMessages()
                            }
                    </View>
                </ScrollView>

                 <View style={styles.footer}>
                        <View style={{flex:1,marginRight:10}}>
                            <UserInput 
                                initial_text={this.state.message}
                                icon={CHAT_IC}
                                placeholder="Enter your message..."
                                onChangeText={(text)=>this.updateMessage(text)} />
                        </View>

                        <Button 
                            custom_width={80}
                            label='Send'
                            onPress={()=>this.sendMessage()}/>
                </View>



        </View>
        ) 
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
        marginTop:10,
        backgroundColor:GRAY
    },
    scroll_view:{
        flex:1,
        flexDirection:'column'
    },
    body:{
        flex:1,
        flexDirection:'column',
       
    },
    footer:{
        width:'100%',
        flexDirection:'row',
        padding:10
      //  backgroundColor:'red'
    }
})
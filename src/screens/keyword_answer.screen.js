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
import { parseValues } from '../utils/custom_func';

@observer
export default class KeywordAnswerScreen extends Component{

    constructor(props){
        super(props);
    }

    
    renderQuiz =()=>{
        return (
            <Text>Please guess keyword</Text>
        )
    }

    renderAnswers=()=>{
        let round=gameStore.current_round
        if (round==null) return null;

        let answers=parseValues(round.keyword.answers);
        return (
            answers!==null?answers.map(answer =>
                    <View style={[styles.answer_container,{backgroundColor:'transparent',alignItems:answer.team_index%2===0?'flex-start':'flex-end'}]}>
                        <Text>{answer.user_id===userStore.user.user_id?'Me':answer.user_name}</Text>
                        <Text>{answer.content}</Text>
                    </View>
            
            )
            :null
        )
    }

    goToChat=()=>{
        this.props.navigation.navigate('chat')
    }

    goToAnswer=()=>{
        this.props.navigation.navigate('answer')
    }

    goToGame=()=>{
        this.props.navigation.navigate('game')
    }
    render(){
       // const params=this.props.navigation.state.params;
        return (
            ///only 2 teams 
            <View style={styles.container}>
              
                <View style={{width:'100%',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                   
                    <View style={{flex:10}}>    
                     {this.renderQuiz()}
                    </View>
                
                    <View style={{flex:2,justifyContent:'center',alignItems:'center',marginHorizontal:5}}>
                       <TouchableOpacity style={styles.button}
                                    onPress={()=>this.goToGame()}>
                            <Text>Game</Text>
                        </TouchableOpacity>
                   </View>
                   
                    <View style={{flex:2,justifyContent:'center',alignItems:'center'}}>
                       <TouchableOpacity style={styles.button}
                                    onPress={()=>this.goToAnswer()}>
                            <Text>Answer</Text>
                        </TouchableOpacity>
                   </View>

                   <View style={{flex:2,justifyContent:'center',alignItems:'center'}}>
                       <TouchableOpacity style={styles.button}
                                    onPress={()=>this.goToChat()}>
                            <Text>Chat</Text>
                        </TouchableOpacity>
                   </View>


        
                </View>
                <View style={{width:'100%',flexDirection:'row'}}>
                   <View style={{flex:5,justifyContent:'center',alignItems:'center'}}>
                       <Text>{gameStore.game.teams[0].team_name}</Text>
                   </View>
                   <View style={{flex:5,justifyContent:'center',alignItems:'center'}}>
                       <Text>{gameStore.game.teams[1].team_name}</Text>
                   </View>

                  
                </View>

                <View style={styles.body}>
                    <ScrollView style={{flex:1,padding:10}}>
                        {
                            this.renderAnswers()
                        }
                    </ScrollView>
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
    answer_edit:{
        flex:8,
        backgroundColor:'gray'
    },
    button:{
        width:80,
        height:40,
        borderRadius:10,
        backgroundColor:'green',
        justifyContent:'center',
        alignItems:'center',
        marginHorizontal:15,
    },
    answer_container:{
        marginVertical:10,
        flexDirection:'column'
    }
})
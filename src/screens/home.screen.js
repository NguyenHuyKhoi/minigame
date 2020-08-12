import React,{Component} from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    FlatList,
    Alert
} from 'react-native'

import sampleRound from '../sample_data/games'
import fireStoreHelper from '../utils/firestore.helper'
import userStore from '../stores/user.store'
import gameStore from '../stores/game.store'
import chatStore from '../stores/chat.store'
import pushTestData from '../utils/push_test_data.hepler'
import {teamAStore,teamBStore} from '../stores/team.store'

class GameItem extends Component{
    render(){
        console.log('item received :',this.props.game)
        return (
            <View style={{width:'100%',height:100,flexDirection:'row',justifyContent:'center',alignContent:'center'}}>
                <View style={{flex:4,flexDirection:'column',justifyContent:'center',alignContent:'center'}}>
                    <Text>Game Id :{this.props.game.game_id}</Text>
                    <Text>Creator Id :{this.props.game.creator_id}</Text>
                    <Text>Rounds :{this.props.game.round_number}</Text>
                </View>

                <View style={{flex:2,justifyContent:'center',alignContent:'center'}}>
                    <TouchableOpacity
                        onPress={this.props.onPress}
                     style={{width:'50%',height:'50%',justifyContent:'center',alignContent:'center'}}>
                        <Text>Join</Text>
                    </TouchableOpacity>
                </View>

            </View>
        )
    }
}

export default class HomeScreen extends Component{
    constructor(props){
        super(props)
        this.state={
            games:[]
        };       

            
        pushTestData.pushAllData();
    }
    componentDidMount=async ()=>{
        var games = await fireStoreHelper.getGamesList();

        this.setState({
            games : games.map(game=>game.data())
        })
    }

    signOut=()=>{
        userStore.updateUser({
            user_name:null,
            password:null
        })
        this.props.navigation.navigate('login');
    }

    joinGame=(game)=>{
        console.log('HomeScreen join game :',game);
        gameStore.updateGame(game);

        fireStoreHelper.findChat({
            game_id:game.game_id,
            team_index:0,
            chat_type:'team'
        });

        fireStoreHelper.findTeam({
            game_id:game.game_id,
            team_index:0
        })
        fireStoreHelper.findTeam({
            game_id:game.game_id,
            team_index:1
        })

        fireStoreHelper.findRound({
            game_id:game.game_id,
            round_index:game.current_round_index
        })

       this.props.navigation.navigate('choose_team')

    }
    render(){
        return (
            <View style={{flex:1}}>
                <TouchableOpacity style={{width:100,height:40,borderRadius:10,backgroundColor:'green'}}
                    onPress={()=>this.signOut()}>
                    <Text>Sign out</Text>
                </TouchableOpacity>
                <Text>Round List</Text>
                <FlatList 
                    data={this.state.games}
                    keyExtractor={(item) => item.id}
                    extraData={this.state.rounds}
                    renderItem={({item})=>(
                        <GameItem 
                            onPress={()=> {this.joinGame(item)}}
                            game={item}/>
                    )}/>
            </View>
        )
    }
}
import React,{Component} from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    FlatList,
    Alert
} from 'react-native'

import fireStoreHelper from '../utils/firestore.helper'
import userStore from '../stores/user.store'
import gameStore from '../stores/game.store'
import { observer } from 'mobx-react'

class GameItem extends Component{
    render(){
        console.log('item received :',this.props.game)
        return (
            <View style={{width:'100%',height:100,flexDirection:'row',justifyContent:'center',alignContent:'center'}}>
                <View style={{flex:4,flexDirection:'column',justifyContent:'center',alignContent:'center'}}>
                    <Text>Game Id :{this.props.game.game_id}</Text>
                    <Text>Team Number :{this.props.game.team_number}</Text>
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

@observer
export default class HomeScreen extends Component{

    componentDidMount=async ()=>{
        await fireStoreHelper.getGamesList();
    }

    signOut=()=>{
        userStore.updateUser(null)
        this.props.navigation.navigate('login');
    }

    joinGame=(game)=>{
        fireStoreHelper.findGame({
            game_id:game.game_id,
        });
        
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
                    data={gameStore.game_list}
                    keyExtractor={(item) => item.id}
                    renderItem={({item})=>(
                        <GameItem 
                            onPress={()=> {this.joinGame(item)}}
                            game={item}/>
                    )}/>
            </View>
        )
    }
}
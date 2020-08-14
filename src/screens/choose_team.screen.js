import React,{Component} from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Alert,
    FlatList
} from 'react-native'

import Orientation from 'react-native-orientation-locker';
import {observer} from 'mobx-react'
import userStore from '../stores/user.store';
import gameStore from '../stores/game.store'

import fireStoreHelper from '../utils/firestore.helper';


class Detail extends Component{
    render(){
        return (
            <Text>hello</Text>
        )
    }
}
class TeamDetail extends Component{
    render(){
        const team=this.props.team;
        console.log('team detail receiver :',team)
        return (
            <View style={{flex:1,flexDirection:'column'}}>
                <View style={{height:50,width:'100%',justifyContent:'center',alignItems:'center'}}>
                    <Text onPress={this.props.chooseTeam}>{team.team_name}</Text>
                </View>
                <FlatList 
                    data={team.members}
                    keyExtractor={(item)=>item.id}
                    renderItem={({item,index})=>(
                        <View style={{height:40,flexDirection:'row',justifyContent:'space-around',
                                backgroundColor:userStore.user!==null && 
                                    item.user_id===userStore.user.user_id?'green':'white'}}>
                            <Text>{index+1}</Text>
                            <Text>{item.user_name}</Text>
                        </View>
                    )}

                    keyExtractor={(user)=>user.id}
                />
            </View>
        )
    }
}

@observer
export default class ChooseTeamScreen extends Component{
    constructor(props){
        super(props);
        Orientation.lockToLandscape();
    };

    goToGame=()=>{
        this.props.navigation.navigate('all_quiz')
    }

    chooseTeam=(team)=>{
        console.log('chooseTeam :')
        if (gameStore.user_team_index!==-1){
            Alert.alert('You are in a team')
        }
        else 
        if (gameStore.game.teams[team.team_index].members.length
            < gameStore.game.teams[team.team_index].max_members){
                fireStoreHelper.chooseTeam({
                    game_id:gameStore.game.game_id,
                    team_index:team.team_index,
                    user:userStore.user
                })
            }
        else {
                Alert.alert('Users count reach limit...')
            }

        console.log('members length :',gameStore.game.teams[team.team_index].members.length)
        console.log('max_member :',gameStore.game.teams[team.team_index].max_members)
    }

    render(){

        if (gameStore.game) console.log('gameStore currentGame :',gameStore.game)
        return (
            <View style={{flex:1,flexDirection:'column'}}>

                <View style={{width:'100%',flexDirection:'row',justifyContent:'flex-end'}}>
                    <TouchableOpacity style={{width:80,height:40,justifyContent:'center',borderRadius:10,backgroundColor:'green'}}
                        onPress={()=>this.goToGame()}>
                        <Text>
                            Go to Game
                        </Text>
                    </TouchableOpacity>
                    
                </View>
                {
                    gameStore.game!==null &&
                
                    <View style={{flex:1,flexDirection:'row'}}>    
                        <TeamDetail style={{flex:1}} team={gameStore.game.teams[0]} chooseTeam={()=>this.chooseTeam(gameStore.game.teams[0])}/>
                        <TeamDetail style={{flex:1}} team={gameStore.game.teams[1]} chooseTeam={()=>this.chooseTeam(gameStore.game.teams[1])}/>
                    </View>
                }
            </View>
           

        )
    }
}

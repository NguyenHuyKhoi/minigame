import React,{Component} from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Alert,
    FlatList,
    StyleSheet
} from 'react-native'

import Orientation from 'react-native-orientation-locker';
import {observer} from 'mobx-react'
import userStore from '../stores/user.store';
import gameStore from '../stores/game.store'
import {length} from '../utils/custom_func'
import {GRAY} from '../utils/palette'
import Button from '../components/button.component'
import HeaderText from '../components/header_text.component'
import fireStoreHelper from '../utils/firestore.helper';
import TeamTitle from '../components/team_title.component';
import MemberCell from '../components/member_cell.component'
import RemainTime from '../components/remain_time.component'
import uIStore from '../stores/ui.store';
import RuleModal from '../components/rule_modal.component';

class TeamDetail extends Component{
    render(){
        const team=this.props.team;
        console.log('team detail receiver :',team)
        return (
            <View style={{flex:1,flexDirection:'column',marginTop:10,marginHorizontal:10}}>
                <TeamTitle chooseTeam={this.props.chooseTeam} team={this.props.team} score={this.props.score}/>
                <FlatList 
                    data={team.members}
                    keyExtractor={(item)=>item.id}
                    renderItem={({item,index})=>(
                        <MemberCell index={index} member={item}/>
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
        if (!gameStore.enable_join_game) {
            Alert.alert('Game will start soon ...')
        }
        else {
            this.props.navigation.navigate('game')
        }
    }

   

    chooseTeam=async (team_index)=>{
        if (gameStore.enable_join_game){
            Alert.alert("Game started ,can't choose team anymore")
            return ;
        }
        console.log('chooseTeam :',team_index)
        if (gameStore.user_team_index!==-1){
            Alert.alert('You are in  team '+gameStore.user_team_index)
        }
        else 
        if (length(gameStore.game.teams[team_index].members)
            < gameStore.game.teams[team_index].max_members){
                await fireStoreHelper.chooseTeam({
                    game_id:gameStore.game.game_id,
                    team_index:team_index,
                    user:userStore.user
                })
            }
        else {
                Alert.alert('Members number reached limit...')
            }
        console.log('members length :',length(gameStore.game.teams[team_index].members))
        console.log('max_member :',gameStore.game.teams[team_index].max_members)
    }

    openRuleModal=()=>{
        uIStore.openRuleModal();
    }

    closeRuleModal=()=>{
        uIStore.closeRuleModal();
    }

    render(){
        return (
            <View style={styles.container}>

                <RuleModal 
                    visible={uIStore.rule_modal_open}
                    closeModal={()=>this.closeRuleModal()}/>
                <View style={{position:'absolute',right:10,top:0}}>
                    <Button custom_width={100}
                        onPress={()=>this.goToGame()}
                        label="Game"/>
                </View>

                <View style={{position:'absolute',left:10,top:0}}>
                    <Button custom_width={100}
                        onPress={()=>this.openRuleModal()}
                        label="Rule"/>
                </View>

                <HeaderText label='Teams'/>
                <View style={{width:'100%',justifyContent:'center',alignItems:'center'}} >
                    { 
                        gameStore.is_game_finished?
                        <Text>Game finished</Text>
                        :gameStore.enable_join_game ?
                            <Text>Game started </Text>
                            : <RemainTime/>
                    }
                </View>

                {
                    gameStore.user_team_index===-1 ?
                    <View style={{width:'100%',justifyContent:'center',alignItems:'center'}} >
                            <Text>Press on team name to choose team .</Text>
                    </View>
                    : null
                }
                {
                    gameStore.game!==null &&
                    <View style={{flex:1,flexDirection:'row'}}>    
                        <TeamDetail 
                            style={{flex:1}} 
                            team={gameStore.game.teams[0]} 
                            chooseTeam={()=>this.chooseTeam(gameStore.game.teams[0].team_index)}
                            score={gameStore.score_of_team_0}
                            />
                        <TeamDetail 
                            style={{flex:1}} 
                            team={gameStore.game.teams[1]} 
                            chooseTeam={()=>this.chooseTeam(gameStore.game.teams[1].team_index)}
                            score={gameStore.score_of_team_1}
                            />
                    </View>
                }
            </View>
           

        )
    }
}



const styles=StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
        backgroundColor:GRAY,
        marginTop:10
    },
    round_list:{
        margin:20,
    }
})
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
import answerTimerStore from '../stores/answer_timer.store'
import {length} from '../utils/custom_func'
import {GRAY} from '../utils/palette'
import Button from '../components/button.component'
import HeaderText from '../components/header_text.component'
import fireStoreHelper from '../utils/firestore.helper';
import TeamTitle from '../components/team_title.component';
import MemberCell from '../components/member_cell.component'

class TeamDetail extends Component{
    render(){
        const team=this.props.team;
        console.log('team detail receiver :',team)
        return (
            <View style={{flex:1,flexDirection:'column',marginTop:10,marginHorizontal:10}}>
                <TeamTitle chooseTeam={this.props.chooseTeam} team={this.props.team}/>
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
        this.state={
            enable_start_game:false
        }
        Orientation.lockToLandscape();
    };

    
    goToGame=()=>{
        if (!this.state.enable_start_game) {
            Alert.alert('Not till time to start game ...')
        }
        else {
            this.props.navigation.navigate('game')
        }
    }
    
    checkAnswerTimerSetUp=()=>{
        //start_time === -1  => no one join game and update start time 
        // => first user run till here will init answer timer
        if (gameStore.game.answer_timer.start_time===-1){
            fireStoreHelper.chooseQuiz({
                game_id:gameStore.game.game_id,
                round_index: 0,
                quiz_index:0
            });


            /// set update_by_user_id equal user_id to prevent others init answer timer again
            fireStoreHelper.updateAnswerTimer({
                game_id:gameStore.game.game_id,
                start_time:(new Date()).toString(),
                update_by_user_id:userStore.user.user_id
            })

            //after all other users fail when update , set update_by_user_id === -1 for next answer timer update .
            setTimeout(()=>{
                fireStoreHelper.resetUpdateByUserIdValue({
                    game_id:gameStore.game.game_id,
                    update_by_user_id:-1
                })
            },3000)
        }
    }
    
    componentDidMount=()=>{
        let countDownTimer=setInterval(()=>{
            console.log('gameStoreOnChooseTeam ',gameStore.game)
    
            let date2=new Date(gameStore.game.enable_join_time)
            let time2=date2.getTime()+gameStore.game.choose_team_duration*1000;
            let date1=new Date();
            let time1=date1.getTime();
    
            let second=Math.floor((time2-time1)/1000)

            console.log('time start game :',gameStore.game.enable_join_time)
            console.log('choose team duration :',gameStore.game.choose_team_duration)
            console.log('remaining time ',second)
            if (second<=-5){
                clearInterval(countDownTimer),
                this.setState({
                    enable_start_game:true
                })
            }
            else 
            if (second<=0) 
                {
                    clearInterval(countDownTimer),
                    this.autoChooseTeam();
                    this.checkAnswerTimerSetUp();
                    this.props.navigation.navigate('game')
                    this.setState({
                        enable_start_game:true
                    })
                }
            else 
                {
                    this.setState({
                        remaining_second:second
                    })
                }
        },1000)
    }

    autoChooseTeam=async ()=>{
        if (gameStore.user_team_index===-1){
            console.log('pickRandomTeam :',gameStore.pick_random_team)
            if (gameStore.pick_random_team===-1){
                Alert.alert('all team is full, join as viewer ')
            }
            else {
                await this.chooseTeam(gameStore.pick_random_team)
                Alert.alert('You automatically pick on team :')
            }
        }
        else {
            Alert.alert('you are in team :')
        }
    }

    chooseTeam=async (team_index)=>{
        if (this.state.enable_start_game){
            Alert.alert("Game started ,can't choose team")
            return ;
        }
        console.log('chooseTeam :',team_index)
        if (gameStore.user_team_index!==-1){
            Alert.alert('You are in a team')
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
                Alert.alert('Users count reach limit...')
            }

        console.log('members length :',length(gameStore.game.teams[team_index].members))
        console.log('max_member :',gameStore.game.teams[team_index].max_members)
    }

    render(){

        return (
            <View style={styles.container}>
                <View style={{position:'absolute',right:10,top:0}}>
                    <Button custom_width={100}
                        onPress={()=>this.goToGame()}
                        label="Game"/>
                </View>

                <HeaderText label='Teams'/>
                <View style={{width:'100%',justifyContent:'center',alignItems:'center'}} >
                    { this.state.enable_start_game ?
                        <Text>Game started </Text>
                        :<Text>Game start in :{this.state.remaining_second} s</Text>
                    }
                </View>
                {
                    gameStore.game!==null &&
                    <View style={{flex:1,flexDirection:'row'}}>    
                        <TeamDetail style={{flex:1}} team={gameStore.game.teams[0]} chooseTeam={()=>this.chooseTeam(gameStore.game.teams[0].team_index)}/>
                        <TeamDetail style={{flex:1}} team={gameStore.game.teams[1]} chooseTeam={()=>this.chooseTeam(gameStore.game.teams[1].team_index)}/>
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
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
import {teamAStore,teamBStore} from '../stores/team.store'
import userStore from '../stores/user.store';
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
        console.log('team detail receiver :',this.props.team)
        return (
            <View style={{flex:1,flexDirection:'column'}}>
                <View style={{height:50,width:'100%',justifyContent:'center',alignItems:'center'}}>
                    <Text onPress={this.props.chooseTeam}>{this.props.team.team_name}</Text>
                </View>
                <FlatList 
                    data={this.props.team.members}
                    keyExtractor={(item)=>item.id}
                    renderItem={({item,index})=>(
                        <View style={{height:40,flexDirection:'row',justifyContent:'space-around',
                                backgroundColor:item.user_id===userStore.user_id?'green':'white'}}>
                            <Text>{index+1}</Text>
                            <Text>{item.user_name}</Text>
                        </View>
                    )}

                    keyExtractor={(user)=>{console.log('teamdetail',user)}}
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
            showedAlert:false
        }
        Orientation.lockToLandscape();
    };

    goToGame=()=>{
        this.props.navigation.navigate('game')
    }

    chooseTeam=(team)=>{
        if (teamAStore.isTeamOfUser || teamBStore.isTeamOfUser){
            Alert.alert('You are in a team')
        }
        else 
        if (team.members.length<team.max_member_count){
            fireStoreHelper.chooseTeam(team,userStore)
        }
        else {
            Alert.alert('Users count reach limit...')
        }
    }

    render(){
        console.log('TeamA on choose_team ',teamAStore.toString())
        console.log('TeamB on choose_team ',teamBStore.toString())
        
        if (!this.state.showedAlert){
            Alert.alert(teamAStore.isTeamOfUser?'Your team is Team A'
                : teamBStore.isTeamOfUser?'Your team is team B':
                'Please choose a team');
            this.setState({
                showedAlert:true
            })
        }
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
                 <View style={{flex:1,flexDirection:'row'}}>    
                    <TeamDetail style={{flex:1}} team={teamAStore} chooseTeam={()=>this.chooseTeam(teamAStore)}/>
                    <TeamDetail style={{flex:1}} team={teamBStore} chooseTeam={()=>this.chooseTeam(teamBStore)}/>
                </View>
            </View>
           

        )
    }
}

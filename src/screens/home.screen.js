import React,{Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    FlatList,
    Alert
} from 'react-native'

import fireStoreHelper from '../utils/firestore.helper'
import userStore from '../stores/user.store'
import gameStore from '../stores/game.store'
import SetTimeButton from '../components/set_time.button'
import { observer } from 'mobx-react'


class GameItem extends Component{

    constructor(props){
        super(props);
        this.state={
            remaining_second:0,
            enable_join_game:false
        }
    }

    componentDidMount=()=>{
        let countDownTimer=setInterval(()=>{
            let date2=new Date(this.props.game.enable_join_time);
            let time2=date2.getTime();
            let date1=new Date();
            let time1=date1.getTime();
    
            let second=Math.floor((time2-time1)/1000)
            if (second<=0) 
                {
                    clearInterval(countDownTimer),
                    this.setState({
                        enable_join_game:true
                    })
                }
            else 
                {
                    this.setState({
                        enable_join_game:false,
                        remaining_second:second
                    })
                }
        },1000)
    }

   

    renderTime=(time)=>{
        let date=new Date(time)
        return date.toString();
    }

    render(){
        console.log('item received :',this.props.game)
        return (
            <View style={{width:'100%',height:150,flexDirection:'row',justifyContent:'center',alignContent:'center'}}>
                <View style={{flex:4,flexDirection:'column',justifyContent:'center',alignContent:'center'}}>
                    <Text>Game Id :{this.props.game.game_id}</Text>
                    <Text>Team Number :{this.props.game.team_number}</Text>
                    <Text>Rounds :{this.props.game.round_number}</Text>
                    <Text>Time start :{this.renderTime(this.props.game.enable_join_time)}</Text>
                    {!this.state.enable_join_game ?<Text>Time remaining  :{this.state.remaining_second}</Text> 
                        :null}
                </View>

                <View style={{flex:2,justifyContent:'center',alignContent:'center'}}>
                    <TouchableOpacity
                        onPress={()=>this.props.onPress(this.state.enable_join_game)}
                        style={[styles.button,{backgroundColor:this.state.enable_join_game?'green':'gray'}]}>
                        <Text>Join</Text>
                    </TouchableOpacity>
                </View>

            </View>
        )
    }
}

@observer
export default class HomeScreen extends Component{

    constructor(props){
        super(props)
        this.state={
            refresh :false
        }
    }
    componentDidMount=async ()=>{
        await fireStoreHelper.getGamesList();
    }

    signOut=()=>{
        userStore.updateUser(null)
        this.props.navigation.navigate('login');
    }

    joinGame=async (enable_join,game)=>{
        if (!enable_join){
            Alert.alert('It is not till start time ...')
            return 
        } 
        else {
            await fireStoreHelper.findGame({
                game_id:game.game_id,
            });
            
            this.props.navigation.navigate('choose_team')
        }

    }

    setTime=()=>{
        //get current date 
        let date=new Date();
        let time=date.getTime()+10*1000;
        fireStoreHelper.setTestTime(time);
        this.setState({
            refresh:!this.state.refresh
        })
    }

    render(){
        return (
            <View style={{flex:1}}>

                <View style={{width:'100%',flexDirection:'row',justifyContent:'space-between',alignContent:'center'}}>
                    <TouchableOpacity style={styles.button}
                        onPress={()=>this.signOut()}>
                        <Text>Sign out</Text>
                    </TouchableOpacity>

                    <SetTimeButton setTime={()=>this.setTime()}/>
                </View>
                <Text>Round List</Text>
                <FlatList 
                    data={gameStore.game_list}
                    keyExtractor={(item) => item.id}
                    renderItem={({item})=>(
                        <GameItem 
                            onPress={(enable_join)=> {this.joinGame(enable_join,item)}}
                            game={item}/>
                    )}/>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    button:{
        width:80,
        height:40,
        borderRadius:10,
        backgroundColor:'green',
        justifyContent:'center',
        alignItems:'center',
        marginHorizontal:15,
    
}
})
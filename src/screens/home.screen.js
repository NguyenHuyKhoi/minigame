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
import Button from '../components/button.component'
import fireStoreHelper from '../utils/firestore.helper'
import userStore from '../stores/user.store'
import gameStore from '../stores/game.store'
import { observer } from 'mobx-react'
import { GRAY } from '../utils/palette'
import HeaderText from '../components/header_text.component'
import Orientation from 'react-native-orientation-locker'
import GameItem from '../components/game_item.component'

@observer
export default class HomeScreen extends Component{

    constructor(props){
        super(props)
        this.state={
            refresh :false
        }

        Orientation.lockToLandscape();

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
            Alert.alert('It is not till time to join game ...')
            return 
        } 
        else {
            await fireStoreHelper.listenGameChange({
                game_id:game.game_id,
            });

            setTimeout(()=>{
                fireStoreHelper.listenCountdownTimerChange({
                    game_id:game.game_id,
                })
                // fireStoreHelper.listenQuizSolver({
                //     game_id:game.game_id,
                //     round_index:gameStore.game.current_round_index
                // })
                this.props.navigation.navigate('choose_team')
                }
                ,1000);


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
            <View style={styles.container}>
                <View style={{position:'absolute',right:20,top:0}}>
                    <Button custom_width={100}
                        onPress={()=>this.signOut()}
                        label="Sign Out"/>
                </View>
                <HeaderText label='Round List'/>
                <FlatList 
                    data={gameStore.game_list}
                    style={styles.round_list}
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
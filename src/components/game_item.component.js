import React,{Component } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet
} from 'react-native'
import Button from './button.component'
import { WHITE } from '../utils/palette';

export default class GameItem extends Component{
    constructor(props){
        super(props);
        this.state={
            remaining_second:0,
            enable_join_game:false
        }
    }

    componentDidMount=()=>{
        let countDownTimer=setInterval(()=>{
            let date2=new Date(this.props.game.enable_start);
            let time2=date2.getTime();
            let date1=new Date();
            let time1=date1.getTime();
    
            console.log('Date1 on GameItem :',date2);
            console.log('Date2 on GameItem :',date1);
            console.log('Second1 on GameItem :',time2);
            console.log('Second2 on GameItem :',time1);
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
        return (
            <View style={styles.container}>
                <View style={styles.row1}>
                        <Text>Game Id     :   {this.props.game.game_id}</Text>
                    <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                        <Text>Teams        :   {this.props.game.team_number}</Text>
                        <Text>Rounds   :   {this.props.game.round_number}</Text>
                    </View>
                        <Text>Start at       : {this.renderTime(this.props.game.enable_start)}</Text>
                </View>

                <View style={styles.row2}>
                    <Button
                        custom_width={80}
                        onPress={()=>this.props.onPress(this.state.enable_join_game)}
                        hight_light={this.state.enable_join_game}
                        label='Join'>
                    </Button>
                    <Text>
                        {!this.state.enable_join_game ?`Time remaining  : ${this.state.remaining_second} s `
                        : 'Started'}
                    </Text> 
                     
                </View>

            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        width:'100%',
        flexDirection:'row',
        backgroundColor:WHITE,
        borderRadius:10,
        marginBottom:20,
    },
    row1:{
        flex:7,
        flexDirection:'column',
        padding:20,
    },
    row2:{
        flex:3,
        justifyContent:'center',
        alignItems:'center'
    }

})
import React from 'react'
import {
    createStackNavigator
} from 'react-navigation'
import LoginScreen from '../screens/login.screen'
import RegisterScreen from '../screens/register.screen'
import HomeScreen from '../screens/home.screen'
import ChooseTeamScreen from '../screens/choose_team.screen'
import HintImageScreen from '../screens/hint_image.screen'
import CurrentQuizScreen from '../screens/current_quiz.screen'
import GameScreen from '../screens/game.screen'
import AnswerScreen from '../screens/answer.screen'
import ChatScreen from '../screens/chat.screen'
import TestScreen from '../screens/test.screen'
export default MainNavigator =createStackNavigator(
    {
        login:LoginScreen,
        register:RegisterScreen,
        home:HomeScreen,
        choose_team:ChooseTeamScreen,
        hint_image:HintImageScreen,
        current_quiz:CurrentQuizScreen,
        game:GameScreen,
        answer:AnswerScreen,
        chat: ChatScreen,
        test:TestScreen
    },
    {
        initialRouteName:'login',
        headerMode :'none',
        navigationOptions:{
            headerVisible:false
        }
    }
)
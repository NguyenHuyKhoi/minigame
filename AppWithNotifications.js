import React, {Component} from 'react';
import {
  View,
  Text
} from 'react-native';
import {InAppNotificationProvider}from 'react-native-in-app-notification'
import MainNavigator from './src/navigators/main.navigator';
export default class AppWithNotifications extends Component{
    render(){
      return (
        <InAppNotificationProvider>
               <MainNavigator/>
        </InAppNotificationProvider>
     
      )
    }
}

import React, {Component} from 'react';
import {
  View,
  Text
} from 'react-native';

import MainNavigator from './src/navigators/main.navigator';
export default class App extends Component{
    render(){
      return (
        <MainNavigator/>
      )
    }
}

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Image,
  Text, StatusBar,
  ImageBackground,
  Platform
} from 'react-native';
import IIcon from 'react-native-vector-icons/Ionicons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Header } from 'native-base'

import { RATIO, width, height, headerHeight, FONT } from '../utils';

export default class CustomHeader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Header androidStatusBarColor="#000" iosBarStyle="dark-content" style={[styles.container, { height: headerHeight, backgroundColor: '#000' }]}>
        <View style={{ backgroundColor: '#fff', height: '100%', width: width + 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity style={{ width: '15%', height: '100%', alignItems: 'center', justifyContent: 'center' }} onPress={this.props.onLeft}>
            {this.props.left ? <IIcon name={this.props.left} size={18} color="#000" /> : null }
          </TouchableOpacity>
          <View style={{ width: '70%', alignItems: 'center', justifyContent: 'center' }}>
            <Text numberOfLines={1} style={{flexWrap: 'wrap', fontSize: 18, color: '#000' }}>{this.props.center}</Text>
          </View>
          <TouchableOpacity style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }} onPress={this.props.onRight}>
            {this.props.right ? <MCIcon name={this.props.right} size={24 + FONT} color="#000" /> : null }
            {/* <MIcon name={this.props.right} size={24 + FONT} color="#000" /> */}
          </TouchableOpacity>
        </View>
      </Header>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 210,
    },
    shadowOpacity: 10,
    shadowRadius: 100,
    elevation: 30,
    // elevation: 6 / RATIO,
    // shadowColor: '#000',
    // shadowOffset: {width: 6, height: 20 },
    // shadowOpacity: 0.8,
    // shadowRadius: 20 / RATIO,
  },
});

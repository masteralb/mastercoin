import React, { Component } from 'react';
import { StatusBar, View, Text, TouchableHighlight, StyleSheet } from 'react-native';
import { Actions, Scene, Router, Tabs } from 'react-native-router-flux';
import { createIconSet } from 'react-native-vector-icons';

import CryptoList from './app/components/crypto-list.js';
import Favorites from './app/components/favorites.js';
import Notifications from './app/components/notifications.js';
import Settings from './app/components/settings.js';
import Coindetails from './app/components/coin-details.js';

const navigationIcons = {
	Mastercoin	  : '\ue638',
	Favorites	  : '\ue661',
	Portfolio	  : '\ue635',
	Settings	  : '\ue672',
	Search		  : '\ue670',
};

const Icon = createIconSet( navigationIcons, 'anticon' );

const TabIcon = (props) => {
	let color = (props.focused) ? props.activeTintColor : '#6f7277';
	return (
		<Icon name={props.title} size={20} color={color} />
	);
};

const Search = (props) => {
	return (
		<TouchableHighlight>
			<Icon name="Search" size={20} color="#fff" style={{padding: 24}} />
		</TouchableHighlight>	
	);
};

const styles = StyleSheet.create({
	header: {
		backgroundColor: '#12161E', 
		shadowColor: '#000',
		shadowOffset: { 
			width: 0, 
			height: 2 
		},
		shadowOpacity: 0.4,
		shadowRadius: 8, 
		height: 60
	},
	tabBar: {
		backgroundColor: '#12161E', 
		height: 60, 
		padding: 10, 
		shadowColor: '#000',
		shadowOffset: { 
			width: 0, 
			height: 2 
		},
		shadowOpacity: 0.4,
		shadowRadius: 8, 
		elevation: 1
	}
});

const appScene = Actions.create(
	<Scene key="root" navigationBarStyle={styles.header} titleStyle={{color: 'white', fontFamily: "IBMPlexSans-Light"}}>
		<Scene key="app" tabs  tabBarPosition={'bottom'}  swipeEnabled={true} tabBarStyle={styles.tabBar} activeTintColor={'#07e2ff'}>
			<Scene key="mastercoin" component={CryptoList} showLabel icon={TabIcon} title="Mastercoin" renderRightButton={Search}/>
			<Scene key="favorites" component={Favorites} showLabel icon={TabIcon} title="Favorites"/>
			<Scene key="portfolio" component={Notifications} icon={TabIcon} showLabel title="Portfolio"/>
			<Scene key="settings" component={Settings} icon={TabIcon} showLabel title="Settings"/>
		</Scene>
		<Scene key="coindetails" component={Coindetails} path={"/coin/:id/"} title="Coin Details"/>
	</Scene>
);

export default class App extends Component<{}>{
	render() {
		return <Router scenes={appScene}/>
	}	
}
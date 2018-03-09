import React, { Component } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import CoinChart from './chart.js';

export default class App extends Component<{}> {

	constructor(props) {
		super(props);
    }
    
	render() {
		return (
			<View style={styles.mainView}>
				<CoinChart coin={this.props.id}/>
			</View>
		);
	}	
}

const styles = StyleSheet.create({
    mainView: {
        backgroundColor: '#0D1016', 
        paddingLeft: 4,
        paddingRight: 4, 
        flex: 1,
        height: 220
    },
    mainStats: {
        color: 'white'
    },
    coinLogo: {

    },
    coinName: {

    },
    coinValue: {

    }
});
import React, { Component } from 'react';
import { Platform, StyleSheet, Text,View, FlatList, 
  RefreshControl, Image, StatusBar, TouchableHighlight
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { coinMarketCap } from '../api.js';

const numeral = require('numeral');
const colors = {
  priceUp: '#00FF68',
  priceDown: '#FF0000',
  rowOdd: '#181D26',
  rowEven: '#12161E',
};

export default class App extends Component<{}> {

  constructor(props) {
    super(props);
    this.state = { 
      data: [], 
      page: 0, 
      refreshing: true, 
    };
    this.market = new coinMarketCap;
  }

  getData(){
      this.setState({ refreshing: true });
      this.market.getTicker().then(( data ) => {
          this.setState({
              data: data,
              loading: false,
              refreshing: false
          });
      }).catch(( error ) => {
        // TODO: Handle errors
        console.log(error);
      });
  }

  componentDidMount(){
      this.getData();
  }

  _keyExtractor = (item, index) => item.id;

  cointImage( item ){
    const img = require( '../images/crypto/btc.png' ) ;
    return(
      <Image
        style={{ width: 30, height: 30}}
        source={img}
      />
    )
  }

  currency( item ){
    const priceColor = ( item.percent_change_24h > 0 ) ? colors.priceUp : colors.priceDown;
    return(
      <View>
        <Text style={styles.currencyName}>{item.name}
          <Text style={styles.currencySymbol}>({item.symbol})</Text>
        </Text>
        <Text style={styles.rowLineChange}>
            <Text style={{color: priceColor}}>{item.percent_change_24h}%</Text>
            <Text style={{color: 'white'}}> (24h)</Text>
        </Text>
      </View>
    )
  }

  price( item ){
    const priceColor = ( item.percent_change_24h > 0 ) ? colors.priceUp : colors.priceDown;
    return(
      <View>
        <Text style={styles.rowLinePrice}>
            <Text style={{color: priceColor}}>${ item.price_usd }</Text>
        </Text>
      </View>
    )
  }

  marketCap( item ){
    return (
      <View>
        <Text style={styles.label}>MARKET CAP</Text>
        <Text style={styles.rowLine}>
          ${numeral(item.market_cap_usd).format('0,0')}
        </Text>
      </View>
    )
  }

  volume( item ){
    return(
      <View>
        <Text style={styles.labelRight}>24H VOLUME</Text>
        <Text style={styles.rowLineRight}>
          ${numeral(item['24h_volume_usd']).format('0,0')}
        </Text>
      </View>
    )               
  }

  supply( item ){
    return(
      <View>
        <Text style={styles.label}>CIRCULATING SUPPLY</Text>
        <Text style={styles.rowLine}>
          ${numeral(item.market_cap_usd).format('0,0')}
        </Text>
      </View>
    )
  }

  totalSupply( item ){
    return(
      <View>
        <Text style={styles.labelRight}>TOTAL SUPPLY</Text>
        <Text style={styles.rowLineRight}>
          ${numeral(item['24h_volume_usd']).format('0,0')}
        </Text>
      </View>
    )
  }

  updateTime( item ){
    return(
      <View>
        <Text style={{ color: '#dedede', fontSize: 10, marginTop: 10}}>
            { new Date(item.last_updated * 1000).toUTCString() }
        </Text>
      </View>
    )
  }

  _renderItem = ({item}) => {

      const rowBackgroundColor = ( ( item.rank%2 ) == 0 ) ? colors.rowOdd : colors.rowEven;
      return(
        <TouchableHighlight onPress={() => {
          Actions.coindetails({ id: item.id, title: item.name })
        }} activeOpacity={0.5} underlayColor="#0d1016">
          <View style={{ padding: 16, backgroundColor: rowBackgroundColor, margin: 4, borderRadius: 13}}>
            <Grid>
              
              {/* Price and currency */}
              <Row style={styles.rowStyle}>
                <Col style={{ width: 40 }}>{ this.cointImage(item) }</Col>
                <Col>{ this.currency(item) }</Col>
                <Col>{ this.price(item) }</Col>
              </Row>

              {/* Market Cap and Vol 24h. */}
              <Row style={styles.rowStyle}>
                <Col>{ this.marketCap(item) }</Col>
                <Col>{ this.volume(item) }</Col>
              </Row>

              {/* Circulation and Total Supply. */}
              <Row style={styles.rowStyleLast}>
                  <Col>{ this.supply(item) }</Col>
                  <Col>{ this.totalSupply(item) }</Col>
              </Row>

              {/* Update time */}
              <Row>
                  <Col style={{ flex: 1, alignContent: 'center' }}>
                    { this.updateTime(item) }
                  </Col>
              </Row>

            </Grid>
          </View>
        </TouchableHighlight>
        );
  };

  _onRefresh(){
    this.getData();
  }

  render() {
    return (
      <View style={{backgroundColor: '#0D1016', paddingLeft: 4, paddingRight: 4, flex: 1}}>
        <StatusBar
          backgroundColor="#12161E"
          barStyle="light-content"
        />
        <FlatList
          data={this.state.data}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          refreshControl={
            <RefreshControl
              refreshing={ this.state.refreshing }
              onRefresh={ this._onRefresh.bind(this) }
            />
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  label:{
    color: '#717478',
    fontFamily: "IBMPlexSans",
    letterSpacing: 1.78,
    fontSize: 8
  },
  rowLine: {
    color: '#fff',
    fontFamily: "IBMPlexSans-Bold",
    fontSize: 12,
    letterSpacing: 1,
  },
  rowLineRight: {
    color: '#fff',
    fontFamily: "IBMPlexSans-Bold",
    fontSize: 12,
    letterSpacing: 1,
    textAlign: 'right',
  },
  rowLinePrice: {
    color: '#fff',
    fontFamily: "IBMPlexSans-Bold",
    fontSize: 18,
    letterSpacing: 1.67,
    textAlign: 'right',
  },
  labelRight: {
    textAlign: 'right',
    color: '#717478',
    fontFamily: "IBMPlexSans",
    letterSpacing: 1.78,
    fontSize: 8
  },
  rowLineChange:{
    color: 'red',
    fontFamily: "IBMPlexSans",
    letterSpacing: 1.78,
    fontSize: 9
  },
  rowStyle: {
    marginBottom: 8,
  },

  rowStyleLast:{
    marginBottom: 0,
  },
  currencyName: {
    color: '#fff',
    fontFamily: "IBMPlexSans-Light",
    fontSize: 18
  },
  currencySymbol: {
    color: '#6f7277',
    fontFamily: "IBMPlexSans-Light",
    fontSize: 18
  }
});
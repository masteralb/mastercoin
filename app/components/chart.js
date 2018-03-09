import React from 'react';
import { AppRegistry, StyleSheet, Text, View, processColor } from 'react-native';
import { LineChart } from 'react-native-charts-wrapper';
import { coinMarketCap } from '../api.js';

const moment = require('moment');
import _ from 'lodash';
import update from 'immutability-helper';

class CoinChart extends React.Component {

  constructor() {
    super();    
    this.state = {
      data: {},
      legend: {
        enabled: false,
      },
      marker: {
        enabled: true,
        markerColor: processColor('#07E2FF'),
        textColor: processColor('white'),
        markerFontSize: 14,
      }
    }
  }

  componentDidMount() {
    const size = 80;
    this.market = new coinMarketCap

    this.market.graph(this.props.coin, 'day').then(res => {

      const _usd = _.map(res.price_usd, function (item) {
        return { y: item[1], x: item[0] }
      })
      this.setState(
        update(this.state, {
          yAxis: {
            $set: {
              left: {
                drawGridLines: false,
                enabled: false
              },
              right: {
                enabled: false
              }
            }
          },
          xAxis: {
            $set: {
              drawGridLines: false,
              textColor: processColor('#07E2FF'),
              textSize: 11,
              gridColor: processColor('#07E2FF'),
              gridLineWidth: 0,
              axisLineColor: processColor('#07E2FF'),
              axisLineWidth: 0.3,
              avoidFirstLastClipping: false,
              valueFormatter: 'date',
              valueFormatterPattern: 'HH:MM',
              position: 'BOTTOM',
            }
          },
          data: {
            $set: {
              dataSets: [{
                values: _usd,
                label: 'USD',
                config: {
                  lineWidth: 0,
                  drawValues: false,
                  drawCircles: false,
                  highlightColor: processColor('blue'),
                  color: processColor('white'),
                  drawFilled: true,
                  fillColor: processColor('#07E2FF')
                }
              }],
            }
          }
        })
      );
    }).catch(e => {
      console.log(e, 'ERROR !!!')
    });
  }

  _randomParabolaValues(size: number) {
    return _.times(size, (index) => {
      return {x: index, y: index * index}
    });
  }

  handleSelect(event) {
    let entry = event.nativeEvent
    if (entry == null) {
      this.setState({...this.state, selectedEntry: null})
    } else {
      this.setState({...this.state, selectedEntry: JSON.stringify(entry)})
    }
  }

  render() {

    let borderColor = processColor("white");
    return (
      <View style={{flex: 1, height: 220}}>
        <View style={styles.container}>
          <LineChart
            style={styles.chart}
            data={this.state.data}
            chartDescription={{text: ''}}
            legend={this.state.legend}
            marker={this.state.marker}
            axisLineColor={processColor("#07E2FF")} 
            descriptionColor={processColor("white")}
            drawGridBackground={false}
            drawGridLines={true}
            borderColor={borderColor}
            borderWidth={0}
            drawBorders={false}
            textColor={processColor("white")} 
            touchEnabled={true}
            dragEnabled={true}
            scaleEnabled={true}
            scaleXEnabled={true}
            scaleYEnabled={false}
            pinchZoom={false}
            doubleTapToZoomEnabled={true}
            gridColor={processColor('#07E2FF')}
            dragDecelerationEnabled={true}
            dragDecelerationFrictionCoef={0.99}
            keepPositionOnRotation={false}            
            yAxis={this.state.yAxis}
            xAxis={this.state.xAxis}
            onSelect={this.handleSelect.bind(this)}
            onChange={(event) => console.log(event.nativeEvent)}
            ref="chart"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    height: 250
  },
  chart: {
    flex: 1,
  }
});


export default CoinChart;
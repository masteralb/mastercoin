import {
  AsyncStorage
} from 'react-native';

const queryString = require('query-string');
const moment = require('moment');

const coinMarketCapBase = 'https://api.coinmarketcap.com/v1/';
const coinMarketCapGraph = 'https://graphs2.coinmarketcap.com/currencies';

class coinMarketCap {

  constructor() {
    this.cacheTime = 1000 * 60 * 5; // 5min
    this.tickerCacheKey = 'conin_market_cap_ticker';
    this.globalDataCacheKey = 'conin_market_cap_global_data';
  }

  ticker() {
    let start = 0,
    limit = 5000;
    return fetch(`${coinMarketCapBase}/ticker/?start=${start}&limit=${limit}`);
  }

  tickerNeedsUpdate() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(this.tickerCacheKey + '_time').then((time) => {
        resolve((Date.now() - time) >= this.cacheTime);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  updateTicker() {
    return new Promise((resolve, reject) => {
      this.ticker().then((res) => {
        return res.json()
      }).then((data) => {
        try {
          AsyncStorage.setItem(this.tickerCacheKey, JSON.stringify(data));
          AsyncStorage.setItem(this.tickerCacheKey + '_time', Date.now().toString());
          resolve(data);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  getTicker() {
    return new Promise((resolve, reject) => {
      this.tickerNeedsUpdate().then((needsUpdate) => {
        if (needsUpdate) {
          this.updateTicker().then((data) => {
            resolve(data);
          });
        } else {
          AsyncStorage.getItem(this.tickerCacheKey).then((ticker) => {
            if (ticker !== null) {
              resolve(JSON.parse(ticker));
            }
          }).catch((error) => {
            reject(error);
          });
        }
      }).catch((error) => {
        reject(error)
      });
    });
  }

  graph(id, type) {
    
    let now = moment.utc().valueOf();

    const graphList = {
      day: [moment.utc().subtract(1, 'day').valueOf(), now],
      week: [moment.utc().subtract(1, 'week').valueOf(), now],
      month: [moment.utc().subtract(1, 'month').valueOf(), now],
      quarter: [moment.utc().subtract(3, 'month').valueOf(), now],
      year: [moment.utc().subtract(1, 'year').valueOf(), now],
      all: [moment.utc().subtract(10, 'years').valueOf(), now]
    }

    return new Promise((resolve, reject) => {
      if (typeof graphList[type] !== 'undefined') {
        fetch(`${coinMarketCapGraph}/${id}/${graphList[type][0]}/${graphList[type][1]}`)
          .then((res) => {
            return res.json()
          })
          .then((data) => {
            resolve(data);
          }).catch((error) => {
            reject(error);
          });
      } else {
        reject('Graph type not found');
      }
    });
  }
}

export { coinMarketCap  }
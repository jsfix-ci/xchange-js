const nock = require('nock');
const chai = require('chai');
const poloniex = require('../../lib/exchanges/poloniex');

const should = chai.should();
const expect = chai.expect

const client = new poloniex.PublicClient();
const rootUrl = client.publicURI;

const testResponses = {
	ticker: {
		body: {
			"BTC_ETH": {
				"id": 148,
				"last": "0.11637495",
				"lowestAsk": "0.11645000",
				"highestBid": "0.11637495",
				"percentChange": "-0.06749145",
				"baseVolume": "50406.61075497",
				"quoteVolume": "427935.14641021",
				"isFrozen": "0",
				"high24hr": "0.12484780",
				"low24hr": "0.11354683"
			}
		},
		response: {
			last: 0.11637495,
			high: 0.12484780,
			low: 0.11354683,
			bid: 0.11637495,
			ask: 0.11645000,
			volume: null,
			time: new Date()
		}
		
	},
	symbols: {
		response: [
		"ETHBTC"
		]
	}
};

nock(rootUrl)
.get('/public')
.query({command:'returnTicker'})
.times(4)
.reply(200, testResponses.ticker.body);


describe('poloniex', function () {

	describe('ticker', function () {

		context('success call', function () {
			it('retrieves ticker data using cb', function (done) {
				client.getTicker('ETHBTC', function (err, resp) {
					resp.time = testResponses.ticker.response.time;
					expect(resp).to.deep.equal(testResponses.ticker.response);
					done();
				});
			});

			it('retrieves ticker using promise', function (done) {
				client.getTicker('ETHBTC').then((resp) => {
					resp.time = testResponses.ticker.response.time;
					expect(resp).to.deep.equal(testResponses.ticker.response);
					done();
				});
			});
		});

	});

	describe('pairs', function () {

		context('success call', function () {
			it('retrieves pairs data using cb', function (done) {
				client.getPairs(function (err, resp) {
					expect(resp).to.deep.equal(testResponses.symbols.response);
					done();
				});
			});

			it('retrieves pairs using promise', function (done) {
				client.getPairs().then((resp) => {
					expect(resp).to.deep.equal(testResponses.symbols.response);
					done();
				});
			});
		});

	});

});
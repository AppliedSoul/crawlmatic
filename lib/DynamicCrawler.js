const HCCrawler = require('headless-chrome-crawler');
const EventEmitter = require('events');
const Promise = require('bluebird');
const _ = require('lodash');

/**
 * Dynamic Crawler - Based on Headless Chrome crawler
 * Is a wrapper supporting promised based api
 * @extends EventEmitter
 */
class DynamicCrawler extends EventEmitter {
  /**
   * Constructor - Initialize the dynamic Crawler
   * with crawler options .
   *
   * Crawler will not be ready until the setup() method
   * resolves the promise
   *
   * Usage:
   *  const crawler = new DynamicCrawler(opts);
   *
   * crawler.setup().then(() => {
   *
   *   // make requests
   *   request(options).then((result) => {
   *        //do something good with the result.
   *   })
   * })
   *
   * See [HCCCrawler.launch(options)]
   * (https://github.com/yujiosaka/headless-chrome-crawler/blob/master/docs/API.md)
   * @param {Object} [options={}] Crawler general options
   */
  constructor(options = {}) {
    super();
    this.options = options;
    this.crawler = null;
  }

  /**
   * setup - to be called after the crawler has been initialized
   * with options and before making requests
   *
   * It will setup underlying Chromium browser instance and resolve
   *
   * @param  {Object} [options={}] Crawler general options
   * @return {Promise}              To be resolved with underlying crawler instance
   */
  setup(options = {}) {
    this.options = _.extend(this.options, options);
    this.options.onSuccess = function(result) {
      result.options.npolisResolve(result);
    };
    this.options.onError = function(error) {
      error.options.npolisReject(error);
    };
    return HCCrawler.launch(this.options).then((crawler) => {
      this.crawler = crawler;
      this.emit('ready');
      return this.crawler;
    })
  }

  /**
   * request - Its promise version of crawler.queue
   * See [crawler.queue(options)]
   * (https://github.com/yujiosaka/headless-chrome-crawler/blob/master/docs/API.md)
   * @param  {Object} [options={}] HCCrawler.queue options passed
   * when making requests
   * @return {Promise}              Promise holding either result or error object
   */
  request(options = {}) {
    return new Promise((resolve, reject) => {
      options.npolisResolve = resolve;
      options.npolisReject = reject;
      this.crawler.queue(options).catch(reject);
    });
  }

  /**
   * destroy - Closes the underlying Chromium browser
   * and resolves the returned promise.
   * @return {Promise} To be resolved when the Chromium
   * browser is closed.
   */
  destroy() {
    return this.crawler.close();
  }

}

/**
 * exports Dynamic Crawler class
 * @type {DynamicCrawler}
 */
module.exports = DynamicCrawler;
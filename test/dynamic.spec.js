const {
  DynamicCrawler
} = require('../index');


describe('Dynamic Crawler Tests', function() {

  const crawler = new DynamicCrawler({
    evaluatePage: (() => ({
      title: $('title').text(),
    }))
  });

  it('setup should be fulfilled', function() {
    return crawler.setup().should.eventually.be.fulfilled;
  })

  it('should reject requests with no options defined', function() {
    return crawler.request().should.eventually.be.rejected;
  })

  it('should able to dynamically crawl website (https://bing.com get Title)', function() {
    return crawler.request({
      url: 'https://bing.com'
    }).then((res) => {
      return res.result.title;
    }).should.eventually.be.a('string');
  })

  it('should be able to reject if faulty requests are made', function() {
    return crawler.request({
      url: 'http://bingxxxx.comm',
      timeout: 10 * 1000,
      retryCount: 0
    }).should.eventually.be.rejected;
  })

  it('should able to close the crawler instance', function() {
    return crawler.destroy().should.eventually.be.fulfilled
  })

  it('should able to create crawler instance with default options', function() {
    const crawlerNoOpts = new DynamicCrawler();
    return crawlerNoOpts.setup().then(() => crawlerNoOpts.destroy())
      .should.eventually.be.fulfilled;
  })
})
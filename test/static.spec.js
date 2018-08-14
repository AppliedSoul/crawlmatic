const {
  StaticCrawler
} = require('../index');


describe('Static Crawler Tests', function() {

  const crawler = new StaticCrawler({});

  it('setup should be fulfilled', function() {
    return crawler.setup().should.eventually.be.fulfilled;
  })

  it('should able to crawl website (https://bing.com )', function() {
    return crawler.request({
      url: 'https://bing.com'
    }).then((res) => {
      let $ = res.$;
      return $("title").text();
    }).should.eventually.be.a('string');
  })

  it('should be able to reject if faulty requests are made', function() {
    return crawler.request({
      url: 'http://bingxxxx.comm',
      timeout: 10 * 1000,
      retries: 0
    }).should.eventually.be.rejected;
  })

  it('should able to close the crawler instance', function() {
    return crawler.destroy().should.eventually.be.fulfilled
  })
})
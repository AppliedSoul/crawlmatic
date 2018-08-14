const {
  DynamicCrawler,
  StaticCrawler
} = require('../index.js');

// Initialize with HCCrawler options
const crawler = new DynamicCrawler({
  //dynamically evaluate page title
  evaluatePage: (() => ({
    title: $('title').text(),
  }))
});
//Setup - resolved when Chromium instance is up
crawler.setup().then(() => {

  // make requests with HCCrawler queue options
  crawler.request({
    url: "http://example.com"
  }).then((resp) => {
    console.log(resp.result.title);

    // destroy the instance
    process.nextTick(() => crawler.destroy())
  })

});

//Initialize with node-crawler options
const staticCrawler = new StaticCrawler({
  maxConnections: 10,
  retries: 3
});

//setup internal node-crawler instance and resolves promise
staticCrawler.setup().then(() => {
  // makes request with node-crawler queue options
  staticCrawler.request({
    url: 'http://example.com'
  }).then((resp) => {
    //server side response parsing using cheerio
    let $ = res.$;
    console.log($("title").text());

    // destroy the instance
    process.nextTick(() => crawler.destroy())
  })
});
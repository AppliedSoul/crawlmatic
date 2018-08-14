# crawlmatic
[![Build Status](https://travis-ci.org/AppliedSoul/crawlmatic.svg?branch=master)](https://travis-ci.org/AppliedSoul/crawlmatic) </br>
Single library for static or dynamic website crawling needs.</br>
A standard wrapper for [HCCrawler](https://github.com/yujiosaka/headless-chrome-crawler/blob/master/docs/API.md) & [node-crawler](https://github.com/bda-research/node-crawler), based on bluebird promises.</br>
</br>
</br>
<b>Install using npm:</b>
```
npm i crawlmatic --save
```

<b> Dynamic crawling example:</b>
```javascript
const {
  DynamicCrawler
} = require('crawlmatic');

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
```
<b>Static crawling example:</b>
```javascript
const {
  StaticCrawler
} = require('crawlmatic');
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

```

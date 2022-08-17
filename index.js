require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { isUri } = require("valid-url")
const dns = require('node:dns')
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

const urlMap = new Map()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function (req, res) {
  // console.log(req.body)
  let url = req.body.url
  let isValid = isUri(url)
  console.log()
  console.log("sdsds" + isValid)
  // dns.lookup(url, (err, address, family) => {
  console.log(isValid)
  console.log(url.includes("ftp"))
  // console.log(err)
  if (url.includes("ftp")) {
    return res.json({ error: 'invalid url' })
  }
  if (!isValid) {
    return res.json({ error: 'invalid url' })
  }

  if (urlMap.has(url)) {
    return res.json({
      original_url: url,
      short_url: urlMap.get(url)
    })
  } else {
    urlMap.set(url, urlMap.size + 1)
    return res.json({
      original_url: url,
      short_url: urlMap.get(url)
    })
  }
  // });





})

app.get('/api/shorturl/:short', function (req, res) {
  let shortUrl = parseInt(req.params.short)
  let mapValues = [...urlMap.values()]
  // console.log(typeof shortUrl)
  console.log(shortUrl)
  // console.log(mapValues)
  // console.log(mapValues.includes(shortUrl))
  console.log(urlMap)
  if (mapValues.includes(shortUrl)) {
    console.log("inside loop")
    let url
    for (const [key, value] of urlMap) {
      if (value === shortUrl) {
        url = key

      }
    }
    return res.redirect(url)
  } else {
    return res.json({
      error: "No short URL found for the given input"
    })
  }
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

const express = require('express');
const app = express();
const axios = require('axios');
const cheerio = require('cheerio');
const qs = require('qs');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index', { name: 'World' });
});

app.get('/pics', (req, res) => {
  res.render('pics', { name: 'World' });
});

app.get('/face', (req, res) => {
  res.render('face', { name: 'World' });
});

const buttons = [
  { likes: 0 },
  { likes: 0 },
  { likes: 0 }
];
app.get('/buy', (req, res) => {
  res.render('buy', { name: 'World' });
});



// Render the index page
app.get('/store', (req, res) => {
  res.render('store', { buttons });
});

// Handle the like button POST request
app.post('/store/like/:buttonIndex', (req, res) => {
  const buttonIndex = parseInt(req.params.buttonIndex);
  buttons[buttonIndex].likes++;
  res.redirect('/store');
});



app.get('/news', (req, res) => {
  res.render('news', { articleContent: null, searchQuery: '' });
});

app.post('/news', async (req, res) => {
  try {
    const searchQuery = req.body.query;
    const newsApiUrl = `https://newsapi.org/v2/everything?q=${searchQuery}&apiKey=5de12005ffc04d2abda96b241dc1ecbb`;

    const response = await axios.get(newsApiUrl);
    const articles = response.data.articles;

    if (articles.length > 0) {
      const articleUrl = articles[0].url;
      const articleResponse = await axios.get(articleUrl);
      const $ = cheerio.load(articleResponse.data);
      const articleTitle = $('h1').text();
      const articleBody = $('p').text();
      const articleContent = { title: articleTitle, bodyText: articleBody };
      res.render('news', { articleContent, searchQuery });
    } else {
      res.render('news', { articleContent: null, searchQuery });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while fetching the articles.');
  }
});



const port = process.env.PORT || 3000;
const host = '0.0.0.0';
app.listen(port, host, () => {
  console.log(`Server listening on port ${port}`);
});

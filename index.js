const express = require('express');
const app = express();
const axios = require('axios');
const cheerio = require('cheerio');

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index', { name: 'World' });
});

app.get('/pics', (req, res) => {
  res.render('pics', { name: 'World' });
});

app.get('/face', (req, res) => {
  res.render('face', { name: 'World' });
});

app.get('/news', async (req, res) => {
  try {
    const response = await axios.get('https://medium.com/@emilymenonbender/thought-experiment-in-the-national-library-of-thailand-f2bf761a8a83');
    const html = response.data;
    const $ = cheerio.load(html);

    // Extract the <h1> tag and store its content
    const title = $('h1').text();

    // Extract all <p> tags with class 'pw-post-body-paragraph' and store their contents in an array
    const paragraphs = [];
    $('p.pw-post-body-paragraph').each((index, element) => {
      paragraphs.push($(element).text());
    });

    // Render the 'news.ejs' template with the extracted data
    res.render('news', { title, paragraphs });
  } catch (error) {
    console.error('Error fetching the article:', error);
    res.send('Error fetching the article');
  }
});

const port = process.env.PORT || 3000;
const host = '0.0.0.0';
app.listen(port, host, () => {
  console.log(`Server listening on port ${port}`);
});

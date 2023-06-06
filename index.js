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
let cartCount = 0;
let checkoutSubmitted = false; // Variable to track if the checkout form has been submitted

let productCatalog = [
  { id: 1, name: 'Shirt', price: '$10', imageSrc: '/images/green.jpg', title: 'Green Shirt' },
  { id: 2, name: 'Trousers', price: '$20', imageSrc: '/images/blue.jpg', title: 'Blue Trousers' },
  { id: 3, name: 'Dress', price: '$30', imageSrc: '/images/red.jpg', title: 'Red Dress' },
  { id: 4, name: 'Hat', price: '$5', imageSrc: '/images/shirt.jpg', title: 'Black Hat' },
  { id: 3, name: 'Dress', price: '$30', imageSrc: '/images/red.jpg', title: 'Red Dress' },
  { id: 4, name: 'Hat', price: '$5', imageSrc: '/images/shirt.jpg', title: 'Black Hat' },
  // Add more products here if needed
];

let selectedProducts = []; // Array to store the selected products

app.get('/store', (req, res) => {
  res.render('store', { cartCount, productCatalog, selectedProducts, checkoutSubmitted });
});

app.post('/addToCart', (req, res) => {
  const productId = req.body.productId;
  const selectedProduct = productCatalog.find(product => product.id === parseInt(productId));

  if (selectedProduct) {
    cartCount++;
    selectedProducts.push(selectedProduct); // Add the selected product to the selectedProducts array
  } else {
    res.status(404).send('Product not found.');
  }
  res.redirect('/store');
});

app.post('/checkout', (req, res) => {
  // Perform the necessary actions for checkout (e.g., process payment, place order, etc.)
  // You can clear the cartCount or perform any other required operations here
  
  checkoutSubmitted = true; // Set checkoutSubmitted to true
  res.redirect('/store');
});

app.post('/reset', (req, res) => {
  // Reset the page to the original state
  cartCount = 0;
  selectedProducts = [];
  checkoutSubmitted = false;
  res.redirect('/store');
});


// Handle the like button POST request




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



const port = process.env.PORT || 3010;
const host = '0.0.0.0';
app.listen(port, host, () => {
  console.log(`Server listening on port ${port}`);
});

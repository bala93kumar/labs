const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios').default;
const mongoose = require('mongoose');

const Favorite = require('./models/favorite');

const app = express();

app.use(bodyParser.json());

app.get('/favorites', async (req, res) => {
  const favorites = await Favorite.find();
  res.status(200).json({
    favorites: favorites,
  });
});

app.post('/favorites', async (req, res) => {
  const favName = req.body.name;
  const favType = req.body.type;
  const favUrl = req.body.url;

  try {
    if (favType !== 'movie' && favType !== 'character') {
      throw new Error('"type" should be "movie" or "character"!');
    }
    const existingFav = await Favorite.findOne({ name: favName });
    if (existingFav) {
      throw new Error('Favorite exists already!');
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  const favorite = new Favorite({
    name: favName,
    type: favType,
    url: favUrl,
  });

  try {
    await favorite.save();
    res
      .status(201)
      .json({ message: 'Favorite saved!', favorite: favorite.toObject() });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

app.get('/movies', async (req, res) => {
  try {
    // const response = await axios.get('https://swapi.dev/api/films');
    const response = await axios.get('https://swapi.py4e.com/api/films/');
    res.status(200).json({ movies: response.data });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

app.get('/people', async (req, res) => {
  try {
    // const response = await axios.get('https://swapi.dev/api/people');
    const response = await axios.get('https://swapi.py4e.com/api/people/');
    res.status(200).json({ people: response.data });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});


// app.listen(3000, '0.0.0.0', () => console.log('API listening on 3000'));

mongoose.connect(
  'mongodb://172.17.0.2:27017/swfavorites',
  { useNewUrlParser: true },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      app.listen(3000);
    }
  }
);


// without mongoose related 
// UNCOMMENT BELOW CODE TO USE ONLY TO HIT THE ENDPOINTS

/*
// server.js
const express = require('express');
const axios = require('axios').default;

const app = express();
app.use(express.json());

// --- In-memory store (resets on restart) ---
const favorites = []; // { name, type, url }

// --- Health & root ---
app.get('/health', (_req, res) => res.status(200).send('OK'));
app.get('/', (_req, res) => res.status(200).send('Root OK'));

// --- List favorites ---
app.get('/favorites', async (_req, res) => {
  res.status(200).json({ favorites });
});

// --- Create favorite (validation + duplicate by name) ---
app.post('/favorites', async (req, res) => {
  const { name, type, url } = req.body;

  // Basic validation
  if (!name || !type || !url) {
    return res.status(400).json({ message: 'name, type, and url are required.' });
  }
  if (!['movie', 'character'].includes(type)) {
    return res.status(400).json({ message: '"type" should be "movie" or "character".' });
  }

  // Duplicate check by name
  const exists = favorites.find(f => f.name.toLowerCase() === name.toLowerCase());
  if (exists) {
    return res.status(409).json({ message: 'Favorite exists already!' });
  }

  const favorite = { name, type, url };
  favorites.push(favorite);

  return res.status(201).json({ message: 'Favorite saved!', favorite });
});

// --- Movies proxy (SWAPI mirror) ---
app.get('/movies', async (_req, res) => {
  try {
    // You can switch to swapi.dev if you prefer:
    // const response = await axios.get('https://swapi.dev/api/films/');
    const response = await axios.get('https://swapi.py4e.com/api/films/');
    res.status(200).json({ movies: response.data });
  } catch (error) {
    console.error('Movies fetch error:', error.message);
    res.status(502).json({ message: 'Failed to fetch movies.' });
  }
});

// --- People proxy (SWAPI mirror) ---
app.get('/people', async (_req, res) => {
  try {
    // const response = await axios.get('https://swapi.dev/api/people/');
    const response = await axios.get('https://swapi.py4e.com/api/people/');
    res.status(200).json({ people: response.data });
  } catch (error) {
    console.error('People fetch error:', error.message);
    res.status(502).json({ message: 'Failed to fetch people.' });
  }
});

// --- Error safety ---
process.on('uncaughtException', err => console.error('Uncaught:', err));
process.on('unhandledRejection', err => console.error('Unhandled:', err));

// --- Start server (bind to 0.0.0.0 for Docker) ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`API listening on ${PORT}`));

*/
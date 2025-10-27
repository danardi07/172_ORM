const express = require('express');
const app = express();
const db = require('./models');
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

db.sequelize.sync()
  .then((result) => {
    app.listen(3000, () => {
      console.log('Server Started');
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.get('/', (req, res) => {
  res.send('Selamat Datang Di Perpustakaan');
});

app.post('/komik', async (req, res) => {
  try {
    const { title, description,author } = req.body;
    const komik = await db.Komik.create({ title, description, author });
    res.status(200).json(komik);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/komik', async (req, res) => {
  try {
    const komiks = await db.Komik.findAll();
    res.status(200).json(komiks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/komik/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const komik = await db.Komik.findByPk(id);
    if (!komik) {
      return res.status(404).json({ error: 'Komik tidak ditemukan' });
    }
    res.status(200).json(komik);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/komik/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const komik = await db.Komik.findByPk(id);
    if (!komik) {
      return res.status(404).json({ error: 'Komik tidak ditemukan' });
    }
    const { title, description, author } = req.body;
    await komik.update({ title, description, author });
    res.status(200).json(komik);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/komik/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const komik = await db.Komik.findByPk(id);
    if (!komik) {
      return res.status(404).json({ error: 'Komik tidak ditemukan' });
    }
    await komik.destroy();
    res.status(200).json({ message: 'Komik berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

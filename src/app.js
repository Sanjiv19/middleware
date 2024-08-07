// middleware/src/index.js
const express = require('express');
const { Pool } = require('pg');
const axios = require('axios');
const cron = require('node-cron');
require('dotenv').config();

const app = express();
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Route to receive Freshservice tickets
app.post('/tickets', async (req, res) => {
  const ticket = req.body;
  try {
    await pool.query('INSERT INTO tickets (id, data) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING', [ticket.id, JSON.stringify(ticket)]);
    res.status(200).send('Ticket received');
  } catch (error) {
    console.error('Error storing ticket:', error);
    res.status(500).send('Error storing ticket');
  }
});

// Function to push tickets to Freshdesk
async function pushTicketsToFreshdesk() {
  try {
    const { rows } = await pool.query('SELECT * FROM tickets WHERE status = $1', ['pending']);
    for (const ticket of rows) {
      await axios.post('https://effy-opinyin.freshdesk.com/api/v2/tickets', ticket.data, {
        headers: { 'Authorization': `Basic ${Buffer.from(process.env.FRESHDESK_API_KEY + ':X').toString('base64')}` },
      });
      await pool.query('UPDATE tickets SET status = $1 WHERE id = $2', ['sent', ticket.id]);
    }
  } catch (error) {
    console.error('Error pushing tickets to Freshdesk:', error);
  }
}

// Schedule task to push tickets every 5 minutes
cron.schedule('*/5 * * * *', pushTicketsToFreshdesk);

module.exports = app;

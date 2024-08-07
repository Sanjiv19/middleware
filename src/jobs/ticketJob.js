const cron = require('node-cron');
const { pool } = require('../db');
const { createFreshdeskTicket } = require('../services/freshdeskService');

// Define status constants
const STATUS_PENDING = 1; // Adjust this value based on your database schema if necessary

// Function to process pending tickets
async function processPendingTickets() {
  try {
    // Fetch pending tickets from the database
    const result = await pool.query(
      'SELECT * FROM tickets WHERE status = $1',
      [STATUS_PENDING]
    );

    // Process each ticket
    for (const ticket of result.rows) {
      try {
        // Create a ticket in Freshdesk
        await createFreshdeskTicket(ticket);

        // Update the ticket status in the database to prevent duplicate processing
        await pool.query(
          'UPDATE tickets SET status = $1 WHERE id = $2',
          [2, ticket.id] // Assuming 2 is the status code for "Processed" or similar
        );

      } catch (freshdeskError) {
        console.error(`Error creating Freshdesk ticket for ticket ID ${ticket.id}:`, freshdeskError);
      }
    }

  } catch (error) {
    console.error('Error processing pending tickets:', error);
  }
}

// Schedule the task to run every 5 minutes
// cron.schedule('*/5 * * * *', async () => {
//   console.log('Running processPendingTickets job...');
//   await processPendingTickets();
// });

module.exports = {
  processPendingTickets,
};

const { query } = require('../db/index');

class Ticket {
  // TODO Include ticket id in the schema also include another column called Freshdesk Ticket Created - [Boolean Value - Initial Value False]
  constructor({ subject, description, email, priority, status, source }) {
    this.subject = subject;
    this.description = description;
    this.email = email;
    this.priority = priority;
    this.status = status;
    this.source = source;
  }

  async save() {
    const text = 'INSERT INTO tickets(subject, description, email, priority, status, source) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
    const values = [this.subject, this.description, this.email, this.priority, this.status, this.source];

    try {
      const res = await query(text, values);
      // 
      return res.rows[0];
    } catch (err) {
      throw new Error('Failed to save ticket');
    }
  }
}

module.exports = Ticket;

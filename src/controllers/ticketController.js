const Ticket = require('../models/ticket');

const receiveTicket = async (req, res) => {
  const { subject, description, email, priority, status, source } = req.body;

  console.log( subject, description, email, priority, status, source );

  // try {
    // const ticket = new Ticket({
    //   subject,
    //   description,
    //   email,
    //   priority,
    //   status,
    //   source,
    // });

    // Also Destructure ticket id from req.body
    // TODO Create Insert Query / Update Query Function Inside db/index.js
// TODO Send the data destructured from req.body

    
// console.log(ticket);
// const ticket1 = await ticket.save();
//     console.log(ticket1);
//     res.status(201).send({ message: 'Ticket received and stored' });
//   } catch (error) {
//     res.status(500).send({ error: 'Failed to store ticket' });
//   }
};

module.exports = {
  receiveTicket,
};

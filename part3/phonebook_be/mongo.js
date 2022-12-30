const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.1yrfgqj.mongodb.net/phonebook?retryWrites=true&w=majority`


const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
  date: Date,
})

const Contact = mongoose.model('Contact', phonebookSchema)

// Just print all contacts
if (process.argv.length === 3) {
  Contact.find({}).then(result => {
    result.forEach(contact => {
      console.log(contact)
    })
    mongoose.connection.close()
  })
} else {
// Adding a new contact
  mongoose
    .connect(url)
    .then(() => {
      console.log('connected')

      const contact = new Contact({
        name: process.argv[3],
        number: process.argv[4],
        date: new Date(),
      })

      return contact.save()
    })
    .then(() => {
      console.log('contact saved!')
      return mongoose.connection.close()
    })
    .catch((err) => console.log(err))
}



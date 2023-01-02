const mongoose = require('mongoose')

const mongoUrl = process.env.MONGODB_URI

console.log('connectng to ', mongoUrl)

mongoose.connect(mongoUrl)
  .then(() => {
    console.log('connected')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  likes: Number
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)

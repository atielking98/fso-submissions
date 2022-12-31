const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}

const phonebookSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minlength: 8,
    validate: {
      validator: function(v) {
        if (v.includes('-')) {
          let vParts = v.split('-')
          if (vParts.length !== 2) {
            return false
          } else if (vParts[0].length < 2 || vParts[0].length > 3) {
            return false
          } else if (!isNumber(vParts[0]) || !isNumber(vParts[1])) {
            return false
          }
        }
        return true
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: true
  },
  date: {
    type: Date,
    required: true
  }
})

phonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Contact', phonebookSchema)
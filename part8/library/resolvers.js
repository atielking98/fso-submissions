const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const config = require('./utils/config')

const { UserInputError, AuthenticationError } = require('apollo-server')
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const resolvers = {
    Query: {
      bookCount: async () => Book.collection.countDocuments(), 
      allBooks: async (root, args) => {
        if (args.author) {
          const foundAuthor = await Author.findOne({ name: args.author })
          if (foundAuthor) {
            if (args.genre) {
              return await Book.find({ author: foundAuthor.id, genres: { $in: [args.genre] } }).populate('author')
            }
            return  await Book.find({ author: foundAuthor.id }).populate('author')
          }
          return null
        }
  
        if (args.genre) {
          return Book.find({ genres: { $in: [args.genre] } }).populate('author')
        }
        return await Book.find({}).populate('author')
      },
      authorCount: async () => Author.collection.countDocuments(),
      allAuthors: async () => {
        return Author.find({})
      },
      me: (root, args, context) => {
        return context.currentUser
      }
    },
  
    Author: {    
      bookCount: async (root) => {
        const foundAuthor = await Author.findOne({ name: root.name })
        const foundBooks = await Book.find({ author: foundAuthor.id }) 
        return foundBooks.length
      }
    },
  
    Mutation: {
      addBook: async (root, args, context) => {
        const currentUser = context.currentUser
        if (!currentUser) {
          throw new AuthenticationError("not authenticated")
        }
        const foundBook = await Book.findOne({ title: args.title }).populate('author')
        if (foundBook) {
          throw new UserInputError('Book already exists', {
            invalidArgs: args.title,
          })
        }
  
        let foundAuthor = await Author.findOne({ name: args.author })
        if (!foundAuthor) {
          const author = new Author({ name: args.author, born: null })
          try {
            await author.save()
            foundAuthor = await Author.findOne({ name: args.author })
          } catch (error) {
            throw new UserInputError(error.message, {
              invalidArgs: args,
            })
          }
        }
  
        const book = new Book({ ...args, author: foundAuthor })
  
        try {
          await book.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        }
        pubsub.publish('BOOK_ADDED', { bookAdded: book })
        return book
      },
      editAuthor: async (root, args, context) => {
        if (!context.currentUser) {
          throw new AuthenticationError("not authenticated")
        }
        const author = await Author.findOne({ name: args.name })
        if (!author) {
          return null
        }
        author.born = args.setBornTo
        try {
          await author.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        }
        return author
      },
      createUser: async (root, args) => {
        const user = new User({ username: args.username, favouriteGenre: args.favouriteGenre })
    
        return user.save()
          .catch(error => {
            throw new UserInputError(error.message, {
              invalidArgs: args,
            })
          })
      },
      login: async (root, args) => {
        console.log(args)
        const users = await User.find({})
        console.log(users)
        const user = await User.findOne({ username: args.username })
        console.log(user)
        if ( !user || args.password !== 'secret' ) {
          throw new UserInputError("wrong credentials")
        }
    
        const userForToken = {
          username: user.username,
          id: user._id,
        }
    
        return { value: jwt.sign(userForToken, config.JWT_SECRET) }
      },
    },
    Subscription: {
        bookAdded: {
          subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
        },
      },
  }

  module.exports = resolvers
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async(request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 })
  console.log(blogs)
  response.json(blogs)
})

blogsRouter.post('/', async(request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const title = body.title
  const existingBlog = await Blog.findOne({ title })
  if (existingBlog) {
    return response.status(400).json({
      error: 'blog title must be unique'
    })
  }
  const user = request.user
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.get('/:id', async(request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.delete('/:id', async(request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'user not found' })
  }
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    if (blog.user.toString() !== user.id.toString()) {
      return response.status(401).json({ error: 'cannot delete another user\'s blog' })
    }
  } else {
    return response.status(404).end()
  }
  const userObject = await User.findById(user.id.toString())
  const userObjectBlogs = userObject.blogs
  await User.findByIdAndUpdate(blog.user.toString(), { blogs: userObjectBlogs.filter(blog => blog.id.toString() !== request.params.id) })
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async(request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: body.user
  }
  const blogResult = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true,
    runValidators: true, context: 'query' })
  response.json(blogResult)
})

module.exports = blogsRouter
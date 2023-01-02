const _ = require('lodash')

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce( function(a, b){
    return a + b.likes
  }, 0)
}

const favoriteBlog = (blogs) => {
  const favorite = blogs.reduce((prev, current) => (prev.likes > current.likes) ? prev : current, {})
  if (favorite === {}) {
    return {}
  } else {
    return { 'title': favorite.title, 'author': favorite.author, 'likes': favorite.likes }
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return {}
  const authorBlogs = _.map(_.countBy(blogs, 'author'), (val, key) => ({ 'author': key, 'blogs': val }))
  return authorBlogs.reduce((prev, current) => (prev.blogs > current.blogs) ? prev : current, {})
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return {}
  const authorLikes = _.map(_.groupBy(blogs, 'author'), (blogPosts, author) => ({
    author: author,
    likes: _.sumBy(blogPosts, 'likes')
  }))
  console.log(authorLikes)
  return authorLikes.reduce((prev, current) => (prev.likes > current.likes) ? prev : current, {})
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
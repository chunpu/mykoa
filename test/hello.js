var koa = require('../lib/app')
var app = koa()

app.use(function *(next) {
  /*
  var self = this
  yield function(next) {
    self.body = 'hi'
    next()
  }*/
  console.log({}.toString.call(next), 'next')
  this.a = this.url
  yield next
}).use(function *() {
  this.body = this.a
})
app.listen(2222)


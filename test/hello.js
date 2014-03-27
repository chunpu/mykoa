var koa = require('../lib/app')
var app = koa()

app.use(function *() {
  /*
  var self = this
  yield function(next) {
    self.body = 'hi'
    next()
  }*/
  this.body = 'hi'
})
app.listen(2222)


var http = require('http')
var co = require('co')

module.exports = function() {
  return new App
}

function App() {
  this.mw = [] // middleware
}

var app = App.prototype

app.listen = function() { // when listen, we create the Gen Func
  var server = http.createServer(this.callback())
  return server.listen.apply(server, arguments)
}

app.callback = function() {
  var self = this
  var fn = co(function* () {
    yield self.mw
  })
  return function(req, res) {
    var ctx = self.createContext(req, res)
    fn.call(ctx, ctx.onerror)
  }
}

app.use = function(fn) {
  this.mw.push(fn)
  return this
}

app.createContext = function(req, res) {
  return {
    req: req,
    res: res,
    set body(val) {
      this._body = val
    },
    onerror: function(err) {
      if (err) 
        return res.end('error')
      res.end(this._body)
    }
  }
}

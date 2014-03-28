var http = require('http')
var co = require('co')

module.exports = function() {
  return new App
}

function App() {
  this.mw = [] // middleware
}

function compose(arr) {
  return function* (next) {
    var i = arr.length
    var prev = next || function* () {}
    var curr
    while (i--) {
      curr = arr[i]
      prev = curr.call(this, prev)
      console.log(prev, 'prev')
    }
    yield gen
    //yield *gen
  }
}

var app = App.prototype

app.listen = function() { // when listen, we create the Gen Func
  var server = http.createServer(this.callback())
  return server.listen.apply(server, arguments)
}

app.callback = function() {
  var self = this
  var fn = co(compose(this.mw))
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

    // request

    get url() {
      return req.url
    },
    set url(v) {
      req.url = v
    },

    // response
    set body(val) {
      this._body = val
    },

    // other

    onerror: function(err) {
      if (err) {
        console.log(err)
        return res.end('error')
      }
      res.end(this._body)
    }
  }
}

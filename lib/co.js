module.exports = co
function co(Gen) {
  var gen = Gen
  if (isGeneratorFunction(gen)) {
    gen = gen()
  }
  return function(cb) {
    next()
    function next(err, arg) {
      if (err) {
        cb && cb(err)
        cb = undefined
      } else {
        if (gen.next) {
          var ret = gen.next(arg)
          console.log(ret)
          if (ret.done) {
            cb && cb(null, arg)
            cb = undefined
          } else {
            toThunk(ret.value)(next)
          }
        }
      }
    }
  }

  function isGeneratorFunction(Gen) {
    return Gen.constructor && Gen.constructor.name === 'GeneratorFunction'
  }

  function toThunk(o) {
    var fn
    if (o.constructor && o.constructor.name.indexOf('GeneratorFunction') === 0) fn = co
    else if (Array.isArray(o)) fn = arr2Thunk
    else if (Object.prototype.toString.call(o) === '[object Object]') fn = obj2Thunk
    if (fn) o = fn(o)
    return o
  }

  function arr2Thunk(arr) {
    return function(cb) {
      var len = arr.length
      var result = []
      arr.forEach(function(a, i) {
        var fn = toThunk(arr[i])
        fn(function(err, d) {
          if (err) cb(err)
          else {
            len --
            result[i] = d
            if (len === 0) cb(null, result)
          }
        })
      })
    }
  }

  function obj2Thunk(o) {
    return function(cb) {
      var arr = Object.keys(o)
      var len = arr.length
      var result = {}
      arr.forEach(function(a, i) {
        var fn = toThunk(o[arr[i]])
        fn(function(err, d) {
          if (err) cb(err)
          else {
            len --
            result[arr[i]] = d
            if (len === 0) cb(null, result)
          }
        })
      })
    }
  }

}
/*

// test

function delay(time) {
  return function(fn) {
    setTimeout(function() {
      fn(null, time)
    }, time)
  }
}

function* gen(time) {
  yield delay(time)
  yield delay(time + 100)
}

console.time(1)
co(function* () {
  yield {
    first: {
      key1: gen(200),
      key2: gen(100)
    },
    second: [delay(200), delay(100), delay(150)]
  }

})(function(err, d) {
  console.log(err, d)
  console.timeEnd(1)
})*/

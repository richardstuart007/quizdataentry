function MyQueryPromise(promise) {
  if (promise.isFulfilled) return promise

  // Set initial state
  var isPending = true
  var isRejected = false
  var isFulfilled = false

  // Observe the promise, saving the fulfillment in a closure scope.
  var result = promise.then(
    function (v) {
      isFulfilled = true
      isPending = false
      console.log(typeof v, v)
      return v
    },
    function (e) {
      isRejected = true
      isPending = false
      console.log(typeof e, e)
      throw e
    }
  )

  result.isFulfilled = function () {
    return isFulfilled
  }
  result.isPending = function () {
    return isPending
  }
  result.isRejected = function () {
    return isRejected
  }
  console.log(typeof result, result)
  return result
}

export default MyQueryPromise

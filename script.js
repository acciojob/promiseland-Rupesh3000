class CustomPromise {
  constructor() {
    // possible states: "pending", "fulfilled", "rejected"
    this.state = "pending";

    this.value = undefined;   // for resolve
    this.reason = undefined;  // for reject

    // store callbacks until promise settles
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    this.onFinallyCallbacks = [];
  }

  resolve(value) {
    if (this.state !== "pending") return;

    this.state = "fulfilled";
    this.value = value;

    // run all success handlers
    this.onFulfilledCallbacks.forEach((cb) => cb(value));

    // run finally handlers
    this.onFinallyCallbacks.forEach((cb) => cb());
  }

  reject(reason) {
    if (this.state !== "pending") return;

    this.state = "rejected";
    this.reason = reason;

    // run all rejection handlers
    this.onRejectedCallbacks.forEach((cb) => cb(reason));

    // run finally handlers
    this.onFinallyCallbacks.forEach((cb) => cb());
  }

  then(onFulfilled, onRejected) {
    // if already fulfilled
    if (this.state === "fulfilled") {
      if (typeof onFulfilled === "function") {
        onFulfilled(this.value);
      }
    }

    // if already rejected
    if (this.state === "rejected") {
      if (typeof onRejected === "function") {
        onRejected(this.reason);
      }
    }

    // if still pending, store callbacks
    if (this.state === "pending") {
      if (typeof onFulfilled === "function") {
        this.onFulfilledCallbacks.push(onFulfilled);
      }
      if (typeof onRejected === "function") {
        this.onRejectedCallbacks.push(onRejected);
      }
    }

    // return this for simple chaining (enough for this task)
    return this;
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  finally(onFinally) {
    if (this.state === "fulfilled" || this.state === "rejected") {
      if (typeof onFinally === "function") {
        onFinally();
      }
    } else {
      if (typeof onFinally === "function") {
        this.onFinallyCallbacks.push(onFinally);
      }
    }

    return this;
  }
}


window.CustomPromise = CustomPromise;

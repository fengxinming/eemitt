"use strict";
function addListener(emitter, eventName, fn, once, ctx) {
  var ehs = emitter._events[eventName];
  if (!ehs) {
    ehs = [];
    emitter._events[eventName] = ehs;
  }
  var type = typeof fn;
  if (type !== "function") {
    console.warn('Expect a function to bind "'.concat(eventName, '" event, but got ').concat(type, " ").concat(fn));
    return;
  }
  ehs[ehs.length] = { fn, once, ctx };
}
function addListeners(emitter, eventName, fn, once, ctx) {
  if (Array.isArray(eventName)) {
    eventName.forEach(function(n) {
      var type = typeof n;
      if (type !== "string") {
        console.warn("Expect a string as event name, but got ".concat(type, " ").concat(n));
      }
      addListener(emitter, n, fn, once, ctx);
    });
  } else {
    addListener(emitter, eventName, fn, once, ctx);
  }
  return emitter;
}
function removeListener(emitter, eventName, fn, once) {
  var listeners = emitter._events[eventName];
  if (!listeners) {
    return;
  }
  var type = typeof fn;
  if (type !== "function") {
    console.warn('Expect a function to bind "'.concat(eventName, '" event, but got a ').concat(type));
    return;
  }
  emitter._events[eventName] = listeners.filter(function(listener) {
    return listener.fn !== fn || once && !listener.once;
  });
}
function removeListeners(emitter, eventName, fn) {
  if (Array.isArray(eventName)) {
    eventName.forEach(function(n) {
      removeListener(emitter, n, fn, false);
    });
  } else {
    removeListener(emitter, eventName, fn, false);
  }
}
var EEvent = (
  /** @class */
  function() {
    function EEvent2(eventType, currentTarget) {
      this.target = currentTarget;
      this.currentTarget = currentTarget;
      this.isImmediatePropagationStopped = true;
      if (typeof eventType === "string") {
        this.type = eventType;
      } else {
        Object.assign(this, eventType);
      }
    }
    EEvent2.prototype.stopImmediatePropagation = function() {
      this.isImmediatePropagationStopped = false;
    };
    EEvent2.prototype.startImmediatePropagation = function() {
      this.isImmediatePropagationStopped = true;
    };
    return EEvent2;
  }()
);
var Emitter = (
  /** @class */
  function() {
    function Emitter2() {
      this._events = /* @__PURE__ */ Object.create(null);
    }
    Emitter2.prototype.on = function(eventName, fn, ctx) {
      return addListeners(this, eventName, fn, false, ctx);
    };
    Emitter2.prototype.once = function(eventName, fn, ctx) {
      return addListeners(this, eventName, fn, true, ctx);
    };
    Emitter2.prototype.off = function(eventName, fn) {
      removeListeners(this, eventName, fn);
      return this;
    };
    Emitter2.prototype.emit = function(eventType) {
      var evt = new EEvent(eventType, this);
      var type = evt.type;
      var currentListeners = this._events[type];
      var i = 0;
      if (!currentListeners) {
        return i;
      }
      var duplicates = currentListeners.slice(0);
      for (var len = duplicates.length; i < len; i++) {
        var _a = duplicates[i], fn = _a.fn, once = _a.once, ctx = _a.ctx;
        if (once) {
          removeListener(this, type, fn, once);
        }
        fn.call(ctx === void 0 ? this : ctx, evt);
        if (evt.isImmediatePropagationStopped === false) {
          break;
        }
      }
      return i;
    };
    Emitter2.prototype.removeAllListeners = function(eventName) {
      var _this = this;
      var len = arguments.length;
      switch (len) {
        case 0:
          this._events = /* @__PURE__ */ Object.create(null);
          break;
        case 1:
          if (Array.isArray(eventName)) {
            eventName.forEach(function(name) {
              delete _this._events[name];
            });
          } else {
            delete this._events[eventName];
          }
          break;
      }
      return this;
    };
    return Emitter2;
  }()
);
exports.EEvent = EEvent;
exports.Emitter = Emitter;

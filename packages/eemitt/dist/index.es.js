function addListener(emitter, eventName, fn, once, meta) {
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
  ehs[ehs.length] = { fn, once, meta };
}
function addListeners(emitter, eventName, fn, once, meta) {
  if (Array.isArray(eventName)) {
    eventName.forEach(function(n) {
      var type = typeof n;
      if (type !== "string") {
        console.warn("Expect a string as event name, but got ".concat(type, " ").concat(n));
      }
      addListener(emitter, n, fn, once, meta);
    });
  } else {
    addListener(emitter, eventName, fn, once, meta);
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
    Emitter2.prototype.on = function(eventName, fn, meta) {
      return addListeners(this, eventName, fn, false, meta);
    };
    Emitter2.prototype.once = function(eventName, fn, meta) {
      return addListeners(this, eventName, fn, true, meta);
    };
    Emitter2.prototype.off = function(eventName, fn) {
      removeListeners(this, eventName, fn);
      return this;
    };
    Emitter2.prototype.emit = function(eventArgs) {
      var evt = new EEvent(eventArgs, this);
      var type = evt.type;
      var els = this._events[type];
      var i = 0;
      if (!els) {
        return i;
      }
      for (var len = els.length; i < len; i++) {
        var _a = els[i], fn = _a.fn, once = _a.once, meta = _a.meta;
        if (once) {
          removeListener(this, type, fn, once);
        }
        fn.call(this, evt, meta);
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
export {
  EEvent,
  Emitter
};

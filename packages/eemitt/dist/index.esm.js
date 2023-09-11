function createEventHandler(fn, once, ctx) {
    return { fn: fn, once: once, ctx: ctx };
}
var EmitterEvent = /** @class */ (function () {
    function EmitterEvent(eventType, currentTarget) {
        this.target = currentTarget;
        this.currentTarget = currentTarget;
        this.isImmediatePropagationStopped = true;
        if (typeof eventType === 'string') {
            this.type = eventType;
        }
        else {
            Object.assign(this, eventType);
        }
    }
    EmitterEvent.prototype.stopImmediatePropagation = function () {
        this.isImmediatePropagationStopped = false;
    };
    return EmitterEvent;
}());
function addListener(emitter, eventName, fn, ctx, once) {
    var ehs = emitter._events[eventName];
    if (!ehs) {
        ehs = [];
        emitter._events[eventName] = ehs;
    }
    if (typeof fn !== 'function') {
        console.warn("Expect a function to bind \"".concat(eventName, "\" event, but got a ").concat(typeof fn));
        return;
    }
    var eh = createEventHandler(fn, once, ctx || emitter);
    ehs[ehs.length] = eh;
}
function addListeners(emitter, eventName, fn, ctx, once) {
    if (Array.isArray(eventName)) {
        eventName.forEach(function (n) {
            var type = typeof n;
            if (type !== 'string') {
                console.warn("Expect a string as event name, but got ".concat(type, " ").concat(n));
            }
            addListener(emitter, n, fn, ctx, once);
        });
    }
    else {
        addListener(emitter, eventName, fn, ctx, once);
    }
}
function removeListener(emitter, eventName, fn, once) {
    var listeners = emitter._events[eventName];
    if (!listeners) {
        return;
    }
    var type = typeof fn;
    if (type !== 'function') {
        console.warn("Expect a function to bind \"".concat(eventName, "\" event, but got a ").concat(type));
        return;
    }
    emitter._events[eventName] = listeners.filter(function (listener) {
        return listener.fn !== fn || (once && !listener.once);
    });
}
function removeListeners(emitter, eventName, fn) {
    if (Array.isArray(eventName)) {
        eventName.forEach(function (n) {
            removeListener(emitter, n, fn, false);
        });
    }
    else {
        removeListener(emitter, eventName, fn, false);
    }
}
function emit(emitter, eventType, cb) {
    var evt = new EmitterEvent(eventType, emitter);
    var type = evt.type;
    var els = emitter._events[type];
    var i = 0;
    if (!els) {
        return i;
    }
    for (var len = els.length; i < len; i++) {
        var _a = els[i], fn = _a.fn, once = _a.once, ctx = _a.ctx;
        // 只执行一次的情况
        if (once) {
            removeListener(emitter, type, fn, once);
        }
        // 执行事件回调函数
        cb(fn, ctx, evt);
        // 试图阻止当前事件广播
        if (evt.isImmediatePropagationStopped === false) {
            break;
        }
    }
    return i;
}
var Emitter = /** @class */ (function () {
    function Emitter() {
        this._events = Object.create(null);
    }
    Emitter.prototype.on = function (eventName, fn, ctx) {
        addListeners(this, eventName, fn, ctx, false);
        return this;
    };
    Emitter.prototype.once = function (eventName, fn, ctx) {
        addListeners(this, eventName, fn, ctx, true);
        return this;
    };
    Emitter.prototype.off = function (eventName, fn) {
        removeListeners(this, eventName, fn);
        return this;
    };
    Emitter.prototype.emit = function (eventType) {
        return emit(this, eventType, function (fn, ctx, evt) {
            fn.call(ctx, evt);
        });
    };
    Emitter.prototype.removeAllListeners = function (eventName) {
        var _this = this;
        var len = arguments.length;
        switch (len) {
            case 0:
                this._events = Object.create(null);
                break;
            case 1:
                if (Array.isArray(eventName)) {
                    eventName.forEach(function (name) {
                        delete _this._events[name];
                    });
                }
                else {
                    delete this._events[eventName];
                }
                break;
        }
        return this;
    };
    return Emitter;
}());

export { Emitter, EmitterEvent, addListener, addListeners, emit, removeListener, removeListeners };

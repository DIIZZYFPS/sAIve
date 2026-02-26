import Ct, { app as We, ipcMain as Nl, dialog as mr, BrowserWindow as Fl, shell as hc, net as pc } from "electron";
import rt from "fs";
import mc from "constants";
import gr from "stream";
import Zi from "util";
import xl from "assert";
import Ce from "path";
import Br, { spawn as gc } from "child_process";
import Ll from "events";
import vr from "crypto";
import Ul from "tty";
import Hr from "os";
import mt, { fileURLToPath as vc } from "url";
import Ec from "string_decoder";
import $l from "zlib";
import yc from "http";
var Qe = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, Rt = {}, Zr = {}, Pr = {}, ba;
function Ve() {
  return ba || (ba = 1, Pr.fromCallback = function(t) {
    return Object.defineProperty(function(...d) {
      if (typeof d[d.length - 1] == "function") t.apply(this, d);
      else
        return new Promise((h, c) => {
          d.push((f, u) => f != null ? c(f) : h(u)), t.apply(this, d);
        });
    }, "name", { value: t.name });
  }, Pr.fromPromise = function(t) {
    return Object.defineProperty(function(...d) {
      const h = d[d.length - 1];
      if (typeof h != "function") return t.apply(this, d);
      d.pop(), t.apply(this, d).then((c) => h(null, c), h);
    }, "name", { value: t.name });
  }), Pr;
}
var en, Pa;
function wc() {
  if (Pa) return en;
  Pa = 1;
  var t = mc, d = process.cwd, h = null, c = process.env.GRACEFUL_FS_PLATFORM || process.platform;
  process.cwd = function() {
    return h || (h = d.call(process)), h;
  };
  try {
    process.cwd();
  } catch {
  }
  if (typeof process.chdir == "function") {
    var f = process.chdir;
    process.chdir = function(a) {
      h = null, f.call(process, a);
    }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, f);
  }
  en = u;
  function u(a) {
    t.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && l(a), a.lutimes || o(a), a.chown = n(a.chown), a.fchown = n(a.fchown), a.lchown = n(a.lchown), a.chmod = s(a.chmod), a.fchmod = s(a.fchmod), a.lchmod = s(a.lchmod), a.chownSync = r(a.chownSync), a.fchownSync = r(a.fchownSync), a.lchownSync = r(a.lchownSync), a.chmodSync = i(a.chmodSync), a.fchmodSync = i(a.fchmodSync), a.lchmodSync = i(a.lchmodSync), a.stat = p(a.stat), a.fstat = p(a.fstat), a.lstat = p(a.lstat), a.statSync = g(a.statSync), a.fstatSync = g(a.fstatSync), a.lstatSync = g(a.lstatSync), a.chmod && !a.lchmod && (a.lchmod = function(m, w, S) {
      S && process.nextTick(S);
    }, a.lchmodSync = function() {
    }), a.chown && !a.lchown && (a.lchown = function(m, w, S, P) {
      P && process.nextTick(P);
    }, a.lchownSync = function() {
    }), c === "win32" && (a.rename = typeof a.rename != "function" ? a.rename : function(m) {
      function w(S, P, I) {
        var b = Date.now(), O = 0;
        m(S, P, function T(A) {
          if (A && (A.code === "EACCES" || A.code === "EPERM" || A.code === "EBUSY") && Date.now() - b < 6e4) {
            setTimeout(function() {
              a.stat(P, function(v, $) {
                v && v.code === "ENOENT" ? m(S, P, T) : I(A);
              });
            }, O), O < 100 && (O += 10);
            return;
          }
          I && I(A);
        });
      }
      return Object.setPrototypeOf && Object.setPrototypeOf(w, m), w;
    }(a.rename)), a.read = typeof a.read != "function" ? a.read : function(m) {
      function w(S, P, I, b, O, T) {
        var A;
        if (T && typeof T == "function") {
          var v = 0;
          A = function($, k, L) {
            if ($ && $.code === "EAGAIN" && v < 10)
              return v++, m.call(a, S, P, I, b, O, A);
            T.apply(this, arguments);
          };
        }
        return m.call(a, S, P, I, b, O, A);
      }
      return Object.setPrototypeOf && Object.setPrototypeOf(w, m), w;
    }(a.read), a.readSync = typeof a.readSync != "function" ? a.readSync : /* @__PURE__ */ function(m) {
      return function(w, S, P, I, b) {
        for (var O = 0; ; )
          try {
            return m.call(a, w, S, P, I, b);
          } catch (T) {
            if (T.code === "EAGAIN" && O < 10) {
              O++;
              continue;
            }
            throw T;
          }
      };
    }(a.readSync);
    function l(m) {
      m.lchmod = function(w, S, P) {
        m.open(
          w,
          t.O_WRONLY | t.O_SYMLINK,
          S,
          function(I, b) {
            if (I) {
              P && P(I);
              return;
            }
            m.fchmod(b, S, function(O) {
              m.close(b, function(T) {
                P && P(O || T);
              });
            });
          }
        );
      }, m.lchmodSync = function(w, S) {
        var P = m.openSync(w, t.O_WRONLY | t.O_SYMLINK, S), I = !0, b;
        try {
          b = m.fchmodSync(P, S), I = !1;
        } finally {
          if (I)
            try {
              m.closeSync(P);
            } catch {
            }
          else
            m.closeSync(P);
        }
        return b;
      };
    }
    function o(m) {
      t.hasOwnProperty("O_SYMLINK") && m.futimes ? (m.lutimes = function(w, S, P, I) {
        m.open(w, t.O_SYMLINK, function(b, O) {
          if (b) {
            I && I(b);
            return;
          }
          m.futimes(O, S, P, function(T) {
            m.close(O, function(A) {
              I && I(T || A);
            });
          });
        });
      }, m.lutimesSync = function(w, S, P) {
        var I = m.openSync(w, t.O_SYMLINK), b, O = !0;
        try {
          b = m.futimesSync(I, S, P), O = !1;
        } finally {
          if (O)
            try {
              m.closeSync(I);
            } catch {
            }
          else
            m.closeSync(I);
        }
        return b;
      }) : m.futimes && (m.lutimes = function(w, S, P, I) {
        I && process.nextTick(I);
      }, m.lutimesSync = function() {
      });
    }
    function s(m) {
      return m && function(w, S, P) {
        return m.call(a, w, S, function(I) {
          y(I) && (I = null), P && P.apply(this, arguments);
        });
      };
    }
    function i(m) {
      return m && function(w, S) {
        try {
          return m.call(a, w, S);
        } catch (P) {
          if (!y(P)) throw P;
        }
      };
    }
    function n(m) {
      return m && function(w, S, P, I) {
        return m.call(a, w, S, P, function(b) {
          y(b) && (b = null), I && I.apply(this, arguments);
        });
      };
    }
    function r(m) {
      return m && function(w, S, P) {
        try {
          return m.call(a, w, S, P);
        } catch (I) {
          if (!y(I)) throw I;
        }
      };
    }
    function p(m) {
      return m && function(w, S, P) {
        typeof S == "function" && (P = S, S = null);
        function I(b, O) {
          O && (O.uid < 0 && (O.uid += 4294967296), O.gid < 0 && (O.gid += 4294967296)), P && P.apply(this, arguments);
        }
        return S ? m.call(a, w, S, I) : m.call(a, w, I);
      };
    }
    function g(m) {
      return m && function(w, S) {
        var P = S ? m.call(a, w, S) : m.call(a, w);
        return P && (P.uid < 0 && (P.uid += 4294967296), P.gid < 0 && (P.gid += 4294967296)), P;
      };
    }
    function y(m) {
      if (!m || m.code === "ENOSYS")
        return !0;
      var w = !process.getuid || process.getuid() !== 0;
      return !!(w && (m.code === "EINVAL" || m.code === "EPERM"));
    }
  }
  return en;
}
var tn, Oa;
function _c() {
  if (Oa) return tn;
  Oa = 1;
  var t = gr.Stream;
  tn = d;
  function d(h) {
    return {
      ReadStream: c,
      WriteStream: f
    };
    function c(u, a) {
      if (!(this instanceof c)) return new c(u, a);
      t.call(this);
      var l = this;
      this.path = u, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", this.mode = 438, this.bufferSize = 64 * 1024, a = a || {};
      for (var o = Object.keys(a), s = 0, i = o.length; s < i; s++) {
        var n = o[s];
        this[n] = a[n];
      }
      if (this.encoding && this.setEncoding(this.encoding), this.start !== void 0) {
        if (typeof this.start != "number")
          throw TypeError("start must be a Number");
        if (this.end === void 0)
          this.end = 1 / 0;
        else if (typeof this.end != "number")
          throw TypeError("end must be a Number");
        if (this.start > this.end)
          throw new Error("start must be <= end");
        this.pos = this.start;
      }
      if (this.fd !== null) {
        process.nextTick(function() {
          l._read();
        });
        return;
      }
      h.open(this.path, this.flags, this.mode, function(r, p) {
        if (r) {
          l.emit("error", r), l.readable = !1;
          return;
        }
        l.fd = p, l.emit("open", p), l._read();
      });
    }
    function f(u, a) {
      if (!(this instanceof f)) return new f(u, a);
      t.call(this), this.path = u, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, a = a || {};
      for (var l = Object.keys(a), o = 0, s = l.length; o < s; o++) {
        var i = l[o];
        this[i] = a[i];
      }
      if (this.start !== void 0) {
        if (typeof this.start != "number")
          throw TypeError("start must be a Number");
        if (this.start < 0)
          throw new Error("start must be >= zero");
        this.pos = this.start;
      }
      this.busy = !1, this._queue = [], this.fd === null && (this._open = h.open, this._queue.push([this._open, this.path, this.flags, this.mode, void 0]), this.flush());
    }
  }
  return tn;
}
var rn, Ia;
function Rc() {
  if (Ia) return rn;
  Ia = 1, rn = d;
  var t = Object.getPrototypeOf || function(h) {
    return h.__proto__;
  };
  function d(h) {
    if (h === null || typeof h != "object")
      return h;
    if (h instanceof Object)
      var c = { __proto__: t(h) };
    else
      var c = /* @__PURE__ */ Object.create(null);
    return Object.getOwnPropertyNames(h).forEach(function(f) {
      Object.defineProperty(c, f, Object.getOwnPropertyDescriptor(h, f));
    }), c;
  }
  return rn;
}
var Or, Da;
function je() {
  if (Da) return Or;
  Da = 1;
  var t = rt, d = wc(), h = _c(), c = Rc(), f = Zi, u, a;
  typeof Symbol == "function" && typeof Symbol.for == "function" ? (u = Symbol.for("graceful-fs.queue"), a = Symbol.for("graceful-fs.previous")) : (u = "___graceful-fs.queue", a = "___graceful-fs.previous");
  function l() {
  }
  function o(m, w) {
    Object.defineProperty(m, u, {
      get: function() {
        return w;
      }
    });
  }
  var s = l;
  if (f.debuglog ? s = f.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (s = function() {
    var m = f.format.apply(f, arguments);
    m = "GFS4: " + m.split(/\n/).join(`
GFS4: `), console.error(m);
  }), !t[u]) {
    var i = Qe[u] || [];
    o(t, i), t.close = function(m) {
      function w(S, P) {
        return m.call(t, S, function(I) {
          I || g(), typeof P == "function" && P.apply(this, arguments);
        });
      }
      return Object.defineProperty(w, a, {
        value: m
      }), w;
    }(t.close), t.closeSync = function(m) {
      function w(S) {
        m.apply(t, arguments), g();
      }
      return Object.defineProperty(w, a, {
        value: m
      }), w;
    }(t.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
      s(t[u]), xl.equal(t[u].length, 0);
    });
  }
  Qe[u] || o(Qe, t[u]), Or = n(c(t)), process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !t.__patched && (Or = n(t), t.__patched = !0);
  function n(m) {
    d(m), m.gracefulify = n, m.createReadStream = de, m.createWriteStream = ie;
    var w = m.readFile;
    m.readFile = S;
    function S(Q, ge, _) {
      return typeof ge == "function" && (_ = ge, ge = null), E(Q, ge, _);
      function E(H, x, ce, me) {
        return w(H, x, function(he) {
          he && (he.code === "EMFILE" || he.code === "ENFILE") ? r([E, [H, x, ce], he, me || Date.now(), Date.now()]) : typeof ce == "function" && ce.apply(this, arguments);
        });
      }
    }
    var P = m.writeFile;
    m.writeFile = I;
    function I(Q, ge, _, E) {
      return typeof _ == "function" && (E = _, _ = null), H(Q, ge, _, E);
      function H(x, ce, me, he, _e) {
        return P(x, ce, me, function(Ee) {
          Ee && (Ee.code === "EMFILE" || Ee.code === "ENFILE") ? r([H, [x, ce, me, he], Ee, _e || Date.now(), Date.now()]) : typeof he == "function" && he.apply(this, arguments);
        });
      }
    }
    var b = m.appendFile;
    b && (m.appendFile = O);
    function O(Q, ge, _, E) {
      return typeof _ == "function" && (E = _, _ = null), H(Q, ge, _, E);
      function H(x, ce, me, he, _e) {
        return b(x, ce, me, function(Ee) {
          Ee && (Ee.code === "EMFILE" || Ee.code === "ENFILE") ? r([H, [x, ce, me, he], Ee, _e || Date.now(), Date.now()]) : typeof he == "function" && he.apply(this, arguments);
        });
      }
    }
    var T = m.copyFile;
    T && (m.copyFile = A);
    function A(Q, ge, _, E) {
      return typeof _ == "function" && (E = _, _ = 0), H(Q, ge, _, E);
      function H(x, ce, me, he, _e) {
        return T(x, ce, me, function(Ee) {
          Ee && (Ee.code === "EMFILE" || Ee.code === "ENFILE") ? r([H, [x, ce, me, he], Ee, _e || Date.now(), Date.now()]) : typeof he == "function" && he.apply(this, arguments);
        });
      }
    }
    var v = m.readdir;
    m.readdir = k;
    var $ = /^v[0-5]\./;
    function k(Q, ge, _) {
      typeof ge == "function" && (_ = ge, ge = null);
      var E = $.test(process.version) ? function(ce, me, he, _e) {
        return v(ce, H(
          ce,
          me,
          he,
          _e
        ));
      } : function(ce, me, he, _e) {
        return v(ce, me, H(
          ce,
          me,
          he,
          _e
        ));
      };
      return E(Q, ge, _);
      function H(x, ce, me, he) {
        return function(_e, Ee) {
          _e && (_e.code === "EMFILE" || _e.code === "ENFILE") ? r([
            E,
            [x, ce, me],
            _e,
            he || Date.now(),
            Date.now()
          ]) : (Ee && Ee.sort && Ee.sort(), typeof me == "function" && me.call(this, _e, Ee));
        };
      }
    }
    if (process.version.substr(0, 4) === "v0.8") {
      var L = h(m);
      D = L.ReadStream, V = L.WriteStream;
    }
    var q = m.ReadStream;
    q && (D.prototype = Object.create(q.prototype), D.prototype.open = G);
    var F = m.WriteStream;
    F && (V.prototype = Object.create(F.prototype), V.prototype.open = te), Object.defineProperty(m, "ReadStream", {
      get: function() {
        return D;
      },
      set: function(Q) {
        D = Q;
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(m, "WriteStream", {
      get: function() {
        return V;
      },
      set: function(Q) {
        V = Q;
      },
      enumerable: !0,
      configurable: !0
    });
    var N = D;
    Object.defineProperty(m, "FileReadStream", {
      get: function() {
        return N;
      },
      set: function(Q) {
        N = Q;
      },
      enumerable: !0,
      configurable: !0
    });
    var j = V;
    Object.defineProperty(m, "FileWriteStream", {
      get: function() {
        return j;
      },
      set: function(Q) {
        j = Q;
      },
      enumerable: !0,
      configurable: !0
    });
    function D(Q, ge) {
      return this instanceof D ? (q.apply(this, arguments), this) : D.apply(Object.create(D.prototype), arguments);
    }
    function G() {
      var Q = this;
      ve(Q.path, Q.flags, Q.mode, function(ge, _) {
        ge ? (Q.autoClose && Q.destroy(), Q.emit("error", ge)) : (Q.fd = _, Q.emit("open", _), Q.read());
      });
    }
    function V(Q, ge) {
      return this instanceof V ? (F.apply(this, arguments), this) : V.apply(Object.create(V.prototype), arguments);
    }
    function te() {
      var Q = this;
      ve(Q.path, Q.flags, Q.mode, function(ge, _) {
        ge ? (Q.destroy(), Q.emit("error", ge)) : (Q.fd = _, Q.emit("open", _));
      });
    }
    function de(Q, ge) {
      return new m.ReadStream(Q, ge);
    }
    function ie(Q, ge) {
      return new m.WriteStream(Q, ge);
    }
    var we = m.open;
    m.open = ve;
    function ve(Q, ge, _, E) {
      return typeof _ == "function" && (E = _, _ = null), H(Q, ge, _, E);
      function H(x, ce, me, he, _e) {
        return we(x, ce, me, function(Ee, He) {
          Ee && (Ee.code === "EMFILE" || Ee.code === "ENFILE") ? r([H, [x, ce, me, he], Ee, _e || Date.now(), Date.now()]) : typeof he == "function" && he.apply(this, arguments);
        });
      }
    }
    return m;
  }
  function r(m) {
    s("ENQUEUE", m[0].name, m[1]), t[u].push(m), y();
  }
  var p;
  function g() {
    for (var m = Date.now(), w = 0; w < t[u].length; ++w)
      t[u][w].length > 2 && (t[u][w][3] = m, t[u][w][4] = m);
    y();
  }
  function y() {
    if (clearTimeout(p), p = void 0, t[u].length !== 0) {
      var m = t[u].shift(), w = m[0], S = m[1], P = m[2], I = m[3], b = m[4];
      if (I === void 0)
        s("RETRY", w.name, S), w.apply(null, S);
      else if (Date.now() - I >= 6e4) {
        s("TIMEOUT", w.name, S);
        var O = S.pop();
        typeof O == "function" && O.call(null, P);
      } else {
        var T = Date.now() - b, A = Math.max(b - I, 1), v = Math.min(A * 1.2, 100);
        T >= v ? (s("RETRY", w.name, S), w.apply(null, S.concat([I]))) : t[u].push(m);
      }
      p === void 0 && (p = setTimeout(y, 0));
    }
  }
  return Or;
}
var Na;
function kt() {
  return Na || (Na = 1, function(t) {
    const d = Ve().fromCallback, h = je(), c = [
      "access",
      "appendFile",
      "chmod",
      "chown",
      "close",
      "copyFile",
      "fchmod",
      "fchown",
      "fdatasync",
      "fstat",
      "fsync",
      "ftruncate",
      "futimes",
      "lchmod",
      "lchown",
      "link",
      "lstat",
      "mkdir",
      "mkdtemp",
      "open",
      "opendir",
      "readdir",
      "readFile",
      "readlink",
      "realpath",
      "rename",
      "rm",
      "rmdir",
      "stat",
      "symlink",
      "truncate",
      "unlink",
      "utimes",
      "writeFile"
    ].filter((f) => typeof h[f] == "function");
    Object.assign(t, h), c.forEach((f) => {
      t[f] = d(h[f]);
    }), t.exists = function(f, u) {
      return typeof u == "function" ? h.exists(f, u) : new Promise((a) => h.exists(f, a));
    }, t.read = function(f, u, a, l, o, s) {
      return typeof s == "function" ? h.read(f, u, a, l, o, s) : new Promise((i, n) => {
        h.read(f, u, a, l, o, (r, p, g) => {
          if (r) return n(r);
          i({ bytesRead: p, buffer: g });
        });
      });
    }, t.write = function(f, u, ...a) {
      return typeof a[a.length - 1] == "function" ? h.write(f, u, ...a) : new Promise((l, o) => {
        h.write(f, u, ...a, (s, i, n) => {
          if (s) return o(s);
          l({ bytesWritten: i, buffer: n });
        });
      });
    }, typeof h.writev == "function" && (t.writev = function(f, u, ...a) {
      return typeof a[a.length - 1] == "function" ? h.writev(f, u, ...a) : new Promise((l, o) => {
        h.writev(f, u, ...a, (s, i, n) => {
          if (s) return o(s);
          l({ bytesWritten: i, buffers: n });
        });
      });
    }), typeof h.realpath.native == "function" ? t.realpath.native = d(h.realpath.native) : process.emitWarning(
      "fs.realpath.native is not a function. Is fs being monkey-patched?",
      "Warning",
      "fs-extra-WARN0003"
    );
  }(Zr)), Zr;
}
var Ir = {}, nn = {}, Fa;
function Ac() {
  if (Fa) return nn;
  Fa = 1;
  const t = Ce;
  return nn.checkPath = function(h) {
    if (process.platform === "win32" && /[<>:"|?*]/.test(h.replace(t.parse(h).root, ""))) {
      const f = new Error(`Path contains invalid characters: ${h}`);
      throw f.code = "EINVAL", f;
    }
  }, nn;
}
var xa;
function Sc() {
  if (xa) return Ir;
  xa = 1;
  const t = /* @__PURE__ */ kt(), { checkPath: d } = /* @__PURE__ */ Ac(), h = (c) => {
    const f = { mode: 511 };
    return typeof c == "number" ? c : { ...f, ...c }.mode;
  };
  return Ir.makeDir = async (c, f) => (d(c), t.mkdir(c, {
    mode: h(f),
    recursive: !0
  })), Ir.makeDirSync = (c, f) => (d(c), t.mkdirSync(c, {
    mode: h(f),
    recursive: !0
  })), Ir;
}
var an, La;
function nt() {
  if (La) return an;
  La = 1;
  const t = Ve().fromPromise, { makeDir: d, makeDirSync: h } = /* @__PURE__ */ Sc(), c = t(d);
  return an = {
    mkdirs: c,
    mkdirsSync: h,
    // alias
    mkdirp: c,
    mkdirpSync: h,
    ensureDir: c,
    ensureDirSync: h
  }, an;
}
var on, Ua;
function bt() {
  if (Ua) return on;
  Ua = 1;
  const t = Ve().fromPromise, d = /* @__PURE__ */ kt();
  function h(c) {
    return d.access(c).then(() => !0).catch(() => !1);
  }
  return on = {
    pathExists: t(h),
    pathExistsSync: d.existsSync
  }, on;
}
var sn, $a;
function kl() {
  if ($a) return sn;
  $a = 1;
  const t = je();
  function d(c, f, u, a) {
    t.open(c, "r+", (l, o) => {
      if (l) return a(l);
      t.futimes(o, f, u, (s) => {
        t.close(o, (i) => {
          a && a(s || i);
        });
      });
    });
  }
  function h(c, f, u) {
    const a = t.openSync(c, "r+");
    return t.futimesSync(a, f, u), t.closeSync(a);
  }
  return sn = {
    utimesMillis: d,
    utimesMillisSync: h
  }, sn;
}
var ln, ka;
function qt() {
  if (ka) return ln;
  ka = 1;
  const t = /* @__PURE__ */ kt(), d = Ce, h = Zi;
  function c(r, p, g) {
    const y = g.dereference ? (m) => t.stat(m, { bigint: !0 }) : (m) => t.lstat(m, { bigint: !0 });
    return Promise.all([
      y(r),
      y(p).catch((m) => {
        if (m.code === "ENOENT") return null;
        throw m;
      })
    ]).then(([m, w]) => ({ srcStat: m, destStat: w }));
  }
  function f(r, p, g) {
    let y;
    const m = g.dereference ? (S) => t.statSync(S, { bigint: !0 }) : (S) => t.lstatSync(S, { bigint: !0 }), w = m(r);
    try {
      y = m(p);
    } catch (S) {
      if (S.code === "ENOENT") return { srcStat: w, destStat: null };
      throw S;
    }
    return { srcStat: w, destStat: y };
  }
  function u(r, p, g, y, m) {
    h.callbackify(c)(r, p, y, (w, S) => {
      if (w) return m(w);
      const { srcStat: P, destStat: I } = S;
      if (I) {
        if (s(P, I)) {
          const b = d.basename(r), O = d.basename(p);
          return g === "move" && b !== O && b.toLowerCase() === O.toLowerCase() ? m(null, { srcStat: P, destStat: I, isChangingCase: !0 }) : m(new Error("Source and destination must not be the same."));
        }
        if (P.isDirectory() && !I.isDirectory())
          return m(new Error(`Cannot overwrite non-directory '${p}' with directory '${r}'.`));
        if (!P.isDirectory() && I.isDirectory())
          return m(new Error(`Cannot overwrite directory '${p}' with non-directory '${r}'.`));
      }
      return P.isDirectory() && i(r, p) ? m(new Error(n(r, p, g))) : m(null, { srcStat: P, destStat: I });
    });
  }
  function a(r, p, g, y) {
    const { srcStat: m, destStat: w } = f(r, p, y);
    if (w) {
      if (s(m, w)) {
        const S = d.basename(r), P = d.basename(p);
        if (g === "move" && S !== P && S.toLowerCase() === P.toLowerCase())
          return { srcStat: m, destStat: w, isChangingCase: !0 };
        throw new Error("Source and destination must not be the same.");
      }
      if (m.isDirectory() && !w.isDirectory())
        throw new Error(`Cannot overwrite non-directory '${p}' with directory '${r}'.`);
      if (!m.isDirectory() && w.isDirectory())
        throw new Error(`Cannot overwrite directory '${p}' with non-directory '${r}'.`);
    }
    if (m.isDirectory() && i(r, p))
      throw new Error(n(r, p, g));
    return { srcStat: m, destStat: w };
  }
  function l(r, p, g, y, m) {
    const w = d.resolve(d.dirname(r)), S = d.resolve(d.dirname(g));
    if (S === w || S === d.parse(S).root) return m();
    t.stat(S, { bigint: !0 }, (P, I) => P ? P.code === "ENOENT" ? m() : m(P) : s(p, I) ? m(new Error(n(r, g, y))) : l(r, p, S, y, m));
  }
  function o(r, p, g, y) {
    const m = d.resolve(d.dirname(r)), w = d.resolve(d.dirname(g));
    if (w === m || w === d.parse(w).root) return;
    let S;
    try {
      S = t.statSync(w, { bigint: !0 });
    } catch (P) {
      if (P.code === "ENOENT") return;
      throw P;
    }
    if (s(p, S))
      throw new Error(n(r, g, y));
    return o(r, p, w, y);
  }
  function s(r, p) {
    return p.ino && p.dev && p.ino === r.ino && p.dev === r.dev;
  }
  function i(r, p) {
    const g = d.resolve(r).split(d.sep).filter((m) => m), y = d.resolve(p).split(d.sep).filter((m) => m);
    return g.reduce((m, w, S) => m && y[S] === w, !0);
  }
  function n(r, p, g) {
    return `Cannot ${g} '${r}' to a subdirectory of itself, '${p}'.`;
  }
  return ln = {
    checkPaths: u,
    checkPathsSync: a,
    checkParentPaths: l,
    checkParentPathsSync: o,
    isSrcSubdir: i,
    areIdentical: s
  }, ln;
}
var un, qa;
function Tc() {
  if (qa) return un;
  qa = 1;
  const t = je(), d = Ce, h = nt().mkdirs, c = bt().pathExists, f = kl().utimesMillis, u = /* @__PURE__ */ qt();
  function a(k, L, q, F) {
    typeof q == "function" && !F ? (F = q, q = {}) : typeof q == "function" && (q = { filter: q }), F = F || function() {
    }, q = q || {}, q.clobber = "clobber" in q ? !!q.clobber : !0, q.overwrite = "overwrite" in q ? !!q.overwrite : q.clobber, q.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
      `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
      "Warning",
      "fs-extra-WARN0001"
    ), u.checkPaths(k, L, "copy", q, (N, j) => {
      if (N) return F(N);
      const { srcStat: D, destStat: G } = j;
      u.checkParentPaths(k, D, L, "copy", (V) => V ? F(V) : q.filter ? o(l, G, k, L, q, F) : l(G, k, L, q, F));
    });
  }
  function l(k, L, q, F, N) {
    const j = d.dirname(q);
    c(j, (D, G) => {
      if (D) return N(D);
      if (G) return i(k, L, q, F, N);
      h(j, (V) => V ? N(V) : i(k, L, q, F, N));
    });
  }
  function o(k, L, q, F, N, j) {
    Promise.resolve(N.filter(q, F)).then((D) => D ? k(L, q, F, N, j) : j(), (D) => j(D));
  }
  function s(k, L, q, F, N) {
    return F.filter ? o(i, k, L, q, F, N) : i(k, L, q, F, N);
  }
  function i(k, L, q, F, N) {
    (F.dereference ? t.stat : t.lstat)(L, (D, G) => D ? N(D) : G.isDirectory() ? I(G, k, L, q, F, N) : G.isFile() || G.isCharacterDevice() || G.isBlockDevice() ? n(G, k, L, q, F, N) : G.isSymbolicLink() ? v(k, L, q, F, N) : G.isSocket() ? N(new Error(`Cannot copy a socket file: ${L}`)) : G.isFIFO() ? N(new Error(`Cannot copy a FIFO pipe: ${L}`)) : N(new Error(`Unknown file: ${L}`)));
  }
  function n(k, L, q, F, N, j) {
    return L ? r(k, q, F, N, j) : p(k, q, F, N, j);
  }
  function r(k, L, q, F, N) {
    if (F.overwrite)
      t.unlink(q, (j) => j ? N(j) : p(k, L, q, F, N));
    else return F.errorOnExist ? N(new Error(`'${q}' already exists`)) : N();
  }
  function p(k, L, q, F, N) {
    t.copyFile(L, q, (j) => j ? N(j) : F.preserveTimestamps ? g(k.mode, L, q, N) : S(q, k.mode, N));
  }
  function g(k, L, q, F) {
    return y(k) ? m(q, k, (N) => N ? F(N) : w(k, L, q, F)) : w(k, L, q, F);
  }
  function y(k) {
    return (k & 128) === 0;
  }
  function m(k, L, q) {
    return S(k, L | 128, q);
  }
  function w(k, L, q, F) {
    P(L, q, (N) => N ? F(N) : S(q, k, F));
  }
  function S(k, L, q) {
    return t.chmod(k, L, q);
  }
  function P(k, L, q) {
    t.stat(k, (F, N) => F ? q(F) : f(L, N.atime, N.mtime, q));
  }
  function I(k, L, q, F, N, j) {
    return L ? O(q, F, N, j) : b(k.mode, q, F, N, j);
  }
  function b(k, L, q, F, N) {
    t.mkdir(q, (j) => {
      if (j) return N(j);
      O(L, q, F, (D) => D ? N(D) : S(q, k, N));
    });
  }
  function O(k, L, q, F) {
    t.readdir(k, (N, j) => N ? F(N) : T(j, k, L, q, F));
  }
  function T(k, L, q, F, N) {
    const j = k.pop();
    return j ? A(k, j, L, q, F, N) : N();
  }
  function A(k, L, q, F, N, j) {
    const D = d.join(q, L), G = d.join(F, L);
    u.checkPaths(D, G, "copy", N, (V, te) => {
      if (V) return j(V);
      const { destStat: de } = te;
      s(de, D, G, N, (ie) => ie ? j(ie) : T(k, q, F, N, j));
    });
  }
  function v(k, L, q, F, N) {
    t.readlink(L, (j, D) => {
      if (j) return N(j);
      if (F.dereference && (D = d.resolve(process.cwd(), D)), k)
        t.readlink(q, (G, V) => G ? G.code === "EINVAL" || G.code === "UNKNOWN" ? t.symlink(D, q, N) : N(G) : (F.dereference && (V = d.resolve(process.cwd(), V)), u.isSrcSubdir(D, V) ? N(new Error(`Cannot copy '${D}' to a subdirectory of itself, '${V}'.`)) : k.isDirectory() && u.isSrcSubdir(V, D) ? N(new Error(`Cannot overwrite '${V}' with '${D}'.`)) : $(D, q, N)));
      else
        return t.symlink(D, q, N);
    });
  }
  function $(k, L, q) {
    t.unlink(L, (F) => F ? q(F) : t.symlink(k, L, q));
  }
  return un = a, un;
}
var cn, Ma;
function Cc() {
  if (Ma) return cn;
  Ma = 1;
  const t = je(), d = Ce, h = nt().mkdirsSync, c = kl().utimesMillisSync, f = /* @__PURE__ */ qt();
  function u(T, A, v) {
    typeof v == "function" && (v = { filter: v }), v = v || {}, v.clobber = "clobber" in v ? !!v.clobber : !0, v.overwrite = "overwrite" in v ? !!v.overwrite : v.clobber, v.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
      `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
      "Warning",
      "fs-extra-WARN0002"
    );
    const { srcStat: $, destStat: k } = f.checkPathsSync(T, A, "copy", v);
    return f.checkParentPathsSync(T, $, A, "copy"), a(k, T, A, v);
  }
  function a(T, A, v, $) {
    if ($.filter && !$.filter(A, v)) return;
    const k = d.dirname(v);
    return t.existsSync(k) || h(k), o(T, A, v, $);
  }
  function l(T, A, v, $) {
    if (!($.filter && !$.filter(A, v)))
      return o(T, A, v, $);
  }
  function o(T, A, v, $) {
    const L = ($.dereference ? t.statSync : t.lstatSync)(A);
    if (L.isDirectory()) return w(L, T, A, v, $);
    if (L.isFile() || L.isCharacterDevice() || L.isBlockDevice()) return s(L, T, A, v, $);
    if (L.isSymbolicLink()) return b(T, A, v, $);
    throw L.isSocket() ? new Error(`Cannot copy a socket file: ${A}`) : L.isFIFO() ? new Error(`Cannot copy a FIFO pipe: ${A}`) : new Error(`Unknown file: ${A}`);
  }
  function s(T, A, v, $, k) {
    return A ? i(T, v, $, k) : n(T, v, $, k);
  }
  function i(T, A, v, $) {
    if ($.overwrite)
      return t.unlinkSync(v), n(T, A, v, $);
    if ($.errorOnExist)
      throw new Error(`'${v}' already exists`);
  }
  function n(T, A, v, $) {
    return t.copyFileSync(A, v), $.preserveTimestamps && r(T.mode, A, v), y(v, T.mode);
  }
  function r(T, A, v) {
    return p(T) && g(v, T), m(A, v);
  }
  function p(T) {
    return (T & 128) === 0;
  }
  function g(T, A) {
    return y(T, A | 128);
  }
  function y(T, A) {
    return t.chmodSync(T, A);
  }
  function m(T, A) {
    const v = t.statSync(T);
    return c(A, v.atime, v.mtime);
  }
  function w(T, A, v, $, k) {
    return A ? P(v, $, k) : S(T.mode, v, $, k);
  }
  function S(T, A, v, $) {
    return t.mkdirSync(v), P(A, v, $), y(v, T);
  }
  function P(T, A, v) {
    t.readdirSync(T).forEach(($) => I($, T, A, v));
  }
  function I(T, A, v, $) {
    const k = d.join(A, T), L = d.join(v, T), { destStat: q } = f.checkPathsSync(k, L, "copy", $);
    return l(q, k, L, $);
  }
  function b(T, A, v, $) {
    let k = t.readlinkSync(A);
    if ($.dereference && (k = d.resolve(process.cwd(), k)), T) {
      let L;
      try {
        L = t.readlinkSync(v);
      } catch (q) {
        if (q.code === "EINVAL" || q.code === "UNKNOWN") return t.symlinkSync(k, v);
        throw q;
      }
      if ($.dereference && (L = d.resolve(process.cwd(), L)), f.isSrcSubdir(k, L))
        throw new Error(`Cannot copy '${k}' to a subdirectory of itself, '${L}'.`);
      if (t.statSync(v).isDirectory() && f.isSrcSubdir(L, k))
        throw new Error(`Cannot overwrite '${L}' with '${k}'.`);
      return O(k, v);
    } else
      return t.symlinkSync(k, v);
  }
  function O(T, A) {
    return t.unlinkSync(A), t.symlinkSync(T, A);
  }
  return cn = u, cn;
}
var fn, Ba;
function ea() {
  if (Ba) return fn;
  Ba = 1;
  const t = Ve().fromCallback;
  return fn = {
    copy: t(/* @__PURE__ */ Tc()),
    copySync: /* @__PURE__ */ Cc()
  }, fn;
}
var dn, Ha;
function bc() {
  if (Ha) return dn;
  Ha = 1;
  const t = je(), d = Ce, h = xl, c = process.platform === "win32";
  function f(g) {
    [
      "unlink",
      "chmod",
      "stat",
      "lstat",
      "rmdir",
      "readdir"
    ].forEach((m) => {
      g[m] = g[m] || t[m], m = m + "Sync", g[m] = g[m] || t[m];
    }), g.maxBusyTries = g.maxBusyTries || 3;
  }
  function u(g, y, m) {
    let w = 0;
    typeof y == "function" && (m = y, y = {}), h(g, "rimraf: missing path"), h.strictEqual(typeof g, "string", "rimraf: path should be a string"), h.strictEqual(typeof m, "function", "rimraf: callback function required"), h(y, "rimraf: invalid options argument provided"), h.strictEqual(typeof y, "object", "rimraf: options should be object"), f(y), a(g, y, function S(P) {
      if (P) {
        if ((P.code === "EBUSY" || P.code === "ENOTEMPTY" || P.code === "EPERM") && w < y.maxBusyTries) {
          w++;
          const I = w * 100;
          return setTimeout(() => a(g, y, S), I);
        }
        P.code === "ENOENT" && (P = null);
      }
      m(P);
    });
  }
  function a(g, y, m) {
    h(g), h(y), h(typeof m == "function"), y.lstat(g, (w, S) => {
      if (w && w.code === "ENOENT")
        return m(null);
      if (w && w.code === "EPERM" && c)
        return l(g, y, w, m);
      if (S && S.isDirectory())
        return s(g, y, w, m);
      y.unlink(g, (P) => {
        if (P) {
          if (P.code === "ENOENT")
            return m(null);
          if (P.code === "EPERM")
            return c ? l(g, y, P, m) : s(g, y, P, m);
          if (P.code === "EISDIR")
            return s(g, y, P, m);
        }
        return m(P);
      });
    });
  }
  function l(g, y, m, w) {
    h(g), h(y), h(typeof w == "function"), y.chmod(g, 438, (S) => {
      S ? w(S.code === "ENOENT" ? null : m) : y.stat(g, (P, I) => {
        P ? w(P.code === "ENOENT" ? null : m) : I.isDirectory() ? s(g, y, m, w) : y.unlink(g, w);
      });
    });
  }
  function o(g, y, m) {
    let w;
    h(g), h(y);
    try {
      y.chmodSync(g, 438);
    } catch (S) {
      if (S.code === "ENOENT")
        return;
      throw m;
    }
    try {
      w = y.statSync(g);
    } catch (S) {
      if (S.code === "ENOENT")
        return;
      throw m;
    }
    w.isDirectory() ? r(g, y, m) : y.unlinkSync(g);
  }
  function s(g, y, m, w) {
    h(g), h(y), h(typeof w == "function"), y.rmdir(g, (S) => {
      S && (S.code === "ENOTEMPTY" || S.code === "EEXIST" || S.code === "EPERM") ? i(g, y, w) : S && S.code === "ENOTDIR" ? w(m) : w(S);
    });
  }
  function i(g, y, m) {
    h(g), h(y), h(typeof m == "function"), y.readdir(g, (w, S) => {
      if (w) return m(w);
      let P = S.length, I;
      if (P === 0) return y.rmdir(g, m);
      S.forEach((b) => {
        u(d.join(g, b), y, (O) => {
          if (!I) {
            if (O) return m(I = O);
            --P === 0 && y.rmdir(g, m);
          }
        });
      });
    });
  }
  function n(g, y) {
    let m;
    y = y || {}, f(y), h(g, "rimraf: missing path"), h.strictEqual(typeof g, "string", "rimraf: path should be a string"), h(y, "rimraf: missing options"), h.strictEqual(typeof y, "object", "rimraf: options should be object");
    try {
      m = y.lstatSync(g);
    } catch (w) {
      if (w.code === "ENOENT")
        return;
      w.code === "EPERM" && c && o(g, y, w);
    }
    try {
      m && m.isDirectory() ? r(g, y, null) : y.unlinkSync(g);
    } catch (w) {
      if (w.code === "ENOENT")
        return;
      if (w.code === "EPERM")
        return c ? o(g, y, w) : r(g, y, w);
      if (w.code !== "EISDIR")
        throw w;
      r(g, y, w);
    }
  }
  function r(g, y, m) {
    h(g), h(y);
    try {
      y.rmdirSync(g);
    } catch (w) {
      if (w.code === "ENOTDIR")
        throw m;
      if (w.code === "ENOTEMPTY" || w.code === "EEXIST" || w.code === "EPERM")
        p(g, y);
      else if (w.code !== "ENOENT")
        throw w;
    }
  }
  function p(g, y) {
    if (h(g), h(y), y.readdirSync(g).forEach((m) => n(d.join(g, m), y)), c) {
      const m = Date.now();
      do
        try {
          return y.rmdirSync(g, y);
        } catch {
        }
      while (Date.now() - m < 500);
    } else
      return y.rmdirSync(g, y);
  }
  return dn = u, u.sync = n, dn;
}
var hn, ja;
function jr() {
  if (ja) return hn;
  ja = 1;
  const t = je(), d = Ve().fromCallback, h = /* @__PURE__ */ bc();
  function c(u, a) {
    if (t.rm) return t.rm(u, { recursive: !0, force: !0 }, a);
    h(u, a);
  }
  function f(u) {
    if (t.rmSync) return t.rmSync(u, { recursive: !0, force: !0 });
    h.sync(u);
  }
  return hn = {
    remove: d(c),
    removeSync: f
  }, hn;
}
var pn, Ga;
function Pc() {
  if (Ga) return pn;
  Ga = 1;
  const t = Ve().fromPromise, d = /* @__PURE__ */ kt(), h = Ce, c = /* @__PURE__ */ nt(), f = /* @__PURE__ */ jr(), u = t(async function(o) {
    let s;
    try {
      s = await d.readdir(o);
    } catch {
      return c.mkdirs(o);
    }
    return Promise.all(s.map((i) => f.remove(h.join(o, i))));
  });
  function a(l) {
    let o;
    try {
      o = d.readdirSync(l);
    } catch {
      return c.mkdirsSync(l);
    }
    o.forEach((s) => {
      s = h.join(l, s), f.removeSync(s);
    });
  }
  return pn = {
    emptyDirSync: a,
    emptydirSync: a,
    emptyDir: u,
    emptydir: u
  }, pn;
}
var mn, Wa;
function Oc() {
  if (Wa) return mn;
  Wa = 1;
  const t = Ve().fromCallback, d = Ce, h = je(), c = /* @__PURE__ */ nt();
  function f(a, l) {
    function o() {
      h.writeFile(a, "", (s) => {
        if (s) return l(s);
        l();
      });
    }
    h.stat(a, (s, i) => {
      if (!s && i.isFile()) return l();
      const n = d.dirname(a);
      h.stat(n, (r, p) => {
        if (r)
          return r.code === "ENOENT" ? c.mkdirs(n, (g) => {
            if (g) return l(g);
            o();
          }) : l(r);
        p.isDirectory() ? o() : h.readdir(n, (g) => {
          if (g) return l(g);
        });
      });
    });
  }
  function u(a) {
    let l;
    try {
      l = h.statSync(a);
    } catch {
    }
    if (l && l.isFile()) return;
    const o = d.dirname(a);
    try {
      h.statSync(o).isDirectory() || h.readdirSync(o);
    } catch (s) {
      if (s && s.code === "ENOENT") c.mkdirsSync(o);
      else throw s;
    }
    h.writeFileSync(a, "");
  }
  return mn = {
    createFile: t(f),
    createFileSync: u
  }, mn;
}
var gn, Va;
function Ic() {
  if (Va) return gn;
  Va = 1;
  const t = Ve().fromCallback, d = Ce, h = je(), c = /* @__PURE__ */ nt(), f = bt().pathExists, { areIdentical: u } = /* @__PURE__ */ qt();
  function a(o, s, i) {
    function n(r, p) {
      h.link(r, p, (g) => {
        if (g) return i(g);
        i(null);
      });
    }
    h.lstat(s, (r, p) => {
      h.lstat(o, (g, y) => {
        if (g)
          return g.message = g.message.replace("lstat", "ensureLink"), i(g);
        if (p && u(y, p)) return i(null);
        const m = d.dirname(s);
        f(m, (w, S) => {
          if (w) return i(w);
          if (S) return n(o, s);
          c.mkdirs(m, (P) => {
            if (P) return i(P);
            n(o, s);
          });
        });
      });
    });
  }
  function l(o, s) {
    let i;
    try {
      i = h.lstatSync(s);
    } catch {
    }
    try {
      const p = h.lstatSync(o);
      if (i && u(p, i)) return;
    } catch (p) {
      throw p.message = p.message.replace("lstat", "ensureLink"), p;
    }
    const n = d.dirname(s);
    return h.existsSync(n) || c.mkdirsSync(n), h.linkSync(o, s);
  }
  return gn = {
    createLink: t(a),
    createLinkSync: l
  }, gn;
}
var vn, Ya;
function Dc() {
  if (Ya) return vn;
  Ya = 1;
  const t = Ce, d = je(), h = bt().pathExists;
  function c(u, a, l) {
    if (t.isAbsolute(u))
      return d.lstat(u, (o) => o ? (o.message = o.message.replace("lstat", "ensureSymlink"), l(o)) : l(null, {
        toCwd: u,
        toDst: u
      }));
    {
      const o = t.dirname(a), s = t.join(o, u);
      return h(s, (i, n) => i ? l(i) : n ? l(null, {
        toCwd: s,
        toDst: u
      }) : d.lstat(u, (r) => r ? (r.message = r.message.replace("lstat", "ensureSymlink"), l(r)) : l(null, {
        toCwd: u,
        toDst: t.relative(o, u)
      })));
    }
  }
  function f(u, a) {
    let l;
    if (t.isAbsolute(u)) {
      if (l = d.existsSync(u), !l) throw new Error("absolute srcpath does not exist");
      return {
        toCwd: u,
        toDst: u
      };
    } else {
      const o = t.dirname(a), s = t.join(o, u);
      if (l = d.existsSync(s), l)
        return {
          toCwd: s,
          toDst: u
        };
      if (l = d.existsSync(u), !l) throw new Error("relative srcpath does not exist");
      return {
        toCwd: u,
        toDst: t.relative(o, u)
      };
    }
  }
  return vn = {
    symlinkPaths: c,
    symlinkPathsSync: f
  }, vn;
}
var En, za;
function Nc() {
  if (za) return En;
  za = 1;
  const t = je();
  function d(c, f, u) {
    if (u = typeof f == "function" ? f : u, f = typeof f == "function" ? !1 : f, f) return u(null, f);
    t.lstat(c, (a, l) => {
      if (a) return u(null, "file");
      f = l && l.isDirectory() ? "dir" : "file", u(null, f);
    });
  }
  function h(c, f) {
    let u;
    if (f) return f;
    try {
      u = t.lstatSync(c);
    } catch {
      return "file";
    }
    return u && u.isDirectory() ? "dir" : "file";
  }
  return En = {
    symlinkType: d,
    symlinkTypeSync: h
  }, En;
}
var yn, Xa;
function Fc() {
  if (Xa) return yn;
  Xa = 1;
  const t = Ve().fromCallback, d = Ce, h = /* @__PURE__ */ kt(), c = /* @__PURE__ */ nt(), f = c.mkdirs, u = c.mkdirsSync, a = /* @__PURE__ */ Dc(), l = a.symlinkPaths, o = a.symlinkPathsSync, s = /* @__PURE__ */ Nc(), i = s.symlinkType, n = s.symlinkTypeSync, r = bt().pathExists, { areIdentical: p } = /* @__PURE__ */ qt();
  function g(w, S, P, I) {
    I = typeof P == "function" ? P : I, P = typeof P == "function" ? !1 : P, h.lstat(S, (b, O) => {
      !b && O.isSymbolicLink() ? Promise.all([
        h.stat(w),
        h.stat(S)
      ]).then(([T, A]) => {
        if (p(T, A)) return I(null);
        y(w, S, P, I);
      }) : y(w, S, P, I);
    });
  }
  function y(w, S, P, I) {
    l(w, S, (b, O) => {
      if (b) return I(b);
      w = O.toDst, i(O.toCwd, P, (T, A) => {
        if (T) return I(T);
        const v = d.dirname(S);
        r(v, ($, k) => {
          if ($) return I($);
          if (k) return h.symlink(w, S, A, I);
          f(v, (L) => {
            if (L) return I(L);
            h.symlink(w, S, A, I);
          });
        });
      });
    });
  }
  function m(w, S, P) {
    let I;
    try {
      I = h.lstatSync(S);
    } catch {
    }
    if (I && I.isSymbolicLink()) {
      const A = h.statSync(w), v = h.statSync(S);
      if (p(A, v)) return;
    }
    const b = o(w, S);
    w = b.toDst, P = n(b.toCwd, P);
    const O = d.dirname(S);
    return h.existsSync(O) || u(O), h.symlinkSync(w, S, P);
  }
  return yn = {
    createSymlink: t(g),
    createSymlinkSync: m
  }, yn;
}
var wn, Ka;
function xc() {
  if (Ka) return wn;
  Ka = 1;
  const { createFile: t, createFileSync: d } = /* @__PURE__ */ Oc(), { createLink: h, createLinkSync: c } = /* @__PURE__ */ Ic(), { createSymlink: f, createSymlinkSync: u } = /* @__PURE__ */ Fc();
  return wn = {
    // file
    createFile: t,
    createFileSync: d,
    ensureFile: t,
    ensureFileSync: d,
    // link
    createLink: h,
    createLinkSync: c,
    ensureLink: h,
    ensureLinkSync: c,
    // symlink
    createSymlink: f,
    createSymlinkSync: u,
    ensureSymlink: f,
    ensureSymlinkSync: u
  }, wn;
}
var _n, Ja;
function ta() {
  if (Ja) return _n;
  Ja = 1;
  function t(h, { EOL: c = `
`, finalEOL: f = !0, replacer: u = null, spaces: a } = {}) {
    const l = f ? c : "";
    return JSON.stringify(h, u, a).replace(/\n/g, c) + l;
  }
  function d(h) {
    return Buffer.isBuffer(h) && (h = h.toString("utf8")), h.replace(/^\uFEFF/, "");
  }
  return _n = { stringify: t, stripBom: d }, _n;
}
var Rn, Qa;
function Lc() {
  if (Qa) return Rn;
  Qa = 1;
  let t;
  try {
    t = je();
  } catch {
    t = rt;
  }
  const d = Ve(), { stringify: h, stripBom: c } = ta();
  async function f(i, n = {}) {
    typeof n == "string" && (n = { encoding: n });
    const r = n.fs || t, p = "throws" in n ? n.throws : !0;
    let g = await d.fromCallback(r.readFile)(i, n);
    g = c(g);
    let y;
    try {
      y = JSON.parse(g, n ? n.reviver : null);
    } catch (m) {
      if (p)
        throw m.message = `${i}: ${m.message}`, m;
      return null;
    }
    return y;
  }
  const u = d.fromPromise(f);
  function a(i, n = {}) {
    typeof n == "string" && (n = { encoding: n });
    const r = n.fs || t, p = "throws" in n ? n.throws : !0;
    try {
      let g = r.readFileSync(i, n);
      return g = c(g), JSON.parse(g, n.reviver);
    } catch (g) {
      if (p)
        throw g.message = `${i}: ${g.message}`, g;
      return null;
    }
  }
  async function l(i, n, r = {}) {
    const p = r.fs || t, g = h(n, r);
    await d.fromCallback(p.writeFile)(i, g, r);
  }
  const o = d.fromPromise(l);
  function s(i, n, r = {}) {
    const p = r.fs || t, g = h(n, r);
    return p.writeFileSync(i, g, r);
  }
  return Rn = {
    readFile: u,
    readFileSync: a,
    writeFile: o,
    writeFileSync: s
  }, Rn;
}
var An, Za;
function Uc() {
  if (Za) return An;
  Za = 1;
  const t = Lc();
  return An = {
    // jsonfile exports
    readJson: t.readFile,
    readJsonSync: t.readFileSync,
    writeJson: t.writeFile,
    writeJsonSync: t.writeFileSync
  }, An;
}
var Sn, eo;
function ra() {
  if (eo) return Sn;
  eo = 1;
  const t = Ve().fromCallback, d = je(), h = Ce, c = /* @__PURE__ */ nt(), f = bt().pathExists;
  function u(l, o, s, i) {
    typeof s == "function" && (i = s, s = "utf8");
    const n = h.dirname(l);
    f(n, (r, p) => {
      if (r) return i(r);
      if (p) return d.writeFile(l, o, s, i);
      c.mkdirs(n, (g) => {
        if (g) return i(g);
        d.writeFile(l, o, s, i);
      });
    });
  }
  function a(l, ...o) {
    const s = h.dirname(l);
    if (d.existsSync(s))
      return d.writeFileSync(l, ...o);
    c.mkdirsSync(s), d.writeFileSync(l, ...o);
  }
  return Sn = {
    outputFile: t(u),
    outputFileSync: a
  }, Sn;
}
var Tn, to;
function $c() {
  if (to) return Tn;
  to = 1;
  const { stringify: t } = ta(), { outputFile: d } = /* @__PURE__ */ ra();
  async function h(c, f, u = {}) {
    const a = t(f, u);
    await d(c, a, u);
  }
  return Tn = h, Tn;
}
var Cn, ro;
function kc() {
  if (ro) return Cn;
  ro = 1;
  const { stringify: t } = ta(), { outputFileSync: d } = /* @__PURE__ */ ra();
  function h(c, f, u) {
    const a = t(f, u);
    d(c, a, u);
  }
  return Cn = h, Cn;
}
var bn, no;
function qc() {
  if (no) return bn;
  no = 1;
  const t = Ve().fromPromise, d = /* @__PURE__ */ Uc();
  return d.outputJson = t(/* @__PURE__ */ $c()), d.outputJsonSync = /* @__PURE__ */ kc(), d.outputJSON = d.outputJson, d.outputJSONSync = d.outputJsonSync, d.writeJSON = d.writeJson, d.writeJSONSync = d.writeJsonSync, d.readJSON = d.readJson, d.readJSONSync = d.readJsonSync, bn = d, bn;
}
var Pn, io;
function Mc() {
  if (io) return Pn;
  io = 1;
  const t = je(), d = Ce, h = ea().copy, c = jr().remove, f = nt().mkdirp, u = bt().pathExists, a = /* @__PURE__ */ qt();
  function l(r, p, g, y) {
    typeof g == "function" && (y = g, g = {}), g = g || {};
    const m = g.overwrite || g.clobber || !1;
    a.checkPaths(r, p, "move", g, (w, S) => {
      if (w) return y(w);
      const { srcStat: P, isChangingCase: I = !1 } = S;
      a.checkParentPaths(r, P, p, "move", (b) => {
        if (b) return y(b);
        if (o(p)) return s(r, p, m, I, y);
        f(d.dirname(p), (O) => O ? y(O) : s(r, p, m, I, y));
      });
    });
  }
  function o(r) {
    const p = d.dirname(r);
    return d.parse(p).root === p;
  }
  function s(r, p, g, y, m) {
    if (y) return i(r, p, g, m);
    if (g)
      return c(p, (w) => w ? m(w) : i(r, p, g, m));
    u(p, (w, S) => w ? m(w) : S ? m(new Error("dest already exists.")) : i(r, p, g, m));
  }
  function i(r, p, g, y) {
    t.rename(r, p, (m) => m ? m.code !== "EXDEV" ? y(m) : n(r, p, g, y) : y());
  }
  function n(r, p, g, y) {
    h(r, p, {
      overwrite: g,
      errorOnExist: !0
    }, (w) => w ? y(w) : c(r, y));
  }
  return Pn = l, Pn;
}
var On, ao;
function Bc() {
  if (ao) return On;
  ao = 1;
  const t = je(), d = Ce, h = ea().copySync, c = jr().removeSync, f = nt().mkdirpSync, u = /* @__PURE__ */ qt();
  function a(n, r, p) {
    p = p || {};
    const g = p.overwrite || p.clobber || !1, { srcStat: y, isChangingCase: m = !1 } = u.checkPathsSync(n, r, "move", p);
    return u.checkParentPathsSync(n, y, r, "move"), l(r) || f(d.dirname(r)), o(n, r, g, m);
  }
  function l(n) {
    const r = d.dirname(n);
    return d.parse(r).root === r;
  }
  function o(n, r, p, g) {
    if (g) return s(n, r, p);
    if (p)
      return c(r), s(n, r, p);
    if (t.existsSync(r)) throw new Error("dest already exists.");
    return s(n, r, p);
  }
  function s(n, r, p) {
    try {
      t.renameSync(n, r);
    } catch (g) {
      if (g.code !== "EXDEV") throw g;
      return i(n, r, p);
    }
  }
  function i(n, r, p) {
    return h(n, r, {
      overwrite: p,
      errorOnExist: !0
    }), c(n);
  }
  return On = a, On;
}
var In, oo;
function Hc() {
  if (oo) return In;
  oo = 1;
  const t = Ve().fromCallback;
  return In = {
    move: t(/* @__PURE__ */ Mc()),
    moveSync: /* @__PURE__ */ Bc()
  }, In;
}
var Dn, so;
function gt() {
  return so || (so = 1, Dn = {
    // Export promiseified graceful-fs:
    .../* @__PURE__ */ kt(),
    // Export extra methods:
    .../* @__PURE__ */ ea(),
    .../* @__PURE__ */ Pc(),
    .../* @__PURE__ */ xc(),
    .../* @__PURE__ */ qc(),
    .../* @__PURE__ */ nt(),
    .../* @__PURE__ */ Hc(),
    .../* @__PURE__ */ ra(),
    .../* @__PURE__ */ bt(),
    .../* @__PURE__ */ jr()
  }), Dn;
}
var jt = {}, At = {}, Nn = {}, St = {}, lo;
function na() {
  if (lo) return St;
  lo = 1, Object.defineProperty(St, "__esModule", { value: !0 }), St.CancellationError = St.CancellationToken = void 0;
  const t = Ll;
  let d = class extends t.EventEmitter {
    get cancelled() {
      return this._cancelled || this._parent != null && this._parent.cancelled;
    }
    set parent(f) {
      this.removeParentCancelHandler(), this._parent = f, this.parentCancelHandler = () => this.cancel(), this._parent.onCancel(this.parentCancelHandler);
    }
    // babel cannot compile ... correctly for super calls
    constructor(f) {
      super(), this.parentCancelHandler = null, this._parent = null, this._cancelled = !1, f != null && (this.parent = f);
    }
    cancel() {
      this._cancelled = !0, this.emit("cancel");
    }
    onCancel(f) {
      this.cancelled ? f() : this.once("cancel", f);
    }
    createPromise(f) {
      if (this.cancelled)
        return Promise.reject(new h());
      const u = () => {
        if (a != null)
          try {
            this.removeListener("cancel", a), a = null;
          } catch {
          }
      };
      let a = null;
      return new Promise((l, o) => {
        let s = null;
        if (a = () => {
          try {
            s != null && (s(), s = null);
          } finally {
            o(new h());
          }
        }, this.cancelled) {
          a();
          return;
        }
        this.onCancel(a), f(l, o, (i) => {
          s = i;
        });
      }).then((l) => (u(), l)).catch((l) => {
        throw u(), l;
      });
    }
    removeParentCancelHandler() {
      const f = this._parent;
      f != null && this.parentCancelHandler != null && (f.removeListener("cancel", this.parentCancelHandler), this.parentCancelHandler = null);
    }
    dispose() {
      try {
        this.removeParentCancelHandler();
      } finally {
        this.removeAllListeners(), this._parent = null;
      }
    }
  };
  St.CancellationToken = d;
  class h extends Error {
    constructor() {
      super("cancelled");
    }
  }
  return St.CancellationError = h, St;
}
var Dr = {}, uo;
function Gr() {
  if (uo) return Dr;
  uo = 1, Object.defineProperty(Dr, "__esModule", { value: !0 }), Dr.newError = t;
  function t(d, h) {
    const c = new Error(d);
    return c.code = h, c;
  }
  return Dr;
}
var $e = {}, Nr = { exports: {} }, Fr = { exports: {} }, Fn, co;
function jc() {
  if (co) return Fn;
  co = 1;
  var t = 1e3, d = t * 60, h = d * 60, c = h * 24, f = c * 7, u = c * 365.25;
  Fn = function(i, n) {
    n = n || {};
    var r = typeof i;
    if (r === "string" && i.length > 0)
      return a(i);
    if (r === "number" && isFinite(i))
      return n.long ? o(i) : l(i);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(i)
    );
  };
  function a(i) {
    if (i = String(i), !(i.length > 100)) {
      var n = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        i
      );
      if (n) {
        var r = parseFloat(n[1]), p = (n[2] || "ms").toLowerCase();
        switch (p) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return r * u;
          case "weeks":
          case "week":
          case "w":
            return r * f;
          case "days":
          case "day":
          case "d":
            return r * c;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return r * h;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return r * d;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return r * t;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return r;
          default:
            return;
        }
      }
    }
  }
  function l(i) {
    var n = Math.abs(i);
    return n >= c ? Math.round(i / c) + "d" : n >= h ? Math.round(i / h) + "h" : n >= d ? Math.round(i / d) + "m" : n >= t ? Math.round(i / t) + "s" : i + "ms";
  }
  function o(i) {
    var n = Math.abs(i);
    return n >= c ? s(i, n, c, "day") : n >= h ? s(i, n, h, "hour") : n >= d ? s(i, n, d, "minute") : n >= t ? s(i, n, t, "second") : i + " ms";
  }
  function s(i, n, r, p) {
    var g = n >= r * 1.5;
    return Math.round(i / r) + " " + p + (g ? "s" : "");
  }
  return Fn;
}
var xn, fo;
function ql() {
  if (fo) return xn;
  fo = 1;
  function t(d) {
    c.debug = c, c.default = c, c.coerce = s, c.disable = l, c.enable = u, c.enabled = o, c.humanize = jc(), c.destroy = i, Object.keys(d).forEach((n) => {
      c[n] = d[n];
    }), c.names = [], c.skips = [], c.formatters = {};
    function h(n) {
      let r = 0;
      for (let p = 0; p < n.length; p++)
        r = (r << 5) - r + n.charCodeAt(p), r |= 0;
      return c.colors[Math.abs(r) % c.colors.length];
    }
    c.selectColor = h;
    function c(n) {
      let r, p = null, g, y;
      function m(...w) {
        if (!m.enabled)
          return;
        const S = m, P = Number(/* @__PURE__ */ new Date()), I = P - (r || P);
        S.diff = I, S.prev = r, S.curr = P, r = P, w[0] = c.coerce(w[0]), typeof w[0] != "string" && w.unshift("%O");
        let b = 0;
        w[0] = w[0].replace(/%([a-zA-Z%])/g, (T, A) => {
          if (T === "%%")
            return "%";
          b++;
          const v = c.formatters[A];
          if (typeof v == "function") {
            const $ = w[b];
            T = v.call(S, $), w.splice(b, 1), b--;
          }
          return T;
        }), c.formatArgs.call(S, w), (S.log || c.log).apply(S, w);
      }
      return m.namespace = n, m.useColors = c.useColors(), m.color = c.selectColor(n), m.extend = f, m.destroy = c.destroy, Object.defineProperty(m, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => p !== null ? p : (g !== c.namespaces && (g = c.namespaces, y = c.enabled(n)), y),
        set: (w) => {
          p = w;
        }
      }), typeof c.init == "function" && c.init(m), m;
    }
    function f(n, r) {
      const p = c(this.namespace + (typeof r > "u" ? ":" : r) + n);
      return p.log = this.log, p;
    }
    function u(n) {
      c.save(n), c.namespaces = n, c.names = [], c.skips = [];
      const r = (typeof n == "string" ? n : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
      for (const p of r)
        p[0] === "-" ? c.skips.push(p.slice(1)) : c.names.push(p);
    }
    function a(n, r) {
      let p = 0, g = 0, y = -1, m = 0;
      for (; p < n.length; )
        if (g < r.length && (r[g] === n[p] || r[g] === "*"))
          r[g] === "*" ? (y = g, m = p, g++) : (p++, g++);
        else if (y !== -1)
          g = y + 1, m++, p = m;
        else
          return !1;
      for (; g < r.length && r[g] === "*"; )
        g++;
      return g === r.length;
    }
    function l() {
      const n = [
        ...c.names,
        ...c.skips.map((r) => "-" + r)
      ].join(",");
      return c.enable(""), n;
    }
    function o(n) {
      for (const r of c.skips)
        if (a(n, r))
          return !1;
      for (const r of c.names)
        if (a(n, r))
          return !0;
      return !1;
    }
    function s(n) {
      return n instanceof Error ? n.stack || n.message : n;
    }
    function i() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    return c.enable(c.load()), c;
  }
  return xn = t, xn;
}
var ho;
function Gc() {
  return ho || (ho = 1, function(t, d) {
    d.formatArgs = c, d.save = f, d.load = u, d.useColors = h, d.storage = a(), d.destroy = /* @__PURE__ */ (() => {
      let o = !1;
      return () => {
        o || (o = !0, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
      };
    })(), d.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function h() {
      if (typeof window < "u" && window.process && (window.process.type === "renderer" || window.process.__nwjs))
        return !0;
      if (typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))
        return !1;
      let o;
      return typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && (o = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(o[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function c(o) {
      if (o[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + o[0] + (this.useColors ? "%c " : " ") + "+" + t.exports.humanize(this.diff), !this.useColors)
        return;
      const s = "color: " + this.color;
      o.splice(1, 0, s, "color: inherit");
      let i = 0, n = 0;
      o[0].replace(/%[a-zA-Z%]/g, (r) => {
        r !== "%%" && (i++, r === "%c" && (n = i));
      }), o.splice(n, 0, s);
    }
    d.log = console.debug || console.log || (() => {
    });
    function f(o) {
      try {
        o ? d.storage.setItem("debug", o) : d.storage.removeItem("debug");
      } catch {
      }
    }
    function u() {
      let o;
      try {
        o = d.storage.getItem("debug") || d.storage.getItem("DEBUG");
      } catch {
      }
      return !o && typeof process < "u" && "env" in process && (o = process.env.DEBUG), o;
    }
    function a() {
      try {
        return localStorage;
      } catch {
      }
    }
    t.exports = ql()(d);
    const { formatters: l } = t.exports;
    l.j = function(o) {
      try {
        return JSON.stringify(o);
      } catch (s) {
        return "[UnexpectedJSONParseError]: " + s.message;
      }
    };
  }(Fr, Fr.exports)), Fr.exports;
}
var xr = { exports: {} }, Ln, po;
function Wc() {
  return po || (po = 1, Ln = (t, d = process.argv) => {
    const h = t.startsWith("-") ? "" : t.length === 1 ? "-" : "--", c = d.indexOf(h + t), f = d.indexOf("--");
    return c !== -1 && (f === -1 || c < f);
  }), Ln;
}
var Un, mo;
function Vc() {
  if (mo) return Un;
  mo = 1;
  const t = Hr, d = Ul, h = Wc(), { env: c } = process;
  let f;
  h("no-color") || h("no-colors") || h("color=false") || h("color=never") ? f = 0 : (h("color") || h("colors") || h("color=true") || h("color=always")) && (f = 1);
  function u() {
    if ("FORCE_COLOR" in c)
      return c.FORCE_COLOR === "true" ? 1 : c.FORCE_COLOR === "false" ? 0 : c.FORCE_COLOR.length === 0 ? 1 : Math.min(Number.parseInt(c.FORCE_COLOR, 10), 3);
  }
  function a(s) {
    return s === 0 ? !1 : {
      level: s,
      hasBasic: !0,
      has256: s >= 2,
      has16m: s >= 3
    };
  }
  function l(s, { streamIsTTY: i, sniffFlags: n = !0 } = {}) {
    const r = u();
    r !== void 0 && (f = r);
    const p = n ? f : r;
    if (p === 0)
      return 0;
    if (n) {
      if (h("color=16m") || h("color=full") || h("color=truecolor"))
        return 3;
      if (h("color=256"))
        return 2;
    }
    if (s && !i && p === void 0)
      return 0;
    const g = p || 0;
    if (c.TERM === "dumb")
      return g;
    if (process.platform === "win32") {
      const y = t.release().split(".");
      return Number(y[0]) >= 10 && Number(y[2]) >= 10586 ? Number(y[2]) >= 14931 ? 3 : 2 : 1;
    }
    if ("CI" in c)
      return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE", "DRONE"].some((y) => y in c) || c.CI_NAME === "codeship" ? 1 : g;
    if ("TEAMCITY_VERSION" in c)
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(c.TEAMCITY_VERSION) ? 1 : 0;
    if (c.COLORTERM === "truecolor")
      return 3;
    if ("TERM_PROGRAM" in c) {
      const y = Number.parseInt((c.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (c.TERM_PROGRAM) {
        case "iTerm.app":
          return y >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    return /-256(color)?$/i.test(c.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(c.TERM) || "COLORTERM" in c ? 1 : g;
  }
  function o(s, i = {}) {
    const n = l(s, {
      streamIsTTY: s && s.isTTY,
      ...i
    });
    return a(n);
  }
  return Un = {
    supportsColor: o,
    stdout: o({ isTTY: d.isatty(1) }),
    stderr: o({ isTTY: d.isatty(2) })
  }, Un;
}
var go;
function Yc() {
  return go || (go = 1, function(t, d) {
    const h = Ul, c = Zi;
    d.init = i, d.log = l, d.formatArgs = u, d.save = o, d.load = s, d.useColors = f, d.destroy = c.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), d.colors = [6, 2, 3, 4, 5, 1];
    try {
      const r = Vc();
      r && (r.stderr || r).level >= 2 && (d.colors = [
        20,
        21,
        26,
        27,
        32,
        33,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        56,
        57,
        62,
        63,
        68,
        69,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        92,
        93,
        98,
        99,
        112,
        113,
        128,
        129,
        134,
        135,
        148,
        149,
        160,
        161,
        162,
        163,
        164,
        165,
        166,
        167,
        168,
        169,
        170,
        171,
        172,
        173,
        178,
        179,
        184,
        185,
        196,
        197,
        198,
        199,
        200,
        201,
        202,
        203,
        204,
        205,
        206,
        207,
        208,
        209,
        214,
        215,
        220,
        221
      ]);
    } catch {
    }
    d.inspectOpts = Object.keys(process.env).filter((r) => /^debug_/i.test(r)).reduce((r, p) => {
      const g = p.substring(6).toLowerCase().replace(/_([a-z])/g, (m, w) => w.toUpperCase());
      let y = process.env[p];
      return /^(yes|on|true|enabled)$/i.test(y) ? y = !0 : /^(no|off|false|disabled)$/i.test(y) ? y = !1 : y === "null" ? y = null : y = Number(y), r[g] = y, r;
    }, {});
    function f() {
      return "colors" in d.inspectOpts ? !!d.inspectOpts.colors : h.isatty(process.stderr.fd);
    }
    function u(r) {
      const { namespace: p, useColors: g } = this;
      if (g) {
        const y = this.color, m = "\x1B[3" + (y < 8 ? y : "8;5;" + y), w = `  ${m};1m${p} \x1B[0m`;
        r[0] = w + r[0].split(`
`).join(`
` + w), r.push(m + "m+" + t.exports.humanize(this.diff) + "\x1B[0m");
      } else
        r[0] = a() + p + " " + r[0];
    }
    function a() {
      return d.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function l(...r) {
      return process.stderr.write(c.formatWithOptions(d.inspectOpts, ...r) + `
`);
    }
    function o(r) {
      r ? process.env.DEBUG = r : delete process.env.DEBUG;
    }
    function s() {
      return process.env.DEBUG;
    }
    function i(r) {
      r.inspectOpts = {};
      const p = Object.keys(d.inspectOpts);
      for (let g = 0; g < p.length; g++)
        r.inspectOpts[p[g]] = d.inspectOpts[p[g]];
    }
    t.exports = ql()(d);
    const { formatters: n } = t.exports;
    n.o = function(r) {
      return this.inspectOpts.colors = this.useColors, c.inspect(r, this.inspectOpts).split(`
`).map((p) => p.trim()).join(" ");
    }, n.O = function(r) {
      return this.inspectOpts.colors = this.useColors, c.inspect(r, this.inspectOpts);
    };
  }(xr, xr.exports)), xr.exports;
}
var vo;
function zc() {
  return vo || (vo = 1, typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? Nr.exports = Gc() : Nr.exports = Yc()), Nr.exports;
}
var Gt = {}, Eo;
function Ml() {
  if (Eo) return Gt;
  Eo = 1, Object.defineProperty(Gt, "__esModule", { value: !0 }), Gt.ProgressCallbackTransform = void 0;
  const t = gr;
  let d = class extends t.Transform {
    constructor(c, f, u) {
      super(), this.total = c, this.cancellationToken = f, this.onProgress = u, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.nextUpdate = this.start + 1e3;
    }
    _transform(c, f, u) {
      if (this.cancellationToken.cancelled) {
        u(new Error("cancelled"), null);
        return;
      }
      this.transferred += c.length, this.delta += c.length;
      const a = Date.now();
      a >= this.nextUpdate && this.transferred !== this.total && (this.nextUpdate = a + 1e3, this.onProgress({
        total: this.total,
        delta: this.delta,
        transferred: this.transferred,
        percent: this.transferred / this.total * 100,
        bytesPerSecond: Math.round(this.transferred / ((a - this.start) / 1e3))
      }), this.delta = 0), u(null, c);
    }
    _flush(c) {
      if (this.cancellationToken.cancelled) {
        c(new Error("cancelled"));
        return;
      }
      this.onProgress({
        total: this.total,
        delta: this.delta,
        transferred: this.total,
        percent: 100,
        bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
      }), this.delta = 0, c(null);
    }
  };
  return Gt.ProgressCallbackTransform = d, Gt;
}
var yo;
function Xc() {
  if (yo) return $e;
  yo = 1, Object.defineProperty($e, "__esModule", { value: !0 }), $e.DigestTransform = $e.HttpExecutor = $e.HttpError = void 0, $e.createHttpError = s, $e.parseJson = r, $e.configureRequestOptionsFromUrl = y, $e.configureRequestUrl = m, $e.safeGetHeader = P, $e.configureRequestOptions = b, $e.safeStringifyJson = O;
  const t = vr, d = zc(), h = rt, c = gr, f = mt, u = na(), a = Gr(), l = Ml(), o = (0, d.default)("electron-builder");
  function s(T, A = null) {
    return new n(T.statusCode || -1, `${T.statusCode} ${T.statusMessage}` + (A == null ? "" : `
` + JSON.stringify(A, null, "  ")) + `
Headers: ` + O(T.headers), A);
  }
  const i = /* @__PURE__ */ new Map([
    [429, "Too many requests"],
    [400, "Bad request"],
    [403, "Forbidden"],
    [404, "Not found"],
    [405, "Method not allowed"],
    [406, "Not acceptable"],
    [408, "Request timeout"],
    [413, "Request entity too large"],
    [500, "Internal server error"],
    [502, "Bad gateway"],
    [503, "Service unavailable"],
    [504, "Gateway timeout"],
    [505, "HTTP version not supported"]
  ]);
  class n extends Error {
    constructor(A, v = `HTTP error: ${i.get(A) || A}`, $ = null) {
      super(v), this.statusCode = A, this.description = $, this.name = "HttpError", this.code = `HTTP_ERROR_${A}`;
    }
    isServerError() {
      return this.statusCode >= 500 && this.statusCode <= 599;
    }
  }
  $e.HttpError = n;
  function r(T) {
    return T.then((A) => A == null || A.length === 0 ? null : JSON.parse(A));
  }
  class p {
    constructor() {
      this.maxRedirects = 10;
    }
    request(A, v = new u.CancellationToken(), $) {
      b(A);
      const k = $ == null ? void 0 : JSON.stringify($), L = k ? Buffer.from(k) : void 0;
      if (L != null) {
        o(k);
        const { headers: q, ...F } = A;
        A = {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": L.length,
            ...q
          },
          ...F
        };
      }
      return this.doApiRequest(A, v, (q) => q.end(L));
    }
    doApiRequest(A, v, $, k = 0) {
      return o.enabled && o(`Request: ${O(A)}`), v.createPromise((L, q, F) => {
        const N = this.createRequest(A, (j) => {
          try {
            this.handleResponse(j, A, v, L, q, k, $);
          } catch (D) {
            q(D);
          }
        });
        this.addErrorAndTimeoutHandlers(N, q, A.timeout), this.addRedirectHandlers(N, A, q, k, (j) => {
          this.doApiRequest(j, v, $, k).then(L).catch(q);
        }), $(N, q), F(() => N.abort());
      });
    }
    // noinspection JSUnusedLocalSymbols
    // eslint-disable-next-line
    addRedirectHandlers(A, v, $, k, L) {
    }
    addErrorAndTimeoutHandlers(A, v, $ = 60 * 1e3) {
      this.addTimeOutHandler(A, v, $), A.on("error", v), A.on("aborted", () => {
        v(new Error("Request has been aborted by the server"));
      });
    }
    handleResponse(A, v, $, k, L, q, F) {
      var N;
      if (o.enabled && o(`Response: ${A.statusCode} ${A.statusMessage}, request options: ${O(v)}`), A.statusCode === 404) {
        L(s(A, `method: ${v.method || "GET"} url: ${v.protocol || "https:"}//${v.hostname}${v.port ? `:${v.port}` : ""}${v.path}

Please double check that your authentication token is correct. Due to security reasons, actual status maybe not reported, but 404.
`));
        return;
      } else if (A.statusCode === 204) {
        k();
        return;
      }
      const j = (N = A.statusCode) !== null && N !== void 0 ? N : 0, D = j >= 300 && j < 400, G = P(A, "location");
      if (D && G != null) {
        if (q > this.maxRedirects) {
          L(this.createMaxRedirectError());
          return;
        }
        this.doApiRequest(p.prepareRedirectUrlOptions(G, v), $, F, q).then(k).catch(L);
        return;
      }
      A.setEncoding("utf8");
      let V = "";
      A.on("error", L), A.on("data", (te) => V += te), A.on("end", () => {
        try {
          if (A.statusCode != null && A.statusCode >= 400) {
            const te = P(A, "content-type"), de = te != null && (Array.isArray(te) ? te.find((ie) => ie.includes("json")) != null : te.includes("json"));
            L(s(A, `method: ${v.method || "GET"} url: ${v.protocol || "https:"}//${v.hostname}${v.port ? `:${v.port}` : ""}${v.path}

          Data:
          ${de ? JSON.stringify(JSON.parse(V)) : V}
          `));
          } else
            k(V.length === 0 ? null : V);
        } catch (te) {
          L(te);
        }
      });
    }
    async downloadToBuffer(A, v) {
      return await v.cancellationToken.createPromise(($, k, L) => {
        const q = [], F = {
          headers: v.headers || void 0,
          // because PrivateGitHubProvider requires HttpExecutor.prepareRedirectUrlOptions logic, so, we need to redirect manually
          redirect: "manual"
        };
        m(A, F), b(F), this.doDownload(F, {
          destination: null,
          options: v,
          onCancel: L,
          callback: (N) => {
            N == null ? $(Buffer.concat(q)) : k(N);
          },
          responseHandler: (N, j) => {
            let D = 0;
            N.on("data", (G) => {
              if (D += G.length, D > 524288e3) {
                j(new Error("Maximum allowed size is 500 MB"));
                return;
              }
              q.push(G);
            }), N.on("end", () => {
              j(null);
            });
          }
        }, 0);
      });
    }
    doDownload(A, v, $) {
      const k = this.createRequest(A, (L) => {
        if (L.statusCode >= 400) {
          v.callback(new Error(`Cannot download "${A.protocol || "https:"}//${A.hostname}${A.path}", status ${L.statusCode}: ${L.statusMessage}`));
          return;
        }
        L.on("error", v.callback);
        const q = P(L, "location");
        if (q != null) {
          $ < this.maxRedirects ? this.doDownload(p.prepareRedirectUrlOptions(q, A), v, $++) : v.callback(this.createMaxRedirectError());
          return;
        }
        v.responseHandler == null ? I(v, L) : v.responseHandler(L, v.callback);
      });
      this.addErrorAndTimeoutHandlers(k, v.callback, A.timeout), this.addRedirectHandlers(k, A, v.callback, $, (L) => {
        this.doDownload(L, v, $++);
      }), k.end();
    }
    createMaxRedirectError() {
      return new Error(`Too many redirects (> ${this.maxRedirects})`);
    }
    addTimeOutHandler(A, v, $) {
      A.on("socket", (k) => {
        k.setTimeout($, () => {
          A.abort(), v(new Error("Request timed out"));
        });
      });
    }
    static prepareRedirectUrlOptions(A, v) {
      const $ = y(A, { ...v }), k = $.headers;
      if (k != null && k.authorization) {
        const L = p.reconstructOriginalUrl(v), q = g(A, v);
        p.isCrossOriginRedirect(L, q) && (o.enabled && o(`Given the cross-origin redirect (from ${L.host} to ${q.host}), the Authorization header will be stripped out.`), delete k.authorization);
      }
      return $;
    }
    static reconstructOriginalUrl(A) {
      const v = A.protocol || "https:";
      if (!A.hostname)
        throw new Error("Missing hostname in request options");
      const $ = A.hostname, k = A.port ? `:${A.port}` : "", L = A.path || "/";
      return new f.URL(`${v}//${$}${k}${L}`);
    }
    static isCrossOriginRedirect(A, v) {
      if (A.hostname.toLowerCase() !== v.hostname.toLowerCase())
        return !0;
      if (A.protocol === "http:" && // This can be replaced with `!originalUrl.port`, but for the sake of clarity.
      ["80", ""].includes(A.port) && v.protocol === "https:" && // This can be replaced with `!redirectUrl.port`, but for the sake of clarity.
      ["443", ""].includes(v.port))
        return !1;
      if (A.protocol !== v.protocol)
        return !0;
      const $ = A.port, k = v.port;
      return $ !== k;
    }
    static retryOnServerError(A, v = 3) {
      for (let $ = 0; ; $++)
        try {
          return A();
        } catch (k) {
          if ($ < v && (k instanceof n && k.isServerError() || k.code === "EPIPE"))
            continue;
          throw k;
        }
    }
  }
  $e.HttpExecutor = p;
  function g(T, A) {
    try {
      return new f.URL(T);
    } catch {
      const v = A.hostname, $ = A.protocol || "https:", k = A.port ? `:${A.port}` : "", L = `${$}//${v}${k}`;
      return new f.URL(T, L);
    }
  }
  function y(T, A) {
    const v = b(A), $ = g(T, A);
    return m($, v), v;
  }
  function m(T, A) {
    A.protocol = T.protocol, A.hostname = T.hostname, T.port ? A.port = T.port : A.port && delete A.port, A.path = T.pathname + T.search;
  }
  class w extends c.Transform {
    // noinspection JSUnusedGlobalSymbols
    get actual() {
      return this._actual;
    }
    constructor(A, v = "sha512", $ = "base64") {
      super(), this.expected = A, this.algorithm = v, this.encoding = $, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, t.createHash)(v);
    }
    // noinspection JSUnusedGlobalSymbols
    _transform(A, v, $) {
      this.digester.update(A), $(null, A);
    }
    // noinspection JSUnusedGlobalSymbols
    _flush(A) {
      if (this._actual = this.digester.digest(this.encoding), this.isValidateOnEnd)
        try {
          this.validate();
        } catch (v) {
          A(v);
          return;
        }
      A(null);
    }
    validate() {
      if (this._actual == null)
        throw (0, a.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
      if (this._actual !== this.expected)
        throw (0, a.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
      return null;
    }
  }
  $e.DigestTransform = w;
  function S(T, A, v) {
    return T != null && A != null && T !== A ? (v(new Error(`checksum mismatch: expected ${A} but got ${T} (X-Checksum-Sha2 header)`)), !1) : !0;
  }
  function P(T, A) {
    const v = T.headers[A];
    return v == null ? null : Array.isArray(v) ? v.length === 0 ? null : v[v.length - 1] : v;
  }
  function I(T, A) {
    if (!S(P(A, "X-Checksum-Sha2"), T.options.sha2, T.callback))
      return;
    const v = [];
    if (T.options.onProgress != null) {
      const q = P(A, "content-length");
      q != null && v.push(new l.ProgressCallbackTransform(parseInt(q, 10), T.options.cancellationToken, T.options.onProgress));
    }
    const $ = T.options.sha512;
    $ != null ? v.push(new w($, "sha512", $.length === 128 && !$.includes("+") && !$.includes("Z") && !$.includes("=") ? "hex" : "base64")) : T.options.sha2 != null && v.push(new w(T.options.sha2, "sha256", "hex"));
    const k = (0, h.createWriteStream)(T.destination);
    v.push(k);
    let L = A;
    for (const q of v)
      q.on("error", (F) => {
        k.close(), T.options.cancellationToken.cancelled || T.callback(F);
      }), L = L.pipe(q);
    k.on("finish", () => {
      k.close(T.callback);
    });
  }
  function b(T, A, v) {
    v != null && (T.method = v), T.headers = { ...T.headers };
    const $ = T.headers;
    return A != null && ($.authorization = A.startsWith("Basic") || A.startsWith("Bearer") ? A : `token ${A}`), $["User-Agent"] == null && ($["User-Agent"] = "electron-builder"), (v == null || v === "GET" || $["Cache-Control"] == null) && ($["Cache-Control"] = "no-cache"), T.protocol == null && process.versions.electron != null && (T.protocol = "https:"), T;
  }
  function O(T, A) {
    return JSON.stringify(T, (v, $) => v.endsWith("Authorization") || v.endsWith("authorization") || v.endsWith("Password") || v.endsWith("PASSWORD") || v.endsWith("Token") || v.includes("password") || v.includes("token") || A != null && A.has(v) ? "<stripped sensitive data>" : $, 2);
  }
  return $e;
}
var Wt = {}, wo;
function Kc() {
  if (wo) return Wt;
  wo = 1, Object.defineProperty(Wt, "__esModule", { value: !0 }), Wt.MemoLazy = void 0;
  let t = class {
    constructor(c, f) {
      this.selector = c, this.creator = f, this.selected = void 0, this._value = void 0;
    }
    get hasValue() {
      return this._value !== void 0;
    }
    get value() {
      const c = this.selector();
      if (this._value !== void 0 && d(this.selected, c))
        return this._value;
      this.selected = c;
      const f = this.creator(c);
      return this.value = f, f;
    }
    set value(c) {
      this._value = c;
    }
  };
  Wt.MemoLazy = t;
  function d(h, c) {
    if (typeof h == "object" && h !== null && (typeof c == "object" && c !== null)) {
      const a = Object.keys(h), l = Object.keys(c);
      return a.length === l.length && a.every((o) => d(h[o], c[o]));
    }
    return h === c;
  }
  return Wt;
}
var Nt = {}, _o;
function Jc() {
  if (_o) return Nt;
  _o = 1, Object.defineProperty(Nt, "__esModule", { value: !0 }), Nt.githubUrl = t, Nt.githubTagPrefix = d, Nt.getS3LikeProviderBaseUrl = h;
  function t(a, l = "github.com") {
    return `${a.protocol || "https"}://${a.host || l}`;
  }
  function d(a) {
    var l;
    return a.tagNamePrefix ? a.tagNamePrefix : !((l = a.vPrefixedTagName) !== null && l !== void 0) || l ? "v" : "";
  }
  function h(a) {
    const l = a.provider;
    if (l === "s3")
      return c(a);
    if (l === "spaces")
      return u(a);
    throw new Error(`Not supported provider: ${l}`);
  }
  function c(a) {
    let l;
    if (a.accelerate == !0)
      l = `https://${a.bucket}.s3-accelerate.amazonaws.com`;
    else if (a.endpoint != null)
      l = `${a.endpoint}/${a.bucket}`;
    else if (a.bucket.includes(".")) {
      if (a.region == null)
        throw new Error(`Bucket name "${a.bucket}" includes a dot, but S3 region is missing`);
      a.region === "us-east-1" ? l = `https://s3.amazonaws.com/${a.bucket}` : l = `https://s3-${a.region}.amazonaws.com/${a.bucket}`;
    } else a.region === "cn-north-1" ? l = `https://${a.bucket}.s3.${a.region}.amazonaws.com.cn` : l = `https://${a.bucket}.s3.amazonaws.com`;
    return f(l, a.path);
  }
  function f(a, l) {
    return l != null && l.length > 0 && (l.startsWith("/") || (a += "/"), a += l), a;
  }
  function u(a) {
    if (a.name == null)
      throw new Error("name is missing");
    if (a.region == null)
      throw new Error("region is missing");
    return f(`https://${a.name}.${a.region}.digitaloceanspaces.com`, a.path);
  }
  return Nt;
}
var Lr = {}, Ro;
function Qc() {
  if (Ro) return Lr;
  Ro = 1, Object.defineProperty(Lr, "__esModule", { value: !0 }), Lr.retry = d;
  const t = na();
  async function d(h, c) {
    var f;
    const { retries: u, interval: a, backoff: l = 0, attempt: o = 0, shouldRetry: s, cancellationToken: i = new t.CancellationToken() } = c;
    try {
      return await h();
    } catch (n) {
      if (await Promise.resolve((f = s == null ? void 0 : s(n)) !== null && f !== void 0 ? f : !0) && u > 0 && !i.cancelled)
        return await new Promise((r) => setTimeout(r, a + l * o)), await d(h, { ...c, retries: u - 1, attempt: o + 1 });
      throw n;
    }
  }
  return Lr;
}
var Ur = {}, Ao;
function Zc() {
  if (Ao) return Ur;
  Ao = 1, Object.defineProperty(Ur, "__esModule", { value: !0 }), Ur.parseDn = t;
  function t(d) {
    let h = !1, c = null, f = "", u = 0;
    d = d.trim();
    const a = /* @__PURE__ */ new Map();
    for (let l = 0; l <= d.length; l++) {
      if (l === d.length) {
        c !== null && a.set(c, f);
        break;
      }
      const o = d[l];
      if (h) {
        if (o === '"') {
          h = !1;
          continue;
        }
      } else {
        if (o === '"') {
          h = !0;
          continue;
        }
        if (o === "\\") {
          l++;
          const s = parseInt(d.slice(l, l + 2), 16);
          Number.isNaN(s) ? f += d[l] : (l++, f += String.fromCharCode(s));
          continue;
        }
        if (c === null && o === "=") {
          c = f, f = "";
          continue;
        }
        if (o === "," || o === ";" || o === "+") {
          c !== null && a.set(c, f), c = null, f = "";
          continue;
        }
      }
      if (o === " " && !h) {
        if (f.length === 0)
          continue;
        if (l > u) {
          let s = l;
          for (; d[s] === " "; )
            s++;
          u = s;
        }
        if (u >= d.length || d[u] === "," || d[u] === ";" || c === null && d[u] === "=" || c !== null && d[u] === "+") {
          l = u - 1;
          continue;
        }
      }
      f += o;
    }
    return a;
  }
  return Ur;
}
var Tt = {}, So;
function ef() {
  if (So) return Tt;
  So = 1, Object.defineProperty(Tt, "__esModule", { value: !0 }), Tt.nil = Tt.UUID = void 0;
  const t = vr, d = Gr(), h = "options.name must be either a string or a Buffer", c = (0, t.randomBytes)(16);
  c[0] = c[0] | 1;
  const f = {}, u = [];
  for (let n = 0; n < 256; n++) {
    const r = (n + 256).toString(16).substr(1);
    f[r] = n, u[n] = r;
  }
  class a {
    constructor(r) {
      this.ascii = null, this.binary = null;
      const p = a.check(r);
      if (!p)
        throw new Error("not a UUID");
      this.version = p.version, p.format === "ascii" ? this.ascii = r : this.binary = r;
    }
    static v5(r, p) {
      return s(r, "sha1", 80, p);
    }
    toString() {
      return this.ascii == null && (this.ascii = i(this.binary)), this.ascii;
    }
    inspect() {
      return `UUID v${this.version} ${this.toString()}`;
    }
    static check(r, p = 0) {
      if (typeof r == "string")
        return r = r.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(r) ? r === "00000000-0000-0000-0000-000000000000" ? { version: void 0, variant: "nil", format: "ascii" } : {
          version: (f[r[14] + r[15]] & 240) >> 4,
          variant: l((f[r[19] + r[20]] & 224) >> 5),
          format: "ascii"
        } : !1;
      if (Buffer.isBuffer(r)) {
        if (r.length < p + 16)
          return !1;
        let g = 0;
        for (; g < 16 && r[p + g] === 0; g++)
          ;
        return g === 16 ? { version: void 0, variant: "nil", format: "binary" } : {
          version: (r[p + 6] & 240) >> 4,
          variant: l((r[p + 8] & 224) >> 5),
          format: "binary"
        };
      }
      throw (0, d.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
    }
    // read stringified uuid into a Buffer
    static parse(r) {
      const p = Buffer.allocUnsafe(16);
      let g = 0;
      for (let y = 0; y < 16; y++)
        p[y] = f[r[g++] + r[g++]], (y === 3 || y === 5 || y === 7 || y === 9) && (g += 1);
      return p;
    }
  }
  Tt.UUID = a, a.OID = a.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
  function l(n) {
    switch (n) {
      case 0:
      case 1:
      case 3:
        return "ncs";
      case 4:
      case 5:
        return "rfc4122";
      case 6:
        return "microsoft";
      default:
        return "future";
    }
  }
  var o;
  (function(n) {
    n[n.ASCII = 0] = "ASCII", n[n.BINARY = 1] = "BINARY", n[n.OBJECT = 2] = "OBJECT";
  })(o || (o = {}));
  function s(n, r, p, g, y = o.ASCII) {
    const m = (0, t.createHash)(r);
    if (typeof n != "string" && !Buffer.isBuffer(n))
      throw (0, d.newError)(h, "ERR_INVALID_UUID_NAME");
    m.update(g), m.update(n);
    const S = m.digest();
    let P;
    switch (y) {
      case o.BINARY:
        S[6] = S[6] & 15 | p, S[8] = S[8] & 63 | 128, P = S;
        break;
      case o.OBJECT:
        S[6] = S[6] & 15 | p, S[8] = S[8] & 63 | 128, P = new a(S);
        break;
      default:
        P = u[S[0]] + u[S[1]] + u[S[2]] + u[S[3]] + "-" + u[S[4]] + u[S[5]] + "-" + u[S[6] & 15 | p] + u[S[7]] + "-" + u[S[8] & 63 | 128] + u[S[9]] + "-" + u[S[10]] + u[S[11]] + u[S[12]] + u[S[13]] + u[S[14]] + u[S[15]];
        break;
    }
    return P;
  }
  function i(n) {
    return u[n[0]] + u[n[1]] + u[n[2]] + u[n[3]] + "-" + u[n[4]] + u[n[5]] + "-" + u[n[6]] + u[n[7]] + "-" + u[n[8]] + u[n[9]] + "-" + u[n[10]] + u[n[11]] + u[n[12]] + u[n[13]] + u[n[14]] + u[n[15]];
  }
  return Tt.nil = new a("00000000-0000-0000-0000-000000000000"), Tt;
}
var Ft = {}, $n = {}, To;
function tf() {
  return To || (To = 1, function(t) {
    (function(d) {
      d.parser = function(_, E) {
        return new c(_, E);
      }, d.SAXParser = c, d.SAXStream = i, d.createStream = s, d.MAX_BUFFER_LENGTH = 64 * 1024;
      var h = [
        "comment",
        "sgmlDecl",
        "textNode",
        "tagName",
        "doctype",
        "procInstName",
        "procInstBody",
        "entity",
        "attribName",
        "attribValue",
        "cdata",
        "script"
      ];
      d.EVENTS = [
        "text",
        "processinginstruction",
        "sgmldeclaration",
        "doctype",
        "comment",
        "opentagstart",
        "attribute",
        "opentag",
        "closetag",
        "opencdata",
        "cdata",
        "closecdata",
        "error",
        "end",
        "ready",
        "script",
        "opennamespace",
        "closenamespace"
      ];
      function c(_, E) {
        if (!(this instanceof c))
          return new c(_, E);
        var H = this;
        u(H), H.q = H.c = "", H.bufferCheckPosition = d.MAX_BUFFER_LENGTH, H.opt = E || {}, H.opt.lowercase = H.opt.lowercase || H.opt.lowercasetags, H.looseCase = H.opt.lowercase ? "toLowerCase" : "toUpperCase", H.tags = [], H.closed = H.closedRoot = H.sawRoot = !1, H.tag = H.error = null, H.strict = !!_, H.noscript = !!(_ || H.opt.noscript), H.state = v.BEGIN, H.strictEntities = H.opt.strictEntities, H.ENTITIES = H.strictEntities ? Object.create(d.XML_ENTITIES) : Object.create(d.ENTITIES), H.attribList = [], H.opt.xmlns && (H.ns = Object.create(y)), H.opt.unquotedAttributeValues === void 0 && (H.opt.unquotedAttributeValues = !_), H.trackPosition = H.opt.position !== !1, H.trackPosition && (H.position = H.line = H.column = 0), k(H, "onready");
      }
      Object.create || (Object.create = function(_) {
        function E() {
        }
        E.prototype = _;
        var H = new E();
        return H;
      }), Object.keys || (Object.keys = function(_) {
        var E = [];
        for (var H in _) _.hasOwnProperty(H) && E.push(H);
        return E;
      });
      function f(_) {
        for (var E = Math.max(d.MAX_BUFFER_LENGTH, 10), H = 0, x = 0, ce = h.length; x < ce; x++) {
          var me = _[h[x]].length;
          if (me > E)
            switch (h[x]) {
              case "textNode":
                q(_);
                break;
              case "cdata":
                L(_, "oncdata", _.cdata), _.cdata = "";
                break;
              case "script":
                L(_, "onscript", _.script), _.script = "";
                break;
              default:
                N(_, "Max buffer length exceeded: " + h[x]);
            }
          H = Math.max(H, me);
        }
        var he = d.MAX_BUFFER_LENGTH - H;
        _.bufferCheckPosition = he + _.position;
      }
      function u(_) {
        for (var E = 0, H = h.length; E < H; E++)
          _[h[E]] = "";
      }
      function a(_) {
        q(_), _.cdata !== "" && (L(_, "oncdata", _.cdata), _.cdata = ""), _.script !== "" && (L(_, "onscript", _.script), _.script = "");
      }
      c.prototype = {
        end: function() {
          j(this);
        },
        write: ge,
        resume: function() {
          return this.error = null, this;
        },
        close: function() {
          return this.write(null);
        },
        flush: function() {
          a(this);
        }
      };
      var l;
      try {
        l = require("stream").Stream;
      } catch {
        l = function() {
        };
      }
      l || (l = function() {
      });
      var o = d.EVENTS.filter(function(_) {
        return _ !== "error" && _ !== "end";
      });
      function s(_, E) {
        return new i(_, E);
      }
      function i(_, E) {
        if (!(this instanceof i))
          return new i(_, E);
        l.apply(this), this._parser = new c(_, E), this.writable = !0, this.readable = !0;
        var H = this;
        this._parser.onend = function() {
          H.emit("end");
        }, this._parser.onerror = function(x) {
          H.emit("error", x), H._parser.error = null;
        }, this._decoder = null, o.forEach(function(x) {
          Object.defineProperty(H, "on" + x, {
            get: function() {
              return H._parser["on" + x];
            },
            set: function(ce) {
              if (!ce)
                return H.removeAllListeners(x), H._parser["on" + x] = ce, ce;
              H.on(x, ce);
            },
            enumerable: !0,
            configurable: !1
          });
        });
      }
      i.prototype = Object.create(l.prototype, {
        constructor: {
          value: i
        }
      }), i.prototype.write = function(_) {
        if (typeof Buffer == "function" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(_)) {
          if (!this._decoder) {
            var E = Ec.StringDecoder;
            this._decoder = new E("utf8");
          }
          _ = this._decoder.write(_);
        }
        return this._parser.write(_.toString()), this.emit("data", _), !0;
      }, i.prototype.end = function(_) {
        return _ && _.length && this.write(_), this._parser.end(), !0;
      }, i.prototype.on = function(_, E) {
        var H = this;
        return !H._parser["on" + _] && o.indexOf(_) !== -1 && (H._parser["on" + _] = function() {
          var x = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
          x.splice(0, 0, _), H.emit.apply(H, x);
        }), l.prototype.on.call(H, _, E);
      };
      var n = "[CDATA[", r = "DOCTYPE", p = "http://www.w3.org/XML/1998/namespace", g = "http://www.w3.org/2000/xmlns/", y = { xml: p, xmlns: g }, m = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, w = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, S = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, P = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
      function I(_) {
        return _ === " " || _ === `
` || _ === "\r" || _ === "	";
      }
      function b(_) {
        return _ === '"' || _ === "'";
      }
      function O(_) {
        return _ === ">" || I(_);
      }
      function T(_, E) {
        return _.test(E);
      }
      function A(_, E) {
        return !T(_, E);
      }
      var v = 0;
      d.STATE = {
        BEGIN: v++,
        // leading byte order mark or whitespace
        BEGIN_WHITESPACE: v++,
        // leading whitespace
        TEXT: v++,
        // general stuff
        TEXT_ENTITY: v++,
        // &amp and such.
        OPEN_WAKA: v++,
        // <
        SGML_DECL: v++,
        // <!BLARG
        SGML_DECL_QUOTED: v++,
        // <!BLARG foo "bar
        DOCTYPE: v++,
        // <!DOCTYPE
        DOCTYPE_QUOTED: v++,
        // <!DOCTYPE "//blah
        DOCTYPE_DTD: v++,
        // <!DOCTYPE "//blah" [ ...
        DOCTYPE_DTD_QUOTED: v++,
        // <!DOCTYPE "//blah" [ "foo
        COMMENT_STARTING: v++,
        // <!-
        COMMENT: v++,
        // <!--
        COMMENT_ENDING: v++,
        // <!-- blah -
        COMMENT_ENDED: v++,
        // <!-- blah --
        CDATA: v++,
        // <![CDATA[ something
        CDATA_ENDING: v++,
        // ]
        CDATA_ENDING_2: v++,
        // ]]
        PROC_INST: v++,
        // <?hi
        PROC_INST_BODY: v++,
        // <?hi there
        PROC_INST_ENDING: v++,
        // <?hi "there" ?
        OPEN_TAG: v++,
        // <strong
        OPEN_TAG_SLASH: v++,
        // <strong /
        ATTRIB: v++,
        // <a
        ATTRIB_NAME: v++,
        // <a foo
        ATTRIB_NAME_SAW_WHITE: v++,
        // <a foo _
        ATTRIB_VALUE: v++,
        // <a foo=
        ATTRIB_VALUE_QUOTED: v++,
        // <a foo="bar
        ATTRIB_VALUE_CLOSED: v++,
        // <a foo="bar"
        ATTRIB_VALUE_UNQUOTED: v++,
        // <a foo=bar
        ATTRIB_VALUE_ENTITY_Q: v++,
        // <foo bar="&quot;"
        ATTRIB_VALUE_ENTITY_U: v++,
        // <foo bar=&quot
        CLOSE_TAG: v++,
        // </a
        CLOSE_TAG_SAW_WHITE: v++,
        // </a   >
        SCRIPT: v++,
        // <script> ...
        SCRIPT_ENDING: v++
        // <script> ... <
      }, d.XML_ENTITIES = {
        amp: "&",
        gt: ">",
        lt: "<",
        quot: '"',
        apos: "'"
      }, d.ENTITIES = {
        amp: "&",
        gt: ">",
        lt: "<",
        quot: '"',
        apos: "'",
        AElig: 198,
        Aacute: 193,
        Acirc: 194,
        Agrave: 192,
        Aring: 197,
        Atilde: 195,
        Auml: 196,
        Ccedil: 199,
        ETH: 208,
        Eacute: 201,
        Ecirc: 202,
        Egrave: 200,
        Euml: 203,
        Iacute: 205,
        Icirc: 206,
        Igrave: 204,
        Iuml: 207,
        Ntilde: 209,
        Oacute: 211,
        Ocirc: 212,
        Ograve: 210,
        Oslash: 216,
        Otilde: 213,
        Ouml: 214,
        THORN: 222,
        Uacute: 218,
        Ucirc: 219,
        Ugrave: 217,
        Uuml: 220,
        Yacute: 221,
        aacute: 225,
        acirc: 226,
        aelig: 230,
        agrave: 224,
        aring: 229,
        atilde: 227,
        auml: 228,
        ccedil: 231,
        eacute: 233,
        ecirc: 234,
        egrave: 232,
        eth: 240,
        euml: 235,
        iacute: 237,
        icirc: 238,
        igrave: 236,
        iuml: 239,
        ntilde: 241,
        oacute: 243,
        ocirc: 244,
        ograve: 242,
        oslash: 248,
        otilde: 245,
        ouml: 246,
        szlig: 223,
        thorn: 254,
        uacute: 250,
        ucirc: 251,
        ugrave: 249,
        uuml: 252,
        yacute: 253,
        yuml: 255,
        copy: 169,
        reg: 174,
        nbsp: 160,
        iexcl: 161,
        cent: 162,
        pound: 163,
        curren: 164,
        yen: 165,
        brvbar: 166,
        sect: 167,
        uml: 168,
        ordf: 170,
        laquo: 171,
        not: 172,
        shy: 173,
        macr: 175,
        deg: 176,
        plusmn: 177,
        sup1: 185,
        sup2: 178,
        sup3: 179,
        acute: 180,
        micro: 181,
        para: 182,
        middot: 183,
        cedil: 184,
        ordm: 186,
        raquo: 187,
        frac14: 188,
        frac12: 189,
        frac34: 190,
        iquest: 191,
        times: 215,
        divide: 247,
        OElig: 338,
        oelig: 339,
        Scaron: 352,
        scaron: 353,
        Yuml: 376,
        fnof: 402,
        circ: 710,
        tilde: 732,
        Alpha: 913,
        Beta: 914,
        Gamma: 915,
        Delta: 916,
        Epsilon: 917,
        Zeta: 918,
        Eta: 919,
        Theta: 920,
        Iota: 921,
        Kappa: 922,
        Lambda: 923,
        Mu: 924,
        Nu: 925,
        Xi: 926,
        Omicron: 927,
        Pi: 928,
        Rho: 929,
        Sigma: 931,
        Tau: 932,
        Upsilon: 933,
        Phi: 934,
        Chi: 935,
        Psi: 936,
        Omega: 937,
        alpha: 945,
        beta: 946,
        gamma: 947,
        delta: 948,
        epsilon: 949,
        zeta: 950,
        eta: 951,
        theta: 952,
        iota: 953,
        kappa: 954,
        lambda: 955,
        mu: 956,
        nu: 957,
        xi: 958,
        omicron: 959,
        pi: 960,
        rho: 961,
        sigmaf: 962,
        sigma: 963,
        tau: 964,
        upsilon: 965,
        phi: 966,
        chi: 967,
        psi: 968,
        omega: 969,
        thetasym: 977,
        upsih: 978,
        piv: 982,
        ensp: 8194,
        emsp: 8195,
        thinsp: 8201,
        zwnj: 8204,
        zwj: 8205,
        lrm: 8206,
        rlm: 8207,
        ndash: 8211,
        mdash: 8212,
        lsquo: 8216,
        rsquo: 8217,
        sbquo: 8218,
        ldquo: 8220,
        rdquo: 8221,
        bdquo: 8222,
        dagger: 8224,
        Dagger: 8225,
        bull: 8226,
        hellip: 8230,
        permil: 8240,
        prime: 8242,
        Prime: 8243,
        lsaquo: 8249,
        rsaquo: 8250,
        oline: 8254,
        frasl: 8260,
        euro: 8364,
        image: 8465,
        weierp: 8472,
        real: 8476,
        trade: 8482,
        alefsym: 8501,
        larr: 8592,
        uarr: 8593,
        rarr: 8594,
        darr: 8595,
        harr: 8596,
        crarr: 8629,
        lArr: 8656,
        uArr: 8657,
        rArr: 8658,
        dArr: 8659,
        hArr: 8660,
        forall: 8704,
        part: 8706,
        exist: 8707,
        empty: 8709,
        nabla: 8711,
        isin: 8712,
        notin: 8713,
        ni: 8715,
        prod: 8719,
        sum: 8721,
        minus: 8722,
        lowast: 8727,
        radic: 8730,
        prop: 8733,
        infin: 8734,
        ang: 8736,
        and: 8743,
        or: 8744,
        cap: 8745,
        cup: 8746,
        int: 8747,
        there4: 8756,
        sim: 8764,
        cong: 8773,
        asymp: 8776,
        ne: 8800,
        equiv: 8801,
        le: 8804,
        ge: 8805,
        sub: 8834,
        sup: 8835,
        nsub: 8836,
        sube: 8838,
        supe: 8839,
        oplus: 8853,
        otimes: 8855,
        perp: 8869,
        sdot: 8901,
        lceil: 8968,
        rceil: 8969,
        lfloor: 8970,
        rfloor: 8971,
        lang: 9001,
        rang: 9002,
        loz: 9674,
        spades: 9824,
        clubs: 9827,
        hearts: 9829,
        diams: 9830
      }, Object.keys(d.ENTITIES).forEach(function(_) {
        var E = d.ENTITIES[_], H = typeof E == "number" ? String.fromCharCode(E) : E;
        d.ENTITIES[_] = H;
      });
      for (var $ in d.STATE)
        d.STATE[d.STATE[$]] = $;
      v = d.STATE;
      function k(_, E, H) {
        _[E] && _[E](H);
      }
      function L(_, E, H) {
        _.textNode && q(_), k(_, E, H);
      }
      function q(_) {
        _.textNode = F(_.opt, _.textNode), _.textNode && k(_, "ontext", _.textNode), _.textNode = "";
      }
      function F(_, E) {
        return _.trim && (E = E.trim()), _.normalize && (E = E.replace(/\s+/g, " ")), E;
      }
      function N(_, E) {
        return q(_), _.trackPosition && (E += `
Line: ` + _.line + `
Column: ` + _.column + `
Char: ` + _.c), E = new Error(E), _.error = E, k(_, "onerror", E), _;
      }
      function j(_) {
        return _.sawRoot && !_.closedRoot && D(_, "Unclosed root tag"), _.state !== v.BEGIN && _.state !== v.BEGIN_WHITESPACE && _.state !== v.TEXT && N(_, "Unexpected end"), q(_), _.c = "", _.closed = !0, k(_, "onend"), c.call(_, _.strict, _.opt), _;
      }
      function D(_, E) {
        if (typeof _ != "object" || !(_ instanceof c))
          throw new Error("bad call to strictFail");
        _.strict && N(_, E);
      }
      function G(_) {
        _.strict || (_.tagName = _.tagName[_.looseCase]());
        var E = _.tags[_.tags.length - 1] || _, H = _.tag = { name: _.tagName, attributes: {} };
        _.opt.xmlns && (H.ns = E.ns), _.attribList.length = 0, L(_, "onopentagstart", H);
      }
      function V(_, E) {
        var H = _.indexOf(":"), x = H < 0 ? ["", _] : _.split(":"), ce = x[0], me = x[1];
        return E && _ === "xmlns" && (ce = "xmlns", me = ""), { prefix: ce, local: me };
      }
      function te(_) {
        if (_.strict || (_.attribName = _.attribName[_.looseCase]()), _.attribList.indexOf(_.attribName) !== -1 || _.tag.attributes.hasOwnProperty(_.attribName)) {
          _.attribName = _.attribValue = "";
          return;
        }
        if (_.opt.xmlns) {
          var E = V(_.attribName, !0), H = E.prefix, x = E.local;
          if (H === "xmlns")
            if (x === "xml" && _.attribValue !== p)
              D(
                _,
                "xml: prefix must be bound to " + p + `
Actual: ` + _.attribValue
              );
            else if (x === "xmlns" && _.attribValue !== g)
              D(
                _,
                "xmlns: prefix must be bound to " + g + `
Actual: ` + _.attribValue
              );
            else {
              var ce = _.tag, me = _.tags[_.tags.length - 1] || _;
              ce.ns === me.ns && (ce.ns = Object.create(me.ns)), ce.ns[x] = _.attribValue;
            }
          _.attribList.push([_.attribName, _.attribValue]);
        } else
          _.tag.attributes[_.attribName] = _.attribValue, L(_, "onattribute", {
            name: _.attribName,
            value: _.attribValue
          });
        _.attribName = _.attribValue = "";
      }
      function de(_, E) {
        if (_.opt.xmlns) {
          var H = _.tag, x = V(_.tagName);
          H.prefix = x.prefix, H.local = x.local, H.uri = H.ns[x.prefix] || "", H.prefix && !H.uri && (D(_, "Unbound namespace prefix: " + JSON.stringify(_.tagName)), H.uri = x.prefix);
          var ce = _.tags[_.tags.length - 1] || _;
          H.ns && ce.ns !== H.ns && Object.keys(H.ns).forEach(function(e) {
            L(_, "onopennamespace", {
              prefix: e,
              uri: H.ns[e]
            });
          });
          for (var me = 0, he = _.attribList.length; me < he; me++) {
            var _e = _.attribList[me], Ee = _e[0], He = _e[1], Ae = V(Ee, !0), qe = Ae.prefix, lt = Ae.local, it = qe === "" ? "" : H.ns[qe] || "", tt = {
              name: Ee,
              value: He,
              prefix: qe,
              local: lt,
              uri: it
            };
            qe && qe !== "xmlns" && !it && (D(_, "Unbound namespace prefix: " + JSON.stringify(qe)), tt.uri = qe), _.tag.attributes[Ee] = tt, L(_, "onattribute", tt);
          }
          _.attribList.length = 0;
        }
        _.tag.isSelfClosing = !!E, _.sawRoot = !0, _.tags.push(_.tag), L(_, "onopentag", _.tag), E || (!_.noscript && _.tagName.toLowerCase() === "script" ? _.state = v.SCRIPT : _.state = v.TEXT, _.tag = null, _.tagName = ""), _.attribName = _.attribValue = "", _.attribList.length = 0;
      }
      function ie(_) {
        if (!_.tagName) {
          D(_, "Weird empty close tag."), _.textNode += "</>", _.state = v.TEXT;
          return;
        }
        if (_.script) {
          if (_.tagName !== "script") {
            _.script += "</" + _.tagName + ">", _.tagName = "", _.state = v.SCRIPT;
            return;
          }
          L(_, "onscript", _.script), _.script = "";
        }
        var E = _.tags.length, H = _.tagName;
        _.strict || (H = H[_.looseCase]());
        for (var x = H; E--; ) {
          var ce = _.tags[E];
          if (ce.name !== x)
            D(_, "Unexpected close tag");
          else
            break;
        }
        if (E < 0) {
          D(_, "Unmatched closing tag: " + _.tagName), _.textNode += "</" + _.tagName + ">", _.state = v.TEXT;
          return;
        }
        _.tagName = H;
        for (var me = _.tags.length; me-- > E; ) {
          var he = _.tag = _.tags.pop();
          _.tagName = _.tag.name, L(_, "onclosetag", _.tagName);
          var _e = {};
          for (var Ee in he.ns)
            _e[Ee] = he.ns[Ee];
          var He = _.tags[_.tags.length - 1] || _;
          _.opt.xmlns && he.ns !== He.ns && Object.keys(he.ns).forEach(function(Ae) {
            var qe = he.ns[Ae];
            L(_, "onclosenamespace", { prefix: Ae, uri: qe });
          });
        }
        E === 0 && (_.closedRoot = !0), _.tagName = _.attribValue = _.attribName = "", _.attribList.length = 0, _.state = v.TEXT;
      }
      function we(_) {
        var E = _.entity, H = E.toLowerCase(), x, ce = "";
        return _.ENTITIES[E] ? _.ENTITIES[E] : _.ENTITIES[H] ? _.ENTITIES[H] : (E = H, E.charAt(0) === "#" && (E.charAt(1) === "x" ? (E = E.slice(2), x = parseInt(E, 16), ce = x.toString(16)) : (E = E.slice(1), x = parseInt(E, 10), ce = x.toString(10))), E = E.replace(/^0+/, ""), isNaN(x) || ce.toLowerCase() !== E ? (D(_, "Invalid character entity"), "&" + _.entity + ";") : String.fromCodePoint(x));
      }
      function ve(_, E) {
        E === "<" ? (_.state = v.OPEN_WAKA, _.startTagPosition = _.position) : I(E) || (D(_, "Non-whitespace before first tag."), _.textNode = E, _.state = v.TEXT);
      }
      function Q(_, E) {
        var H = "";
        return E < _.length && (H = _.charAt(E)), H;
      }
      function ge(_) {
        var E = this;
        if (this.error)
          throw this.error;
        if (E.closed)
          return N(
            E,
            "Cannot write after close. Assign an onready handler."
          );
        if (_ === null)
          return j(E);
        typeof _ == "object" && (_ = _.toString());
        for (var H = 0, x = ""; x = Q(_, H++), E.c = x, !!x; )
          switch (E.trackPosition && (E.position++, x === `
` ? (E.line++, E.column = 0) : E.column++), E.state) {
            case v.BEGIN:
              if (E.state = v.BEGIN_WHITESPACE, x === "\uFEFF")
                continue;
              ve(E, x);
              continue;
            case v.BEGIN_WHITESPACE:
              ve(E, x);
              continue;
            case v.TEXT:
              if (E.sawRoot && !E.closedRoot) {
                for (var ce = H - 1; x && x !== "<" && x !== "&"; )
                  x = Q(_, H++), x && E.trackPosition && (E.position++, x === `
` ? (E.line++, E.column = 0) : E.column++);
                E.textNode += _.substring(ce, H - 1);
              }
              x === "<" && !(E.sawRoot && E.closedRoot && !E.strict) ? (E.state = v.OPEN_WAKA, E.startTagPosition = E.position) : (!I(x) && (!E.sawRoot || E.closedRoot) && D(E, "Text data outside of root node."), x === "&" ? E.state = v.TEXT_ENTITY : E.textNode += x);
              continue;
            case v.SCRIPT:
              x === "<" ? E.state = v.SCRIPT_ENDING : E.script += x;
              continue;
            case v.SCRIPT_ENDING:
              x === "/" ? E.state = v.CLOSE_TAG : (E.script += "<" + x, E.state = v.SCRIPT);
              continue;
            case v.OPEN_WAKA:
              if (x === "!")
                E.state = v.SGML_DECL, E.sgmlDecl = "";
              else if (!I(x)) if (T(m, x))
                E.state = v.OPEN_TAG, E.tagName = x;
              else if (x === "/")
                E.state = v.CLOSE_TAG, E.tagName = "";
              else if (x === "?")
                E.state = v.PROC_INST, E.procInstName = E.procInstBody = "";
              else {
                if (D(E, "Unencoded <"), E.startTagPosition + 1 < E.position) {
                  var me = E.position - E.startTagPosition;
                  x = new Array(me).join(" ") + x;
                }
                E.textNode += "<" + x, E.state = v.TEXT;
              }
              continue;
            case v.SGML_DECL:
              if (E.sgmlDecl + x === "--") {
                E.state = v.COMMENT, E.comment = "", E.sgmlDecl = "";
                continue;
              }
              E.doctype && E.doctype !== !0 && E.sgmlDecl ? (E.state = v.DOCTYPE_DTD, E.doctype += "<!" + E.sgmlDecl + x, E.sgmlDecl = "") : (E.sgmlDecl + x).toUpperCase() === n ? (L(E, "onopencdata"), E.state = v.CDATA, E.sgmlDecl = "", E.cdata = "") : (E.sgmlDecl + x).toUpperCase() === r ? (E.state = v.DOCTYPE, (E.doctype || E.sawRoot) && D(
                E,
                "Inappropriately located doctype declaration"
              ), E.doctype = "", E.sgmlDecl = "") : x === ">" ? (L(E, "onsgmldeclaration", E.sgmlDecl), E.sgmlDecl = "", E.state = v.TEXT) : (b(x) && (E.state = v.SGML_DECL_QUOTED), E.sgmlDecl += x);
              continue;
            case v.SGML_DECL_QUOTED:
              x === E.q && (E.state = v.SGML_DECL, E.q = ""), E.sgmlDecl += x;
              continue;
            case v.DOCTYPE:
              x === ">" ? (E.state = v.TEXT, L(E, "ondoctype", E.doctype), E.doctype = !0) : (E.doctype += x, x === "[" ? E.state = v.DOCTYPE_DTD : b(x) && (E.state = v.DOCTYPE_QUOTED, E.q = x));
              continue;
            case v.DOCTYPE_QUOTED:
              E.doctype += x, x === E.q && (E.q = "", E.state = v.DOCTYPE);
              continue;
            case v.DOCTYPE_DTD:
              x === "]" ? (E.doctype += x, E.state = v.DOCTYPE) : x === "<" ? (E.state = v.OPEN_WAKA, E.startTagPosition = E.position) : b(x) ? (E.doctype += x, E.state = v.DOCTYPE_DTD_QUOTED, E.q = x) : E.doctype += x;
              continue;
            case v.DOCTYPE_DTD_QUOTED:
              E.doctype += x, x === E.q && (E.state = v.DOCTYPE_DTD, E.q = "");
              continue;
            case v.COMMENT:
              x === "-" ? E.state = v.COMMENT_ENDING : E.comment += x;
              continue;
            case v.COMMENT_ENDING:
              x === "-" ? (E.state = v.COMMENT_ENDED, E.comment = F(E.opt, E.comment), E.comment && L(E, "oncomment", E.comment), E.comment = "") : (E.comment += "-" + x, E.state = v.COMMENT);
              continue;
            case v.COMMENT_ENDED:
              x !== ">" ? (D(E, "Malformed comment"), E.comment += "--" + x, E.state = v.COMMENT) : E.doctype && E.doctype !== !0 ? E.state = v.DOCTYPE_DTD : E.state = v.TEXT;
              continue;
            case v.CDATA:
              x === "]" ? E.state = v.CDATA_ENDING : E.cdata += x;
              continue;
            case v.CDATA_ENDING:
              x === "]" ? E.state = v.CDATA_ENDING_2 : (E.cdata += "]" + x, E.state = v.CDATA);
              continue;
            case v.CDATA_ENDING_2:
              x === ">" ? (E.cdata && L(E, "oncdata", E.cdata), L(E, "onclosecdata"), E.cdata = "", E.state = v.TEXT) : x === "]" ? E.cdata += "]" : (E.cdata += "]]" + x, E.state = v.CDATA);
              continue;
            case v.PROC_INST:
              x === "?" ? E.state = v.PROC_INST_ENDING : I(x) ? E.state = v.PROC_INST_BODY : E.procInstName += x;
              continue;
            case v.PROC_INST_BODY:
              if (!E.procInstBody && I(x))
                continue;
              x === "?" ? E.state = v.PROC_INST_ENDING : E.procInstBody += x;
              continue;
            case v.PROC_INST_ENDING:
              x === ">" ? (L(E, "onprocessinginstruction", {
                name: E.procInstName,
                body: E.procInstBody
              }), E.procInstName = E.procInstBody = "", E.state = v.TEXT) : (E.procInstBody += "?" + x, E.state = v.PROC_INST_BODY);
              continue;
            case v.OPEN_TAG:
              T(w, x) ? E.tagName += x : (G(E), x === ">" ? de(E) : x === "/" ? E.state = v.OPEN_TAG_SLASH : (I(x) || D(E, "Invalid character in tag name"), E.state = v.ATTRIB));
              continue;
            case v.OPEN_TAG_SLASH:
              x === ">" ? (de(E, !0), ie(E)) : (D(E, "Forward-slash in opening tag not followed by >"), E.state = v.ATTRIB);
              continue;
            case v.ATTRIB:
              if (I(x))
                continue;
              x === ">" ? de(E) : x === "/" ? E.state = v.OPEN_TAG_SLASH : T(m, x) ? (E.attribName = x, E.attribValue = "", E.state = v.ATTRIB_NAME) : D(E, "Invalid attribute name");
              continue;
            case v.ATTRIB_NAME:
              x === "=" ? E.state = v.ATTRIB_VALUE : x === ">" ? (D(E, "Attribute without value"), E.attribValue = E.attribName, te(E), de(E)) : I(x) ? E.state = v.ATTRIB_NAME_SAW_WHITE : T(w, x) ? E.attribName += x : D(E, "Invalid attribute name");
              continue;
            case v.ATTRIB_NAME_SAW_WHITE:
              if (x === "=")
                E.state = v.ATTRIB_VALUE;
              else {
                if (I(x))
                  continue;
                D(E, "Attribute without value"), E.tag.attributes[E.attribName] = "", E.attribValue = "", L(E, "onattribute", {
                  name: E.attribName,
                  value: ""
                }), E.attribName = "", x === ">" ? de(E) : T(m, x) ? (E.attribName = x, E.state = v.ATTRIB_NAME) : (D(E, "Invalid attribute name"), E.state = v.ATTRIB);
              }
              continue;
            case v.ATTRIB_VALUE:
              if (I(x))
                continue;
              b(x) ? (E.q = x, E.state = v.ATTRIB_VALUE_QUOTED) : (E.opt.unquotedAttributeValues || N(E, "Unquoted attribute value"), E.state = v.ATTRIB_VALUE_UNQUOTED, E.attribValue = x);
              continue;
            case v.ATTRIB_VALUE_QUOTED:
              if (x !== E.q) {
                x === "&" ? E.state = v.ATTRIB_VALUE_ENTITY_Q : E.attribValue += x;
                continue;
              }
              te(E), E.q = "", E.state = v.ATTRIB_VALUE_CLOSED;
              continue;
            case v.ATTRIB_VALUE_CLOSED:
              I(x) ? E.state = v.ATTRIB : x === ">" ? de(E) : x === "/" ? E.state = v.OPEN_TAG_SLASH : T(m, x) ? (D(E, "No whitespace between attributes"), E.attribName = x, E.attribValue = "", E.state = v.ATTRIB_NAME) : D(E, "Invalid attribute name");
              continue;
            case v.ATTRIB_VALUE_UNQUOTED:
              if (!O(x)) {
                x === "&" ? E.state = v.ATTRIB_VALUE_ENTITY_U : E.attribValue += x;
                continue;
              }
              te(E), x === ">" ? de(E) : E.state = v.ATTRIB;
              continue;
            case v.CLOSE_TAG:
              if (E.tagName)
                x === ">" ? ie(E) : T(w, x) ? E.tagName += x : E.script ? (E.script += "</" + E.tagName, E.tagName = "", E.state = v.SCRIPT) : (I(x) || D(E, "Invalid tagname in closing tag"), E.state = v.CLOSE_TAG_SAW_WHITE);
              else {
                if (I(x))
                  continue;
                A(m, x) ? E.script ? (E.script += "</" + x, E.state = v.SCRIPT) : D(E, "Invalid tagname in closing tag.") : E.tagName = x;
              }
              continue;
            case v.CLOSE_TAG_SAW_WHITE:
              if (I(x))
                continue;
              x === ">" ? ie(E) : D(E, "Invalid characters in closing tag");
              continue;
            case v.TEXT_ENTITY:
            case v.ATTRIB_VALUE_ENTITY_Q:
            case v.ATTRIB_VALUE_ENTITY_U:
              var he, _e;
              switch (E.state) {
                case v.TEXT_ENTITY:
                  he = v.TEXT, _e = "textNode";
                  break;
                case v.ATTRIB_VALUE_ENTITY_Q:
                  he = v.ATTRIB_VALUE_QUOTED, _e = "attribValue";
                  break;
                case v.ATTRIB_VALUE_ENTITY_U:
                  he = v.ATTRIB_VALUE_UNQUOTED, _e = "attribValue";
                  break;
              }
              if (x === ";") {
                var Ee = we(E);
                E.opt.unparsedEntities && !Object.values(d.XML_ENTITIES).includes(Ee) ? (E.entity = "", E.state = he, E.write(Ee)) : (E[_e] += Ee, E.entity = "", E.state = he);
              } else T(E.entity.length ? P : S, x) ? E.entity += x : (D(E, "Invalid character in entity name"), E[_e] += "&" + E.entity + x, E.entity = "", E.state = he);
              continue;
            default:
              throw new Error(E, "Unknown state: " + E.state);
          }
        return E.position >= E.bufferCheckPosition && f(E), E;
      }
      /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
      String.fromCodePoint || function() {
        var _ = String.fromCharCode, E = Math.floor, H = function() {
          var x = 16384, ce = [], me, he, _e = -1, Ee = arguments.length;
          if (!Ee)
            return "";
          for (var He = ""; ++_e < Ee; ) {
            var Ae = Number(arguments[_e]);
            if (!isFinite(Ae) || // `NaN`, `+Infinity`, or `-Infinity`
            Ae < 0 || // not a valid Unicode code point
            Ae > 1114111 || // not a valid Unicode code point
            E(Ae) !== Ae)
              throw RangeError("Invalid code point: " + Ae);
            Ae <= 65535 ? ce.push(Ae) : (Ae -= 65536, me = (Ae >> 10) + 55296, he = Ae % 1024 + 56320, ce.push(me, he)), (_e + 1 === Ee || ce.length > x) && (He += _.apply(null, ce), ce.length = 0);
          }
          return He;
        };
        Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
          value: H,
          configurable: !0,
          writable: !0
        }) : String.fromCodePoint = H;
      }();
    })(t);
  }($n)), $n;
}
var Co;
function rf() {
  if (Co) return Ft;
  Co = 1, Object.defineProperty(Ft, "__esModule", { value: !0 }), Ft.XElement = void 0, Ft.parseXml = a;
  const t = tf(), d = Gr();
  class h {
    constructor(o) {
      if (this.name = o, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !o)
        throw (0, d.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
      if (!f(o))
        throw (0, d.newError)(`Invalid element name: ${o}`, "ERR_XML_ELEMENT_INVALID_NAME");
    }
    attribute(o) {
      const s = this.attributes === null ? null : this.attributes[o];
      if (s == null)
        throw (0, d.newError)(`No attribute "${o}"`, "ERR_XML_MISSED_ATTRIBUTE");
      return s;
    }
    removeAttribute(o) {
      this.attributes !== null && delete this.attributes[o];
    }
    element(o, s = !1, i = null) {
      const n = this.elementOrNull(o, s);
      if (n === null)
        throw (0, d.newError)(i || `No element "${o}"`, "ERR_XML_MISSED_ELEMENT");
      return n;
    }
    elementOrNull(o, s = !1) {
      if (this.elements === null)
        return null;
      for (const i of this.elements)
        if (u(i, o, s))
          return i;
      return null;
    }
    getElements(o, s = !1) {
      return this.elements === null ? [] : this.elements.filter((i) => u(i, o, s));
    }
    elementValueOrEmpty(o, s = !1) {
      const i = this.elementOrNull(o, s);
      return i === null ? "" : i.value;
    }
  }
  Ft.XElement = h;
  const c = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
  function f(l) {
    return c.test(l);
  }
  function u(l, o, s) {
    const i = l.name;
    return i === o || s === !0 && i.length === o.length && i.toLowerCase() === o.toLowerCase();
  }
  function a(l) {
    let o = null;
    const s = t.parser(!0, {}), i = [];
    return s.onopentag = (n) => {
      const r = new h(n.name);
      if (r.attributes = n.attributes, o === null)
        o = r;
      else {
        const p = i[i.length - 1];
        p.elements == null && (p.elements = []), p.elements.push(r);
      }
      i.push(r);
    }, s.onclosetag = () => {
      i.pop();
    }, s.ontext = (n) => {
      i.length > 0 && (i[i.length - 1].value = n);
    }, s.oncdata = (n) => {
      const r = i[i.length - 1];
      r.value = n, r.isCData = !0;
    }, s.onerror = (n) => {
      throw n;
    }, s.write(l), o;
  }
  return Ft;
}
var bo;
function xe() {
  return bo || (bo = 1, function(t) {
    Object.defineProperty(t, "__esModule", { value: !0 }), t.CURRENT_APP_PACKAGE_FILE_NAME = t.CURRENT_APP_INSTALLER_FILE_NAME = t.XElement = t.parseXml = t.UUID = t.parseDn = t.retry = t.githubTagPrefix = t.githubUrl = t.getS3LikeProviderBaseUrl = t.ProgressCallbackTransform = t.MemoLazy = t.safeStringifyJson = t.safeGetHeader = t.parseJson = t.HttpExecutor = t.HttpError = t.DigestTransform = t.createHttpError = t.configureRequestUrl = t.configureRequestOptionsFromUrl = t.configureRequestOptions = t.newError = t.CancellationToken = t.CancellationError = void 0, t.asArray = n;
    var d = na();
    Object.defineProperty(t, "CancellationError", { enumerable: !0, get: function() {
      return d.CancellationError;
    } }), Object.defineProperty(t, "CancellationToken", { enumerable: !0, get: function() {
      return d.CancellationToken;
    } });
    var h = Gr();
    Object.defineProperty(t, "newError", { enumerable: !0, get: function() {
      return h.newError;
    } });
    var c = Xc();
    Object.defineProperty(t, "configureRequestOptions", { enumerable: !0, get: function() {
      return c.configureRequestOptions;
    } }), Object.defineProperty(t, "configureRequestOptionsFromUrl", { enumerable: !0, get: function() {
      return c.configureRequestOptionsFromUrl;
    } }), Object.defineProperty(t, "configureRequestUrl", { enumerable: !0, get: function() {
      return c.configureRequestUrl;
    } }), Object.defineProperty(t, "createHttpError", { enumerable: !0, get: function() {
      return c.createHttpError;
    } }), Object.defineProperty(t, "DigestTransform", { enumerable: !0, get: function() {
      return c.DigestTransform;
    } }), Object.defineProperty(t, "HttpError", { enumerable: !0, get: function() {
      return c.HttpError;
    } }), Object.defineProperty(t, "HttpExecutor", { enumerable: !0, get: function() {
      return c.HttpExecutor;
    } }), Object.defineProperty(t, "parseJson", { enumerable: !0, get: function() {
      return c.parseJson;
    } }), Object.defineProperty(t, "safeGetHeader", { enumerable: !0, get: function() {
      return c.safeGetHeader;
    } }), Object.defineProperty(t, "safeStringifyJson", { enumerable: !0, get: function() {
      return c.safeStringifyJson;
    } });
    var f = Kc();
    Object.defineProperty(t, "MemoLazy", { enumerable: !0, get: function() {
      return f.MemoLazy;
    } });
    var u = Ml();
    Object.defineProperty(t, "ProgressCallbackTransform", { enumerable: !0, get: function() {
      return u.ProgressCallbackTransform;
    } });
    var a = Jc();
    Object.defineProperty(t, "getS3LikeProviderBaseUrl", { enumerable: !0, get: function() {
      return a.getS3LikeProviderBaseUrl;
    } }), Object.defineProperty(t, "githubUrl", { enumerable: !0, get: function() {
      return a.githubUrl;
    } }), Object.defineProperty(t, "githubTagPrefix", { enumerable: !0, get: function() {
      return a.githubTagPrefix;
    } });
    var l = Qc();
    Object.defineProperty(t, "retry", { enumerable: !0, get: function() {
      return l.retry;
    } });
    var o = Zc();
    Object.defineProperty(t, "parseDn", { enumerable: !0, get: function() {
      return o.parseDn;
    } });
    var s = ef();
    Object.defineProperty(t, "UUID", { enumerable: !0, get: function() {
      return s.UUID;
    } });
    var i = rf();
    Object.defineProperty(t, "parseXml", { enumerable: !0, get: function() {
      return i.parseXml;
    } }), Object.defineProperty(t, "XElement", { enumerable: !0, get: function() {
      return i.XElement;
    } }), t.CURRENT_APP_INSTALLER_FILE_NAME = "installer.exe", t.CURRENT_APP_PACKAGE_FILE_NAME = "package.7z";
    function n(r) {
      return r == null ? [] : Array.isArray(r) ? r : [r];
    }
  }(Nn)), Nn;
}
var ke = {}, $r = {}, dt = {}, Po;
function Er() {
  if (Po) return dt;
  Po = 1;
  function t(a) {
    return typeof a > "u" || a === null;
  }
  function d(a) {
    return typeof a == "object" && a !== null;
  }
  function h(a) {
    return Array.isArray(a) ? a : t(a) ? [] : [a];
  }
  function c(a, l) {
    var o, s, i, n;
    if (l)
      for (n = Object.keys(l), o = 0, s = n.length; o < s; o += 1)
        i = n[o], a[i] = l[i];
    return a;
  }
  function f(a, l) {
    var o = "", s;
    for (s = 0; s < l; s += 1)
      o += a;
    return o;
  }
  function u(a) {
    return a === 0 && Number.NEGATIVE_INFINITY === 1 / a;
  }
  return dt.isNothing = t, dt.isObject = d, dt.toArray = h, dt.repeat = f, dt.isNegativeZero = u, dt.extend = c, dt;
}
var kn, Oo;
function yr() {
  if (Oo) return kn;
  Oo = 1;
  function t(h, c) {
    var f = "", u = h.reason || "(unknown reason)";
    return h.mark ? (h.mark.name && (f += 'in "' + h.mark.name + '" '), f += "(" + (h.mark.line + 1) + ":" + (h.mark.column + 1) + ")", !c && h.mark.snippet && (f += `

` + h.mark.snippet), u + " " + f) : u;
  }
  function d(h, c) {
    Error.call(this), this.name = "YAMLException", this.reason = h, this.mark = c, this.message = t(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
  }
  return d.prototype = Object.create(Error.prototype), d.prototype.constructor = d, d.prototype.toString = function(c) {
    return this.name + ": " + t(this, c);
  }, kn = d, kn;
}
var qn, Io;
function nf() {
  if (Io) return qn;
  Io = 1;
  var t = Er();
  function d(f, u, a, l, o) {
    var s = "", i = "", n = Math.floor(o / 2) - 1;
    return l - u > n && (s = " ... ", u = l - n + s.length), a - l > n && (i = " ...", a = l + n - i.length), {
      str: s + f.slice(u, a).replace(/\t/g, "→") + i,
      pos: l - u + s.length
      // relative position
    };
  }
  function h(f, u) {
    return t.repeat(" ", u - f.length) + f;
  }
  function c(f, u) {
    if (u = Object.create(u || null), !f.buffer) return null;
    u.maxLength || (u.maxLength = 79), typeof u.indent != "number" && (u.indent = 1), typeof u.linesBefore != "number" && (u.linesBefore = 3), typeof u.linesAfter != "number" && (u.linesAfter = 2);
    for (var a = /\r?\n|\r|\0/g, l = [0], o = [], s, i = -1; s = a.exec(f.buffer); )
      o.push(s.index), l.push(s.index + s[0].length), f.position <= s.index && i < 0 && (i = l.length - 2);
    i < 0 && (i = l.length - 1);
    var n = "", r, p, g = Math.min(f.line + u.linesAfter, o.length).toString().length, y = u.maxLength - (u.indent + g + 3);
    for (r = 1; r <= u.linesBefore && !(i - r < 0); r++)
      p = d(
        f.buffer,
        l[i - r],
        o[i - r],
        f.position - (l[i] - l[i - r]),
        y
      ), n = t.repeat(" ", u.indent) + h((f.line - r + 1).toString(), g) + " | " + p.str + `
` + n;
    for (p = d(f.buffer, l[i], o[i], f.position, y), n += t.repeat(" ", u.indent) + h((f.line + 1).toString(), g) + " | " + p.str + `
`, n += t.repeat("-", u.indent + g + 3 + p.pos) + `^
`, r = 1; r <= u.linesAfter && !(i + r >= o.length); r++)
      p = d(
        f.buffer,
        l[i + r],
        o[i + r],
        f.position - (l[i] - l[i + r]),
        y
      ), n += t.repeat(" ", u.indent) + h((f.line + r + 1).toString(), g) + " | " + p.str + `
`;
    return n.replace(/\n$/, "");
  }
  return qn = c, qn;
}
var Mn, Do;
function Me() {
  if (Do) return Mn;
  Do = 1;
  var t = yr(), d = [
    "kind",
    "multi",
    "resolve",
    "construct",
    "instanceOf",
    "predicate",
    "represent",
    "representName",
    "defaultStyle",
    "styleAliases"
  ], h = [
    "scalar",
    "sequence",
    "mapping"
  ];
  function c(u) {
    var a = {};
    return u !== null && Object.keys(u).forEach(function(l) {
      u[l].forEach(function(o) {
        a[String(o)] = l;
      });
    }), a;
  }
  function f(u, a) {
    if (a = a || {}, Object.keys(a).forEach(function(l) {
      if (d.indexOf(l) === -1)
        throw new t('Unknown option "' + l + '" is met in definition of "' + u + '" YAML type.');
    }), this.options = a, this.tag = u, this.kind = a.kind || null, this.resolve = a.resolve || function() {
      return !0;
    }, this.construct = a.construct || function(l) {
      return l;
    }, this.instanceOf = a.instanceOf || null, this.predicate = a.predicate || null, this.represent = a.represent || null, this.representName = a.representName || null, this.defaultStyle = a.defaultStyle || null, this.multi = a.multi || !1, this.styleAliases = c(a.styleAliases || null), h.indexOf(this.kind) === -1)
      throw new t('Unknown kind "' + this.kind + '" is specified for "' + u + '" YAML type.');
  }
  return Mn = f, Mn;
}
var Bn, No;
function Bl() {
  if (No) return Bn;
  No = 1;
  var t = yr(), d = Me();
  function h(u, a) {
    var l = [];
    return u[a].forEach(function(o) {
      var s = l.length;
      l.forEach(function(i, n) {
        i.tag === o.tag && i.kind === o.kind && i.multi === o.multi && (s = n);
      }), l[s] = o;
    }), l;
  }
  function c() {
    var u = {
      scalar: {},
      sequence: {},
      mapping: {},
      fallback: {},
      multi: {
        scalar: [],
        sequence: [],
        mapping: [],
        fallback: []
      }
    }, a, l;
    function o(s) {
      s.multi ? (u.multi[s.kind].push(s), u.multi.fallback.push(s)) : u[s.kind][s.tag] = u.fallback[s.tag] = s;
    }
    for (a = 0, l = arguments.length; a < l; a += 1)
      arguments[a].forEach(o);
    return u;
  }
  function f(u) {
    return this.extend(u);
  }
  return f.prototype.extend = function(a) {
    var l = [], o = [];
    if (a instanceof d)
      o.push(a);
    else if (Array.isArray(a))
      o = o.concat(a);
    else if (a && (Array.isArray(a.implicit) || Array.isArray(a.explicit)))
      a.implicit && (l = l.concat(a.implicit)), a.explicit && (o = o.concat(a.explicit));
    else
      throw new t("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
    l.forEach(function(i) {
      if (!(i instanceof d))
        throw new t("Specified list of YAML types (or a single Type object) contains a non-Type object.");
      if (i.loadKind && i.loadKind !== "scalar")
        throw new t("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
      if (i.multi)
        throw new t("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
    }), o.forEach(function(i) {
      if (!(i instanceof d))
        throw new t("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    });
    var s = Object.create(f.prototype);
    return s.implicit = (this.implicit || []).concat(l), s.explicit = (this.explicit || []).concat(o), s.compiledImplicit = h(s, "implicit"), s.compiledExplicit = h(s, "explicit"), s.compiledTypeMap = c(s.compiledImplicit, s.compiledExplicit), s;
  }, Bn = f, Bn;
}
var Hn, Fo;
function Hl() {
  if (Fo) return Hn;
  Fo = 1;
  var t = Me();
  return Hn = new t("tag:yaml.org,2002:str", {
    kind: "scalar",
    construct: function(d) {
      return d !== null ? d : "";
    }
  }), Hn;
}
var jn, xo;
function jl() {
  if (xo) return jn;
  xo = 1;
  var t = Me();
  return jn = new t("tag:yaml.org,2002:seq", {
    kind: "sequence",
    construct: function(d) {
      return d !== null ? d : [];
    }
  }), jn;
}
var Gn, Lo;
function Gl() {
  if (Lo) return Gn;
  Lo = 1;
  var t = Me();
  return Gn = new t("tag:yaml.org,2002:map", {
    kind: "mapping",
    construct: function(d) {
      return d !== null ? d : {};
    }
  }), Gn;
}
var Wn, Uo;
function Wl() {
  if (Uo) return Wn;
  Uo = 1;
  var t = Bl();
  return Wn = new t({
    explicit: [
      Hl(),
      jl(),
      Gl()
    ]
  }), Wn;
}
var Vn, $o;
function Vl() {
  if ($o) return Vn;
  $o = 1;
  var t = Me();
  function d(f) {
    if (f === null) return !0;
    var u = f.length;
    return u === 1 && f === "~" || u === 4 && (f === "null" || f === "Null" || f === "NULL");
  }
  function h() {
    return null;
  }
  function c(f) {
    return f === null;
  }
  return Vn = new t("tag:yaml.org,2002:null", {
    kind: "scalar",
    resolve: d,
    construct: h,
    predicate: c,
    represent: {
      canonical: function() {
        return "~";
      },
      lowercase: function() {
        return "null";
      },
      uppercase: function() {
        return "NULL";
      },
      camelcase: function() {
        return "Null";
      },
      empty: function() {
        return "";
      }
    },
    defaultStyle: "lowercase"
  }), Vn;
}
var Yn, ko;
function Yl() {
  if (ko) return Yn;
  ko = 1;
  var t = Me();
  function d(f) {
    if (f === null) return !1;
    var u = f.length;
    return u === 4 && (f === "true" || f === "True" || f === "TRUE") || u === 5 && (f === "false" || f === "False" || f === "FALSE");
  }
  function h(f) {
    return f === "true" || f === "True" || f === "TRUE";
  }
  function c(f) {
    return Object.prototype.toString.call(f) === "[object Boolean]";
  }
  return Yn = new t("tag:yaml.org,2002:bool", {
    kind: "scalar",
    resolve: d,
    construct: h,
    predicate: c,
    represent: {
      lowercase: function(f) {
        return f ? "true" : "false";
      },
      uppercase: function(f) {
        return f ? "TRUE" : "FALSE";
      },
      camelcase: function(f) {
        return f ? "True" : "False";
      }
    },
    defaultStyle: "lowercase"
  }), Yn;
}
var zn, qo;
function zl() {
  if (qo) return zn;
  qo = 1;
  var t = Er(), d = Me();
  function h(o) {
    return 48 <= o && o <= 57 || 65 <= o && o <= 70 || 97 <= o && o <= 102;
  }
  function c(o) {
    return 48 <= o && o <= 55;
  }
  function f(o) {
    return 48 <= o && o <= 57;
  }
  function u(o) {
    if (o === null) return !1;
    var s = o.length, i = 0, n = !1, r;
    if (!s) return !1;
    if (r = o[i], (r === "-" || r === "+") && (r = o[++i]), r === "0") {
      if (i + 1 === s) return !0;
      if (r = o[++i], r === "b") {
        for (i++; i < s; i++)
          if (r = o[i], r !== "_") {
            if (r !== "0" && r !== "1") return !1;
            n = !0;
          }
        return n && r !== "_";
      }
      if (r === "x") {
        for (i++; i < s; i++)
          if (r = o[i], r !== "_") {
            if (!h(o.charCodeAt(i))) return !1;
            n = !0;
          }
        return n && r !== "_";
      }
      if (r === "o") {
        for (i++; i < s; i++)
          if (r = o[i], r !== "_") {
            if (!c(o.charCodeAt(i))) return !1;
            n = !0;
          }
        return n && r !== "_";
      }
    }
    if (r === "_") return !1;
    for (; i < s; i++)
      if (r = o[i], r !== "_") {
        if (!f(o.charCodeAt(i)))
          return !1;
        n = !0;
      }
    return !(!n || r === "_");
  }
  function a(o) {
    var s = o, i = 1, n;
    if (s.indexOf("_") !== -1 && (s = s.replace(/_/g, "")), n = s[0], (n === "-" || n === "+") && (n === "-" && (i = -1), s = s.slice(1), n = s[0]), s === "0") return 0;
    if (n === "0") {
      if (s[1] === "b") return i * parseInt(s.slice(2), 2);
      if (s[1] === "x") return i * parseInt(s.slice(2), 16);
      if (s[1] === "o") return i * parseInt(s.slice(2), 8);
    }
    return i * parseInt(s, 10);
  }
  function l(o) {
    return Object.prototype.toString.call(o) === "[object Number]" && o % 1 === 0 && !t.isNegativeZero(o);
  }
  return zn = new d("tag:yaml.org,2002:int", {
    kind: "scalar",
    resolve: u,
    construct: a,
    predicate: l,
    represent: {
      binary: function(o) {
        return o >= 0 ? "0b" + o.toString(2) : "-0b" + o.toString(2).slice(1);
      },
      octal: function(o) {
        return o >= 0 ? "0o" + o.toString(8) : "-0o" + o.toString(8).slice(1);
      },
      decimal: function(o) {
        return o.toString(10);
      },
      /* eslint-disable max-len */
      hexadecimal: function(o) {
        return o >= 0 ? "0x" + o.toString(16).toUpperCase() : "-0x" + o.toString(16).toUpperCase().slice(1);
      }
    },
    defaultStyle: "decimal",
    styleAliases: {
      binary: [2, "bin"],
      octal: [8, "oct"],
      decimal: [10, "dec"],
      hexadecimal: [16, "hex"]
    }
  }), zn;
}
var Xn, Mo;
function Xl() {
  if (Mo) return Xn;
  Mo = 1;
  var t = Er(), d = Me(), h = new RegExp(
    // 2.5e4, 2.5 and integers
    "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
  );
  function c(o) {
    return !(o === null || !h.test(o) || // Quick hack to not allow integers end with `_`
    // Probably should update regexp & check speed
    o[o.length - 1] === "_");
  }
  function f(o) {
    var s, i;
    return s = o.replace(/_/g, "").toLowerCase(), i = s[0] === "-" ? -1 : 1, "+-".indexOf(s[0]) >= 0 && (s = s.slice(1)), s === ".inf" ? i === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : s === ".nan" ? NaN : i * parseFloat(s, 10);
  }
  var u = /^[-+]?[0-9]+e/;
  function a(o, s) {
    var i;
    if (isNaN(o))
      switch (s) {
        case "lowercase":
          return ".nan";
        case "uppercase":
          return ".NAN";
        case "camelcase":
          return ".NaN";
      }
    else if (Number.POSITIVE_INFINITY === o)
      switch (s) {
        case "lowercase":
          return ".inf";
        case "uppercase":
          return ".INF";
        case "camelcase":
          return ".Inf";
      }
    else if (Number.NEGATIVE_INFINITY === o)
      switch (s) {
        case "lowercase":
          return "-.inf";
        case "uppercase":
          return "-.INF";
        case "camelcase":
          return "-.Inf";
      }
    else if (t.isNegativeZero(o))
      return "-0.0";
    return i = o.toString(10), u.test(i) ? i.replace("e", ".e") : i;
  }
  function l(o) {
    return Object.prototype.toString.call(o) === "[object Number]" && (o % 1 !== 0 || t.isNegativeZero(o));
  }
  return Xn = new d("tag:yaml.org,2002:float", {
    kind: "scalar",
    resolve: c,
    construct: f,
    predicate: l,
    represent: a,
    defaultStyle: "lowercase"
  }), Xn;
}
var Kn, Bo;
function Kl() {
  return Bo || (Bo = 1, Kn = Wl().extend({
    implicit: [
      Vl(),
      Yl(),
      zl(),
      Xl()
    ]
  })), Kn;
}
var Jn, Ho;
function Jl() {
  return Ho || (Ho = 1, Jn = Kl()), Jn;
}
var Qn, jo;
function Ql() {
  if (jo) return Qn;
  jo = 1;
  var t = Me(), d = new RegExp(
    "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
  ), h = new RegExp(
    "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
  );
  function c(a) {
    return a === null ? !1 : d.exec(a) !== null || h.exec(a) !== null;
  }
  function f(a) {
    var l, o, s, i, n, r, p, g = 0, y = null, m, w, S;
    if (l = d.exec(a), l === null && (l = h.exec(a)), l === null) throw new Error("Date resolve error");
    if (o = +l[1], s = +l[2] - 1, i = +l[3], !l[4])
      return new Date(Date.UTC(o, s, i));
    if (n = +l[4], r = +l[5], p = +l[6], l[7]) {
      for (g = l[7].slice(0, 3); g.length < 3; )
        g += "0";
      g = +g;
    }
    return l[9] && (m = +l[10], w = +(l[11] || 0), y = (m * 60 + w) * 6e4, l[9] === "-" && (y = -y)), S = new Date(Date.UTC(o, s, i, n, r, p, g)), y && S.setTime(S.getTime() - y), S;
  }
  function u(a) {
    return a.toISOString();
  }
  return Qn = new t("tag:yaml.org,2002:timestamp", {
    kind: "scalar",
    resolve: c,
    construct: f,
    instanceOf: Date,
    represent: u
  }), Qn;
}
var Zn, Go;
function Zl() {
  if (Go) return Zn;
  Go = 1;
  var t = Me();
  function d(h) {
    return h === "<<" || h === null;
  }
  return Zn = new t("tag:yaml.org,2002:merge", {
    kind: "scalar",
    resolve: d
  }), Zn;
}
var ei, Wo;
function eu() {
  if (Wo) return ei;
  Wo = 1;
  var t = Me(), d = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
  function h(a) {
    if (a === null) return !1;
    var l, o, s = 0, i = a.length, n = d;
    for (o = 0; o < i; o++)
      if (l = n.indexOf(a.charAt(o)), !(l > 64)) {
        if (l < 0) return !1;
        s += 6;
      }
    return s % 8 === 0;
  }
  function c(a) {
    var l, o, s = a.replace(/[\r\n=]/g, ""), i = s.length, n = d, r = 0, p = [];
    for (l = 0; l < i; l++)
      l % 4 === 0 && l && (p.push(r >> 16 & 255), p.push(r >> 8 & 255), p.push(r & 255)), r = r << 6 | n.indexOf(s.charAt(l));
    return o = i % 4 * 6, o === 0 ? (p.push(r >> 16 & 255), p.push(r >> 8 & 255), p.push(r & 255)) : o === 18 ? (p.push(r >> 10 & 255), p.push(r >> 2 & 255)) : o === 12 && p.push(r >> 4 & 255), new Uint8Array(p);
  }
  function f(a) {
    var l = "", o = 0, s, i, n = a.length, r = d;
    for (s = 0; s < n; s++)
      s % 3 === 0 && s && (l += r[o >> 18 & 63], l += r[o >> 12 & 63], l += r[o >> 6 & 63], l += r[o & 63]), o = (o << 8) + a[s];
    return i = n % 3, i === 0 ? (l += r[o >> 18 & 63], l += r[o >> 12 & 63], l += r[o >> 6 & 63], l += r[o & 63]) : i === 2 ? (l += r[o >> 10 & 63], l += r[o >> 4 & 63], l += r[o << 2 & 63], l += r[64]) : i === 1 && (l += r[o >> 2 & 63], l += r[o << 4 & 63], l += r[64], l += r[64]), l;
  }
  function u(a) {
    return Object.prototype.toString.call(a) === "[object Uint8Array]";
  }
  return ei = new t("tag:yaml.org,2002:binary", {
    kind: "scalar",
    resolve: h,
    construct: c,
    predicate: u,
    represent: f
  }), ei;
}
var ti, Vo;
function tu() {
  if (Vo) return ti;
  Vo = 1;
  var t = Me(), d = Object.prototype.hasOwnProperty, h = Object.prototype.toString;
  function c(u) {
    if (u === null) return !0;
    var a = [], l, o, s, i, n, r = u;
    for (l = 0, o = r.length; l < o; l += 1) {
      if (s = r[l], n = !1, h.call(s) !== "[object Object]") return !1;
      for (i in s)
        if (d.call(s, i))
          if (!n) n = !0;
          else return !1;
      if (!n) return !1;
      if (a.indexOf(i) === -1) a.push(i);
      else return !1;
    }
    return !0;
  }
  function f(u) {
    return u !== null ? u : [];
  }
  return ti = new t("tag:yaml.org,2002:omap", {
    kind: "sequence",
    resolve: c,
    construct: f
  }), ti;
}
var ri, Yo;
function ru() {
  if (Yo) return ri;
  Yo = 1;
  var t = Me(), d = Object.prototype.toString;
  function h(f) {
    if (f === null) return !0;
    var u, a, l, o, s, i = f;
    for (s = new Array(i.length), u = 0, a = i.length; u < a; u += 1) {
      if (l = i[u], d.call(l) !== "[object Object]" || (o = Object.keys(l), o.length !== 1)) return !1;
      s[u] = [o[0], l[o[0]]];
    }
    return !0;
  }
  function c(f) {
    if (f === null) return [];
    var u, a, l, o, s, i = f;
    for (s = new Array(i.length), u = 0, a = i.length; u < a; u += 1)
      l = i[u], o = Object.keys(l), s[u] = [o[0], l[o[0]]];
    return s;
  }
  return ri = new t("tag:yaml.org,2002:pairs", {
    kind: "sequence",
    resolve: h,
    construct: c
  }), ri;
}
var ni, zo;
function nu() {
  if (zo) return ni;
  zo = 1;
  var t = Me(), d = Object.prototype.hasOwnProperty;
  function h(f) {
    if (f === null) return !0;
    var u, a = f;
    for (u in a)
      if (d.call(a, u) && a[u] !== null)
        return !1;
    return !0;
  }
  function c(f) {
    return f !== null ? f : {};
  }
  return ni = new t("tag:yaml.org,2002:set", {
    kind: "mapping",
    resolve: h,
    construct: c
  }), ni;
}
var ii, Xo;
function ia() {
  return Xo || (Xo = 1, ii = Jl().extend({
    implicit: [
      Ql(),
      Zl()
    ],
    explicit: [
      eu(),
      tu(),
      ru(),
      nu()
    ]
  })), ii;
}
var Ko;
function af() {
  if (Ko) return $r;
  Ko = 1;
  var t = Er(), d = yr(), h = nf(), c = ia(), f = Object.prototype.hasOwnProperty, u = 1, a = 2, l = 3, o = 4, s = 1, i = 2, n = 3, r = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, p = /[\x85\u2028\u2029]/, g = /[,\[\]\{\}]/, y = /^(?:!|!!|![a-z\-]+!)$/i, m = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
  function w(e) {
    return Object.prototype.toString.call(e);
  }
  function S(e) {
    return e === 10 || e === 13;
  }
  function P(e) {
    return e === 9 || e === 32;
  }
  function I(e) {
    return e === 9 || e === 32 || e === 10 || e === 13;
  }
  function b(e) {
    return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
  }
  function O(e) {
    var B;
    return 48 <= e && e <= 57 ? e - 48 : (B = e | 32, 97 <= B && B <= 102 ? B - 97 + 10 : -1);
  }
  function T(e) {
    return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
  }
  function A(e) {
    return 48 <= e && e <= 57 ? e - 48 : -1;
  }
  function v(e) {
    return e === 48 ? "\0" : e === 97 ? "\x07" : e === 98 ? "\b" : e === 116 || e === 9 ? "	" : e === 110 ? `
` : e === 118 ? "\v" : e === 102 ? "\f" : e === 114 ? "\r" : e === 101 ? "\x1B" : e === 32 ? " " : e === 34 ? '"' : e === 47 ? "/" : e === 92 ? "\\" : e === 78 ? "" : e === 95 ? " " : e === 76 ? "\u2028" : e === 80 ? "\u2029" : "";
  }
  function $(e) {
    return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
      (e - 65536 >> 10) + 55296,
      (e - 65536 & 1023) + 56320
    );
  }
  function k(e, B, W) {
    B === "__proto__" ? Object.defineProperty(e, B, {
      configurable: !0,
      enumerable: !0,
      writable: !0,
      value: W
    }) : e[B] = W;
  }
  for (var L = new Array(256), q = new Array(256), F = 0; F < 256; F++)
    L[F] = v(F) ? 1 : 0, q[F] = v(F);
  function N(e, B) {
    this.input = e, this.filename = B.filename || null, this.schema = B.schema || c, this.onWarning = B.onWarning || null, this.legacy = B.legacy || !1, this.json = B.json || !1, this.listener = B.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
  }
  function j(e, B) {
    var W = {
      name: e.filename,
      buffer: e.input.slice(0, -1),
      // omit trailing \0
      position: e.position,
      line: e.line,
      column: e.position - e.lineStart
    };
    return W.snippet = h(W), new d(B, W);
  }
  function D(e, B) {
    throw j(e, B);
  }
  function G(e, B) {
    e.onWarning && e.onWarning.call(null, j(e, B));
  }
  var V = {
    YAML: function(B, W, ne) {
      var Y, re, Z;
      B.version !== null && D(B, "duplication of %YAML directive"), ne.length !== 1 && D(B, "YAML directive accepts exactly one argument"), Y = /^([0-9]+)\.([0-9]+)$/.exec(ne[0]), Y === null && D(B, "ill-formed argument of the YAML directive"), re = parseInt(Y[1], 10), Z = parseInt(Y[2], 10), re !== 1 && D(B, "unacceptable YAML version of the document"), B.version = ne[0], B.checkLineBreaks = Z < 2, Z !== 1 && Z !== 2 && G(B, "unsupported YAML version of the document");
    },
    TAG: function(B, W, ne) {
      var Y, re;
      ne.length !== 2 && D(B, "TAG directive accepts exactly two arguments"), Y = ne[0], re = ne[1], y.test(Y) || D(B, "ill-formed tag handle (first argument) of the TAG directive"), f.call(B.tagMap, Y) && D(B, 'there is a previously declared suffix for "' + Y + '" tag handle'), m.test(re) || D(B, "ill-formed tag prefix (second argument) of the TAG directive");
      try {
        re = decodeURIComponent(re);
      } catch {
        D(B, "tag prefix is malformed: " + re);
      }
      B.tagMap[Y] = re;
    }
  };
  function te(e, B, W, ne) {
    var Y, re, Z, oe;
    if (B < W) {
      if (oe = e.input.slice(B, W), ne)
        for (Y = 0, re = oe.length; Y < re; Y += 1)
          Z = oe.charCodeAt(Y), Z === 9 || 32 <= Z && Z <= 1114111 || D(e, "expected valid JSON character");
      else r.test(oe) && D(e, "the stream contains non-printable characters");
      e.result += oe;
    }
  }
  function de(e, B, W, ne) {
    var Y, re, Z, oe;
    for (t.isObject(W) || D(e, "cannot merge mappings; the provided source object is unacceptable"), Y = Object.keys(W), Z = 0, oe = Y.length; Z < oe; Z += 1)
      re = Y[Z], f.call(B, re) || (k(B, re, W[re]), ne[re] = !0);
  }
  function ie(e, B, W, ne, Y, re, Z, oe, ue) {
    var Se, Te;
    if (Array.isArray(Y))
      for (Y = Array.prototype.slice.call(Y), Se = 0, Te = Y.length; Se < Te; Se += 1)
        Array.isArray(Y[Se]) && D(e, "nested arrays are not supported inside keys"), typeof Y == "object" && w(Y[Se]) === "[object Object]" && (Y[Se] = "[object Object]");
    if (typeof Y == "object" && w(Y) === "[object Object]" && (Y = "[object Object]"), Y = String(Y), B === null && (B = {}), ne === "tag:yaml.org,2002:merge")
      if (Array.isArray(re))
        for (Se = 0, Te = re.length; Se < Te; Se += 1)
          de(e, B, re[Se], W);
      else
        de(e, B, re, W);
    else
      !e.json && !f.call(W, Y) && f.call(B, Y) && (e.line = Z || e.line, e.lineStart = oe || e.lineStart, e.position = ue || e.position, D(e, "duplicated mapping key")), k(B, Y, re), delete W[Y];
    return B;
  }
  function we(e) {
    var B;
    B = e.input.charCodeAt(e.position), B === 10 ? e.position++ : B === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : D(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
  }
  function ve(e, B, W) {
    for (var ne = 0, Y = e.input.charCodeAt(e.position); Y !== 0; ) {
      for (; P(Y); )
        Y === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), Y = e.input.charCodeAt(++e.position);
      if (B && Y === 35)
        do
          Y = e.input.charCodeAt(++e.position);
        while (Y !== 10 && Y !== 13 && Y !== 0);
      if (S(Y))
        for (we(e), Y = e.input.charCodeAt(e.position), ne++, e.lineIndent = 0; Y === 32; )
          e.lineIndent++, Y = e.input.charCodeAt(++e.position);
      else
        break;
    }
    return W !== -1 && ne !== 0 && e.lineIndent < W && G(e, "deficient indentation"), ne;
  }
  function Q(e) {
    var B = e.position, W;
    return W = e.input.charCodeAt(B), !!((W === 45 || W === 46) && W === e.input.charCodeAt(B + 1) && W === e.input.charCodeAt(B + 2) && (B += 3, W = e.input.charCodeAt(B), W === 0 || I(W)));
  }
  function ge(e, B) {
    B === 1 ? e.result += " " : B > 1 && (e.result += t.repeat(`
`, B - 1));
  }
  function _(e, B, W) {
    var ne, Y, re, Z, oe, ue, Se, Te, pe = e.kind, R = e.result, M;
    if (M = e.input.charCodeAt(e.position), I(M) || b(M) || M === 35 || M === 38 || M === 42 || M === 33 || M === 124 || M === 62 || M === 39 || M === 34 || M === 37 || M === 64 || M === 96 || (M === 63 || M === 45) && (Y = e.input.charCodeAt(e.position + 1), I(Y) || W && b(Y)))
      return !1;
    for (e.kind = "scalar", e.result = "", re = Z = e.position, oe = !1; M !== 0; ) {
      if (M === 58) {
        if (Y = e.input.charCodeAt(e.position + 1), I(Y) || W && b(Y))
          break;
      } else if (M === 35) {
        if (ne = e.input.charCodeAt(e.position - 1), I(ne))
          break;
      } else {
        if (e.position === e.lineStart && Q(e) || W && b(M))
          break;
        if (S(M))
          if (ue = e.line, Se = e.lineStart, Te = e.lineIndent, ve(e, !1, -1), e.lineIndent >= B) {
            oe = !0, M = e.input.charCodeAt(e.position);
            continue;
          } else {
            e.position = Z, e.line = ue, e.lineStart = Se, e.lineIndent = Te;
            break;
          }
      }
      oe && (te(e, re, Z, !1), ge(e, e.line - ue), re = Z = e.position, oe = !1), P(M) || (Z = e.position + 1), M = e.input.charCodeAt(++e.position);
    }
    return te(e, re, Z, !1), e.result ? !0 : (e.kind = pe, e.result = R, !1);
  }
  function E(e, B) {
    var W, ne, Y;
    if (W = e.input.charCodeAt(e.position), W !== 39)
      return !1;
    for (e.kind = "scalar", e.result = "", e.position++, ne = Y = e.position; (W = e.input.charCodeAt(e.position)) !== 0; )
      if (W === 39)
        if (te(e, ne, e.position, !0), W = e.input.charCodeAt(++e.position), W === 39)
          ne = e.position, e.position++, Y = e.position;
        else
          return !0;
      else S(W) ? (te(e, ne, Y, !0), ge(e, ve(e, !1, B)), ne = Y = e.position) : e.position === e.lineStart && Q(e) ? D(e, "unexpected end of the document within a single quoted scalar") : (e.position++, Y = e.position);
    D(e, "unexpected end of the stream within a single quoted scalar");
  }
  function H(e, B) {
    var W, ne, Y, re, Z, oe;
    if (oe = e.input.charCodeAt(e.position), oe !== 34)
      return !1;
    for (e.kind = "scalar", e.result = "", e.position++, W = ne = e.position; (oe = e.input.charCodeAt(e.position)) !== 0; ) {
      if (oe === 34)
        return te(e, W, e.position, !0), e.position++, !0;
      if (oe === 92) {
        if (te(e, W, e.position, !0), oe = e.input.charCodeAt(++e.position), S(oe))
          ve(e, !1, B);
        else if (oe < 256 && L[oe])
          e.result += q[oe], e.position++;
        else if ((Z = T(oe)) > 0) {
          for (Y = Z, re = 0; Y > 0; Y--)
            oe = e.input.charCodeAt(++e.position), (Z = O(oe)) >= 0 ? re = (re << 4) + Z : D(e, "expected hexadecimal character");
          e.result += $(re), e.position++;
        } else
          D(e, "unknown escape sequence");
        W = ne = e.position;
      } else S(oe) ? (te(e, W, ne, !0), ge(e, ve(e, !1, B)), W = ne = e.position) : e.position === e.lineStart && Q(e) ? D(e, "unexpected end of the document within a double quoted scalar") : (e.position++, ne = e.position);
    }
    D(e, "unexpected end of the stream within a double quoted scalar");
  }
  function x(e, B) {
    var W = !0, ne, Y, re, Z = e.tag, oe, ue = e.anchor, Se, Te, pe, R, M, z = /* @__PURE__ */ Object.create(null), X, K, ae, ee;
    if (ee = e.input.charCodeAt(e.position), ee === 91)
      Te = 93, M = !1, oe = [];
    else if (ee === 123)
      Te = 125, M = !0, oe = {};
    else
      return !1;
    for (e.anchor !== null && (e.anchorMap[e.anchor] = oe), ee = e.input.charCodeAt(++e.position); ee !== 0; ) {
      if (ve(e, !0, B), ee = e.input.charCodeAt(e.position), ee === Te)
        return e.position++, e.tag = Z, e.anchor = ue, e.kind = M ? "mapping" : "sequence", e.result = oe, !0;
      W ? ee === 44 && D(e, "expected the node content, but found ','") : D(e, "missed comma between flow collection entries"), K = X = ae = null, pe = R = !1, ee === 63 && (Se = e.input.charCodeAt(e.position + 1), I(Se) && (pe = R = !0, e.position++, ve(e, !0, B))), ne = e.line, Y = e.lineStart, re = e.position, Ae(e, B, u, !1, !0), K = e.tag, X = e.result, ve(e, !0, B), ee = e.input.charCodeAt(e.position), (R || e.line === ne) && ee === 58 && (pe = !0, ee = e.input.charCodeAt(++e.position), ve(e, !0, B), Ae(e, B, u, !1, !0), ae = e.result), M ? ie(e, oe, z, K, X, ae, ne, Y, re) : pe ? oe.push(ie(e, null, z, K, X, ae, ne, Y, re)) : oe.push(X), ve(e, !0, B), ee = e.input.charCodeAt(e.position), ee === 44 ? (W = !0, ee = e.input.charCodeAt(++e.position)) : W = !1;
    }
    D(e, "unexpected end of the stream within a flow collection");
  }
  function ce(e, B) {
    var W, ne, Y = s, re = !1, Z = !1, oe = B, ue = 0, Se = !1, Te, pe;
    if (pe = e.input.charCodeAt(e.position), pe === 124)
      ne = !1;
    else if (pe === 62)
      ne = !0;
    else
      return !1;
    for (e.kind = "scalar", e.result = ""; pe !== 0; )
      if (pe = e.input.charCodeAt(++e.position), pe === 43 || pe === 45)
        s === Y ? Y = pe === 43 ? n : i : D(e, "repeat of a chomping mode identifier");
      else if ((Te = A(pe)) >= 0)
        Te === 0 ? D(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : Z ? D(e, "repeat of an indentation width identifier") : (oe = B + Te - 1, Z = !0);
      else
        break;
    if (P(pe)) {
      do
        pe = e.input.charCodeAt(++e.position);
      while (P(pe));
      if (pe === 35)
        do
          pe = e.input.charCodeAt(++e.position);
        while (!S(pe) && pe !== 0);
    }
    for (; pe !== 0; ) {
      for (we(e), e.lineIndent = 0, pe = e.input.charCodeAt(e.position); (!Z || e.lineIndent < oe) && pe === 32; )
        e.lineIndent++, pe = e.input.charCodeAt(++e.position);
      if (!Z && e.lineIndent > oe && (oe = e.lineIndent), S(pe)) {
        ue++;
        continue;
      }
      if (e.lineIndent < oe) {
        Y === n ? e.result += t.repeat(`
`, re ? 1 + ue : ue) : Y === s && re && (e.result += `
`);
        break;
      }
      for (ne ? P(pe) ? (Se = !0, e.result += t.repeat(`
`, re ? 1 + ue : ue)) : Se ? (Se = !1, e.result += t.repeat(`
`, ue + 1)) : ue === 0 ? re && (e.result += " ") : e.result += t.repeat(`
`, ue) : e.result += t.repeat(`
`, re ? 1 + ue : ue), re = !0, Z = !0, ue = 0, W = e.position; !S(pe) && pe !== 0; )
        pe = e.input.charCodeAt(++e.position);
      te(e, W, e.position, !1);
    }
    return !0;
  }
  function me(e, B) {
    var W, ne = e.tag, Y = e.anchor, re = [], Z, oe = !1, ue;
    if (e.firstTabInLine !== -1) return !1;
    for (e.anchor !== null && (e.anchorMap[e.anchor] = re), ue = e.input.charCodeAt(e.position); ue !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, D(e, "tab characters must not be used in indentation")), !(ue !== 45 || (Z = e.input.charCodeAt(e.position + 1), !I(Z)))); ) {
      if (oe = !0, e.position++, ve(e, !0, -1) && e.lineIndent <= B) {
        re.push(null), ue = e.input.charCodeAt(e.position);
        continue;
      }
      if (W = e.line, Ae(e, B, l, !1, !0), re.push(e.result), ve(e, !0, -1), ue = e.input.charCodeAt(e.position), (e.line === W || e.lineIndent > B) && ue !== 0)
        D(e, "bad indentation of a sequence entry");
      else if (e.lineIndent < B)
        break;
    }
    return oe ? (e.tag = ne, e.anchor = Y, e.kind = "sequence", e.result = re, !0) : !1;
  }
  function he(e, B, W) {
    var ne, Y, re, Z, oe, ue, Se = e.tag, Te = e.anchor, pe = {}, R = /* @__PURE__ */ Object.create(null), M = null, z = null, X = null, K = !1, ae = !1, ee;
    if (e.firstTabInLine !== -1) return !1;
    for (e.anchor !== null && (e.anchorMap[e.anchor] = pe), ee = e.input.charCodeAt(e.position); ee !== 0; ) {
      if (!K && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, D(e, "tab characters must not be used in indentation")), ne = e.input.charCodeAt(e.position + 1), re = e.line, (ee === 63 || ee === 58) && I(ne))
        ee === 63 ? (K && (ie(e, pe, R, M, z, null, Z, oe, ue), M = z = X = null), ae = !0, K = !0, Y = !0) : K ? (K = !1, Y = !0) : D(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, ee = ne;
      else {
        if (Z = e.line, oe = e.lineStart, ue = e.position, !Ae(e, W, a, !1, !0))
          break;
        if (e.line === re) {
          for (ee = e.input.charCodeAt(e.position); P(ee); )
            ee = e.input.charCodeAt(++e.position);
          if (ee === 58)
            ee = e.input.charCodeAt(++e.position), I(ee) || D(e, "a whitespace character is expected after the key-value separator within a block mapping"), K && (ie(e, pe, R, M, z, null, Z, oe, ue), M = z = X = null), ae = !0, K = !1, Y = !1, M = e.tag, z = e.result;
          else if (ae)
            D(e, "can not read an implicit mapping pair; a colon is missed");
          else
            return e.tag = Se, e.anchor = Te, !0;
        } else if (ae)
          D(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
        else
          return e.tag = Se, e.anchor = Te, !0;
      }
      if ((e.line === re || e.lineIndent > B) && (K && (Z = e.line, oe = e.lineStart, ue = e.position), Ae(e, B, o, !0, Y) && (K ? z = e.result : X = e.result), K || (ie(e, pe, R, M, z, X, Z, oe, ue), M = z = X = null), ve(e, !0, -1), ee = e.input.charCodeAt(e.position)), (e.line === re || e.lineIndent > B) && ee !== 0)
        D(e, "bad indentation of a mapping entry");
      else if (e.lineIndent < B)
        break;
    }
    return K && ie(e, pe, R, M, z, null, Z, oe, ue), ae && (e.tag = Se, e.anchor = Te, e.kind = "mapping", e.result = pe), ae;
  }
  function _e(e) {
    var B, W = !1, ne = !1, Y, re, Z;
    if (Z = e.input.charCodeAt(e.position), Z !== 33) return !1;
    if (e.tag !== null && D(e, "duplication of a tag property"), Z = e.input.charCodeAt(++e.position), Z === 60 ? (W = !0, Z = e.input.charCodeAt(++e.position)) : Z === 33 ? (ne = !0, Y = "!!", Z = e.input.charCodeAt(++e.position)) : Y = "!", B = e.position, W) {
      do
        Z = e.input.charCodeAt(++e.position);
      while (Z !== 0 && Z !== 62);
      e.position < e.length ? (re = e.input.slice(B, e.position), Z = e.input.charCodeAt(++e.position)) : D(e, "unexpected end of the stream within a verbatim tag");
    } else {
      for (; Z !== 0 && !I(Z); )
        Z === 33 && (ne ? D(e, "tag suffix cannot contain exclamation marks") : (Y = e.input.slice(B - 1, e.position + 1), y.test(Y) || D(e, "named tag handle cannot contain such characters"), ne = !0, B = e.position + 1)), Z = e.input.charCodeAt(++e.position);
      re = e.input.slice(B, e.position), g.test(re) && D(e, "tag suffix cannot contain flow indicator characters");
    }
    re && !m.test(re) && D(e, "tag name cannot contain such characters: " + re);
    try {
      re = decodeURIComponent(re);
    } catch {
      D(e, "tag name is malformed: " + re);
    }
    return W ? e.tag = re : f.call(e.tagMap, Y) ? e.tag = e.tagMap[Y] + re : Y === "!" ? e.tag = "!" + re : Y === "!!" ? e.tag = "tag:yaml.org,2002:" + re : D(e, 'undeclared tag handle "' + Y + '"'), !0;
  }
  function Ee(e) {
    var B, W;
    if (W = e.input.charCodeAt(e.position), W !== 38) return !1;
    for (e.anchor !== null && D(e, "duplication of an anchor property"), W = e.input.charCodeAt(++e.position), B = e.position; W !== 0 && !I(W) && !b(W); )
      W = e.input.charCodeAt(++e.position);
    return e.position === B && D(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(B, e.position), !0;
  }
  function He(e) {
    var B, W, ne;
    if (ne = e.input.charCodeAt(e.position), ne !== 42) return !1;
    for (ne = e.input.charCodeAt(++e.position), B = e.position; ne !== 0 && !I(ne) && !b(ne); )
      ne = e.input.charCodeAt(++e.position);
    return e.position === B && D(e, "name of an alias node must contain at least one character"), W = e.input.slice(B, e.position), f.call(e.anchorMap, W) || D(e, 'unidentified alias "' + W + '"'), e.result = e.anchorMap[W], ve(e, !0, -1), !0;
  }
  function Ae(e, B, W, ne, Y) {
    var re, Z, oe, ue = 1, Se = !1, Te = !1, pe, R, M, z, X, K;
    if (e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, re = Z = oe = o === W || l === W, ne && ve(e, !0, -1) && (Se = !0, e.lineIndent > B ? ue = 1 : e.lineIndent === B ? ue = 0 : e.lineIndent < B && (ue = -1)), ue === 1)
      for (; _e(e) || Ee(e); )
        ve(e, !0, -1) ? (Se = !0, oe = re, e.lineIndent > B ? ue = 1 : e.lineIndent === B ? ue = 0 : e.lineIndent < B && (ue = -1)) : oe = !1;
    if (oe && (oe = Se || Y), (ue === 1 || o === W) && (u === W || a === W ? X = B : X = B + 1, K = e.position - e.lineStart, ue === 1 ? oe && (me(e, K) || he(e, K, X)) || x(e, X) ? Te = !0 : (Z && ce(e, X) || E(e, X) || H(e, X) ? Te = !0 : He(e) ? (Te = !0, (e.tag !== null || e.anchor !== null) && D(e, "alias node should not have any properties")) : _(e, X, u === W) && (Te = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : ue === 0 && (Te = oe && me(e, K))), e.tag === null)
      e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
    else if (e.tag === "?") {
      for (e.result !== null && e.kind !== "scalar" && D(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"'), pe = 0, R = e.implicitTypes.length; pe < R; pe += 1)
        if (z = e.implicitTypes[pe], z.resolve(e.result)) {
          e.result = z.construct(e.result), e.tag = z.tag, e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
          break;
        }
    } else if (e.tag !== "!") {
      if (f.call(e.typeMap[e.kind || "fallback"], e.tag))
        z = e.typeMap[e.kind || "fallback"][e.tag];
      else
        for (z = null, M = e.typeMap.multi[e.kind || "fallback"], pe = 0, R = M.length; pe < R; pe += 1)
          if (e.tag.slice(0, M[pe].tag.length) === M[pe].tag) {
            z = M[pe];
            break;
          }
      z || D(e, "unknown tag !<" + e.tag + ">"), e.result !== null && z.kind !== e.kind && D(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + z.kind + '", not "' + e.kind + '"'), z.resolve(e.result, e.tag) ? (e.result = z.construct(e.result, e.tag), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : D(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
    }
    return e.listener !== null && e.listener("close", e), e.tag !== null || e.anchor !== null || Te;
  }
  function qe(e) {
    var B = e.position, W, ne, Y, re = !1, Z;
    for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (Z = e.input.charCodeAt(e.position)) !== 0 && (ve(e, !0, -1), Z = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || Z !== 37)); ) {
      for (re = !0, Z = e.input.charCodeAt(++e.position), W = e.position; Z !== 0 && !I(Z); )
        Z = e.input.charCodeAt(++e.position);
      for (ne = e.input.slice(W, e.position), Y = [], ne.length < 1 && D(e, "directive name must not be less than one character in length"); Z !== 0; ) {
        for (; P(Z); )
          Z = e.input.charCodeAt(++e.position);
        if (Z === 35) {
          do
            Z = e.input.charCodeAt(++e.position);
          while (Z !== 0 && !S(Z));
          break;
        }
        if (S(Z)) break;
        for (W = e.position; Z !== 0 && !I(Z); )
          Z = e.input.charCodeAt(++e.position);
        Y.push(e.input.slice(W, e.position));
      }
      Z !== 0 && we(e), f.call(V, ne) ? V[ne](e, ne, Y) : G(e, 'unknown document directive "' + ne + '"');
    }
    if (ve(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, ve(e, !0, -1)) : re && D(e, "directives end mark is expected"), Ae(e, e.lineIndent - 1, o, !1, !0), ve(e, !0, -1), e.checkLineBreaks && p.test(e.input.slice(B, e.position)) && G(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && Q(e)) {
      e.input.charCodeAt(e.position) === 46 && (e.position += 3, ve(e, !0, -1));
      return;
    }
    if (e.position < e.length - 1)
      D(e, "end of the stream or a document separator is expected");
    else
      return;
  }
  function lt(e, B) {
    e = String(e), B = B || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
    var W = new N(e, B), ne = e.indexOf("\0");
    for (ne !== -1 && (W.position = ne, D(W, "null byte is not allowed in input")), W.input += "\0"; W.input.charCodeAt(W.position) === 32; )
      W.lineIndent += 1, W.position += 1;
    for (; W.position < W.length - 1; )
      qe(W);
    return W.documents;
  }
  function it(e, B, W) {
    B !== null && typeof B == "object" && typeof W > "u" && (W = B, B = null);
    var ne = lt(e, W);
    if (typeof B != "function")
      return ne;
    for (var Y = 0, re = ne.length; Y < re; Y += 1)
      B(ne[Y]);
  }
  function tt(e, B) {
    var W = lt(e, B);
    if (W.length !== 0) {
      if (W.length === 1)
        return W[0];
      throw new d("expected a single document in the stream, but found more");
    }
  }
  return $r.loadAll = it, $r.load = tt, $r;
}
var ai = {}, Jo;
function of() {
  if (Jo) return ai;
  Jo = 1;
  var t = Er(), d = yr(), h = ia(), c = Object.prototype.toString, f = Object.prototype.hasOwnProperty, u = 65279, a = 9, l = 10, o = 13, s = 32, i = 33, n = 34, r = 35, p = 37, g = 38, y = 39, m = 42, w = 44, S = 45, P = 58, I = 61, b = 62, O = 63, T = 64, A = 91, v = 93, $ = 96, k = 123, L = 124, q = 125, F = {};
  F[0] = "\\0", F[7] = "\\a", F[8] = "\\b", F[9] = "\\t", F[10] = "\\n", F[11] = "\\v", F[12] = "\\f", F[13] = "\\r", F[27] = "\\e", F[34] = '\\"', F[92] = "\\\\", F[133] = "\\N", F[160] = "\\_", F[8232] = "\\L", F[8233] = "\\P";
  var N = [
    "y",
    "Y",
    "yes",
    "Yes",
    "YES",
    "on",
    "On",
    "ON",
    "n",
    "N",
    "no",
    "No",
    "NO",
    "off",
    "Off",
    "OFF"
  ], j = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
  function D(R, M) {
    var z, X, K, ae, ee, se, fe;
    if (M === null) return {};
    for (z = {}, X = Object.keys(M), K = 0, ae = X.length; K < ae; K += 1)
      ee = X[K], se = String(M[ee]), ee.slice(0, 2) === "!!" && (ee = "tag:yaml.org,2002:" + ee.slice(2)), fe = R.compiledTypeMap.fallback[ee], fe && f.call(fe.styleAliases, se) && (se = fe.styleAliases[se]), z[ee] = se;
    return z;
  }
  function G(R) {
    var M, z, X;
    if (M = R.toString(16).toUpperCase(), R <= 255)
      z = "x", X = 2;
    else if (R <= 65535)
      z = "u", X = 4;
    else if (R <= 4294967295)
      z = "U", X = 8;
    else
      throw new d("code point within a string may not be greater than 0xFFFFFFFF");
    return "\\" + z + t.repeat("0", X - M.length) + M;
  }
  var V = 1, te = 2;
  function de(R) {
    this.schema = R.schema || h, this.indent = Math.max(1, R.indent || 2), this.noArrayIndent = R.noArrayIndent || !1, this.skipInvalid = R.skipInvalid || !1, this.flowLevel = t.isNothing(R.flowLevel) ? -1 : R.flowLevel, this.styleMap = D(this.schema, R.styles || null), this.sortKeys = R.sortKeys || !1, this.lineWidth = R.lineWidth || 80, this.noRefs = R.noRefs || !1, this.noCompatMode = R.noCompatMode || !1, this.condenseFlow = R.condenseFlow || !1, this.quotingType = R.quotingType === '"' ? te : V, this.forceQuotes = R.forceQuotes || !1, this.replacer = typeof R.replacer == "function" ? R.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
  }
  function ie(R, M) {
    for (var z = t.repeat(" ", M), X = 0, K = -1, ae = "", ee, se = R.length; X < se; )
      K = R.indexOf(`
`, X), K === -1 ? (ee = R.slice(X), X = se) : (ee = R.slice(X, K + 1), X = K + 1), ee.length && ee !== `
` && (ae += z), ae += ee;
    return ae;
  }
  function we(R, M) {
    return `
` + t.repeat(" ", R.indent * M);
  }
  function ve(R, M) {
    var z, X, K;
    for (z = 0, X = R.implicitTypes.length; z < X; z += 1)
      if (K = R.implicitTypes[z], K.resolve(M))
        return !0;
    return !1;
  }
  function Q(R) {
    return R === s || R === a;
  }
  function ge(R) {
    return 32 <= R && R <= 126 || 161 <= R && R <= 55295 && R !== 8232 && R !== 8233 || 57344 <= R && R <= 65533 && R !== u || 65536 <= R && R <= 1114111;
  }
  function _(R) {
    return ge(R) && R !== u && R !== o && R !== l;
  }
  function E(R, M, z) {
    var X = _(R), K = X && !Q(R);
    return (
      // ns-plain-safe
      (z ? (
        // c = flow-in
        X
      ) : X && R !== w && R !== A && R !== v && R !== k && R !== q) && R !== r && !(M === P && !K) || _(M) && !Q(M) && R === r || M === P && K
    );
  }
  function H(R) {
    return ge(R) && R !== u && !Q(R) && R !== S && R !== O && R !== P && R !== w && R !== A && R !== v && R !== k && R !== q && R !== r && R !== g && R !== m && R !== i && R !== L && R !== I && R !== b && R !== y && R !== n && R !== p && R !== T && R !== $;
  }
  function x(R) {
    return !Q(R) && R !== P;
  }
  function ce(R, M) {
    var z = R.charCodeAt(M), X;
    return z >= 55296 && z <= 56319 && M + 1 < R.length && (X = R.charCodeAt(M + 1), X >= 56320 && X <= 57343) ? (z - 55296) * 1024 + X - 56320 + 65536 : z;
  }
  function me(R) {
    var M = /^\n* /;
    return M.test(R);
  }
  var he = 1, _e = 2, Ee = 3, He = 4, Ae = 5;
  function qe(R, M, z, X, K, ae, ee, se) {
    var fe, ye = 0, Pe = null, De = !1, be = !1, It = X !== -1, Ke = -1, vt = H(ce(R, 0)) && x(ce(R, R.length - 1));
    if (M || ee)
      for (fe = 0; fe < R.length; ye >= 65536 ? fe += 2 : fe++) {
        if (ye = ce(R, fe), !ge(ye))
          return Ae;
        vt = vt && E(ye, Pe, se), Pe = ye;
      }
    else {
      for (fe = 0; fe < R.length; ye >= 65536 ? fe += 2 : fe++) {
        if (ye = ce(R, fe), ye === l)
          De = !0, It && (be = be || // Foldable line = too long, and not more-indented.
          fe - Ke - 1 > X && R[Ke + 1] !== " ", Ke = fe);
        else if (!ge(ye))
          return Ae;
        vt = vt && E(ye, Pe, se), Pe = ye;
      }
      be = be || It && fe - Ke - 1 > X && R[Ke + 1] !== " ";
    }
    return !De && !be ? vt && !ee && !K(R) ? he : ae === te ? Ae : _e : z > 9 && me(R) ? Ae : ee ? ae === te ? Ae : _e : be ? He : Ee;
  }
  function lt(R, M, z, X, K) {
    R.dump = function() {
      if (M.length === 0)
        return R.quotingType === te ? '""' : "''";
      if (!R.noCompatMode && (N.indexOf(M) !== -1 || j.test(M)))
        return R.quotingType === te ? '"' + M + '"' : "'" + M + "'";
      var ae = R.indent * Math.max(1, z), ee = R.lineWidth === -1 ? -1 : Math.max(Math.min(R.lineWidth, 40), R.lineWidth - ae), se = X || R.flowLevel > -1 && z >= R.flowLevel;
      function fe(ye) {
        return ve(R, ye);
      }
      switch (qe(
        M,
        se,
        R.indent,
        ee,
        fe,
        R.quotingType,
        R.forceQuotes && !X,
        K
      )) {
        case he:
          return M;
        case _e:
          return "'" + M.replace(/'/g, "''") + "'";
        case Ee:
          return "|" + it(M, R.indent) + tt(ie(M, ae));
        case He:
          return ">" + it(M, R.indent) + tt(ie(e(M, ee), ae));
        case Ae:
          return '"' + W(M) + '"';
        default:
          throw new d("impossible error: invalid scalar style");
      }
    }();
  }
  function it(R, M) {
    var z = me(R) ? String(M) : "", X = R[R.length - 1] === `
`, K = X && (R[R.length - 2] === `
` || R === `
`), ae = K ? "+" : X ? "" : "-";
    return z + ae + `
`;
  }
  function tt(R) {
    return R[R.length - 1] === `
` ? R.slice(0, -1) : R;
  }
  function e(R, M) {
    for (var z = /(\n+)([^\n]*)/g, X = function() {
      var ye = R.indexOf(`
`);
      return ye = ye !== -1 ? ye : R.length, z.lastIndex = ye, B(R.slice(0, ye), M);
    }(), K = R[0] === `
` || R[0] === " ", ae, ee; ee = z.exec(R); ) {
      var se = ee[1], fe = ee[2];
      ae = fe[0] === " ", X += se + (!K && !ae && fe !== "" ? `
` : "") + B(fe, M), K = ae;
    }
    return X;
  }
  function B(R, M) {
    if (R === "" || R[0] === " ") return R;
    for (var z = / [^ ]/g, X, K = 0, ae, ee = 0, se = 0, fe = ""; X = z.exec(R); )
      se = X.index, se - K > M && (ae = ee > K ? ee : se, fe += `
` + R.slice(K, ae), K = ae + 1), ee = se;
    return fe += `
`, R.length - K > M && ee > K ? fe += R.slice(K, ee) + `
` + R.slice(ee + 1) : fe += R.slice(K), fe.slice(1);
  }
  function W(R) {
    for (var M = "", z = 0, X, K = 0; K < R.length; z >= 65536 ? K += 2 : K++)
      z = ce(R, K), X = F[z], !X && ge(z) ? (M += R[K], z >= 65536 && (M += R[K + 1])) : M += X || G(z);
    return M;
  }
  function ne(R, M, z) {
    var X = "", K = R.tag, ae, ee, se;
    for (ae = 0, ee = z.length; ae < ee; ae += 1)
      se = z[ae], R.replacer && (se = R.replacer.call(z, String(ae), se)), (ue(R, M, se, !1, !1) || typeof se > "u" && ue(R, M, null, !1, !1)) && (X !== "" && (X += "," + (R.condenseFlow ? "" : " ")), X += R.dump);
    R.tag = K, R.dump = "[" + X + "]";
  }
  function Y(R, M, z, X) {
    var K = "", ae = R.tag, ee, se, fe;
    for (ee = 0, se = z.length; ee < se; ee += 1)
      fe = z[ee], R.replacer && (fe = R.replacer.call(z, String(ee), fe)), (ue(R, M + 1, fe, !0, !0, !1, !0) || typeof fe > "u" && ue(R, M + 1, null, !0, !0, !1, !0)) && ((!X || K !== "") && (K += we(R, M)), R.dump && l === R.dump.charCodeAt(0) ? K += "-" : K += "- ", K += R.dump);
    R.tag = ae, R.dump = K || "[]";
  }
  function re(R, M, z) {
    var X = "", K = R.tag, ae = Object.keys(z), ee, se, fe, ye, Pe;
    for (ee = 0, se = ae.length; ee < se; ee += 1)
      Pe = "", X !== "" && (Pe += ", "), R.condenseFlow && (Pe += '"'), fe = ae[ee], ye = z[fe], R.replacer && (ye = R.replacer.call(z, fe, ye)), ue(R, M, fe, !1, !1) && (R.dump.length > 1024 && (Pe += "? "), Pe += R.dump + (R.condenseFlow ? '"' : "") + ":" + (R.condenseFlow ? "" : " "), ue(R, M, ye, !1, !1) && (Pe += R.dump, X += Pe));
    R.tag = K, R.dump = "{" + X + "}";
  }
  function Z(R, M, z, X) {
    var K = "", ae = R.tag, ee = Object.keys(z), se, fe, ye, Pe, De, be;
    if (R.sortKeys === !0)
      ee.sort();
    else if (typeof R.sortKeys == "function")
      ee.sort(R.sortKeys);
    else if (R.sortKeys)
      throw new d("sortKeys must be a boolean or a function");
    for (se = 0, fe = ee.length; se < fe; se += 1)
      be = "", (!X || K !== "") && (be += we(R, M)), ye = ee[se], Pe = z[ye], R.replacer && (Pe = R.replacer.call(z, ye, Pe)), ue(R, M + 1, ye, !0, !0, !0) && (De = R.tag !== null && R.tag !== "?" || R.dump && R.dump.length > 1024, De && (R.dump && l === R.dump.charCodeAt(0) ? be += "?" : be += "? "), be += R.dump, De && (be += we(R, M)), ue(R, M + 1, Pe, !0, De) && (R.dump && l === R.dump.charCodeAt(0) ? be += ":" : be += ": ", be += R.dump, K += be));
    R.tag = ae, R.dump = K || "{}";
  }
  function oe(R, M, z) {
    var X, K, ae, ee, se, fe;
    for (K = z ? R.explicitTypes : R.implicitTypes, ae = 0, ee = K.length; ae < ee; ae += 1)
      if (se = K[ae], (se.instanceOf || se.predicate) && (!se.instanceOf || typeof M == "object" && M instanceof se.instanceOf) && (!se.predicate || se.predicate(M))) {
        if (z ? se.multi && se.representName ? R.tag = se.representName(M) : R.tag = se.tag : R.tag = "?", se.represent) {
          if (fe = R.styleMap[se.tag] || se.defaultStyle, c.call(se.represent) === "[object Function]")
            X = se.represent(M, fe);
          else if (f.call(se.represent, fe))
            X = se.represent[fe](M, fe);
          else
            throw new d("!<" + se.tag + '> tag resolver accepts not "' + fe + '" style');
          R.dump = X;
        }
        return !0;
      }
    return !1;
  }
  function ue(R, M, z, X, K, ae, ee) {
    R.tag = null, R.dump = z, oe(R, z, !1) || oe(R, z, !0);
    var se = c.call(R.dump), fe = X, ye;
    X && (X = R.flowLevel < 0 || R.flowLevel > M);
    var Pe = se === "[object Object]" || se === "[object Array]", De, be;
    if (Pe && (De = R.duplicates.indexOf(z), be = De !== -1), (R.tag !== null && R.tag !== "?" || be || R.indent !== 2 && M > 0) && (K = !1), be && R.usedDuplicates[De])
      R.dump = "*ref_" + De;
    else {
      if (Pe && be && !R.usedDuplicates[De] && (R.usedDuplicates[De] = !0), se === "[object Object]")
        X && Object.keys(R.dump).length !== 0 ? (Z(R, M, R.dump, K), be && (R.dump = "&ref_" + De + R.dump)) : (re(R, M, R.dump), be && (R.dump = "&ref_" + De + " " + R.dump));
      else if (se === "[object Array]")
        X && R.dump.length !== 0 ? (R.noArrayIndent && !ee && M > 0 ? Y(R, M - 1, R.dump, K) : Y(R, M, R.dump, K), be && (R.dump = "&ref_" + De + R.dump)) : (ne(R, M, R.dump), be && (R.dump = "&ref_" + De + " " + R.dump));
      else if (se === "[object String]")
        R.tag !== "?" && lt(R, R.dump, M, ae, fe);
      else {
        if (se === "[object Undefined]")
          return !1;
        if (R.skipInvalid) return !1;
        throw new d("unacceptable kind of an object to dump " + se);
      }
      R.tag !== null && R.tag !== "?" && (ye = encodeURI(
        R.tag[0] === "!" ? R.tag.slice(1) : R.tag
      ).replace(/!/g, "%21"), R.tag[0] === "!" ? ye = "!" + ye : ye.slice(0, 18) === "tag:yaml.org,2002:" ? ye = "!!" + ye.slice(18) : ye = "!<" + ye + ">", R.dump = ye + " " + R.dump);
    }
    return !0;
  }
  function Se(R, M) {
    var z = [], X = [], K, ae;
    for (Te(R, z, X), K = 0, ae = X.length; K < ae; K += 1)
      M.duplicates.push(z[X[K]]);
    M.usedDuplicates = new Array(ae);
  }
  function Te(R, M, z) {
    var X, K, ae;
    if (R !== null && typeof R == "object")
      if (K = M.indexOf(R), K !== -1)
        z.indexOf(K) === -1 && z.push(K);
      else if (M.push(R), Array.isArray(R))
        for (K = 0, ae = R.length; K < ae; K += 1)
          Te(R[K], M, z);
      else
        for (X = Object.keys(R), K = 0, ae = X.length; K < ae; K += 1)
          Te(R[X[K]], M, z);
  }
  function pe(R, M) {
    M = M || {};
    var z = new de(M);
    z.noRefs || Se(R, z);
    var X = R;
    return z.replacer && (X = z.replacer.call({ "": X }, "", X)), ue(z, 0, X, !0, !0) ? z.dump + `
` : "";
  }
  return ai.dump = pe, ai;
}
var Qo;
function aa() {
  if (Qo) return ke;
  Qo = 1;
  var t = af(), d = of();
  function h(c, f) {
    return function() {
      throw new Error("Function yaml." + c + " is removed in js-yaml 4. Use yaml." + f + " instead, which is now safe by default.");
    };
  }
  return ke.Type = Me(), ke.Schema = Bl(), ke.FAILSAFE_SCHEMA = Wl(), ke.JSON_SCHEMA = Kl(), ke.CORE_SCHEMA = Jl(), ke.DEFAULT_SCHEMA = ia(), ke.load = t.load, ke.loadAll = t.loadAll, ke.dump = d.dump, ke.YAMLException = yr(), ke.types = {
    binary: eu(),
    float: Xl(),
    map: Gl(),
    null: Vl(),
    pairs: ru(),
    set: nu(),
    timestamp: Ql(),
    bool: Yl(),
    int: zl(),
    merge: Zl(),
    omap: tu(),
    seq: jl(),
    str: Hl()
  }, ke.safeLoad = h("safeLoad", "load"), ke.safeLoadAll = h("safeLoadAll", "loadAll"), ke.safeDump = h("safeDump", "dump"), ke;
}
var Vt = {}, Zo;
function sf() {
  if (Zo) return Vt;
  Zo = 1, Object.defineProperty(Vt, "__esModule", { value: !0 }), Vt.Lazy = void 0;
  class t {
    constructor(h) {
      this._value = null, this.creator = h;
    }
    get hasValue() {
      return this.creator == null;
    }
    get value() {
      if (this.creator == null)
        return this._value;
      const h = this.creator();
      return this.value = h, h;
    }
    set value(h) {
      this._value = h, this.creator = null;
    }
  }
  return Vt.Lazy = t, Vt;
}
var kr = { exports: {} }, oi, es;
function Wr() {
  if (es) return oi;
  es = 1;
  const t = "2.0.0", d = 256, h = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
  9007199254740991, c = 16, f = d - 6;
  return oi = {
    MAX_LENGTH: d,
    MAX_SAFE_COMPONENT_LENGTH: c,
    MAX_SAFE_BUILD_LENGTH: f,
    MAX_SAFE_INTEGER: h,
    RELEASE_TYPES: [
      "major",
      "premajor",
      "minor",
      "preminor",
      "patch",
      "prepatch",
      "prerelease"
    ],
    SEMVER_SPEC_VERSION: t,
    FLAG_INCLUDE_PRERELEASE: 1,
    FLAG_LOOSE: 2
  }, oi;
}
var si, ts;
function Vr() {
  return ts || (ts = 1, si = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...d) => console.error("SEMVER", ...d) : () => {
  }), si;
}
var rs;
function wr() {
  return rs || (rs = 1, function(t, d) {
    const {
      MAX_SAFE_COMPONENT_LENGTH: h,
      MAX_SAFE_BUILD_LENGTH: c,
      MAX_LENGTH: f
    } = Wr(), u = Vr();
    d = t.exports = {};
    const a = d.re = [], l = d.safeRe = [], o = d.src = [], s = d.safeSrc = [], i = d.t = {};
    let n = 0;
    const r = "[a-zA-Z0-9-]", p = [
      ["\\s", 1],
      ["\\d", f],
      [r, c]
    ], g = (m) => {
      for (const [w, S] of p)
        m = m.split(`${w}*`).join(`${w}{0,${S}}`).split(`${w}+`).join(`${w}{1,${S}}`);
      return m;
    }, y = (m, w, S) => {
      const P = g(w), I = n++;
      u(m, I, w), i[m] = I, o[I] = w, s[I] = P, a[I] = new RegExp(w, S ? "g" : void 0), l[I] = new RegExp(P, S ? "g" : void 0);
    };
    y("NUMERICIDENTIFIER", "0|[1-9]\\d*"), y("NUMERICIDENTIFIERLOOSE", "\\d+"), y("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${r}*`), y("MAINVERSION", `(${o[i.NUMERICIDENTIFIER]})\\.(${o[i.NUMERICIDENTIFIER]})\\.(${o[i.NUMERICIDENTIFIER]})`), y("MAINVERSIONLOOSE", `(${o[i.NUMERICIDENTIFIERLOOSE]})\\.(${o[i.NUMERICIDENTIFIERLOOSE]})\\.(${o[i.NUMERICIDENTIFIERLOOSE]})`), y("PRERELEASEIDENTIFIER", `(?:${o[i.NONNUMERICIDENTIFIER]}|${o[i.NUMERICIDENTIFIER]})`), y("PRERELEASEIDENTIFIERLOOSE", `(?:${o[i.NONNUMERICIDENTIFIER]}|${o[i.NUMERICIDENTIFIERLOOSE]})`), y("PRERELEASE", `(?:-(${o[i.PRERELEASEIDENTIFIER]}(?:\\.${o[i.PRERELEASEIDENTIFIER]})*))`), y("PRERELEASELOOSE", `(?:-?(${o[i.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${o[i.PRERELEASEIDENTIFIERLOOSE]})*))`), y("BUILDIDENTIFIER", `${r}+`), y("BUILD", `(?:\\+(${o[i.BUILDIDENTIFIER]}(?:\\.${o[i.BUILDIDENTIFIER]})*))`), y("FULLPLAIN", `v?${o[i.MAINVERSION]}${o[i.PRERELEASE]}?${o[i.BUILD]}?`), y("FULL", `^${o[i.FULLPLAIN]}$`), y("LOOSEPLAIN", `[v=\\s]*${o[i.MAINVERSIONLOOSE]}${o[i.PRERELEASELOOSE]}?${o[i.BUILD]}?`), y("LOOSE", `^${o[i.LOOSEPLAIN]}$`), y("GTLT", "((?:<|>)?=?)"), y("XRANGEIDENTIFIERLOOSE", `${o[i.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), y("XRANGEIDENTIFIER", `${o[i.NUMERICIDENTIFIER]}|x|X|\\*`), y("XRANGEPLAIN", `[v=\\s]*(${o[i.XRANGEIDENTIFIER]})(?:\\.(${o[i.XRANGEIDENTIFIER]})(?:\\.(${o[i.XRANGEIDENTIFIER]})(?:${o[i.PRERELEASE]})?${o[i.BUILD]}?)?)?`), y("XRANGEPLAINLOOSE", `[v=\\s]*(${o[i.XRANGEIDENTIFIERLOOSE]})(?:\\.(${o[i.XRANGEIDENTIFIERLOOSE]})(?:\\.(${o[i.XRANGEIDENTIFIERLOOSE]})(?:${o[i.PRERELEASELOOSE]})?${o[i.BUILD]}?)?)?`), y("XRANGE", `^${o[i.GTLT]}\\s*${o[i.XRANGEPLAIN]}$`), y("XRANGELOOSE", `^${o[i.GTLT]}\\s*${o[i.XRANGEPLAINLOOSE]}$`), y("COERCEPLAIN", `(^|[^\\d])(\\d{1,${h}})(?:\\.(\\d{1,${h}}))?(?:\\.(\\d{1,${h}}))?`), y("COERCE", `${o[i.COERCEPLAIN]}(?:$|[^\\d])`), y("COERCEFULL", o[i.COERCEPLAIN] + `(?:${o[i.PRERELEASE]})?(?:${o[i.BUILD]})?(?:$|[^\\d])`), y("COERCERTL", o[i.COERCE], !0), y("COERCERTLFULL", o[i.COERCEFULL], !0), y("LONETILDE", "(?:~>?)"), y("TILDETRIM", `(\\s*)${o[i.LONETILDE]}\\s+`, !0), d.tildeTrimReplace = "$1~", y("TILDE", `^${o[i.LONETILDE]}${o[i.XRANGEPLAIN]}$`), y("TILDELOOSE", `^${o[i.LONETILDE]}${o[i.XRANGEPLAINLOOSE]}$`), y("LONECARET", "(?:\\^)"), y("CARETTRIM", `(\\s*)${o[i.LONECARET]}\\s+`, !0), d.caretTrimReplace = "$1^", y("CARET", `^${o[i.LONECARET]}${o[i.XRANGEPLAIN]}$`), y("CARETLOOSE", `^${o[i.LONECARET]}${o[i.XRANGEPLAINLOOSE]}$`), y("COMPARATORLOOSE", `^${o[i.GTLT]}\\s*(${o[i.LOOSEPLAIN]})$|^$`), y("COMPARATOR", `^${o[i.GTLT]}\\s*(${o[i.FULLPLAIN]})$|^$`), y("COMPARATORTRIM", `(\\s*)${o[i.GTLT]}\\s*(${o[i.LOOSEPLAIN]}|${o[i.XRANGEPLAIN]})`, !0), d.comparatorTrimReplace = "$1$2$3", y("HYPHENRANGE", `^\\s*(${o[i.XRANGEPLAIN]})\\s+-\\s+(${o[i.XRANGEPLAIN]})\\s*$`), y("HYPHENRANGELOOSE", `^\\s*(${o[i.XRANGEPLAINLOOSE]})\\s+-\\s+(${o[i.XRANGEPLAINLOOSE]})\\s*$`), y("STAR", "(<|>)?=?\\s*\\*"), y("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), y("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
  }(kr, kr.exports)), kr.exports;
}
var li, ns;
function oa() {
  if (ns) return li;
  ns = 1;
  const t = Object.freeze({ loose: !0 }), d = Object.freeze({});
  return li = (c) => c ? typeof c != "object" ? t : c : d, li;
}
var ui, is;
function iu() {
  if (is) return ui;
  is = 1;
  const t = /^[0-9]+$/, d = (c, f) => {
    if (typeof c == "number" && typeof f == "number")
      return c === f ? 0 : c < f ? -1 : 1;
    const u = t.test(c), a = t.test(f);
    return u && a && (c = +c, f = +f), c === f ? 0 : u && !a ? -1 : a && !u ? 1 : c < f ? -1 : 1;
  };
  return ui = {
    compareIdentifiers: d,
    rcompareIdentifiers: (c, f) => d(f, c)
  }, ui;
}
var ci, as;
function Be() {
  if (as) return ci;
  as = 1;
  const t = Vr(), { MAX_LENGTH: d, MAX_SAFE_INTEGER: h } = Wr(), { safeRe: c, t: f } = wr(), u = oa(), { compareIdentifiers: a } = iu();
  class l {
    constructor(s, i) {
      if (i = u(i), s instanceof l) {
        if (s.loose === !!i.loose && s.includePrerelease === !!i.includePrerelease)
          return s;
        s = s.version;
      } else if (typeof s != "string")
        throw new TypeError(`Invalid version. Must be a string. Got type "${typeof s}".`);
      if (s.length > d)
        throw new TypeError(
          `version is longer than ${d} characters`
        );
      t("SemVer", s, i), this.options = i, this.loose = !!i.loose, this.includePrerelease = !!i.includePrerelease;
      const n = s.trim().match(i.loose ? c[f.LOOSE] : c[f.FULL]);
      if (!n)
        throw new TypeError(`Invalid Version: ${s}`);
      if (this.raw = s, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > h || this.major < 0)
        throw new TypeError("Invalid major version");
      if (this.minor > h || this.minor < 0)
        throw new TypeError("Invalid minor version");
      if (this.patch > h || this.patch < 0)
        throw new TypeError("Invalid patch version");
      n[4] ? this.prerelease = n[4].split(".").map((r) => {
        if (/^[0-9]+$/.test(r)) {
          const p = +r;
          if (p >= 0 && p < h)
            return p;
        }
        return r;
      }) : this.prerelease = [], this.build = n[5] ? n[5].split(".") : [], this.format();
    }
    format() {
      return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
    }
    toString() {
      return this.version;
    }
    compare(s) {
      if (t("SemVer.compare", this.version, this.options, s), !(s instanceof l)) {
        if (typeof s == "string" && s === this.version)
          return 0;
        s = new l(s, this.options);
      }
      return s.version === this.version ? 0 : this.compareMain(s) || this.comparePre(s);
    }
    compareMain(s) {
      return s instanceof l || (s = new l(s, this.options)), this.major < s.major ? -1 : this.major > s.major ? 1 : this.minor < s.minor ? -1 : this.minor > s.minor ? 1 : this.patch < s.patch ? -1 : this.patch > s.patch ? 1 : 0;
    }
    comparePre(s) {
      if (s instanceof l || (s = new l(s, this.options)), this.prerelease.length && !s.prerelease.length)
        return -1;
      if (!this.prerelease.length && s.prerelease.length)
        return 1;
      if (!this.prerelease.length && !s.prerelease.length)
        return 0;
      let i = 0;
      do {
        const n = this.prerelease[i], r = s.prerelease[i];
        if (t("prerelease compare", i, n, r), n === void 0 && r === void 0)
          return 0;
        if (r === void 0)
          return 1;
        if (n === void 0)
          return -1;
        if (n === r)
          continue;
        return a(n, r);
      } while (++i);
    }
    compareBuild(s) {
      s instanceof l || (s = new l(s, this.options));
      let i = 0;
      do {
        const n = this.build[i], r = s.build[i];
        if (t("build compare", i, n, r), n === void 0 && r === void 0)
          return 0;
        if (r === void 0)
          return 1;
        if (n === void 0)
          return -1;
        if (n === r)
          continue;
        return a(n, r);
      } while (++i);
    }
    // preminor will bump the version up to the next minor release, and immediately
    // down to pre-release. premajor and prepatch work the same way.
    inc(s, i, n) {
      if (s.startsWith("pre")) {
        if (!i && n === !1)
          throw new Error("invalid increment argument: identifier is empty");
        if (i) {
          const r = `-${i}`.match(this.options.loose ? c[f.PRERELEASELOOSE] : c[f.PRERELEASE]);
          if (!r || r[1] !== i)
            throw new Error(`invalid identifier: ${i}`);
        }
      }
      switch (s) {
        case "premajor":
          this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", i, n);
          break;
        case "preminor":
          this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", i, n);
          break;
        case "prepatch":
          this.prerelease.length = 0, this.inc("patch", i, n), this.inc("pre", i, n);
          break;
        // If the input is a non-prerelease version, this acts the same as
        // prepatch.
        case "prerelease":
          this.prerelease.length === 0 && this.inc("patch", i, n), this.inc("pre", i, n);
          break;
        case "release":
          if (this.prerelease.length === 0)
            throw new Error(`version ${this.raw} is not a prerelease`);
          this.prerelease.length = 0;
          break;
        case "major":
          (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
          break;
        case "minor":
          (this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
          break;
        case "patch":
          this.prerelease.length === 0 && this.patch++, this.prerelease = [];
          break;
        // This probably shouldn't be used publicly.
        // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
        case "pre": {
          const r = Number(n) ? 1 : 0;
          if (this.prerelease.length === 0)
            this.prerelease = [r];
          else {
            let p = this.prerelease.length;
            for (; --p >= 0; )
              typeof this.prerelease[p] == "number" && (this.prerelease[p]++, p = -2);
            if (p === -1) {
              if (i === this.prerelease.join(".") && n === !1)
                throw new Error("invalid increment argument: identifier already exists");
              this.prerelease.push(r);
            }
          }
          if (i) {
            let p = [i, r];
            n === !1 && (p = [i]), a(this.prerelease[0], i) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = p) : this.prerelease = p;
          }
          break;
        }
        default:
          throw new Error(`invalid increment argument: ${s}`);
      }
      return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
    }
  }
  return ci = l, ci;
}
var fi, os;
function Mt() {
  if (os) return fi;
  os = 1;
  const t = Be();
  return fi = (h, c, f = !1) => {
    if (h instanceof t)
      return h;
    try {
      return new t(h, c);
    } catch (u) {
      if (!f)
        return null;
      throw u;
    }
  }, fi;
}
var di, ss;
function lf() {
  if (ss) return di;
  ss = 1;
  const t = Mt();
  return di = (h, c) => {
    const f = t(h, c);
    return f ? f.version : null;
  }, di;
}
var hi, ls;
function uf() {
  if (ls) return hi;
  ls = 1;
  const t = Mt();
  return hi = (h, c) => {
    const f = t(h.trim().replace(/^[=v]+/, ""), c);
    return f ? f.version : null;
  }, hi;
}
var pi, us;
function cf() {
  if (us) return pi;
  us = 1;
  const t = Be();
  return pi = (h, c, f, u, a) => {
    typeof f == "string" && (a = u, u = f, f = void 0);
    try {
      return new t(
        h instanceof t ? h.version : h,
        f
      ).inc(c, u, a).version;
    } catch {
      return null;
    }
  }, pi;
}
var mi, cs;
function ff() {
  if (cs) return mi;
  cs = 1;
  const t = Mt();
  return mi = (h, c) => {
    const f = t(h, null, !0), u = t(c, null, !0), a = f.compare(u);
    if (a === 0)
      return null;
    const l = a > 0, o = l ? f : u, s = l ? u : f, i = !!o.prerelease.length;
    if (!!s.prerelease.length && !i) {
      if (!s.patch && !s.minor)
        return "major";
      if (s.compareMain(o) === 0)
        return s.minor && !s.patch ? "minor" : "patch";
    }
    const r = i ? "pre" : "";
    return f.major !== u.major ? r + "major" : f.minor !== u.minor ? r + "minor" : f.patch !== u.patch ? r + "patch" : "prerelease";
  }, mi;
}
var gi, fs;
function df() {
  if (fs) return gi;
  fs = 1;
  const t = Be();
  return gi = (h, c) => new t(h, c).major, gi;
}
var vi, ds;
function hf() {
  if (ds) return vi;
  ds = 1;
  const t = Be();
  return vi = (h, c) => new t(h, c).minor, vi;
}
var Ei, hs;
function pf() {
  if (hs) return Ei;
  hs = 1;
  const t = Be();
  return Ei = (h, c) => new t(h, c).patch, Ei;
}
var yi, ps;
function mf() {
  if (ps) return yi;
  ps = 1;
  const t = Mt();
  return yi = (h, c) => {
    const f = t(h, c);
    return f && f.prerelease.length ? f.prerelease : null;
  }, yi;
}
var wi, ms;
function Ze() {
  if (ms) return wi;
  ms = 1;
  const t = Be();
  return wi = (h, c, f) => new t(h, f).compare(new t(c, f)), wi;
}
var _i, gs;
function gf() {
  if (gs) return _i;
  gs = 1;
  const t = Ze();
  return _i = (h, c, f) => t(c, h, f), _i;
}
var Ri, vs;
function vf() {
  if (vs) return Ri;
  vs = 1;
  const t = Ze();
  return Ri = (h, c) => t(h, c, !0), Ri;
}
var Ai, Es;
function sa() {
  if (Es) return Ai;
  Es = 1;
  const t = Be();
  return Ai = (h, c, f) => {
    const u = new t(h, f), a = new t(c, f);
    return u.compare(a) || u.compareBuild(a);
  }, Ai;
}
var Si, ys;
function Ef() {
  if (ys) return Si;
  ys = 1;
  const t = sa();
  return Si = (h, c) => h.sort((f, u) => t(f, u, c)), Si;
}
var Ti, ws;
function yf() {
  if (ws) return Ti;
  ws = 1;
  const t = sa();
  return Ti = (h, c) => h.sort((f, u) => t(u, f, c)), Ti;
}
var Ci, _s;
function Yr() {
  if (_s) return Ci;
  _s = 1;
  const t = Ze();
  return Ci = (h, c, f) => t(h, c, f) > 0, Ci;
}
var bi, Rs;
function la() {
  if (Rs) return bi;
  Rs = 1;
  const t = Ze();
  return bi = (h, c, f) => t(h, c, f) < 0, bi;
}
var Pi, As;
function au() {
  if (As) return Pi;
  As = 1;
  const t = Ze();
  return Pi = (h, c, f) => t(h, c, f) === 0, Pi;
}
var Oi, Ss;
function ou() {
  if (Ss) return Oi;
  Ss = 1;
  const t = Ze();
  return Oi = (h, c, f) => t(h, c, f) !== 0, Oi;
}
var Ii, Ts;
function ua() {
  if (Ts) return Ii;
  Ts = 1;
  const t = Ze();
  return Ii = (h, c, f) => t(h, c, f) >= 0, Ii;
}
var Di, Cs;
function ca() {
  if (Cs) return Di;
  Cs = 1;
  const t = Ze();
  return Di = (h, c, f) => t(h, c, f) <= 0, Di;
}
var Ni, bs;
function su() {
  if (bs) return Ni;
  bs = 1;
  const t = au(), d = ou(), h = Yr(), c = ua(), f = la(), u = ca();
  return Ni = (l, o, s, i) => {
    switch (o) {
      case "===":
        return typeof l == "object" && (l = l.version), typeof s == "object" && (s = s.version), l === s;
      case "!==":
        return typeof l == "object" && (l = l.version), typeof s == "object" && (s = s.version), l !== s;
      case "":
      case "=":
      case "==":
        return t(l, s, i);
      case "!=":
        return d(l, s, i);
      case ">":
        return h(l, s, i);
      case ">=":
        return c(l, s, i);
      case "<":
        return f(l, s, i);
      case "<=":
        return u(l, s, i);
      default:
        throw new TypeError(`Invalid operator: ${o}`);
    }
  }, Ni;
}
var Fi, Ps;
function wf() {
  if (Ps) return Fi;
  Ps = 1;
  const t = Be(), d = Mt(), { safeRe: h, t: c } = wr();
  return Fi = (u, a) => {
    if (u instanceof t)
      return u;
    if (typeof u == "number" && (u = String(u)), typeof u != "string")
      return null;
    a = a || {};
    let l = null;
    if (!a.rtl)
      l = u.match(a.includePrerelease ? h[c.COERCEFULL] : h[c.COERCE]);
    else {
      const p = a.includePrerelease ? h[c.COERCERTLFULL] : h[c.COERCERTL];
      let g;
      for (; (g = p.exec(u)) && (!l || l.index + l[0].length !== u.length); )
        (!l || g.index + g[0].length !== l.index + l[0].length) && (l = g), p.lastIndex = g.index + g[1].length + g[2].length;
      p.lastIndex = -1;
    }
    if (l === null)
      return null;
    const o = l[2], s = l[3] || "0", i = l[4] || "0", n = a.includePrerelease && l[5] ? `-${l[5]}` : "", r = a.includePrerelease && l[6] ? `+${l[6]}` : "";
    return d(`${o}.${s}.${i}${n}${r}`, a);
  }, Fi;
}
var xi, Os;
function _f() {
  if (Os) return xi;
  Os = 1;
  class t {
    constructor() {
      this.max = 1e3, this.map = /* @__PURE__ */ new Map();
    }
    get(h) {
      const c = this.map.get(h);
      if (c !== void 0)
        return this.map.delete(h), this.map.set(h, c), c;
    }
    delete(h) {
      return this.map.delete(h);
    }
    set(h, c) {
      if (!this.delete(h) && c !== void 0) {
        if (this.map.size >= this.max) {
          const u = this.map.keys().next().value;
          this.delete(u);
        }
        this.map.set(h, c);
      }
      return this;
    }
  }
  return xi = t, xi;
}
var Li, Is;
function et() {
  if (Is) return Li;
  Is = 1;
  const t = /\s+/g;
  class d {
    constructor(N, j) {
      if (j = f(j), N instanceof d)
        return N.loose === !!j.loose && N.includePrerelease === !!j.includePrerelease ? N : new d(N.raw, j);
      if (N instanceof u)
        return this.raw = N.value, this.set = [[N]], this.formatted = void 0, this;
      if (this.options = j, this.loose = !!j.loose, this.includePrerelease = !!j.includePrerelease, this.raw = N.trim().replace(t, " "), this.set = this.raw.split("||").map((D) => this.parseRange(D.trim())).filter((D) => D.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const D = this.set[0];
        if (this.set = this.set.filter((G) => !y(G[0])), this.set.length === 0)
          this.set = [D];
        else if (this.set.length > 1) {
          for (const G of this.set)
            if (G.length === 1 && m(G[0])) {
              this.set = [G];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let N = 0; N < this.set.length; N++) {
          N > 0 && (this.formatted += "||");
          const j = this.set[N];
          for (let D = 0; D < j.length; D++)
            D > 0 && (this.formatted += " "), this.formatted += j[D].toString().trim();
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(N) {
      const D = ((this.options.includePrerelease && p) | (this.options.loose && g)) + ":" + N, G = c.get(D);
      if (G)
        return G;
      const V = this.options.loose, te = V ? o[s.HYPHENRANGELOOSE] : o[s.HYPHENRANGE];
      N = N.replace(te, L(this.options.includePrerelease)), a("hyphen replace", N), N = N.replace(o[s.COMPARATORTRIM], i), a("comparator trim", N), N = N.replace(o[s.TILDETRIM], n), a("tilde trim", N), N = N.replace(o[s.CARETTRIM], r), a("caret trim", N);
      let de = N.split(" ").map((Q) => S(Q, this.options)).join(" ").split(/\s+/).map((Q) => k(Q, this.options));
      V && (de = de.filter((Q) => (a("loose invalid filter", Q, this.options), !!Q.match(o[s.COMPARATORLOOSE])))), a("range list", de);
      const ie = /* @__PURE__ */ new Map(), we = de.map((Q) => new u(Q, this.options));
      for (const Q of we) {
        if (y(Q))
          return [Q];
        ie.set(Q.value, Q);
      }
      ie.size > 1 && ie.has("") && ie.delete("");
      const ve = [...ie.values()];
      return c.set(D, ve), ve;
    }
    intersects(N, j) {
      if (!(N instanceof d))
        throw new TypeError("a Range is required");
      return this.set.some((D) => w(D, j) && N.set.some((G) => w(G, j) && D.every((V) => G.every((te) => V.intersects(te, j)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(N) {
      if (!N)
        return !1;
      if (typeof N == "string")
        try {
          N = new l(N, this.options);
        } catch {
          return !1;
        }
      for (let j = 0; j < this.set.length; j++)
        if (q(this.set[j], N, this.options))
          return !0;
      return !1;
    }
  }
  Li = d;
  const h = _f(), c = new h(), f = oa(), u = zr(), a = Vr(), l = Be(), {
    safeRe: o,
    t: s,
    comparatorTrimReplace: i,
    tildeTrimReplace: n,
    caretTrimReplace: r
  } = wr(), { FLAG_INCLUDE_PRERELEASE: p, FLAG_LOOSE: g } = Wr(), y = (F) => F.value === "<0.0.0-0", m = (F) => F.value === "", w = (F, N) => {
    let j = !0;
    const D = F.slice();
    let G = D.pop();
    for (; j && D.length; )
      j = D.every((V) => G.intersects(V, N)), G = D.pop();
    return j;
  }, S = (F, N) => (F = F.replace(o[s.BUILD], ""), a("comp", F, N), F = O(F, N), a("caret", F), F = I(F, N), a("tildes", F), F = A(F, N), a("xrange", F), F = $(F, N), a("stars", F), F), P = (F) => !F || F.toLowerCase() === "x" || F === "*", I = (F, N) => F.trim().split(/\s+/).map((j) => b(j, N)).join(" "), b = (F, N) => {
    const j = N.loose ? o[s.TILDELOOSE] : o[s.TILDE];
    return F.replace(j, (D, G, V, te, de) => {
      a("tilde", F, D, G, V, te, de);
      let ie;
      return P(G) ? ie = "" : P(V) ? ie = `>=${G}.0.0 <${+G + 1}.0.0-0` : P(te) ? ie = `>=${G}.${V}.0 <${G}.${+V + 1}.0-0` : de ? (a("replaceTilde pr", de), ie = `>=${G}.${V}.${te}-${de} <${G}.${+V + 1}.0-0`) : ie = `>=${G}.${V}.${te} <${G}.${+V + 1}.0-0`, a("tilde return", ie), ie;
    });
  }, O = (F, N) => F.trim().split(/\s+/).map((j) => T(j, N)).join(" "), T = (F, N) => {
    a("caret", F, N);
    const j = N.loose ? o[s.CARETLOOSE] : o[s.CARET], D = N.includePrerelease ? "-0" : "";
    return F.replace(j, (G, V, te, de, ie) => {
      a("caret", F, G, V, te, de, ie);
      let we;
      return P(V) ? we = "" : P(te) ? we = `>=${V}.0.0${D} <${+V + 1}.0.0-0` : P(de) ? V === "0" ? we = `>=${V}.${te}.0${D} <${V}.${+te + 1}.0-0` : we = `>=${V}.${te}.0${D} <${+V + 1}.0.0-0` : ie ? (a("replaceCaret pr", ie), V === "0" ? te === "0" ? we = `>=${V}.${te}.${de}-${ie} <${V}.${te}.${+de + 1}-0` : we = `>=${V}.${te}.${de}-${ie} <${V}.${+te + 1}.0-0` : we = `>=${V}.${te}.${de}-${ie} <${+V + 1}.0.0-0`) : (a("no pr"), V === "0" ? te === "0" ? we = `>=${V}.${te}.${de}${D} <${V}.${te}.${+de + 1}-0` : we = `>=${V}.${te}.${de}${D} <${V}.${+te + 1}.0-0` : we = `>=${V}.${te}.${de} <${+V + 1}.0.0-0`), a("caret return", we), we;
    });
  }, A = (F, N) => (a("replaceXRanges", F, N), F.split(/\s+/).map((j) => v(j, N)).join(" ")), v = (F, N) => {
    F = F.trim();
    const j = N.loose ? o[s.XRANGELOOSE] : o[s.XRANGE];
    return F.replace(j, (D, G, V, te, de, ie) => {
      a("xRange", F, D, G, V, te, de, ie);
      const we = P(V), ve = we || P(te), Q = ve || P(de), ge = Q;
      return G === "=" && ge && (G = ""), ie = N.includePrerelease ? "-0" : "", we ? G === ">" || G === "<" ? D = "<0.0.0-0" : D = "*" : G && ge ? (ve && (te = 0), de = 0, G === ">" ? (G = ">=", ve ? (V = +V + 1, te = 0, de = 0) : (te = +te + 1, de = 0)) : G === "<=" && (G = "<", ve ? V = +V + 1 : te = +te + 1), G === "<" && (ie = "-0"), D = `${G + V}.${te}.${de}${ie}`) : ve ? D = `>=${V}.0.0${ie} <${+V + 1}.0.0-0` : Q && (D = `>=${V}.${te}.0${ie} <${V}.${+te + 1}.0-0`), a("xRange return", D), D;
    });
  }, $ = (F, N) => (a("replaceStars", F, N), F.trim().replace(o[s.STAR], "")), k = (F, N) => (a("replaceGTE0", F, N), F.trim().replace(o[N.includePrerelease ? s.GTE0PRE : s.GTE0], "")), L = (F) => (N, j, D, G, V, te, de, ie, we, ve, Q, ge) => (P(D) ? j = "" : P(G) ? j = `>=${D}.0.0${F ? "-0" : ""}` : P(V) ? j = `>=${D}.${G}.0${F ? "-0" : ""}` : te ? j = `>=${j}` : j = `>=${j}${F ? "-0" : ""}`, P(we) ? ie = "" : P(ve) ? ie = `<${+we + 1}.0.0-0` : P(Q) ? ie = `<${we}.${+ve + 1}.0-0` : ge ? ie = `<=${we}.${ve}.${Q}-${ge}` : F ? ie = `<${we}.${ve}.${+Q + 1}-0` : ie = `<=${ie}`, `${j} ${ie}`.trim()), q = (F, N, j) => {
    for (let D = 0; D < F.length; D++)
      if (!F[D].test(N))
        return !1;
    if (N.prerelease.length && !j.includePrerelease) {
      for (let D = 0; D < F.length; D++)
        if (a(F[D].semver), F[D].semver !== u.ANY && F[D].semver.prerelease.length > 0) {
          const G = F[D].semver;
          if (G.major === N.major && G.minor === N.minor && G.patch === N.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return Li;
}
var Ui, Ds;
function zr() {
  if (Ds) return Ui;
  Ds = 1;
  const t = Symbol("SemVer ANY");
  class d {
    static get ANY() {
      return t;
    }
    constructor(i, n) {
      if (n = h(n), i instanceof d) {
        if (i.loose === !!n.loose)
          return i;
        i = i.value;
      }
      i = i.trim().split(/\s+/).join(" "), a("comparator", i, n), this.options = n, this.loose = !!n.loose, this.parse(i), this.semver === t ? this.value = "" : this.value = this.operator + this.semver.version, a("comp", this);
    }
    parse(i) {
      const n = this.options.loose ? c[f.COMPARATORLOOSE] : c[f.COMPARATOR], r = i.match(n);
      if (!r)
        throw new TypeError(`Invalid comparator: ${i}`);
      this.operator = r[1] !== void 0 ? r[1] : "", this.operator === "=" && (this.operator = ""), r[2] ? this.semver = new l(r[2], this.options.loose) : this.semver = t;
    }
    toString() {
      return this.value;
    }
    test(i) {
      if (a("Comparator.test", i, this.options.loose), this.semver === t || i === t)
        return !0;
      if (typeof i == "string")
        try {
          i = new l(i, this.options);
        } catch {
          return !1;
        }
      return u(i, this.operator, this.semver, this.options);
    }
    intersects(i, n) {
      if (!(i instanceof d))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new o(i.value, n).test(this.value) : i.operator === "" ? i.value === "" ? !0 : new o(this.value, n).test(i.semver) : (n = h(n), n.includePrerelease && (this.value === "<0.0.0-0" || i.value === "<0.0.0-0") || !n.includePrerelease && (this.value.startsWith("<0.0.0") || i.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && i.operator.startsWith(">") || this.operator.startsWith("<") && i.operator.startsWith("<") || this.semver.version === i.semver.version && this.operator.includes("=") && i.operator.includes("=") || u(this.semver, "<", i.semver, n) && this.operator.startsWith(">") && i.operator.startsWith("<") || u(this.semver, ">", i.semver, n) && this.operator.startsWith("<") && i.operator.startsWith(">")));
    }
  }
  Ui = d;
  const h = oa(), { safeRe: c, t: f } = wr(), u = su(), a = Vr(), l = Be(), o = et();
  return Ui;
}
var $i, Ns;
function Xr() {
  if (Ns) return $i;
  Ns = 1;
  const t = et();
  return $i = (h, c, f) => {
    try {
      c = new t(c, f);
    } catch {
      return !1;
    }
    return c.test(h);
  }, $i;
}
var ki, Fs;
function Rf() {
  if (Fs) return ki;
  Fs = 1;
  const t = et();
  return ki = (h, c) => new t(h, c).set.map((f) => f.map((u) => u.value).join(" ").trim().split(" ")), ki;
}
var qi, xs;
function Af() {
  if (xs) return qi;
  xs = 1;
  const t = Be(), d = et();
  return qi = (c, f, u) => {
    let a = null, l = null, o = null;
    try {
      o = new d(f, u);
    } catch {
      return null;
    }
    return c.forEach((s) => {
      o.test(s) && (!a || l.compare(s) === -1) && (a = s, l = new t(a, u));
    }), a;
  }, qi;
}
var Mi, Ls;
function Sf() {
  if (Ls) return Mi;
  Ls = 1;
  const t = Be(), d = et();
  return Mi = (c, f, u) => {
    let a = null, l = null, o = null;
    try {
      o = new d(f, u);
    } catch {
      return null;
    }
    return c.forEach((s) => {
      o.test(s) && (!a || l.compare(s) === 1) && (a = s, l = new t(a, u));
    }), a;
  }, Mi;
}
var Bi, Us;
function Tf() {
  if (Us) return Bi;
  Us = 1;
  const t = Be(), d = et(), h = Yr();
  return Bi = (f, u) => {
    f = new d(f, u);
    let a = new t("0.0.0");
    if (f.test(a) || (a = new t("0.0.0-0"), f.test(a)))
      return a;
    a = null;
    for (let l = 0; l < f.set.length; ++l) {
      const o = f.set[l];
      let s = null;
      o.forEach((i) => {
        const n = new t(i.semver.version);
        switch (i.operator) {
          case ">":
            n.prerelease.length === 0 ? n.patch++ : n.prerelease.push(0), n.raw = n.format();
          /* fallthrough */
          case "":
          case ">=":
            (!s || h(n, s)) && (s = n);
            break;
          case "<":
          case "<=":
            break;
          /* istanbul ignore next */
          default:
            throw new Error(`Unexpected operation: ${i.operator}`);
        }
      }), s && (!a || h(a, s)) && (a = s);
    }
    return a && f.test(a) ? a : null;
  }, Bi;
}
var Hi, $s;
function Cf() {
  if ($s) return Hi;
  $s = 1;
  const t = et();
  return Hi = (h, c) => {
    try {
      return new t(h, c).range || "*";
    } catch {
      return null;
    }
  }, Hi;
}
var ji, ks;
function fa() {
  if (ks) return ji;
  ks = 1;
  const t = Be(), d = zr(), { ANY: h } = d, c = et(), f = Xr(), u = Yr(), a = la(), l = ca(), o = ua();
  return ji = (i, n, r, p) => {
    i = new t(i, p), n = new c(n, p);
    let g, y, m, w, S;
    switch (r) {
      case ">":
        g = u, y = l, m = a, w = ">", S = ">=";
        break;
      case "<":
        g = a, y = o, m = u, w = "<", S = "<=";
        break;
      default:
        throw new TypeError('Must provide a hilo val of "<" or ">"');
    }
    if (f(i, n, p))
      return !1;
    for (let P = 0; P < n.set.length; ++P) {
      const I = n.set[P];
      let b = null, O = null;
      if (I.forEach((T) => {
        T.semver === h && (T = new d(">=0.0.0")), b = b || T, O = O || T, g(T.semver, b.semver, p) ? b = T : m(T.semver, O.semver, p) && (O = T);
      }), b.operator === w || b.operator === S || (!O.operator || O.operator === w) && y(i, O.semver))
        return !1;
      if (O.operator === S && m(i, O.semver))
        return !1;
    }
    return !0;
  }, ji;
}
var Gi, qs;
function bf() {
  if (qs) return Gi;
  qs = 1;
  const t = fa();
  return Gi = (h, c, f) => t(h, c, ">", f), Gi;
}
var Wi, Ms;
function Pf() {
  if (Ms) return Wi;
  Ms = 1;
  const t = fa();
  return Wi = (h, c, f) => t(h, c, "<", f), Wi;
}
var Vi, Bs;
function Of() {
  if (Bs) return Vi;
  Bs = 1;
  const t = et();
  return Vi = (h, c, f) => (h = new t(h, f), c = new t(c, f), h.intersects(c, f)), Vi;
}
var Yi, Hs;
function If() {
  if (Hs) return Yi;
  Hs = 1;
  const t = Xr(), d = Ze();
  return Yi = (h, c, f) => {
    const u = [];
    let a = null, l = null;
    const o = h.sort((r, p) => d(r, p, f));
    for (const r of o)
      t(r, c, f) ? (l = r, a || (a = r)) : (l && u.push([a, l]), l = null, a = null);
    a && u.push([a, null]);
    const s = [];
    for (const [r, p] of u)
      r === p ? s.push(r) : !p && r === o[0] ? s.push("*") : p ? r === o[0] ? s.push(`<=${p}`) : s.push(`${r} - ${p}`) : s.push(`>=${r}`);
    const i = s.join(" || "), n = typeof c.raw == "string" ? c.raw : String(c);
    return i.length < n.length ? i : c;
  }, Yi;
}
var zi, js;
function Df() {
  if (js) return zi;
  js = 1;
  const t = et(), d = zr(), { ANY: h } = d, c = Xr(), f = Ze(), u = (n, r, p = {}) => {
    if (n === r)
      return !0;
    n = new t(n, p), r = new t(r, p);
    let g = !1;
    e: for (const y of n.set) {
      for (const m of r.set) {
        const w = o(y, m, p);
        if (g = g || w !== null, w)
          continue e;
      }
      if (g)
        return !1;
    }
    return !0;
  }, a = [new d(">=0.0.0-0")], l = [new d(">=0.0.0")], o = (n, r, p) => {
    if (n === r)
      return !0;
    if (n.length === 1 && n[0].semver === h) {
      if (r.length === 1 && r[0].semver === h)
        return !0;
      p.includePrerelease ? n = a : n = l;
    }
    if (r.length === 1 && r[0].semver === h) {
      if (p.includePrerelease)
        return !0;
      r = l;
    }
    const g = /* @__PURE__ */ new Set();
    let y, m;
    for (const A of n)
      A.operator === ">" || A.operator === ">=" ? y = s(y, A, p) : A.operator === "<" || A.operator === "<=" ? m = i(m, A, p) : g.add(A.semver);
    if (g.size > 1)
      return null;
    let w;
    if (y && m) {
      if (w = f(y.semver, m.semver, p), w > 0)
        return null;
      if (w === 0 && (y.operator !== ">=" || m.operator !== "<="))
        return null;
    }
    for (const A of g) {
      if (y && !c(A, String(y), p) || m && !c(A, String(m), p))
        return null;
      for (const v of r)
        if (!c(A, String(v), p))
          return !1;
      return !0;
    }
    let S, P, I, b, O = m && !p.includePrerelease && m.semver.prerelease.length ? m.semver : !1, T = y && !p.includePrerelease && y.semver.prerelease.length ? y.semver : !1;
    O && O.prerelease.length === 1 && m.operator === "<" && O.prerelease[0] === 0 && (O = !1);
    for (const A of r) {
      if (b = b || A.operator === ">" || A.operator === ">=", I = I || A.operator === "<" || A.operator === "<=", y) {
        if (T && A.semver.prerelease && A.semver.prerelease.length && A.semver.major === T.major && A.semver.minor === T.minor && A.semver.patch === T.patch && (T = !1), A.operator === ">" || A.operator === ">=") {
          if (S = s(y, A, p), S === A && S !== y)
            return !1;
        } else if (y.operator === ">=" && !c(y.semver, String(A), p))
          return !1;
      }
      if (m) {
        if (O && A.semver.prerelease && A.semver.prerelease.length && A.semver.major === O.major && A.semver.minor === O.minor && A.semver.patch === O.patch && (O = !1), A.operator === "<" || A.operator === "<=") {
          if (P = i(m, A, p), P === A && P !== m)
            return !1;
        } else if (m.operator === "<=" && !c(m.semver, String(A), p))
          return !1;
      }
      if (!A.operator && (m || y) && w !== 0)
        return !1;
    }
    return !(y && I && !m && w !== 0 || m && b && !y && w !== 0 || T || O);
  }, s = (n, r, p) => {
    if (!n)
      return r;
    const g = f(n.semver, r.semver, p);
    return g > 0 ? n : g < 0 || r.operator === ">" && n.operator === ">=" ? r : n;
  }, i = (n, r, p) => {
    if (!n)
      return r;
    const g = f(n.semver, r.semver, p);
    return g < 0 ? n : g > 0 || r.operator === "<" && n.operator === "<=" ? r : n;
  };
  return zi = u, zi;
}
var Xi, Gs;
function lu() {
  if (Gs) return Xi;
  Gs = 1;
  const t = wr(), d = Wr(), h = Be(), c = iu(), f = Mt(), u = lf(), a = uf(), l = cf(), o = ff(), s = df(), i = hf(), n = pf(), r = mf(), p = Ze(), g = gf(), y = vf(), m = sa(), w = Ef(), S = yf(), P = Yr(), I = la(), b = au(), O = ou(), T = ua(), A = ca(), v = su(), $ = wf(), k = zr(), L = et(), q = Xr(), F = Rf(), N = Af(), j = Sf(), D = Tf(), G = Cf(), V = fa(), te = bf(), de = Pf(), ie = Of(), we = If(), ve = Df();
  return Xi = {
    parse: f,
    valid: u,
    clean: a,
    inc: l,
    diff: o,
    major: s,
    minor: i,
    patch: n,
    prerelease: r,
    compare: p,
    rcompare: g,
    compareLoose: y,
    compareBuild: m,
    sort: w,
    rsort: S,
    gt: P,
    lt: I,
    eq: b,
    neq: O,
    gte: T,
    lte: A,
    cmp: v,
    coerce: $,
    Comparator: k,
    Range: L,
    satisfies: q,
    toComparators: F,
    maxSatisfying: N,
    minSatisfying: j,
    minVersion: D,
    validRange: G,
    outside: V,
    gtr: te,
    ltr: de,
    intersects: ie,
    simplifyRange: we,
    subset: ve,
    SemVer: h,
    re: t.re,
    src: t.src,
    tokens: t.t,
    SEMVER_SPEC_VERSION: d.SEMVER_SPEC_VERSION,
    RELEASE_TYPES: d.RELEASE_TYPES,
    compareIdentifiers: c.compareIdentifiers,
    rcompareIdentifiers: c.rcompareIdentifiers
  }, Xi;
}
var xt = {}, dr = { exports: {} };
dr.exports;
var Ws;
function Nf() {
  return Ws || (Ws = 1, function(t, d) {
    var h = 200, c = "__lodash_hash_undefined__", f = 1, u = 2, a = 9007199254740991, l = "[object Arguments]", o = "[object Array]", s = "[object AsyncFunction]", i = "[object Boolean]", n = "[object Date]", r = "[object Error]", p = "[object Function]", g = "[object GeneratorFunction]", y = "[object Map]", m = "[object Number]", w = "[object Null]", S = "[object Object]", P = "[object Promise]", I = "[object Proxy]", b = "[object RegExp]", O = "[object Set]", T = "[object String]", A = "[object Symbol]", v = "[object Undefined]", $ = "[object WeakMap]", k = "[object ArrayBuffer]", L = "[object DataView]", q = "[object Float32Array]", F = "[object Float64Array]", N = "[object Int8Array]", j = "[object Int16Array]", D = "[object Int32Array]", G = "[object Uint8Array]", V = "[object Uint8ClampedArray]", te = "[object Uint16Array]", de = "[object Uint32Array]", ie = /[\\^$.*+?()[\]{}|]/g, we = /^\[object .+?Constructor\]$/, ve = /^(?:0|[1-9]\d*)$/, Q = {};
    Q[q] = Q[F] = Q[N] = Q[j] = Q[D] = Q[G] = Q[V] = Q[te] = Q[de] = !0, Q[l] = Q[o] = Q[k] = Q[i] = Q[L] = Q[n] = Q[r] = Q[p] = Q[y] = Q[m] = Q[S] = Q[b] = Q[O] = Q[T] = Q[$] = !1;
    var ge = typeof Qe == "object" && Qe && Qe.Object === Object && Qe, _ = typeof self == "object" && self && self.Object === Object && self, E = ge || _ || Function("return this")(), H = d && !d.nodeType && d, x = H && !0 && t && !t.nodeType && t, ce = x && x.exports === H, me = ce && ge.process, he = function() {
      try {
        return me && me.binding && me.binding("util");
      } catch {
      }
    }(), _e = he && he.isTypedArray;
    function Ee(C, U) {
      for (var J = -1, le = C == null ? 0 : C.length, Oe = 0, Re = []; ++J < le; ) {
        var Ne = C[J];
        U(Ne, J, C) && (Re[Oe++] = Ne);
      }
      return Re;
    }
    function He(C, U) {
      for (var J = -1, le = U.length, Oe = C.length; ++J < le; )
        C[Oe + J] = U[J];
      return C;
    }
    function Ae(C, U) {
      for (var J = -1, le = C == null ? 0 : C.length; ++J < le; )
        if (U(C[J], J, C))
          return !0;
      return !1;
    }
    function qe(C, U) {
      for (var J = -1, le = Array(C); ++J < C; )
        le[J] = U(J);
      return le;
    }
    function lt(C) {
      return function(U) {
        return C(U);
      };
    }
    function it(C, U) {
      return C.has(U);
    }
    function tt(C, U) {
      return C == null ? void 0 : C[U];
    }
    function e(C) {
      var U = -1, J = Array(C.size);
      return C.forEach(function(le, Oe) {
        J[++U] = [Oe, le];
      }), J;
    }
    function B(C, U) {
      return function(J) {
        return C(U(J));
      };
    }
    function W(C) {
      var U = -1, J = Array(C.size);
      return C.forEach(function(le) {
        J[++U] = le;
      }), J;
    }
    var ne = Array.prototype, Y = Function.prototype, re = Object.prototype, Z = E["__core-js_shared__"], oe = Y.toString, ue = re.hasOwnProperty, Se = function() {
      var C = /[^.]+$/.exec(Z && Z.keys && Z.keys.IE_PROTO || "");
      return C ? "Symbol(src)_1." + C : "";
    }(), Te = re.toString, pe = RegExp(
      "^" + oe.call(ue).replace(ie, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    ), R = ce ? E.Buffer : void 0, M = E.Symbol, z = E.Uint8Array, X = re.propertyIsEnumerable, K = ne.splice, ae = M ? M.toStringTag : void 0, ee = Object.getOwnPropertySymbols, se = R ? R.isBuffer : void 0, fe = B(Object.keys, Object), ye = Dt(E, "DataView"), Pe = Dt(E, "Map"), De = Dt(E, "Promise"), be = Dt(E, "Set"), It = Dt(E, "WeakMap"), Ke = Dt(Object, "create"), vt = wt(ye), wu = wt(Pe), _u = wt(De), Ru = wt(be), Au = wt(It), ga = M ? M.prototype : void 0, Jr = ga ? ga.valueOf : void 0;
    function Et(C) {
      var U = -1, J = C == null ? 0 : C.length;
      for (this.clear(); ++U < J; ) {
        var le = C[U];
        this.set(le[0], le[1]);
      }
    }
    function Su() {
      this.__data__ = Ke ? Ke(null) : {}, this.size = 0;
    }
    function Tu(C) {
      var U = this.has(C) && delete this.__data__[C];
      return this.size -= U ? 1 : 0, U;
    }
    function Cu(C) {
      var U = this.__data__;
      if (Ke) {
        var J = U[C];
        return J === c ? void 0 : J;
      }
      return ue.call(U, C) ? U[C] : void 0;
    }
    function bu(C) {
      var U = this.__data__;
      return Ke ? U[C] !== void 0 : ue.call(U, C);
    }
    function Pu(C, U) {
      var J = this.__data__;
      return this.size += this.has(C) ? 0 : 1, J[C] = Ke && U === void 0 ? c : U, this;
    }
    Et.prototype.clear = Su, Et.prototype.delete = Tu, Et.prototype.get = Cu, Et.prototype.has = bu, Et.prototype.set = Pu;
    function at(C) {
      var U = -1, J = C == null ? 0 : C.length;
      for (this.clear(); ++U < J; ) {
        var le = C[U];
        this.set(le[0], le[1]);
      }
    }
    function Ou() {
      this.__data__ = [], this.size = 0;
    }
    function Iu(C) {
      var U = this.__data__, J = Ar(U, C);
      if (J < 0)
        return !1;
      var le = U.length - 1;
      return J == le ? U.pop() : K.call(U, J, 1), --this.size, !0;
    }
    function Du(C) {
      var U = this.__data__, J = Ar(U, C);
      return J < 0 ? void 0 : U[J][1];
    }
    function Nu(C) {
      return Ar(this.__data__, C) > -1;
    }
    function Fu(C, U) {
      var J = this.__data__, le = Ar(J, C);
      return le < 0 ? (++this.size, J.push([C, U])) : J[le][1] = U, this;
    }
    at.prototype.clear = Ou, at.prototype.delete = Iu, at.prototype.get = Du, at.prototype.has = Nu, at.prototype.set = Fu;
    function yt(C) {
      var U = -1, J = C == null ? 0 : C.length;
      for (this.clear(); ++U < J; ) {
        var le = C[U];
        this.set(le[0], le[1]);
      }
    }
    function xu() {
      this.size = 0, this.__data__ = {
        hash: new Et(),
        map: new (Pe || at)(),
        string: new Et()
      };
    }
    function Lu(C) {
      var U = Sr(this, C).delete(C);
      return this.size -= U ? 1 : 0, U;
    }
    function Uu(C) {
      return Sr(this, C).get(C);
    }
    function $u(C) {
      return Sr(this, C).has(C);
    }
    function ku(C, U) {
      var J = Sr(this, C), le = J.size;
      return J.set(C, U), this.size += J.size == le ? 0 : 1, this;
    }
    yt.prototype.clear = xu, yt.prototype.delete = Lu, yt.prototype.get = Uu, yt.prototype.has = $u, yt.prototype.set = ku;
    function Rr(C) {
      var U = -1, J = C == null ? 0 : C.length;
      for (this.__data__ = new yt(); ++U < J; )
        this.add(C[U]);
    }
    function qu(C) {
      return this.__data__.set(C, c), this;
    }
    function Mu(C) {
      return this.__data__.has(C);
    }
    Rr.prototype.add = Rr.prototype.push = qu, Rr.prototype.has = Mu;
    function ut(C) {
      var U = this.__data__ = new at(C);
      this.size = U.size;
    }
    function Bu() {
      this.__data__ = new at(), this.size = 0;
    }
    function Hu(C) {
      var U = this.__data__, J = U.delete(C);
      return this.size = U.size, J;
    }
    function ju(C) {
      return this.__data__.get(C);
    }
    function Gu(C) {
      return this.__data__.has(C);
    }
    function Wu(C, U) {
      var J = this.__data__;
      if (J instanceof at) {
        var le = J.__data__;
        if (!Pe || le.length < h - 1)
          return le.push([C, U]), this.size = ++J.size, this;
        J = this.__data__ = new yt(le);
      }
      return J.set(C, U), this.size = J.size, this;
    }
    ut.prototype.clear = Bu, ut.prototype.delete = Hu, ut.prototype.get = ju, ut.prototype.has = Gu, ut.prototype.set = Wu;
    function Vu(C, U) {
      var J = Tr(C), le = !J && sc(C), Oe = !J && !le && Qr(C), Re = !J && !le && !Oe && Ta(C), Ne = J || le || Oe || Re, Fe = Ne ? qe(C.length, String) : [], Le = Fe.length;
      for (var Ie in C)
        ue.call(C, Ie) && !(Ne && // Safari 9 has enumerable `arguments.length` in strict mode.
        (Ie == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
        Oe && (Ie == "offset" || Ie == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
        Re && (Ie == "buffer" || Ie == "byteLength" || Ie == "byteOffset") || // Skip index properties.
        rc(Ie, Le))) && Fe.push(Ie);
      return Fe;
    }
    function Ar(C, U) {
      for (var J = C.length; J--; )
        if (_a(C[J][0], U))
          return J;
      return -1;
    }
    function Yu(C, U, J) {
      var le = U(C);
      return Tr(C) ? le : He(le, J(C));
    }
    function Bt(C) {
      return C == null ? C === void 0 ? v : w : ae && ae in Object(C) ? ec(C) : oc(C);
    }
    function va(C) {
      return Ht(C) && Bt(C) == l;
    }
    function Ea(C, U, J, le, Oe) {
      return C === U ? !0 : C == null || U == null || !Ht(C) && !Ht(U) ? C !== C && U !== U : zu(C, U, J, le, Ea, Oe);
    }
    function zu(C, U, J, le, Oe, Re) {
      var Ne = Tr(C), Fe = Tr(U), Le = Ne ? o : ct(C), Ie = Fe ? o : ct(U);
      Le = Le == l ? S : Le, Ie = Ie == l ? S : Ie;
      var Ge = Le == S, Je = Ie == S, Ue = Le == Ie;
      if (Ue && Qr(C)) {
        if (!Qr(U))
          return !1;
        Ne = !0, Ge = !1;
      }
      if (Ue && !Ge)
        return Re || (Re = new ut()), Ne || Ta(C) ? ya(C, U, J, le, Oe, Re) : Qu(C, U, Le, J, le, Oe, Re);
      if (!(J & f)) {
        var ze = Ge && ue.call(C, "__wrapped__"), Xe = Je && ue.call(U, "__wrapped__");
        if (ze || Xe) {
          var ft = ze ? C.value() : C, ot = Xe ? U.value() : U;
          return Re || (Re = new ut()), Oe(ft, ot, J, le, Re);
        }
      }
      return Ue ? (Re || (Re = new ut()), Zu(C, U, J, le, Oe, Re)) : !1;
    }
    function Xu(C) {
      if (!Sa(C) || ic(C))
        return !1;
      var U = Ra(C) ? pe : we;
      return U.test(wt(C));
    }
    function Ku(C) {
      return Ht(C) && Aa(C.length) && !!Q[Bt(C)];
    }
    function Ju(C) {
      if (!ac(C))
        return fe(C);
      var U = [];
      for (var J in Object(C))
        ue.call(C, J) && J != "constructor" && U.push(J);
      return U;
    }
    function ya(C, U, J, le, Oe, Re) {
      var Ne = J & f, Fe = C.length, Le = U.length;
      if (Fe != Le && !(Ne && Le > Fe))
        return !1;
      var Ie = Re.get(C);
      if (Ie && Re.get(U))
        return Ie == U;
      var Ge = -1, Je = !0, Ue = J & u ? new Rr() : void 0;
      for (Re.set(C, U), Re.set(U, C); ++Ge < Fe; ) {
        var ze = C[Ge], Xe = U[Ge];
        if (le)
          var ft = Ne ? le(Xe, ze, Ge, U, C, Re) : le(ze, Xe, Ge, C, U, Re);
        if (ft !== void 0) {
          if (ft)
            continue;
          Je = !1;
          break;
        }
        if (Ue) {
          if (!Ae(U, function(ot, _t) {
            if (!it(Ue, _t) && (ze === ot || Oe(ze, ot, J, le, Re)))
              return Ue.push(_t);
          })) {
            Je = !1;
            break;
          }
        } else if (!(ze === Xe || Oe(ze, Xe, J, le, Re))) {
          Je = !1;
          break;
        }
      }
      return Re.delete(C), Re.delete(U), Je;
    }
    function Qu(C, U, J, le, Oe, Re, Ne) {
      switch (J) {
        case L:
          if (C.byteLength != U.byteLength || C.byteOffset != U.byteOffset)
            return !1;
          C = C.buffer, U = U.buffer;
        case k:
          return !(C.byteLength != U.byteLength || !Re(new z(C), new z(U)));
        case i:
        case n:
        case m:
          return _a(+C, +U);
        case r:
          return C.name == U.name && C.message == U.message;
        case b:
        case T:
          return C == U + "";
        case y:
          var Fe = e;
        case O:
          var Le = le & f;
          if (Fe || (Fe = W), C.size != U.size && !Le)
            return !1;
          var Ie = Ne.get(C);
          if (Ie)
            return Ie == U;
          le |= u, Ne.set(C, U);
          var Ge = ya(Fe(C), Fe(U), le, Oe, Re, Ne);
          return Ne.delete(C), Ge;
        case A:
          if (Jr)
            return Jr.call(C) == Jr.call(U);
      }
      return !1;
    }
    function Zu(C, U, J, le, Oe, Re) {
      var Ne = J & f, Fe = wa(C), Le = Fe.length, Ie = wa(U), Ge = Ie.length;
      if (Le != Ge && !Ne)
        return !1;
      for (var Je = Le; Je--; ) {
        var Ue = Fe[Je];
        if (!(Ne ? Ue in U : ue.call(U, Ue)))
          return !1;
      }
      var ze = Re.get(C);
      if (ze && Re.get(U))
        return ze == U;
      var Xe = !0;
      Re.set(C, U), Re.set(U, C);
      for (var ft = Ne; ++Je < Le; ) {
        Ue = Fe[Je];
        var ot = C[Ue], _t = U[Ue];
        if (le)
          var Ca = Ne ? le(_t, ot, Ue, U, C, Re) : le(ot, _t, Ue, C, U, Re);
        if (!(Ca === void 0 ? ot === _t || Oe(ot, _t, J, le, Re) : Ca)) {
          Xe = !1;
          break;
        }
        ft || (ft = Ue == "constructor");
      }
      if (Xe && !ft) {
        var Cr = C.constructor, br = U.constructor;
        Cr != br && "constructor" in C && "constructor" in U && !(typeof Cr == "function" && Cr instanceof Cr && typeof br == "function" && br instanceof br) && (Xe = !1);
      }
      return Re.delete(C), Re.delete(U), Xe;
    }
    function wa(C) {
      return Yu(C, cc, tc);
    }
    function Sr(C, U) {
      var J = C.__data__;
      return nc(U) ? J[typeof U == "string" ? "string" : "hash"] : J.map;
    }
    function Dt(C, U) {
      var J = tt(C, U);
      return Xu(J) ? J : void 0;
    }
    function ec(C) {
      var U = ue.call(C, ae), J = C[ae];
      try {
        C[ae] = void 0;
        var le = !0;
      } catch {
      }
      var Oe = Te.call(C);
      return le && (U ? C[ae] = J : delete C[ae]), Oe;
    }
    var tc = ee ? function(C) {
      return C == null ? [] : (C = Object(C), Ee(ee(C), function(U) {
        return X.call(C, U);
      }));
    } : fc, ct = Bt;
    (ye && ct(new ye(new ArrayBuffer(1))) != L || Pe && ct(new Pe()) != y || De && ct(De.resolve()) != P || be && ct(new be()) != O || It && ct(new It()) != $) && (ct = function(C) {
      var U = Bt(C), J = U == S ? C.constructor : void 0, le = J ? wt(J) : "";
      if (le)
        switch (le) {
          case vt:
            return L;
          case wu:
            return y;
          case _u:
            return P;
          case Ru:
            return O;
          case Au:
            return $;
        }
      return U;
    });
    function rc(C, U) {
      return U = U ?? a, !!U && (typeof C == "number" || ve.test(C)) && C > -1 && C % 1 == 0 && C < U;
    }
    function nc(C) {
      var U = typeof C;
      return U == "string" || U == "number" || U == "symbol" || U == "boolean" ? C !== "__proto__" : C === null;
    }
    function ic(C) {
      return !!Se && Se in C;
    }
    function ac(C) {
      var U = C && C.constructor, J = typeof U == "function" && U.prototype || re;
      return C === J;
    }
    function oc(C) {
      return Te.call(C);
    }
    function wt(C) {
      if (C != null) {
        try {
          return oe.call(C);
        } catch {
        }
        try {
          return C + "";
        } catch {
        }
      }
      return "";
    }
    function _a(C, U) {
      return C === U || C !== C && U !== U;
    }
    var sc = va(/* @__PURE__ */ function() {
      return arguments;
    }()) ? va : function(C) {
      return Ht(C) && ue.call(C, "callee") && !X.call(C, "callee");
    }, Tr = Array.isArray;
    function lc(C) {
      return C != null && Aa(C.length) && !Ra(C);
    }
    var Qr = se || dc;
    function uc(C, U) {
      return Ea(C, U);
    }
    function Ra(C) {
      if (!Sa(C))
        return !1;
      var U = Bt(C);
      return U == p || U == g || U == s || U == I;
    }
    function Aa(C) {
      return typeof C == "number" && C > -1 && C % 1 == 0 && C <= a;
    }
    function Sa(C) {
      var U = typeof C;
      return C != null && (U == "object" || U == "function");
    }
    function Ht(C) {
      return C != null && typeof C == "object";
    }
    var Ta = _e ? lt(_e) : Ku;
    function cc(C) {
      return lc(C) ? Vu(C) : Ju(C);
    }
    function fc() {
      return [];
    }
    function dc() {
      return !1;
    }
    t.exports = uc;
  }(dr, dr.exports)), dr.exports;
}
var Vs;
function Ff() {
  if (Vs) return xt;
  Vs = 1, Object.defineProperty(xt, "__esModule", { value: !0 }), xt.DownloadedUpdateHelper = void 0, xt.createTempUpdateFile = l;
  const t = vr, d = rt, h = Nf(), c = /* @__PURE__ */ gt(), f = Ce;
  let u = class {
    constructor(s) {
      this.cacheDir = s, this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, this._downloadedFileInfo = null;
    }
    get downloadedFileInfo() {
      return this._downloadedFileInfo;
    }
    get file() {
      return this._file;
    }
    get packageFile() {
      return this._packageFile;
    }
    get cacheDirForPendingUpdate() {
      return f.join(this.cacheDir, "pending");
    }
    async validateDownloadedPath(s, i, n, r) {
      if (this.versionInfo != null && this.file === s && this.fileInfo != null)
        return h(this.versionInfo, i) && h(this.fileInfo.info, n.info) && await (0, c.pathExists)(s) ? s : null;
      const p = await this.getValidCachedUpdateFile(n, r);
      return p === null ? null : (r.info(`Update has already been downloaded to ${s}).`), this._file = p, p);
    }
    async setDownloadedFile(s, i, n, r, p, g) {
      this._file = s, this._packageFile = i, this.versionInfo = n, this.fileInfo = r, this._downloadedFileInfo = {
        fileName: p,
        sha512: r.info.sha512,
        isAdminRightsRequired: r.info.isAdminRightsRequired === !0
      }, g && await (0, c.outputJson)(this.getUpdateInfoFile(), this._downloadedFileInfo);
    }
    async clear() {
      this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, await this.cleanCacheDirForPendingUpdate();
    }
    async cleanCacheDirForPendingUpdate() {
      try {
        await (0, c.emptyDir)(this.cacheDirForPendingUpdate);
      } catch {
      }
    }
    /**
     * Returns "update-info.json" which is created in the update cache directory's "pending" subfolder after the first update is downloaded.  If the update file does not exist then the cache is cleared and recreated.  If the update file exists then its properties are validated.
     * @param fileInfo
     * @param logger
     */
    async getValidCachedUpdateFile(s, i) {
      const n = this.getUpdateInfoFile();
      if (!await (0, c.pathExists)(n))
        return null;
      let p;
      try {
        p = await (0, c.readJson)(n);
      } catch (w) {
        let S = "No cached update info available";
        return w.code !== "ENOENT" && (await this.cleanCacheDirForPendingUpdate(), S += ` (error on read: ${w.message})`), i.info(S), null;
      }
      if (!((p == null ? void 0 : p.fileName) !== null))
        return i.warn("Cached update info is corrupted: no fileName, directory for cached update will be cleaned"), await this.cleanCacheDirForPendingUpdate(), null;
      if (s.info.sha512 !== p.sha512)
        return i.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${p.sha512}, expected: ${s.info.sha512}. Directory for cached update will be cleaned`), await this.cleanCacheDirForPendingUpdate(), null;
      const y = f.join(this.cacheDirForPendingUpdate, p.fileName);
      if (!await (0, c.pathExists)(y))
        return i.info("Cached update file doesn't exist"), null;
      const m = await a(y);
      return s.info.sha512 !== m ? (i.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${m}, expected: ${s.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null) : (this._downloadedFileInfo = p, y);
    }
    getUpdateInfoFile() {
      return f.join(this.cacheDirForPendingUpdate, "update-info.json");
    }
  };
  xt.DownloadedUpdateHelper = u;
  function a(o, s = "sha512", i = "base64", n) {
    return new Promise((r, p) => {
      const g = (0, t.createHash)(s);
      g.on("error", p).setEncoding(i), (0, d.createReadStream)(o, {
        ...n,
        highWaterMark: 1024 * 1024
        /* better to use more memory but hash faster */
      }).on("error", p).on("end", () => {
        g.end(), r(g.read());
      }).pipe(g, { end: !1 });
    });
  }
  async function l(o, s, i) {
    let n = 0, r = f.join(s, o);
    for (let p = 0; p < 3; p++)
      try {
        return await (0, c.unlink)(r), r;
      } catch (g) {
        if (g.code === "ENOENT")
          return r;
        i.warn(`Error on remove temp update file: ${g}`), r = f.join(s, `${n++}-${o}`);
      }
    return r;
  }
  return xt;
}
var Yt = {}, qr = {}, Ys;
function xf() {
  if (Ys) return qr;
  Ys = 1, Object.defineProperty(qr, "__esModule", { value: !0 }), qr.getAppCacheDir = h;
  const t = Ce, d = Hr;
  function h() {
    const c = (0, d.homedir)();
    let f;
    return process.platform === "win32" ? f = process.env.LOCALAPPDATA || t.join(c, "AppData", "Local") : process.platform === "darwin" ? f = t.join(c, "Library", "Caches") : f = process.env.XDG_CACHE_HOME || t.join(c, ".cache"), f;
  }
  return qr;
}
var zs;
function Lf() {
  if (zs) return Yt;
  zs = 1, Object.defineProperty(Yt, "__esModule", { value: !0 }), Yt.ElectronAppAdapter = void 0;
  const t = Ce, d = xf();
  let h = class {
    constructor(f = Ct.app) {
      this.app = f;
    }
    whenReady() {
      return this.app.whenReady();
    }
    get version() {
      return this.app.getVersion();
    }
    get name() {
      return this.app.getName();
    }
    get isPackaged() {
      return this.app.isPackaged === !0;
    }
    get appUpdateConfigPath() {
      return this.isPackaged ? t.join(process.resourcesPath, "app-update.yml") : t.join(this.app.getAppPath(), "dev-app-update.yml");
    }
    get userDataPath() {
      return this.app.getPath("userData");
    }
    get baseCachePath() {
      return (0, d.getAppCacheDir)();
    }
    quit() {
      this.app.quit();
    }
    relaunch() {
      this.app.relaunch();
    }
    onQuit(f) {
      this.app.once("quit", (u, a) => f(a));
    }
  };
  return Yt.ElectronAppAdapter = h, Yt;
}
var Ki = {}, Xs;
function Uf() {
  return Xs || (Xs = 1, function(t) {
    Object.defineProperty(t, "__esModule", { value: !0 }), t.ElectronHttpExecutor = t.NET_SESSION_NAME = void 0, t.getNetSession = h;
    const d = xe();
    t.NET_SESSION_NAME = "electron-updater";
    function h() {
      return Ct.session.fromPartition(t.NET_SESSION_NAME, {
        cache: !1
      });
    }
    class c extends d.HttpExecutor {
      constructor(u) {
        super(), this.proxyLoginCallback = u, this.cachedSession = null;
      }
      async download(u, a, l) {
        return await l.cancellationToken.createPromise((o, s, i) => {
          const n = {
            headers: l.headers || void 0,
            redirect: "manual"
          };
          (0, d.configureRequestUrl)(u, n), (0, d.configureRequestOptions)(n), this.doDownload(n, {
            destination: a,
            options: l,
            onCancel: i,
            callback: (r) => {
              r == null ? o(a) : s(r);
            },
            responseHandler: null
          }, 0);
        });
      }
      createRequest(u, a) {
        u.headers && u.headers.Host && (u.host = u.headers.Host, delete u.headers.Host), this.cachedSession == null && (this.cachedSession = h());
        const l = Ct.net.request({
          ...u,
          session: this.cachedSession
        });
        return l.on("response", a), this.proxyLoginCallback != null && l.on("login", this.proxyLoginCallback), l;
      }
      addRedirectHandlers(u, a, l, o, s) {
        u.on("redirect", (i, n, r) => {
          u.abort(), o > this.maxRedirects ? l(this.createMaxRedirectError()) : s(d.HttpExecutor.prepareRedirectUrlOptions(r, a));
        });
      }
    }
    t.ElectronHttpExecutor = c;
  }(Ki)), Ki;
}
var zt = {}, Lt = {}, Ks;
function Pt() {
  if (Ks) return Lt;
  Ks = 1, Object.defineProperty(Lt, "__esModule", { value: !0 }), Lt.newBaseUrl = d, Lt.newUrlFromBase = h, Lt.getChannelFilename = c;
  const t = mt;
  function d(f) {
    const u = new t.URL(f);
    return u.pathname.endsWith("/") || (u.pathname += "/"), u;
  }
  function h(f, u, a = !1) {
    const l = new t.URL(f, u), o = u.search;
    return o != null && o.length !== 0 ? l.search = o : a && (l.search = `noCache=${Date.now().toString(32)}`), l;
  }
  function c(f) {
    return `${f}.yml`;
  }
  return Lt;
}
var st = {}, Ji, Js;
function uu() {
  if (Js) return Ji;
  Js = 1;
  var t = "[object Symbol]", d = /[\\^$.*+?()[\]{}|]/g, h = RegExp(d.source), c = typeof Qe == "object" && Qe && Qe.Object === Object && Qe, f = typeof self == "object" && self && self.Object === Object && self, u = c || f || Function("return this")(), a = Object.prototype, l = a.toString, o = u.Symbol, s = o ? o.prototype : void 0, i = s ? s.toString : void 0;
  function n(m) {
    if (typeof m == "string")
      return m;
    if (p(m))
      return i ? i.call(m) : "";
    var w = m + "";
    return w == "0" && 1 / m == -1 / 0 ? "-0" : w;
  }
  function r(m) {
    return !!m && typeof m == "object";
  }
  function p(m) {
    return typeof m == "symbol" || r(m) && l.call(m) == t;
  }
  function g(m) {
    return m == null ? "" : n(m);
  }
  function y(m) {
    return m = g(m), m && h.test(m) ? m.replace(d, "\\$&") : m;
  }
  return Ji = y, Ji;
}
var Qs;
function Ye() {
  if (Qs) return st;
  Qs = 1, Object.defineProperty(st, "__esModule", { value: !0 }), st.Provider = void 0, st.findFile = a, st.parseUpdateInfo = l, st.getFileList = o, st.resolveFiles = s;
  const t = xe(), d = aa(), h = mt, c = Pt(), f = uu();
  let u = class {
    constructor(n) {
      this.runtimeOptions = n, this.requestHeaders = null, this.executor = n.executor;
    }
    // By default, the blockmap file is in the same directory as the main file
    // But some providers may have a different blockmap file, so we need to override this method
    getBlockMapFiles(n, r, p, g = null) {
      const y = (0, c.newUrlFromBase)(`${n.pathname}.blockmap`, n);
      return [(0, c.newUrlFromBase)(`${n.pathname.replace(new RegExp(f(p), "g"), r)}.blockmap`, g ? new h.URL(g) : n), y];
    }
    get isUseMultipleRangeRequest() {
      return this.runtimeOptions.isUseMultipleRangeRequest !== !1;
    }
    getChannelFilePrefix() {
      if (this.runtimeOptions.platform === "linux") {
        const n = process.env.TEST_UPDATER_ARCH || process.arch;
        return "-linux" + (n === "x64" ? "" : `-${n}`);
      } else
        return this.runtimeOptions.platform === "darwin" ? "-mac" : "";
    }
    // due to historical reasons for windows we use channel name without platform specifier
    getDefaultChannelName() {
      return this.getCustomChannelName("latest");
    }
    getCustomChannelName(n) {
      return `${n}${this.getChannelFilePrefix()}`;
    }
    get fileExtraDownloadHeaders() {
      return null;
    }
    setRequestHeaders(n) {
      this.requestHeaders = n;
    }
    /**
     * Method to perform API request only to resolve update info, but not to download update.
     */
    httpRequest(n, r, p) {
      return this.executor.request(this.createRequestOptions(n, r), p);
    }
    createRequestOptions(n, r) {
      const p = {};
      return this.requestHeaders == null ? r != null && (p.headers = r) : p.headers = r == null ? this.requestHeaders : { ...this.requestHeaders, ...r }, (0, t.configureRequestUrl)(n, p), p;
    }
  };
  st.Provider = u;
  function a(i, n, r) {
    var p;
    if (i.length === 0)
      throw (0, t.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
    const g = i.filter((m) => m.url.pathname.toLowerCase().endsWith(`.${n.toLowerCase()}`)), y = (p = g.find((m) => [m.url.pathname, m.info.url].some((w) => w.includes(process.arch)))) !== null && p !== void 0 ? p : g.shift();
    return y || (r == null ? i[0] : i.find((m) => !r.some((w) => m.url.pathname.toLowerCase().endsWith(`.${w.toLowerCase()}`))));
  }
  function l(i, n, r) {
    if (i == null)
      throw (0, t.newError)(`Cannot parse update info from ${n} in the latest release artifacts (${r}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
    let p;
    try {
      p = (0, d.load)(i);
    } catch (g) {
      throw (0, t.newError)(`Cannot parse update info from ${n} in the latest release artifacts (${r}): ${g.stack || g.message}, rawData: ${i}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
    }
    return p;
  }
  function o(i) {
    const n = i.files;
    if (n != null && n.length > 0)
      return n;
    if (i.path != null)
      return [
        {
          url: i.path,
          sha2: i.sha2,
          sha512: i.sha512
        }
      ];
    throw (0, t.newError)(`No files provided: ${(0, t.safeStringifyJson)(i)}`, "ERR_UPDATER_NO_FILES_PROVIDED");
  }
  function s(i, n, r = (p) => p) {
    const g = o(i).map((w) => {
      if (w.sha2 == null && w.sha512 == null)
        throw (0, t.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, t.safeStringifyJson)(w)}`, "ERR_UPDATER_NO_CHECKSUM");
      return {
        url: (0, c.newUrlFromBase)(r(w.url), n),
        info: w
      };
    }), y = i.packages, m = y == null ? null : y[process.arch] || y.ia32;
    return m != null && (g[0].packageInfo = {
      ...m,
      path: (0, c.newUrlFromBase)(r(m.path), n).href
    }), g;
  }
  return st;
}
var Zs;
function cu() {
  if (Zs) return zt;
  Zs = 1, Object.defineProperty(zt, "__esModule", { value: !0 }), zt.GenericProvider = void 0;
  const t = xe(), d = Pt(), h = Ye();
  let c = class extends h.Provider {
    constructor(u, a, l) {
      super(l), this.configuration = u, this.updater = a, this.baseUrl = (0, d.newBaseUrl)(this.configuration.url);
    }
    get channel() {
      const u = this.updater.channel || this.configuration.channel;
      return u == null ? this.getDefaultChannelName() : this.getCustomChannelName(u);
    }
    async getLatestVersion() {
      const u = (0, d.getChannelFilename)(this.channel), a = (0, d.newUrlFromBase)(u, this.baseUrl, this.updater.isAddNoCacheQuery);
      for (let l = 0; ; l++)
        try {
          return (0, h.parseUpdateInfo)(await this.httpRequest(a), u, a);
        } catch (o) {
          if (o instanceof t.HttpError && o.statusCode === 404)
            throw (0, t.newError)(`Cannot find channel "${u}" update info: ${o.stack || o.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
          if (o.code === "ECONNREFUSED" && l < 3) {
            await new Promise((s, i) => {
              try {
                setTimeout(s, 1e3 * l);
              } catch (n) {
                i(n);
              }
            });
            continue;
          }
          throw o;
        }
    }
    resolveFiles(u) {
      return (0, h.resolveFiles)(u, this.baseUrl);
    }
  };
  return zt.GenericProvider = c, zt;
}
var Xt = {}, Kt = {}, el;
function $f() {
  if (el) return Kt;
  el = 1, Object.defineProperty(Kt, "__esModule", { value: !0 }), Kt.BitbucketProvider = void 0;
  const t = xe(), d = Pt(), h = Ye();
  let c = class extends h.Provider {
    constructor(u, a, l) {
      super({
        ...l,
        isUseMultipleRangeRequest: !1
      }), this.configuration = u, this.updater = a;
      const { owner: o, slug: s } = u;
      this.baseUrl = (0, d.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${o}/${s}/downloads`);
    }
    get channel() {
      return this.updater.channel || this.configuration.channel || "latest";
    }
    async getLatestVersion() {
      const u = new t.CancellationToken(), a = (0, d.getChannelFilename)(this.getCustomChannelName(this.channel)), l = (0, d.newUrlFromBase)(a, this.baseUrl, this.updater.isAddNoCacheQuery);
      try {
        const o = await this.httpRequest(l, void 0, u);
        return (0, h.parseUpdateInfo)(o, a, l);
      } catch (o) {
        throw (0, t.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${o.stack || o.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
      }
    }
    resolveFiles(u) {
      return (0, h.resolveFiles)(u, this.baseUrl);
    }
    toString() {
      const { owner: u, slug: a } = this.configuration;
      return `Bitbucket (owner: ${u}, slug: ${a}, channel: ${this.channel})`;
    }
  };
  return Kt.BitbucketProvider = c, Kt;
}
var ht = {}, tl;
function fu() {
  if (tl) return ht;
  tl = 1, Object.defineProperty(ht, "__esModule", { value: !0 }), ht.GitHubProvider = ht.BaseGitHubProvider = void 0, ht.computeReleaseNotes = s;
  const t = xe(), d = lu(), h = mt, c = Pt(), f = Ye(), u = /\/tag\/([^/]+)$/;
  class a extends f.Provider {
    constructor(n, r, p) {
      super({
        ...p,
        /* because GitHib uses S3 */
        isUseMultipleRangeRequest: !1
      }), this.options = n, this.baseUrl = (0, c.newBaseUrl)((0, t.githubUrl)(n, r));
      const g = r === "github.com" ? "api.github.com" : r;
      this.baseApiUrl = (0, c.newBaseUrl)((0, t.githubUrl)(n, g));
    }
    computeGithubBasePath(n) {
      const r = this.options.host;
      return r && !["github.com", "api.github.com"].includes(r) ? `/api/v3${n}` : n;
    }
  }
  ht.BaseGitHubProvider = a;
  let l = class extends a {
    constructor(n, r, p) {
      super(n, "github.com", p), this.options = n, this.updater = r;
    }
    get channel() {
      const n = this.updater.channel || this.options.channel;
      return n == null ? this.getDefaultChannelName() : this.getCustomChannelName(n);
    }
    async getLatestVersion() {
      var n, r, p, g, y;
      const m = new t.CancellationToken(), w = await this.httpRequest((0, c.newUrlFromBase)(`${this.basePath}.atom`, this.baseUrl), {
        accept: "application/xml, application/atom+xml, text/xml, */*"
      }, m), S = (0, t.parseXml)(w);
      let P = S.element("entry", !1, "No published versions on GitHub"), I = null;
      try {
        if (this.updater.allowPrerelease) {
          const $ = ((n = this.updater) === null || n === void 0 ? void 0 : n.channel) || ((r = d.prerelease(this.updater.currentVersion)) === null || r === void 0 ? void 0 : r[0]) || null;
          if ($ === null)
            I = u.exec(P.element("link").attribute("href"))[1];
          else
            for (const k of S.getElements("entry")) {
              const L = u.exec(k.element("link").attribute("href"));
              if (L === null)
                continue;
              const q = L[1], F = ((p = d.prerelease(q)) === null || p === void 0 ? void 0 : p[0]) || null, N = !$ || ["alpha", "beta"].includes($), j = F !== null && !["alpha", "beta"].includes(String(F));
              if (N && !j && !($ === "beta" && F === "alpha")) {
                I = q;
                break;
              }
              if (F && F === $) {
                I = q;
                break;
              }
            }
        } else {
          I = await this.getLatestTagName(m);
          for (const $ of S.getElements("entry"))
            if (u.exec($.element("link").attribute("href"))[1] === I) {
              P = $;
              break;
            }
        }
      } catch ($) {
        throw (0, t.newError)(`Cannot parse releases feed: ${$.stack || $.message},
XML:
${w}`, "ERR_UPDATER_INVALID_RELEASE_FEED");
      }
      if (I == null)
        throw (0, t.newError)("No published versions on GitHub", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
      let b, O = "", T = "";
      const A = async ($) => {
        O = (0, c.getChannelFilename)($), T = (0, c.newUrlFromBase)(this.getBaseDownloadPath(String(I), O), this.baseUrl);
        const k = this.createRequestOptions(T);
        try {
          return await this.executor.request(k, m);
        } catch (L) {
          throw L instanceof t.HttpError && L.statusCode === 404 ? (0, t.newError)(`Cannot find ${O} in the latest release artifacts (${T}): ${L.stack || L.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : L;
        }
      };
      try {
        let $ = this.channel;
        this.updater.allowPrerelease && (!((g = d.prerelease(I)) === null || g === void 0) && g[0]) && ($ = this.getCustomChannelName(String((y = d.prerelease(I)) === null || y === void 0 ? void 0 : y[0]))), b = await A($);
      } catch ($) {
        if (this.updater.allowPrerelease)
          b = await A(this.getDefaultChannelName());
        else
          throw $;
      }
      const v = (0, f.parseUpdateInfo)(b, O, T);
      return v.releaseName == null && (v.releaseName = P.elementValueOrEmpty("title")), v.releaseNotes == null && (v.releaseNotes = s(this.updater.currentVersion, this.updater.fullChangelog, S, P)), {
        tag: I,
        ...v
      };
    }
    async getLatestTagName(n) {
      const r = this.options, p = r.host == null || r.host === "github.com" ? (0, c.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new h.URL(`${this.computeGithubBasePath(`/repos/${r.owner}/${r.repo}/releases`)}/latest`, this.baseApiUrl);
      try {
        const g = await this.httpRequest(p, { Accept: "application/json" }, n);
        return g == null ? null : JSON.parse(g).tag_name;
      } catch (g) {
        throw (0, t.newError)(`Unable to find latest version on GitHub (${p}), please ensure a production release exists: ${g.stack || g.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
      }
    }
    get basePath() {
      return `/${this.options.owner}/${this.options.repo}/releases`;
    }
    resolveFiles(n) {
      return (0, f.resolveFiles)(n, this.baseUrl, (r) => this.getBaseDownloadPath(n.tag, r.replace(/ /g, "-")));
    }
    getBaseDownloadPath(n, r) {
      return `${this.basePath}/download/${n}/${r}`;
    }
  };
  ht.GitHubProvider = l;
  function o(i) {
    const n = i.elementValueOrEmpty("content");
    return n === "No content." ? "" : n;
  }
  function s(i, n, r, p) {
    if (!n)
      return o(p);
    const g = [];
    for (const y of r.getElements("entry")) {
      const m = /\/tag\/v?([^/]+)$/.exec(y.element("link").attribute("href"))[1];
      d.lt(i, m) && g.push({
        version: m,
        note: o(y)
      });
    }
    return g.sort((y, m) => d.rcompare(y.version, m.version));
  }
  return ht;
}
var Jt = {}, rl;
function kf() {
  if (rl) return Jt;
  rl = 1, Object.defineProperty(Jt, "__esModule", { value: !0 }), Jt.GitLabProvider = void 0;
  const t = xe(), d = mt, h = uu(), c = Pt(), f = Ye();
  let u = class extends f.Provider {
    /**
     * Normalizes filenames by replacing spaces and underscores with dashes.
     *
     * This is a workaround to handle filename formatting differences between tools:
     * - electron-builder formats filenames like "test file.txt" as "test-file.txt"
     * - GitLab may provide asset URLs using underscores, such as "test_file.txt"
     *
     * Because of this mismatch, we can't reliably extract the correct filename from
     * the asset path without normalization. This function ensures consistent matching
     * across different filename formats by converting all spaces and underscores to dashes.
     *
     * @param filename The filename to normalize
     * @returns The normalized filename with spaces and underscores replaced by dashes
     */
    normalizeFilename(l) {
      return l.replace(/ |_/g, "-");
    }
    constructor(l, o, s) {
      super({
        ...s,
        // GitLab might not support multiple range requests efficiently
        isUseMultipleRangeRequest: !1
      }), this.options = l, this.updater = o, this.cachedLatestVersion = null;
      const n = l.host || "gitlab.com";
      this.baseApiUrl = (0, c.newBaseUrl)(`https://${n}/api/v4`);
    }
    get channel() {
      const l = this.updater.channel || this.options.channel;
      return l == null ? this.getDefaultChannelName() : this.getCustomChannelName(l);
    }
    async getLatestVersion() {
      const l = new t.CancellationToken(), o = (0, c.newUrlFromBase)(`projects/${this.options.projectId}/releases/permalink/latest`, this.baseApiUrl);
      let s;
      try {
        const S = { "Content-Type": "application/json", ...this.setAuthHeaderForToken(this.options.token || null) }, P = await this.httpRequest(o, S, l);
        if (!P)
          throw (0, t.newError)("No latest release found", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
        s = JSON.parse(P);
      } catch (S) {
        throw (0, t.newError)(`Unable to find latest release on GitLab (${o}): ${S.stack || S.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
      }
      const i = s.tag_name;
      let n = null, r = "", p = null;
      const g = async (S) => {
        r = (0, c.getChannelFilename)(S);
        const P = s.assets.links.find((b) => b.name === r);
        if (!P)
          throw (0, t.newError)(`Cannot find ${r} in the latest release assets`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        p = new d.URL(P.direct_asset_url);
        const I = this.options.token ? { "PRIVATE-TOKEN": this.options.token } : void 0;
        try {
          const b = await this.httpRequest(p, I, l);
          if (!b)
            throw (0, t.newError)(`Empty response from ${p}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
          return b;
        } catch (b) {
          throw b instanceof t.HttpError && b.statusCode === 404 ? (0, t.newError)(`Cannot find ${r} in the latest release artifacts (${p}): ${b.stack || b.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : b;
        }
      };
      try {
        n = await g(this.channel);
      } catch (S) {
        if (this.channel !== this.getDefaultChannelName())
          n = await g(this.getDefaultChannelName());
        else
          throw S;
      }
      if (!n)
        throw (0, t.newError)(`Unable to parse channel data from ${r}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
      const y = (0, f.parseUpdateInfo)(n, r, p);
      y.releaseName == null && (y.releaseName = s.name), y.releaseNotes == null && (y.releaseNotes = s.description || null);
      const m = /* @__PURE__ */ new Map();
      for (const S of s.assets.links)
        m.set(this.normalizeFilename(S.name), S.direct_asset_url);
      const w = {
        tag: i,
        assets: m,
        ...y
      };
      return this.cachedLatestVersion = w, w;
    }
    /**
     * Utility function to convert GitlabReleaseAsset to Map<string, string>
     * Maps asset names to their download URLs
     */
    convertAssetsToMap(l) {
      const o = /* @__PURE__ */ new Map();
      for (const s of l.links)
        o.set(this.normalizeFilename(s.name), s.direct_asset_url);
      return o;
    }
    /**
     * Find blockmap file URL in assets map for a specific filename
     */
    findBlockMapInAssets(l, o) {
      const s = [`${o}.blockmap`, `${this.normalizeFilename(o)}.blockmap`];
      for (const i of s) {
        const n = l.get(i);
        if (n)
          return new d.URL(n);
      }
      return null;
    }
    async fetchReleaseInfoByVersion(l) {
      const o = new t.CancellationToken(), s = [`v${l}`, l];
      for (const i of s) {
        const n = (0, c.newUrlFromBase)(`projects/${this.options.projectId}/releases/${encodeURIComponent(i)}`, this.baseApiUrl);
        try {
          const r = { "Content-Type": "application/json", ...this.setAuthHeaderForToken(this.options.token || null) }, p = await this.httpRequest(n, r, o);
          if (p)
            return JSON.parse(p);
        } catch (r) {
          if (r instanceof t.HttpError && r.statusCode === 404)
            continue;
          throw (0, t.newError)(`Unable to find release ${i} on GitLab (${n}): ${r.stack || r.message}`, "ERR_UPDATER_RELEASE_NOT_FOUND");
        }
      }
      throw (0, t.newError)(`Unable to find release with version ${l} (tried: ${s.join(", ")}) on GitLab`, "ERR_UPDATER_RELEASE_NOT_FOUND");
    }
    setAuthHeaderForToken(l) {
      const o = {};
      return l != null && (l.startsWith("Bearer") ? o.authorization = l : o["PRIVATE-TOKEN"] = l), o;
    }
    /**
     * Get version info for blockmap files, using cache when possible
     */
    async getVersionInfoForBlockMap(l) {
      if (this.cachedLatestVersion && this.cachedLatestVersion.version === l)
        return this.cachedLatestVersion.assets;
      const o = await this.fetchReleaseInfoByVersion(l);
      return o && o.assets ? this.convertAssetsToMap(o.assets) : null;
    }
    /**
     * Find blockmap URLs from version assets
     */
    async findBlockMapUrlsFromAssets(l, o, s) {
      let i = null, n = null;
      const r = await this.getVersionInfoForBlockMap(o);
      r && (i = this.findBlockMapInAssets(r, s));
      const p = await this.getVersionInfoForBlockMap(l);
      if (p) {
        const g = s.replace(new RegExp(h(o), "g"), l);
        n = this.findBlockMapInAssets(p, g);
      }
      return [n, i];
    }
    async getBlockMapFiles(l, o, s, i = null) {
      if (this.options.uploadTarget === "project_upload") {
        const n = l.pathname.split("/").pop() || "", [r, p] = await this.findBlockMapUrlsFromAssets(o, s, n);
        if (!p)
          throw (0, t.newError)(`Cannot find blockmap file for ${s} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
        if (!r)
          throw (0, t.newError)(`Cannot find blockmap file for ${o} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
        return [r, p];
      } else
        return super.getBlockMapFiles(l, o, s, i);
    }
    resolveFiles(l) {
      return (0, f.getFileList)(l).map((o) => {
        const i = [
          o.url,
          // Original filename
          this.normalizeFilename(o.url)
          // Normalized filename (spaces/underscores → dashes)
        ].find((r) => l.assets.has(r)), n = i ? l.assets.get(i) : void 0;
        if (!n)
          throw (0, t.newError)(`Cannot find asset "${o.url}" in GitLab release assets. Available assets: ${Array.from(l.assets.keys()).join(", ")}`, "ERR_UPDATER_ASSET_NOT_FOUND");
        return {
          url: new d.URL(n),
          info: o
        };
      });
    }
    toString() {
      return `GitLab (projectId: ${this.options.projectId}, channel: ${this.channel})`;
    }
  };
  return Jt.GitLabProvider = u, Jt;
}
var Qt = {}, nl;
function qf() {
  if (nl) return Qt;
  nl = 1, Object.defineProperty(Qt, "__esModule", { value: !0 }), Qt.KeygenProvider = void 0;
  const t = xe(), d = Pt(), h = Ye();
  let c = class extends h.Provider {
    constructor(u, a, l) {
      super({
        ...l,
        isUseMultipleRangeRequest: !1
      }), this.configuration = u, this.updater = a, this.defaultHostname = "api.keygen.sh";
      const o = this.configuration.host || this.defaultHostname;
      this.baseUrl = (0, d.newBaseUrl)(`https://${o}/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
    }
    get channel() {
      return this.updater.channel || this.configuration.channel || "stable";
    }
    async getLatestVersion() {
      const u = new t.CancellationToken(), a = (0, d.getChannelFilename)(this.getCustomChannelName(this.channel)), l = (0, d.newUrlFromBase)(a, this.baseUrl, this.updater.isAddNoCacheQuery);
      try {
        const o = await this.httpRequest(l, {
          Accept: "application/vnd.api+json",
          "Keygen-Version": "1.1"
        }, u);
        return (0, h.parseUpdateInfo)(o, a, l);
      } catch (o) {
        throw (0, t.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${o.stack || o.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
      }
    }
    resolveFiles(u) {
      return (0, h.resolveFiles)(u, this.baseUrl);
    }
    toString() {
      const { account: u, product: a, platform: l } = this.configuration;
      return `Keygen (account: ${u}, product: ${a}, platform: ${l}, channel: ${this.channel})`;
    }
  };
  return Qt.KeygenProvider = c, Qt;
}
var Zt = {}, il;
function Mf() {
  if (il) return Zt;
  il = 1, Object.defineProperty(Zt, "__esModule", { value: !0 }), Zt.PrivateGitHubProvider = void 0;
  const t = xe(), d = aa(), h = Ce, c = mt, f = Pt(), u = fu(), a = Ye();
  let l = class extends u.BaseGitHubProvider {
    constructor(s, i, n, r) {
      super(s, "api.github.com", r), this.updater = i, this.token = n;
    }
    createRequestOptions(s, i) {
      const n = super.createRequestOptions(s, i);
      return n.redirect = "manual", n;
    }
    async getLatestVersion() {
      const s = new t.CancellationToken(), i = (0, f.getChannelFilename)(this.getDefaultChannelName()), n = await this.getLatestVersionInfo(s), r = n.assets.find((y) => y.name === i);
      if (r == null)
        throw (0, t.newError)(`Cannot find ${i} in the release ${n.html_url || n.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
      const p = new c.URL(r.url);
      let g;
      try {
        g = (0, d.load)(await this.httpRequest(p, this.configureHeaders("application/octet-stream"), s));
      } catch (y) {
        throw y instanceof t.HttpError && y.statusCode === 404 ? (0, t.newError)(`Cannot find ${i} in the latest release artifacts (${p}): ${y.stack || y.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : y;
      }
      return g.assets = n.assets, g;
    }
    get fileExtraDownloadHeaders() {
      return this.configureHeaders("application/octet-stream");
    }
    configureHeaders(s) {
      return {
        accept: s,
        authorization: `token ${this.token}`
      };
    }
    async getLatestVersionInfo(s) {
      const i = this.updater.allowPrerelease;
      let n = this.basePath;
      i || (n = `${n}/latest`);
      const r = (0, f.newUrlFromBase)(n, this.baseUrl);
      try {
        const p = JSON.parse(await this.httpRequest(r, this.configureHeaders("application/vnd.github.v3+json"), s));
        return i ? p.find((g) => g.prerelease) || p[0] : p;
      } catch (p) {
        throw (0, t.newError)(`Unable to find latest version on GitHub (${r}), please ensure a production release exists: ${p.stack || p.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
      }
    }
    get basePath() {
      return this.computeGithubBasePath(`/repos/${this.options.owner}/${this.options.repo}/releases`);
    }
    resolveFiles(s) {
      return (0, a.getFileList)(s).map((i) => {
        const n = h.posix.basename(i.url).replace(/ /g, "-"), r = s.assets.find((p) => p != null && p.name === n);
        if (r == null)
          throw (0, t.newError)(`Cannot find asset "${n}" in: ${JSON.stringify(s.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
        return {
          url: new c.URL(r.url),
          info: i
        };
      });
    }
  };
  return Zt.PrivateGitHubProvider = l, Zt;
}
var al;
function Bf() {
  if (al) return Xt;
  al = 1, Object.defineProperty(Xt, "__esModule", { value: !0 }), Xt.isUrlProbablySupportMultiRangeRequests = l, Xt.createClient = o;
  const t = xe(), d = $f(), h = cu(), c = fu(), f = kf(), u = qf(), a = Mf();
  function l(s) {
    return !s.includes("s3.amazonaws.com");
  }
  function o(s, i, n) {
    if (typeof s == "string")
      throw (0, t.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
    const r = s.provider;
    switch (r) {
      case "github": {
        const p = s, g = (p.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || p.token;
        return g == null ? new c.GitHubProvider(p, i, n) : new a.PrivateGitHubProvider(p, i, g, n);
      }
      case "bitbucket":
        return new d.BitbucketProvider(s, i, n);
      case "gitlab":
        return new f.GitLabProvider(s, i, n);
      case "keygen":
        return new u.KeygenProvider(s, i, n);
      case "s3":
      case "spaces":
        return new h.GenericProvider({
          provider: "generic",
          url: (0, t.getS3LikeProviderBaseUrl)(s),
          channel: s.channel || null
        }, i, {
          ...n,
          // https://github.com/minio/minio/issues/5285#issuecomment-350428955
          isUseMultipleRangeRequest: !1
        });
      case "generic": {
        const p = s;
        return new h.GenericProvider(p, i, {
          ...n,
          isUseMultipleRangeRequest: p.useMultipleRangeRequest !== !1 && l(p.url)
        });
      }
      case "custom": {
        const p = s, g = p.updateProvider;
        if (!g)
          throw (0, t.newError)("Custom provider not specified", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
        return new g(p, i, n);
      }
      default:
        throw (0, t.newError)(`Unsupported provider: ${r}`, "ERR_UPDATER_UNSUPPORTED_PROVIDER");
    }
  }
  return Xt;
}
var er = {}, tr = {}, Ut = {}, $t = {}, ol;
function da() {
  if (ol) return $t;
  ol = 1, Object.defineProperty($t, "__esModule", { value: !0 }), $t.OperationKind = void 0, $t.computeOperations = d;
  var t;
  (function(a) {
    a[a.COPY = 0] = "COPY", a[a.DOWNLOAD = 1] = "DOWNLOAD";
  })(t || ($t.OperationKind = t = {}));
  function d(a, l, o) {
    const s = u(a.files), i = u(l.files);
    let n = null;
    const r = l.files[0], p = [], g = r.name, y = s.get(g);
    if (y == null)
      throw new Error(`no file ${g} in old blockmap`);
    const m = i.get(g);
    let w = 0;
    const { checksumToOffset: S, checksumToOldSize: P } = f(s.get(g), y.offset, o);
    let I = r.offset;
    for (let b = 0; b < m.checksums.length; I += m.sizes[b], b++) {
      const O = m.sizes[b], T = m.checksums[b];
      let A = S.get(T);
      A != null && P.get(T) !== O && (o.warn(`Checksum ("${T}") matches, but size differs (old: ${P.get(T)}, new: ${O})`), A = void 0), A === void 0 ? (w++, n != null && n.kind === t.DOWNLOAD && n.end === I ? n.end += O : (n = {
        kind: t.DOWNLOAD,
        start: I,
        end: I + O
        // oldBlocks: null,
      }, c(n, p, T, b))) : n != null && n.kind === t.COPY && n.end === A ? n.end += O : (n = {
        kind: t.COPY,
        start: A,
        end: A + O
        // oldBlocks: [checksum]
      }, c(n, p, T, b));
    }
    return w > 0 && o.info(`File${r.name === "file" ? "" : " " + r.name} has ${w} changed blocks`), p;
  }
  const h = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
  function c(a, l, o, s) {
    if (h && l.length !== 0) {
      const i = l[l.length - 1];
      if (i.kind === a.kind && a.start < i.end && a.start > i.start) {
        const n = [i.start, i.end, a.start, a.end].reduce((r, p) => r < p ? r : p);
        throw new Error(`operation (block index: ${s}, checksum: ${o}, kind: ${t[a.kind]}) overlaps previous operation (checksum: ${o}):
abs: ${i.start} until ${i.end} and ${a.start} until ${a.end}
rel: ${i.start - n} until ${i.end - n} and ${a.start - n} until ${a.end - n}`);
      }
    }
    l.push(a);
  }
  function f(a, l, o) {
    const s = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
    let n = l;
    for (let r = 0; r < a.checksums.length; r++) {
      const p = a.checksums[r], g = a.sizes[r], y = i.get(p);
      if (y === void 0)
        s.set(p, n), i.set(p, g);
      else if (o.debug != null) {
        const m = y === g ? "(same size)" : `(size: ${y}, this size: ${g})`;
        o.debug(`${p} duplicated in blockmap ${m}, it doesn't lead to broken differential downloader, just corresponding block will be skipped)`);
      }
      n += g;
    }
    return { checksumToOffset: s, checksumToOldSize: i };
  }
  function u(a) {
    const l = /* @__PURE__ */ new Map();
    for (const o of a)
      l.set(o.name, o);
    return l;
  }
  return $t;
}
var sl;
function du() {
  if (sl) return Ut;
  sl = 1, Object.defineProperty(Ut, "__esModule", { value: !0 }), Ut.DataSplitter = void 0, Ut.copyData = a;
  const t = xe(), d = rt, h = gr, c = da(), f = Buffer.from(`\r
\r
`);
  var u;
  (function(o) {
    o[o.INIT = 0] = "INIT", o[o.HEADER = 1] = "HEADER", o[o.BODY = 2] = "BODY";
  })(u || (u = {}));
  function a(o, s, i, n, r) {
    const p = (0, d.createReadStream)("", {
      fd: i,
      autoClose: !1,
      start: o.start,
      // end is inclusive
      end: o.end - 1
    });
    p.on("error", n), p.once("end", r), p.pipe(s, {
      end: !1
    });
  }
  let l = class extends h.Writable {
    constructor(s, i, n, r, p, g) {
      super(), this.out = s, this.options = i, this.partIndexToTaskIndex = n, this.partIndexToLength = p, this.finishHandler = g, this.partIndex = -1, this.headerListBuffer = null, this.readState = u.INIT, this.ignoreByteCount = 0, this.remainingPartDataCount = 0, this.actualPartLength = 0, this.boundaryLength = r.length + 4, this.ignoreByteCount = this.boundaryLength - 2;
    }
    get isFinished() {
      return this.partIndex === this.partIndexToLength.length;
    }
    // noinspection JSUnusedGlobalSymbols
    _write(s, i, n) {
      if (this.isFinished) {
        console.error(`Trailing ignored data: ${s.length} bytes`);
        return;
      }
      this.handleData(s).then(n).catch(n);
    }
    async handleData(s) {
      let i = 0;
      if (this.ignoreByteCount !== 0 && this.remainingPartDataCount !== 0)
        throw (0, t.newError)("Internal error", "ERR_DATA_SPLITTER_BYTE_COUNT_MISMATCH");
      if (this.ignoreByteCount > 0) {
        const n = Math.min(this.ignoreByteCount, s.length);
        this.ignoreByteCount -= n, i = n;
      } else if (this.remainingPartDataCount > 0) {
        const n = Math.min(this.remainingPartDataCount, s.length);
        this.remainingPartDataCount -= n, await this.processPartData(s, 0, n), i = n;
      }
      if (i !== s.length) {
        if (this.readState === u.HEADER) {
          const n = this.searchHeaderListEnd(s, i);
          if (n === -1)
            return;
          i = n, this.readState = u.BODY, this.headerListBuffer = null;
        }
        for (; ; ) {
          if (this.readState === u.BODY)
            this.readState = u.INIT;
          else {
            this.partIndex++;
            let g = this.partIndexToTaskIndex.get(this.partIndex);
            if (g == null)
              if (this.isFinished)
                g = this.options.end;
              else
                throw (0, t.newError)("taskIndex is null", "ERR_DATA_SPLITTER_TASK_INDEX_IS_NULL");
            const y = this.partIndex === 0 ? this.options.start : this.partIndexToTaskIndex.get(this.partIndex - 1) + 1;
            if (y < g)
              await this.copyExistingData(y, g);
            else if (y > g)
              throw (0, t.newError)("prevTaskIndex must be < taskIndex", "ERR_DATA_SPLITTER_TASK_INDEX_ASSERT_FAILED");
            if (this.isFinished) {
              this.onPartEnd(), this.finishHandler();
              return;
            }
            if (i = this.searchHeaderListEnd(s, i), i === -1) {
              this.readState = u.HEADER;
              return;
            }
          }
          const n = this.partIndexToLength[this.partIndex], r = i + n, p = Math.min(r, s.length);
          if (await this.processPartStarted(s, i, p), this.remainingPartDataCount = n - (p - i), this.remainingPartDataCount > 0)
            return;
          if (i = r + this.boundaryLength, i >= s.length) {
            this.ignoreByteCount = this.boundaryLength - (s.length - r);
            return;
          }
        }
      }
    }
    copyExistingData(s, i) {
      return new Promise((n, r) => {
        const p = () => {
          if (s === i) {
            n();
            return;
          }
          const g = this.options.tasks[s];
          if (g.kind !== c.OperationKind.COPY) {
            r(new Error("Task kind must be COPY"));
            return;
          }
          a(g, this.out, this.options.oldFileFd, r, () => {
            s++, p();
          });
        };
        p();
      });
    }
    searchHeaderListEnd(s, i) {
      const n = s.indexOf(f, i);
      if (n !== -1)
        return n + f.length;
      const r = i === 0 ? s : s.slice(i);
      return this.headerListBuffer == null ? this.headerListBuffer = r : this.headerListBuffer = Buffer.concat([this.headerListBuffer, r]), -1;
    }
    onPartEnd() {
      const s = this.partIndexToLength[this.partIndex - 1];
      if (this.actualPartLength !== s)
        throw (0, t.newError)(`Expected length: ${s} differs from actual: ${this.actualPartLength}`, "ERR_DATA_SPLITTER_LENGTH_MISMATCH");
      this.actualPartLength = 0;
    }
    processPartStarted(s, i, n) {
      return this.partIndex !== 0 && this.onPartEnd(), this.processPartData(s, i, n);
    }
    processPartData(s, i, n) {
      this.actualPartLength += n - i;
      const r = this.out;
      return r.write(i === 0 && s.length === n ? s : s.slice(i, n)) ? Promise.resolve() : new Promise((p, g) => {
        r.on("error", g), r.once("drain", () => {
          r.removeListener("error", g), p();
        });
      });
    }
  };
  return Ut.DataSplitter = l, Ut;
}
var rr = {}, ll;
function Hf() {
  if (ll) return rr;
  ll = 1, Object.defineProperty(rr, "__esModule", { value: !0 }), rr.executeTasksUsingMultipleRangeRequests = c, rr.checkIsRangesSupported = u;
  const t = xe(), d = du(), h = da();
  function c(a, l, o, s, i) {
    const n = (r) => {
      if (r >= l.length) {
        a.fileMetadataBuffer != null && o.write(a.fileMetadataBuffer), o.end();
        return;
      }
      const p = r + 1e3;
      f(a, {
        tasks: l,
        start: r,
        end: Math.min(l.length, p),
        oldFileFd: s
      }, o, () => n(p), i);
    };
    return n;
  }
  function f(a, l, o, s, i) {
    let n = "bytes=", r = 0;
    const p = /* @__PURE__ */ new Map(), g = [];
    for (let w = l.start; w < l.end; w++) {
      const S = l.tasks[w];
      S.kind === h.OperationKind.DOWNLOAD && (n += `${S.start}-${S.end - 1}, `, p.set(r, w), r++, g.push(S.end - S.start));
    }
    if (r <= 1) {
      const w = (S) => {
        if (S >= l.end) {
          s();
          return;
        }
        const P = l.tasks[S++];
        if (P.kind === h.OperationKind.COPY)
          (0, d.copyData)(P, o, l.oldFileFd, i, () => w(S));
        else {
          const I = a.createRequestOptions();
          I.headers.Range = `bytes=${P.start}-${P.end - 1}`;
          const b = a.httpExecutor.createRequest(I, (O) => {
            O.on("error", i), u(O, i) && (O.pipe(o, {
              end: !1
            }), O.once("end", () => w(S)));
          });
          a.httpExecutor.addErrorAndTimeoutHandlers(b, i), b.end();
        }
      };
      w(l.start);
      return;
    }
    const y = a.createRequestOptions();
    y.headers.Range = n.substring(0, n.length - 2);
    const m = a.httpExecutor.createRequest(y, (w) => {
      if (!u(w, i))
        return;
      const S = (0, t.safeGetHeader)(w, "content-type"), P = /^multipart\/.+?\s*;\s*boundary=(?:"([^"]+)"|([^\s";]+))\s*$/i.exec(S);
      if (P == null) {
        i(new Error(`Content-Type "multipart/byteranges" is expected, but got "${S}"`));
        return;
      }
      const I = new d.DataSplitter(o, l, p, P[1] || P[2], g, s);
      I.on("error", i), w.pipe(I), w.on("end", () => {
        setTimeout(() => {
          m.abort(), i(new Error("Response ends without calling any handlers"));
        }, 1e4);
      });
    });
    a.httpExecutor.addErrorAndTimeoutHandlers(m, i), m.end();
  }
  function u(a, l) {
    if (a.statusCode >= 400)
      return l((0, t.createHttpError)(a)), !1;
    if (a.statusCode !== 206) {
      const o = (0, t.safeGetHeader)(a, "accept-ranges");
      if (o == null || o === "none")
        return l(new Error(`Server doesn't support Accept-Ranges (response code ${a.statusCode})`)), !1;
    }
    return !0;
  }
  return rr;
}
var nr = {}, ul;
function jf() {
  if (ul) return nr;
  ul = 1, Object.defineProperty(nr, "__esModule", { value: !0 }), nr.ProgressDifferentialDownloadCallbackTransform = void 0;
  const t = gr;
  var d;
  (function(c) {
    c[c.COPY = 0] = "COPY", c[c.DOWNLOAD = 1] = "DOWNLOAD";
  })(d || (d = {}));
  let h = class extends t.Transform {
    constructor(f, u, a) {
      super(), this.progressDifferentialDownloadInfo = f, this.cancellationToken = u, this.onProgress = a, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.expectedBytes = 0, this.index = 0, this.operationType = d.COPY, this.nextUpdate = this.start + 1e3;
    }
    _transform(f, u, a) {
      if (this.cancellationToken.cancelled) {
        a(new Error("cancelled"), null);
        return;
      }
      if (this.operationType == d.COPY) {
        a(null, f);
        return;
      }
      this.transferred += f.length, this.delta += f.length;
      const l = Date.now();
      l >= this.nextUpdate && this.transferred !== this.expectedBytes && this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && (this.nextUpdate = l + 1e3, this.onProgress({
        total: this.progressDifferentialDownloadInfo.grandTotal,
        delta: this.delta,
        transferred: this.transferred,
        percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
        bytesPerSecond: Math.round(this.transferred / ((l - this.start) / 1e3))
      }), this.delta = 0), a(null, f);
    }
    beginFileCopy() {
      this.operationType = d.COPY;
    }
    beginRangeDownload() {
      this.operationType = d.DOWNLOAD, this.expectedBytes += this.progressDifferentialDownloadInfo.expectedByteCounts[this.index++];
    }
    endRangeDownload() {
      this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && this.onProgress({
        total: this.progressDifferentialDownloadInfo.grandTotal,
        delta: this.delta,
        transferred: this.transferred,
        percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
        bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
      });
    }
    // Called when we are 100% done with the connection/download
    _flush(f) {
      if (this.cancellationToken.cancelled) {
        f(new Error("cancelled"));
        return;
      }
      this.onProgress({
        total: this.progressDifferentialDownloadInfo.grandTotal,
        delta: this.delta,
        transferred: this.transferred,
        percent: 100,
        bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
      }), this.delta = 0, this.transferred = 0, f(null);
    }
  };
  return nr.ProgressDifferentialDownloadCallbackTransform = h, nr;
}
var cl;
function hu() {
  if (cl) return tr;
  cl = 1, Object.defineProperty(tr, "__esModule", { value: !0 }), tr.DifferentialDownloader = void 0;
  const t = xe(), d = /* @__PURE__ */ gt(), h = rt, c = du(), f = mt, u = da(), a = Hf(), l = jf();
  let o = class {
    // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
    constructor(r, p, g) {
      this.blockAwareFileInfo = r, this.httpExecutor = p, this.options = g, this.fileMetadataBuffer = null, this.logger = g.logger;
    }
    createRequestOptions() {
      const r = {
        headers: {
          ...this.options.requestHeaders,
          accept: "*/*"
        }
      };
      return (0, t.configureRequestUrl)(this.options.newUrl, r), (0, t.configureRequestOptions)(r), r;
    }
    doDownload(r, p) {
      if (r.version !== p.version)
        throw new Error(`version is different (${r.version} - ${p.version}), full download is required`);
      const g = this.logger, y = (0, u.computeOperations)(r, p, g);
      g.debug != null && g.debug(JSON.stringify(y, null, 2));
      let m = 0, w = 0;
      for (const P of y) {
        const I = P.end - P.start;
        P.kind === u.OperationKind.DOWNLOAD ? m += I : w += I;
      }
      const S = this.blockAwareFileInfo.size;
      if (m + w + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== S)
        throw new Error(`Internal error, size mismatch: downloadSize: ${m}, copySize: ${w}, newSize: ${S}`);
      return g.info(`Full: ${s(S)}, To download: ${s(m)} (${Math.round(m / (S / 100))}%)`), this.downloadFile(y);
    }
    downloadFile(r) {
      const p = [], g = () => Promise.all(p.map((y) => (0, d.close)(y.descriptor).catch((m) => {
        this.logger.error(`cannot close file "${y.path}": ${m}`);
      })));
      return this.doDownloadFile(r, p).then(g).catch((y) => g().catch((m) => {
        try {
          this.logger.error(`cannot close files: ${m}`);
        } catch (w) {
          try {
            console.error(w);
          } catch {
          }
        }
        throw y;
      }).then(() => {
        throw y;
      }));
    }
    async doDownloadFile(r, p) {
      const g = await (0, d.open)(this.options.oldFile, "r");
      p.push({ descriptor: g, path: this.options.oldFile });
      const y = await (0, d.open)(this.options.newFile, "w");
      p.push({ descriptor: y, path: this.options.newFile });
      const m = (0, h.createWriteStream)(this.options.newFile, { fd: y });
      await new Promise((w, S) => {
        const P = [];
        let I;
        if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
          const L = [];
          let q = 0;
          for (const N of r)
            N.kind === u.OperationKind.DOWNLOAD && (L.push(N.end - N.start), q += N.end - N.start);
          const F = {
            expectedByteCounts: L,
            grandTotal: q
          };
          I = new l.ProgressDifferentialDownloadCallbackTransform(F, this.options.cancellationToken, this.options.onProgress), P.push(I);
        }
        const b = new t.DigestTransform(this.blockAwareFileInfo.sha512);
        b.isValidateOnEnd = !1, P.push(b), m.on("finish", () => {
          m.close(() => {
            p.splice(1, 1);
            try {
              b.validate();
            } catch (L) {
              S(L);
              return;
            }
            w(void 0);
          });
        }), P.push(m);
        let O = null;
        for (const L of P)
          L.on("error", S), O == null ? O = L : O = O.pipe(L);
        const T = P[0];
        let A;
        if (this.options.isUseMultipleRangeRequest) {
          A = (0, a.executeTasksUsingMultipleRangeRequests)(this, r, T, g, S), A(0);
          return;
        }
        let v = 0, $ = null;
        this.logger.info(`Differential download: ${this.options.newUrl}`);
        const k = this.createRequestOptions();
        k.redirect = "manual", A = (L) => {
          var q, F;
          if (L >= r.length) {
            this.fileMetadataBuffer != null && T.write(this.fileMetadataBuffer), T.end();
            return;
          }
          const N = r[L++];
          if (N.kind === u.OperationKind.COPY) {
            I && I.beginFileCopy(), (0, c.copyData)(N, T, g, S, () => A(L));
            return;
          }
          const j = `bytes=${N.start}-${N.end - 1}`;
          k.headers.range = j, (F = (q = this.logger) === null || q === void 0 ? void 0 : q.debug) === null || F === void 0 || F.call(q, `download range: ${j}`), I && I.beginRangeDownload();
          const D = this.httpExecutor.createRequest(k, (G) => {
            G.on("error", S), G.on("aborted", () => {
              S(new Error("response has been aborted by the server"));
            }), G.statusCode >= 400 && S((0, t.createHttpError)(G)), G.pipe(T, {
              end: !1
            }), G.once("end", () => {
              I && I.endRangeDownload(), ++v === 100 ? (v = 0, setTimeout(() => A(L), 1e3)) : A(L);
            });
          });
          D.on("redirect", (G, V, te) => {
            this.logger.info(`Redirect to ${i(te)}`), $ = te, (0, t.configureRequestUrl)(new f.URL($), k), D.followRedirect();
          }), this.httpExecutor.addErrorAndTimeoutHandlers(D, S), D.end();
        }, A(0);
      });
    }
    async readRemoteBytes(r, p) {
      const g = Buffer.allocUnsafe(p + 1 - r), y = this.createRequestOptions();
      y.headers.range = `bytes=${r}-${p}`;
      let m = 0;
      if (await this.request(y, (w) => {
        w.copy(g, m), m += w.length;
      }), m !== g.length)
        throw new Error(`Received data length ${m} is not equal to expected ${g.length}`);
      return g;
    }
    request(r, p) {
      return new Promise((g, y) => {
        const m = this.httpExecutor.createRequest(r, (w) => {
          (0, a.checkIsRangesSupported)(w, y) && (w.on("error", y), w.on("aborted", () => {
            y(new Error("response has been aborted by the server"));
          }), w.on("data", p), w.on("end", () => g()));
        });
        this.httpExecutor.addErrorAndTimeoutHandlers(m, y), m.end();
      });
    }
  };
  tr.DifferentialDownloader = o;
  function s(n, r = " KB") {
    return new Intl.NumberFormat("en").format((n / 1024).toFixed(2)) + r;
  }
  function i(n) {
    const r = n.indexOf("?");
    return r < 0 ? n : n.substring(0, r);
  }
  return tr;
}
var fl;
function Gf() {
  if (fl) return er;
  fl = 1, Object.defineProperty(er, "__esModule", { value: !0 }), er.GenericDifferentialDownloader = void 0;
  const t = hu();
  let d = class extends t.DifferentialDownloader {
    download(c, f) {
      return this.doDownload(c, f);
    }
  };
  return er.GenericDifferentialDownloader = d, er;
}
var Qi = {}, dl;
function Ot() {
  return dl || (dl = 1, function(t) {
    Object.defineProperty(t, "__esModule", { value: !0 }), t.UpdaterSignal = t.UPDATE_DOWNLOADED = t.DOWNLOAD_PROGRESS = t.CancellationToken = void 0, t.addHandler = c;
    const d = xe();
    Object.defineProperty(t, "CancellationToken", { enumerable: !0, get: function() {
      return d.CancellationToken;
    } }), t.DOWNLOAD_PROGRESS = "download-progress", t.UPDATE_DOWNLOADED = "update-downloaded";
    class h {
      constructor(u) {
        this.emitter = u;
      }
      /**
       * Emitted when an authenticating proxy is [asking for user credentials](https://github.com/electron/electron/blob/master/docs/api/client-request.md#event-login).
       */
      login(u) {
        c(this.emitter, "login", u);
      }
      progress(u) {
        c(this.emitter, t.DOWNLOAD_PROGRESS, u);
      }
      updateDownloaded(u) {
        c(this.emitter, t.UPDATE_DOWNLOADED, u);
      }
      updateCancelled(u) {
        c(this.emitter, "update-cancelled", u);
      }
    }
    t.UpdaterSignal = h;
    function c(f, u, a) {
      f.on(u, a);
    }
  }(Qi)), Qi;
}
var hl;
function ha() {
  if (hl) return At;
  hl = 1, Object.defineProperty(At, "__esModule", { value: !0 }), At.NoOpLogger = At.AppUpdater = void 0;
  const t = xe(), d = vr, h = Hr, c = Ll, f = /* @__PURE__ */ gt(), u = aa(), a = sf(), l = Ce, o = lu(), s = Ff(), i = Lf(), n = Uf(), r = cu(), p = Bf(), g = $l, y = Gf(), m = Ot();
  let w = class pu extends c.EventEmitter {
    /**
     * Get the update channel. Doesn't return `channel` from the update configuration, only if was previously set.
     */
    get channel() {
      return this._channel;
    }
    /**
     * Set the update channel. Overrides `channel` in the update configuration.
     *
     * `allowDowngrade` will be automatically set to `true`. If this behavior is not suitable for you, simple set `allowDowngrade` explicitly after.
     */
    set channel(b) {
      if (this._channel != null) {
        if (typeof b != "string")
          throw (0, t.newError)(`Channel must be a string, but got: ${b}`, "ERR_UPDATER_INVALID_CHANNEL");
        if (b.length === 0)
          throw (0, t.newError)("Channel must be not an empty string", "ERR_UPDATER_INVALID_CHANNEL");
      }
      this._channel = b, this.allowDowngrade = !0;
    }
    /**
     *  Shortcut for explicitly adding auth tokens to request headers
     */
    addAuthHeader(b) {
      this.requestHeaders = Object.assign({}, this.requestHeaders, {
        authorization: b
      });
    }
    // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    get netSession() {
      return (0, n.getNetSession)();
    }
    /**
     * The logger. You can pass [electron-log](https://github.com/megahertz/electron-log), [winston](https://github.com/winstonjs/winston) or another logger with the following interface: `{ info(), warn(), error() }`.
     * Set it to `null` if you would like to disable a logging feature.
     */
    get logger() {
      return this._logger;
    }
    set logger(b) {
      this._logger = b ?? new P();
    }
    // noinspection JSUnusedGlobalSymbols
    /**
     * test only
     * @private
     */
    set updateConfigPath(b) {
      this.clientPromise = null, this._appUpdateConfigPath = b, this.configOnDisk = new a.Lazy(() => this.loadUpdateConfig());
    }
    /**
     * Allows developer to override default logic for determining if an update is supported.
     * The default logic compares the `UpdateInfo` minimum system version against the `os.release()` with `semver` package
     */
    get isUpdateSupported() {
      return this._isUpdateSupported;
    }
    set isUpdateSupported(b) {
      b && (this._isUpdateSupported = b);
    }
    /**
     * Allows developer to override default logic for determining if the user is below the rollout threshold.
     * The default logic compares the staging percentage with numerical representation of user ID.
     * An override can define custom logic, or bypass it if needed.
     */
    get isUserWithinRollout() {
      return this._isUserWithinRollout;
    }
    set isUserWithinRollout(b) {
      b && (this._isUserWithinRollout = b);
    }
    constructor(b, O) {
      super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this.previousBlockmapBaseUrlOverride = null, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new m.UpdaterSignal(this), this._appUpdateConfigPath = null, this._isUpdateSupported = (v) => this.checkIfUpdateSupported(v), this._isUserWithinRollout = (v) => this.isStagingMatch(v), this.clientPromise = null, this.stagingUserIdPromise = new a.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new a.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (v) => {
        this._logger.error(`Error: ${v.stack || v.message}`);
      }), O == null ? (this.app = new i.ElectronAppAdapter(), this.httpExecutor = new n.ElectronHttpExecutor((v, $) => this.emit("login", v, $))) : (this.app = O, this.httpExecutor = null);
      const T = this.app.version, A = (0, o.parse)(T);
      if (A == null)
        throw (0, t.newError)(`App version is not a valid semver version: "${T}"`, "ERR_UPDATER_INVALID_VERSION");
      this.currentVersion = A, this.allowPrerelease = S(A), b != null && (this.setFeedURL(b), typeof b != "string" && b.requestHeaders && (this.requestHeaders = b.requestHeaders));
    }
    //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    getFeedURL() {
      return "Deprecated. Do not use it.";
    }
    /**
     * Configure update provider. If value is `string`, [GenericServerOptions](./publish.md#genericserveroptions) will be set with value as `url`.
     * @param options If you want to override configuration in the `app-update.yml`.
     */
    setFeedURL(b) {
      const O = this.createProviderRuntimeOptions();
      let T;
      typeof b == "string" ? T = new r.GenericProvider({ provider: "generic", url: b }, this, {
        ...O,
        isUseMultipleRangeRequest: (0, p.isUrlProbablySupportMultiRangeRequests)(b)
      }) : T = (0, p.createClient)(b, this, O), this.clientPromise = Promise.resolve(T);
    }
    /**
     * Asks the server whether there is an update.
     * @returns null if the updater is disabled, otherwise info about the latest version
     */
    checkForUpdates() {
      if (!this.isUpdaterActive())
        return Promise.resolve(null);
      let b = this.checkForUpdatesPromise;
      if (b != null)
        return this._logger.info("Checking for update (already in progress)"), b;
      const O = () => this.checkForUpdatesPromise = null;
      return this._logger.info("Checking for update"), b = this.doCheckForUpdates().then((T) => (O(), T)).catch((T) => {
        throw O(), this.emit("error", T, `Cannot check for updates: ${(T.stack || T).toString()}`), T;
      }), this.checkForUpdatesPromise = b, b;
    }
    isUpdaterActive() {
      return this.app.isPackaged || this.forceDevUpdateConfig ? !0 : (this._logger.info("Skip checkForUpdates because application is not packed and dev update config is not forced"), !1);
    }
    // noinspection JSUnusedGlobalSymbols
    checkForUpdatesAndNotify(b) {
      return this.checkForUpdates().then((O) => O != null && O.downloadPromise ? (O.downloadPromise.then(() => {
        const T = pu.formatDownloadNotification(O.updateInfo.version, this.app.name, b);
        new Ct.Notification(T).show();
      }), O) : (this._logger.debug != null && this._logger.debug("checkForUpdatesAndNotify called, downloadPromise is null"), O));
    }
    static formatDownloadNotification(b, O, T) {
      return T == null && (T = {
        title: "A new update is ready to install",
        body: "{appName} version {version} has been downloaded and will be automatically installed on exit"
      }), T = {
        title: T.title.replace("{appName}", O).replace("{version}", b),
        body: T.body.replace("{appName}", O).replace("{version}", b)
      }, T;
    }
    async isStagingMatch(b) {
      const O = b.stagingPercentage;
      let T = O;
      if (T == null)
        return !0;
      if (T = parseInt(T, 10), isNaN(T))
        return this._logger.warn(`Staging percentage is NaN: ${O}`), !0;
      T = T / 100;
      const A = await this.stagingUserIdPromise.value, $ = t.UUID.parse(A).readUInt32BE(12) / 4294967295;
      return this._logger.info(`Staging percentage: ${T}, percentage: ${$}, user id: ${A}`), $ < T;
    }
    computeFinalHeaders(b) {
      return this.requestHeaders != null && Object.assign(b, this.requestHeaders), b;
    }
    async isUpdateAvailable(b) {
      const O = (0, o.parse)(b.version);
      if (O == null)
        throw (0, t.newError)(`This file could not be downloaded, or the latest version (from update server) does not have a valid semver version: "${b.version}"`, "ERR_UPDATER_INVALID_VERSION");
      const T = this.currentVersion;
      if ((0, o.eq)(O, T) || !await Promise.resolve(this.isUpdateSupported(b)) || !await Promise.resolve(this.isUserWithinRollout(b)))
        return !1;
      const v = (0, o.gt)(O, T), $ = (0, o.lt)(O, T);
      return v ? !0 : this.allowDowngrade && $;
    }
    checkIfUpdateSupported(b) {
      const O = b == null ? void 0 : b.minimumSystemVersion, T = (0, h.release)();
      if (O)
        try {
          if ((0, o.lt)(T, O))
            return this._logger.info(`Current OS version ${T} is less than the minimum OS version required ${O} for version ${T}`), !1;
        } catch (A) {
          this._logger.warn(`Failed to compare current OS version(${T}) with minimum OS version(${O}): ${(A.message || A).toString()}`);
        }
      return !0;
    }
    async getUpdateInfoAndProvider() {
      await this.app.whenReady(), this.clientPromise == null && (this.clientPromise = this.configOnDisk.value.then((T) => (0, p.createClient)(T, this, this.createProviderRuntimeOptions())));
      const b = await this.clientPromise, O = await this.stagingUserIdPromise.value;
      return b.setRequestHeaders(this.computeFinalHeaders({ "x-user-staging-id": O })), {
        info: await b.getLatestVersion(),
        provider: b
      };
    }
    createProviderRuntimeOptions() {
      return {
        isUseMultipleRangeRequest: !0,
        platform: this._testOnlyOptions == null ? process.platform : this._testOnlyOptions.platform,
        executor: this.httpExecutor
      };
    }
    async doCheckForUpdates() {
      this.emit("checking-for-update");
      const b = await this.getUpdateInfoAndProvider(), O = b.info;
      if (!await this.isUpdateAvailable(O))
        return this._logger.info(`Update for version ${this.currentVersion.format()} is not available (latest version: ${O.version}, downgrade is ${this.allowDowngrade ? "allowed" : "disallowed"}).`), this.emit("update-not-available", O), {
          isUpdateAvailable: !1,
          versionInfo: O,
          updateInfo: O
        };
      this.updateInfoAndProvider = b, this.onUpdateAvailable(O);
      const T = new t.CancellationToken();
      return {
        isUpdateAvailable: !0,
        versionInfo: O,
        updateInfo: O,
        cancellationToken: T,
        downloadPromise: this.autoDownload ? this.downloadUpdate(T) : null
      };
    }
    onUpdateAvailable(b) {
      this._logger.info(`Found version ${b.version} (url: ${(0, t.asArray)(b.files).map((O) => O.url).join(", ")})`), this.emit("update-available", b);
    }
    /**
     * Start downloading update manually. You can use this method if `autoDownload` option is set to `false`.
     * @returns {Promise<Array<string>>} Paths to downloaded files.
     */
    downloadUpdate(b = new t.CancellationToken()) {
      const O = this.updateInfoAndProvider;
      if (O == null) {
        const A = new Error("Please check update first");
        return this.dispatchError(A), Promise.reject(A);
      }
      if (this.downloadPromise != null)
        return this._logger.info("Downloading update (already in progress)"), this.downloadPromise;
      this._logger.info(`Downloading update from ${(0, t.asArray)(O.info.files).map((A) => A.url).join(", ")}`);
      const T = (A) => {
        if (!(A instanceof t.CancellationError))
          try {
            this.dispatchError(A);
          } catch (v) {
            this._logger.warn(`Cannot dispatch error event: ${v.stack || v}`);
          }
        return A;
      };
      return this.downloadPromise = this.doDownloadUpdate({
        updateInfoAndProvider: O,
        requestHeaders: this.computeRequestHeaders(O.provider),
        cancellationToken: b,
        disableWebInstaller: this.disableWebInstaller,
        disableDifferentialDownload: this.disableDifferentialDownload
      }).catch((A) => {
        throw T(A);
      }).finally(() => {
        this.downloadPromise = null;
      }), this.downloadPromise;
    }
    dispatchError(b) {
      this.emit("error", b, (b.stack || b).toString());
    }
    dispatchUpdateDownloaded(b) {
      this.emit(m.UPDATE_DOWNLOADED, b);
    }
    async loadUpdateConfig() {
      return this._appUpdateConfigPath == null && (this._appUpdateConfigPath = this.app.appUpdateConfigPath), (0, u.load)(await (0, f.readFile)(this._appUpdateConfigPath, "utf-8"));
    }
    computeRequestHeaders(b) {
      const O = b.fileExtraDownloadHeaders;
      if (O != null) {
        const T = this.requestHeaders;
        return T == null ? O : {
          ...O,
          ...T
        };
      }
      return this.computeFinalHeaders({ accept: "*/*" });
    }
    async getOrCreateStagingUserId() {
      const b = l.join(this.app.userDataPath, ".updaterId");
      try {
        const T = await (0, f.readFile)(b, "utf-8");
        if (t.UUID.check(T))
          return T;
        this._logger.warn(`Staging user id file exists, but content was invalid: ${T}`);
      } catch (T) {
        T.code !== "ENOENT" && this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${T}`);
      }
      const O = t.UUID.v5((0, d.randomBytes)(4096), t.UUID.OID);
      this._logger.info(`Generated new staging user ID: ${O}`);
      try {
        await (0, f.outputFile)(b, O);
      } catch (T) {
        this._logger.warn(`Couldn't write out staging user ID: ${T}`);
      }
      return O;
    }
    /** @internal */
    get isAddNoCacheQuery() {
      const b = this.requestHeaders;
      if (b == null)
        return !0;
      for (const O of Object.keys(b)) {
        const T = O.toLowerCase();
        if (T === "authorization" || T === "private-token")
          return !1;
      }
      return !0;
    }
    async getOrCreateDownloadHelper() {
      let b = this.downloadedUpdateHelper;
      if (b == null) {
        const O = (await this.configOnDisk.value).updaterCacheDirName, T = this._logger;
        O == null && T.error("updaterCacheDirName is not specified in app-update.yml Was app build using at least electron-builder 20.34.0?");
        const A = l.join(this.app.baseCachePath, O || this.app.name);
        T.debug != null && T.debug(`updater cache dir: ${A}`), b = new s.DownloadedUpdateHelper(A), this.downloadedUpdateHelper = b;
      }
      return b;
    }
    async executeDownload(b) {
      const O = b.fileInfo, T = {
        headers: b.downloadUpdateOptions.requestHeaders,
        cancellationToken: b.downloadUpdateOptions.cancellationToken,
        sha2: O.info.sha2,
        sha512: O.info.sha512
      };
      this.listenerCount(m.DOWNLOAD_PROGRESS) > 0 && (T.onProgress = (ie) => this.emit(m.DOWNLOAD_PROGRESS, ie));
      const A = b.downloadUpdateOptions.updateInfoAndProvider.info, v = A.version, $ = O.packageInfo;
      function k() {
        const ie = decodeURIComponent(b.fileInfo.url.pathname);
        return ie.toLowerCase().endsWith(`.${b.fileExtension.toLowerCase()}`) ? l.basename(ie) : b.fileInfo.info.url;
      }
      const L = await this.getOrCreateDownloadHelper(), q = L.cacheDirForPendingUpdate;
      await (0, f.mkdir)(q, { recursive: !0 });
      const F = k();
      let N = l.join(q, F);
      const j = $ == null ? null : l.join(q, `package-${v}${l.extname($.path) || ".7z"}`), D = async (ie) => {
        await L.setDownloadedFile(N, j, A, O, F, ie), await b.done({
          ...A,
          downloadedFile: N
        });
        const we = l.join(q, "current.blockmap");
        return await (0, f.pathExists)(we) && await (0, f.copyFile)(we, l.join(L.cacheDir, "current.blockmap")), j == null ? [N] : [N, j];
      }, G = this._logger, V = await L.validateDownloadedPath(N, A, O, G);
      if (V != null)
        return N = V, await D(!1);
      const te = async () => (await L.clear().catch(() => {
      }), await (0, f.unlink)(N).catch(() => {
      })), de = await (0, s.createTempUpdateFile)(`temp-${F}`, q, G);
      try {
        await b.task(de, T, j, te), await (0, t.retry)(() => (0, f.rename)(de, N), {
          retries: 60,
          interval: 500,
          shouldRetry: (ie) => ie instanceof Error && /^EBUSY:/.test(ie.message) ? !0 : (G.warn(`Cannot rename temp file to final file: ${ie.message || ie.stack}`), !1)
        });
      } catch (ie) {
        throw await te(), ie instanceof t.CancellationError && (G.info("cancelled"), this.emit("update-cancelled", A)), ie;
      }
      return G.info(`New version ${v} has been downloaded to ${N}`), await D(!0);
    }
    async differentialDownloadInstaller(b, O, T, A, v) {
      try {
        if (this._testOnlyOptions != null && !this._testOnlyOptions.isUseDifferentialDownload)
          return !0;
        const $ = O.updateInfoAndProvider.provider, k = await $.getBlockMapFiles(b.url, this.app.version, O.updateInfoAndProvider.info.version, this.previousBlockmapBaseUrlOverride);
        this._logger.info(`Download block maps (old: "${k[0]}", new: ${k[1]})`);
        const L = async (G) => {
          const V = await this.httpExecutor.downloadToBuffer(G, {
            headers: O.requestHeaders,
            cancellationToken: O.cancellationToken
          });
          if (V == null || V.length === 0)
            throw new Error(`Blockmap "${G.href}" is empty`);
          try {
            return JSON.parse((0, g.gunzipSync)(V).toString());
          } catch (te) {
            throw new Error(`Cannot parse blockmap "${G.href}", error: ${te}`);
          }
        }, q = {
          newUrl: b.url,
          oldFile: l.join(this.downloadedUpdateHelper.cacheDir, v),
          logger: this._logger,
          newFile: T,
          isUseMultipleRangeRequest: $.isUseMultipleRangeRequest,
          requestHeaders: O.requestHeaders,
          cancellationToken: O.cancellationToken
        };
        this.listenerCount(m.DOWNLOAD_PROGRESS) > 0 && (q.onProgress = (G) => this.emit(m.DOWNLOAD_PROGRESS, G));
        const F = async (G, V) => {
          const te = l.join(V, "current.blockmap");
          await (0, f.outputFile)(te, (0, g.gzipSync)(JSON.stringify(G)));
        }, N = async (G) => {
          const V = l.join(G, "current.blockmap");
          try {
            if (await (0, f.pathExists)(V))
              return JSON.parse((0, g.gunzipSync)(await (0, f.readFile)(V)).toString());
          } catch (te) {
            this._logger.warn(`Cannot parse blockmap "${V}", error: ${te}`);
          }
          return null;
        }, j = await L(k[1]);
        await F(j, this.downloadedUpdateHelper.cacheDirForPendingUpdate);
        let D = await N(this.downloadedUpdateHelper.cacheDir);
        return D == null && (D = await L(k[0])), await new y.GenericDifferentialDownloader(b.info, this.httpExecutor, q).download(D, j), !1;
      } catch ($) {
        if (this._logger.error(`Cannot download differentially, fallback to full download: ${$.stack || $}`), this._testOnlyOptions != null)
          throw $;
        return !0;
      }
    }
  };
  At.AppUpdater = w;
  function S(I) {
    const b = (0, o.prerelease)(I);
    return b != null && b.length > 0;
  }
  class P {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    info(b) {
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    warn(b) {
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    error(b) {
    }
  }
  return At.NoOpLogger = P, At;
}
var pl;
function Kr() {
  if (pl) return jt;
  pl = 1, Object.defineProperty(jt, "__esModule", { value: !0 }), jt.BaseUpdater = void 0;
  const t = Br, d = ha();
  let h = class extends d.AppUpdater {
    constructor(f, u) {
      super(f, u), this.quitAndInstallCalled = !1, this.quitHandlerAdded = !1;
    }
    quitAndInstall(f = !1, u = !1) {
      this._logger.info("Install on explicit quitAndInstall"), this.install(f, f ? u : this.autoRunAppAfterInstall) ? setImmediate(() => {
        Ct.autoUpdater.emit("before-quit-for-update"), this.app.quit();
      }) : this.quitAndInstallCalled = !1;
    }
    executeDownload(f) {
      return super.executeDownload({
        ...f,
        done: (u) => (this.dispatchUpdateDownloaded(u), this.addQuitHandler(), Promise.resolve())
      });
    }
    get installerPath() {
      return this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.file;
    }
    // must be sync (because quit even handler is not async)
    install(f = !1, u = !1) {
      if (this.quitAndInstallCalled)
        return this._logger.warn("install call ignored: quitAndInstallCalled is set to true"), !1;
      const a = this.downloadedUpdateHelper, l = this.installerPath, o = a == null ? null : a.downloadedFileInfo;
      if (l == null || o == null)
        return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
      this.quitAndInstallCalled = !0;
      try {
        return this._logger.info(`Install: isSilent: ${f}, isForceRunAfter: ${u}`), this.doInstall({
          isSilent: f,
          isForceRunAfter: u,
          isAdminRightsRequired: o.isAdminRightsRequired
        });
      } catch (s) {
        return this.dispatchError(s), !1;
      }
    }
    addQuitHandler() {
      this.quitHandlerAdded || !this.autoInstallOnAppQuit || (this.quitHandlerAdded = !0, this.app.onQuit((f) => {
        if (this.quitAndInstallCalled) {
          this._logger.info("Update installer has already been triggered. Quitting application.");
          return;
        }
        if (!this.autoInstallOnAppQuit) {
          this._logger.info("Update will not be installed on quit because autoInstallOnAppQuit is set to false.");
          return;
        }
        if (f !== 0) {
          this._logger.info(`Update will be not installed on quit because application is quitting with exit code ${f}`);
          return;
        }
        this._logger.info("Auto install update on quit"), this.install(!0, !1);
      }));
    }
    spawnSyncLog(f, u = [], a = {}) {
      this._logger.info(`Executing: ${f} with args: ${u}`);
      const l = (0, t.spawnSync)(f, u, {
        env: { ...process.env, ...a },
        encoding: "utf-8",
        shell: !0
      }), { error: o, status: s, stdout: i, stderr: n } = l;
      if (o != null)
        throw this._logger.error(n), o;
      if (s != null && s !== 0)
        throw this._logger.error(n), new Error(`Command ${f} exited with code ${s}`);
      return i.trim();
    }
    /**
     * This handles both node 8 and node 10 way of emitting error when spawning a process
     *   - node 8: Throws the error
     *   - node 10: Emit the error(Need to listen with on)
     */
    // https://github.com/electron-userland/electron-builder/issues/1129
    // Node 8 sends errors: https://nodejs.org/dist/latest-v8.x/docs/api/errors.html#errors_common_system_errors
    async spawnLog(f, u = [], a = void 0, l = "ignore") {
      return this._logger.info(`Executing: ${f} with args: ${u}`), new Promise((o, s) => {
        try {
          const i = { stdio: l, env: a, detached: !0 }, n = (0, t.spawn)(f, u, i);
          n.on("error", (r) => {
            s(r);
          }), n.unref(), n.pid !== void 0 && o(!0);
        } catch (i) {
          s(i);
        }
      });
    }
  };
  return jt.BaseUpdater = h, jt;
}
var ir = {}, ar = {}, ml;
function mu() {
  if (ml) return ar;
  ml = 1, Object.defineProperty(ar, "__esModule", { value: !0 }), ar.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
  const t = /* @__PURE__ */ gt(), d = hu(), h = $l;
  let c = class extends d.DifferentialDownloader {
    async download() {
      const l = this.blockAwareFileInfo, o = l.size, s = o - (l.blockMapSize + 4);
      this.fileMetadataBuffer = await this.readRemoteBytes(s, o - 1);
      const i = f(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
      await this.doDownload(await u(this.options.oldFile), i);
    }
  };
  ar.FileWithEmbeddedBlockMapDifferentialDownloader = c;
  function f(a) {
    return JSON.parse((0, h.inflateRawSync)(a).toString());
  }
  async function u(a) {
    const l = await (0, t.open)(a, "r");
    try {
      const o = (await (0, t.fstat)(l)).size, s = Buffer.allocUnsafe(4);
      await (0, t.read)(l, s, 0, s.length, o - s.length);
      const i = Buffer.allocUnsafe(s.readUInt32BE(0));
      return await (0, t.read)(l, i, 0, i.length, o - s.length - i.length), await (0, t.close)(l), f(i);
    } catch (o) {
      throw await (0, t.close)(l), o;
    }
  }
  return ar;
}
var gl;
function vl() {
  if (gl) return ir;
  gl = 1, Object.defineProperty(ir, "__esModule", { value: !0 }), ir.AppImageUpdater = void 0;
  const t = xe(), d = Br, h = /* @__PURE__ */ gt(), c = rt, f = Ce, u = Kr(), a = mu(), l = Ye(), o = Ot();
  let s = class extends u.BaseUpdater {
    constructor(n, r) {
      super(n, r);
    }
    isUpdaterActive() {
      return process.env.APPIMAGE == null && !this.forceDevUpdateConfig ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
    }
    /*** @private */
    doDownloadUpdate(n) {
      const r = n.updateInfoAndProvider.provider, p = (0, l.findFile)(r.resolveFiles(n.updateInfoAndProvider.info), "AppImage", ["rpm", "deb", "pacman"]);
      return this.executeDownload({
        fileExtension: "AppImage",
        fileInfo: p,
        downloadUpdateOptions: n,
        task: async (g, y) => {
          const m = process.env.APPIMAGE;
          if (m == null)
            throw (0, t.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
          (n.disableDifferentialDownload || await this.downloadDifferential(p, m, g, r, n)) && await this.httpExecutor.download(p.url, g, y), await (0, h.chmod)(g, 493);
        }
      });
    }
    async downloadDifferential(n, r, p, g, y) {
      try {
        const m = {
          newUrl: n.url,
          oldFile: r,
          logger: this._logger,
          newFile: p,
          isUseMultipleRangeRequest: g.isUseMultipleRangeRequest,
          requestHeaders: y.requestHeaders,
          cancellationToken: y.cancellationToken
        };
        return this.listenerCount(o.DOWNLOAD_PROGRESS) > 0 && (m.onProgress = (w) => this.emit(o.DOWNLOAD_PROGRESS, w)), await new a.FileWithEmbeddedBlockMapDifferentialDownloader(n.info, this.httpExecutor, m).download(), !1;
      } catch (m) {
        return this._logger.error(`Cannot download differentially, fallback to full download: ${m.stack || m}`), process.platform === "linux";
      }
    }
    doInstall(n) {
      const r = process.env.APPIMAGE;
      if (r == null)
        throw (0, t.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
      (0, c.unlinkSync)(r);
      let p;
      const g = f.basename(r), y = this.installerPath;
      if (y == null)
        return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
      f.basename(y) === g || !/\d+\.\d+\.\d+/.test(g) ? p = r : p = f.join(f.dirname(r), f.basename(y)), (0, d.execFileSync)("mv", ["-f", y, p]), p !== r && this.emit("appimage-filename-updated", p);
      const m = {
        ...process.env,
        APPIMAGE_SILENT_INSTALL: "true"
      };
      return n.isForceRunAfter ? this.spawnLog(p, [], m) : (m.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, d.execFileSync)(p, [], { env: m })), !0;
    }
  };
  return ir.AppImageUpdater = s, ir;
}
var or = {}, sr = {}, El;
function pa() {
  if (El) return sr;
  El = 1, Object.defineProperty(sr, "__esModule", { value: !0 }), sr.LinuxUpdater = void 0;
  const t = Kr();
  let d = class extends t.BaseUpdater {
    constructor(c, f) {
      super(c, f);
    }
    /**
     * Returns true if the current process is running as root.
     */
    isRunningAsRoot() {
      var c;
      return ((c = process.getuid) === null || c === void 0 ? void 0 : c.call(process)) === 0;
    }
    /**
     * Sanitizies the installer path for using with command line tools.
     */
    get installerPath() {
      var c, f;
      return (f = (c = super.installerPath) === null || c === void 0 ? void 0 : c.replace(/\\/g, "\\\\").replace(/ /g, "\\ ")) !== null && f !== void 0 ? f : null;
    }
    runCommandWithSudoIfNeeded(c) {
      if (this.isRunningAsRoot())
        return this._logger.info("Running as root, no need to use sudo"), this.spawnSyncLog(c[0], c.slice(1));
      const { name: f } = this.app, u = `"${f} would like to update"`, a = this.sudoWithArgs(u);
      this._logger.info(`Running as non-root user, using sudo to install: ${a}`);
      let l = '"';
      return (/pkexec/i.test(a[0]) || a[0] === "sudo") && (l = ""), this.spawnSyncLog(a[0], [...a.length > 1 ? a.slice(1) : [], `${l}/bin/bash`, "-c", `'${c.join(" ")}'${l}`]);
    }
    sudoWithArgs(c) {
      const f = this.determineSudoCommand(), u = [f];
      return /kdesudo/i.test(f) ? (u.push("--comment", c), u.push("-c")) : /gksudo/i.test(f) ? u.push("--message", c) : /pkexec/i.test(f) && u.push("--disable-internal-agent"), u;
    }
    hasCommand(c) {
      try {
        return this.spawnSyncLog("command", ["-v", c]), !0;
      } catch {
        return !1;
      }
    }
    determineSudoCommand() {
      const c = ["gksudo", "kdesudo", "pkexec", "beesu"];
      for (const f of c)
        if (this.hasCommand(f))
          return f;
      return "sudo";
    }
    /**
     * Detects the package manager to use based on the available commands.
     * Allows overriding the default behavior by setting the ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER environment variable.
     * If the environment variable is set, it will be used directly. (This is useful for testing each package manager logic path.)
     * Otherwise, it checks for the presence of the specified package manager commands in the order provided.
     * @param pms - An array of package manager commands to check for, in priority order.
     * @returns The detected package manager command or "unknown" if none are found.
     */
    detectPackageManager(c) {
      var f;
      const u = (f = process.env.ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER) === null || f === void 0 ? void 0 : f.trim();
      if (u)
        return u;
      for (const a of c)
        if (this.hasCommand(a))
          return a;
      return this._logger.warn(`No package manager found in the list: ${c.join(", ")}. Defaulting to the first one: ${c[0]}`), c[0];
    }
  };
  return sr.LinuxUpdater = d, sr;
}
var yl;
function wl() {
  if (yl) return or;
  yl = 1, Object.defineProperty(or, "__esModule", { value: !0 }), or.DebUpdater = void 0;
  const t = Ye(), d = Ot(), h = pa();
  let c = class gu extends h.LinuxUpdater {
    constructor(u, a) {
      super(u, a);
    }
    /*** @private */
    doDownloadUpdate(u) {
      const a = u.updateInfoAndProvider.provider, l = (0, t.findFile)(a.resolveFiles(u.updateInfoAndProvider.info), "deb", ["AppImage", "rpm", "pacman"]);
      return this.executeDownload({
        fileExtension: "deb",
        fileInfo: l,
        downloadUpdateOptions: u,
        task: async (o, s) => {
          this.listenerCount(d.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (i) => this.emit(d.DOWNLOAD_PROGRESS, i)), await this.httpExecutor.download(l.url, o, s);
        }
      });
    }
    doInstall(u) {
      const a = this.installerPath;
      if (a == null)
        return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
      if (!this.hasCommand("dpkg") && !this.hasCommand("apt"))
        return this.dispatchError(new Error("Neither dpkg nor apt command found. Cannot install .deb package.")), !1;
      const l = ["dpkg", "apt"], o = this.detectPackageManager(l);
      try {
        gu.installWithCommandRunner(o, a, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
      } catch (s) {
        return this.dispatchError(s), !1;
      }
      return u.isForceRunAfter && this.app.relaunch(), !0;
    }
    static installWithCommandRunner(u, a, l, o) {
      var s;
      if (u === "dpkg")
        try {
          l(["dpkg", "-i", a]);
        } catch (i) {
          o.warn((s = i.message) !== null && s !== void 0 ? s : i), o.warn("dpkg installation failed, trying to fix broken dependencies with apt-get"), l(["apt-get", "install", "-f", "-y"]);
        }
      else if (u === "apt")
        o.warn("Using apt to install a local .deb. This may fail for unsigned packages unless properly configured."), l([
          "apt",
          "install",
          "-y",
          "--allow-unauthenticated",
          // needed for unsigned .debs
          "--allow-downgrades",
          // allow lower version installs
          "--allow-change-held-packages",
          a
        ]);
      else
        throw new Error(`Package manager ${u} not supported`);
    }
  };
  return or.DebUpdater = c, or;
}
var lr = {}, _l;
function Rl() {
  if (_l) return lr;
  _l = 1, Object.defineProperty(lr, "__esModule", { value: !0 }), lr.PacmanUpdater = void 0;
  const t = Ot(), d = Ye(), h = pa();
  let c = class vu extends h.LinuxUpdater {
    constructor(u, a) {
      super(u, a);
    }
    /*** @private */
    doDownloadUpdate(u) {
      const a = u.updateInfoAndProvider.provider, l = (0, d.findFile)(a.resolveFiles(u.updateInfoAndProvider.info), "pacman", ["AppImage", "deb", "rpm"]);
      return this.executeDownload({
        fileExtension: "pacman",
        fileInfo: l,
        downloadUpdateOptions: u,
        task: async (o, s) => {
          this.listenerCount(t.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (i) => this.emit(t.DOWNLOAD_PROGRESS, i)), await this.httpExecutor.download(l.url, o, s);
        }
      });
    }
    doInstall(u) {
      const a = this.installerPath;
      if (a == null)
        return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
      try {
        vu.installWithCommandRunner(a, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
      } catch (l) {
        return this.dispatchError(l), !1;
      }
      return u.isForceRunAfter && this.app.relaunch(), !0;
    }
    static installWithCommandRunner(u, a, l) {
      var o;
      try {
        a(["pacman", "-U", "--noconfirm", u]);
      } catch (s) {
        l.warn((o = s.message) !== null && o !== void 0 ? o : s), l.warn("pacman installation failed, attempting to update package database and retry");
        try {
          a(["pacman", "-Sy", "--noconfirm"]), a(["pacman", "-U", "--noconfirm", u]);
        } catch (i) {
          throw l.error("Retry after pacman -Sy failed"), i;
        }
      }
    }
  };
  return lr.PacmanUpdater = c, lr;
}
var ur = {}, Al;
function Sl() {
  if (Al) return ur;
  Al = 1, Object.defineProperty(ur, "__esModule", { value: !0 }), ur.RpmUpdater = void 0;
  const t = Ot(), d = Ye(), h = pa();
  let c = class Eu extends h.LinuxUpdater {
    constructor(u, a) {
      super(u, a);
    }
    /*** @private */
    doDownloadUpdate(u) {
      const a = u.updateInfoAndProvider.provider, l = (0, d.findFile)(a.resolveFiles(u.updateInfoAndProvider.info), "rpm", ["AppImage", "deb", "pacman"]);
      return this.executeDownload({
        fileExtension: "rpm",
        fileInfo: l,
        downloadUpdateOptions: u,
        task: async (o, s) => {
          this.listenerCount(t.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (i) => this.emit(t.DOWNLOAD_PROGRESS, i)), await this.httpExecutor.download(l.url, o, s);
        }
      });
    }
    doInstall(u) {
      const a = this.installerPath;
      if (a == null)
        return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
      const l = ["zypper", "dnf", "yum", "rpm"], o = this.detectPackageManager(l);
      try {
        Eu.installWithCommandRunner(o, a, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
      } catch (s) {
        return this.dispatchError(s), !1;
      }
      return u.isForceRunAfter && this.app.relaunch(), !0;
    }
    static installWithCommandRunner(u, a, l, o) {
      if (u === "zypper")
        return l(["zypper", "--non-interactive", "--no-refresh", "install", "--allow-unsigned-rpm", "-f", a]);
      if (u === "dnf")
        return l(["dnf", "install", "--nogpgcheck", "-y", a]);
      if (u === "yum")
        return l(["yum", "install", "--nogpgcheck", "-y", a]);
      if (u === "rpm")
        return o.warn("Installing with rpm only (no dependency resolution)."), l(["rpm", "-Uvh", "--replacepkgs", "--replacefiles", "--nodeps", a]);
      throw new Error(`Package manager ${u} not supported`);
    }
  };
  return ur.RpmUpdater = c, ur;
}
var cr = {}, Tl;
function Cl() {
  if (Tl) return cr;
  Tl = 1, Object.defineProperty(cr, "__esModule", { value: !0 }), cr.MacUpdater = void 0;
  const t = xe(), d = /* @__PURE__ */ gt(), h = rt, c = Ce, f = yc, u = ha(), a = Ye(), l = Br, o = vr;
  let s = class extends u.AppUpdater {
    constructor(n, r) {
      super(n, r), this.nativeUpdater = Ct.autoUpdater, this.squirrelDownloadedUpdate = !1, this.nativeUpdater.on("error", (p) => {
        this._logger.warn(p), this.emit("error", p);
      }), this.nativeUpdater.on("update-downloaded", () => {
        this.squirrelDownloadedUpdate = !0, this.debug("nativeUpdater.update-downloaded");
      });
    }
    debug(n) {
      this._logger.debug != null && this._logger.debug(n);
    }
    closeServerIfExists() {
      this.server && (this.debug("Closing proxy server"), this.server.close((n) => {
        n && this.debug("proxy server wasn't already open, probably attempted closing again as a safety check before quit");
      }));
    }
    async doDownloadUpdate(n) {
      let r = n.updateInfoAndProvider.provider.resolveFiles(n.updateInfoAndProvider.info);
      const p = this._logger, g = "sysctl.proc_translated";
      let y = !1;
      try {
        this.debug("Checking for macOS Rosetta environment"), y = (0, l.execFileSync)("sysctl", [g], { encoding: "utf8" }).includes(`${g}: 1`), p.info(`Checked for macOS Rosetta environment (isRosetta=${y})`);
      } catch (b) {
        p.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${b}`);
      }
      let m = !1;
      try {
        this.debug("Checking for arm64 in uname");
        const O = (0, l.execFileSync)("uname", ["-a"], { encoding: "utf8" }).includes("ARM");
        p.info(`Checked 'uname -a': arm64=${O}`), m = m || O;
      } catch (b) {
        p.warn(`uname shell command to check for arm64 failed: ${b}`);
      }
      m = m || process.arch === "arm64" || y;
      const w = (b) => {
        var O;
        return b.url.pathname.includes("arm64") || ((O = b.info.url) === null || O === void 0 ? void 0 : O.includes("arm64"));
      };
      m && r.some(w) ? r = r.filter((b) => m === w(b)) : r = r.filter((b) => !w(b));
      const S = (0, a.findFile)(r, "zip", ["pkg", "dmg"]);
      if (S == null)
        throw (0, t.newError)(`ZIP file not provided: ${(0, t.safeStringifyJson)(r)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
      const P = n.updateInfoAndProvider.provider, I = "update.zip";
      return this.executeDownload({
        fileExtension: "zip",
        fileInfo: S,
        downloadUpdateOptions: n,
        task: async (b, O) => {
          const T = c.join(this.downloadedUpdateHelper.cacheDir, I), A = () => (0, d.pathExistsSync)(T) ? !n.disableDifferentialDownload : (p.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1);
          let v = !0;
          A() && (v = await this.differentialDownloadInstaller(S, n, b, P, I)), v && await this.httpExecutor.download(S.url, b, O);
        },
        done: async (b) => {
          if (!n.disableDifferentialDownload)
            try {
              const O = c.join(this.downloadedUpdateHelper.cacheDir, I);
              await (0, d.copyFile)(b.downloadedFile, O);
            } catch (O) {
              this._logger.warn(`Unable to copy file for caching for future differential downloads: ${O.message}`);
            }
          return this.updateDownloaded(S, b);
        }
      });
    }
    async updateDownloaded(n, r) {
      var p;
      const g = r.downloadedFile, y = (p = n.info.size) !== null && p !== void 0 ? p : (await (0, d.stat)(g)).size, m = this._logger, w = `fileToProxy=${n.url.href}`;
      this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${w})`), this.server = (0, f.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${w})`), this.server.on("close", () => {
        m.info(`Proxy server for native Squirrel.Mac is closed (${w})`);
      });
      const S = (P) => {
        const I = P.address();
        return typeof I == "string" ? I : `http://127.0.0.1:${I == null ? void 0 : I.port}`;
      };
      return await new Promise((P, I) => {
        const b = (0, o.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), O = Buffer.from(`autoupdater:${b}`, "ascii"), T = `/${(0, o.randomBytes)(64).toString("hex")}.zip`;
        this.server.on("request", (A, v) => {
          const $ = A.url;
          if (m.info(`${$} requested`), $ === "/") {
            if (!A.headers.authorization || A.headers.authorization.indexOf("Basic ") === -1) {
              v.statusCode = 401, v.statusMessage = "Invalid Authentication Credentials", v.end(), m.warn("No authenthication info");
              return;
            }
            const q = A.headers.authorization.split(" ")[1], F = Buffer.from(q, "base64").toString("ascii"), [N, j] = F.split(":");
            if (N !== "autoupdater" || j !== b) {
              v.statusCode = 401, v.statusMessage = "Invalid Authentication Credentials", v.end(), m.warn("Invalid authenthication credentials");
              return;
            }
            const D = Buffer.from(`{ "url": "${S(this.server)}${T}" }`);
            v.writeHead(200, { "Content-Type": "application/json", "Content-Length": D.length }), v.end(D);
            return;
          }
          if (!$.startsWith(T)) {
            m.warn(`${$} requested, but not supported`), v.writeHead(404), v.end();
            return;
          }
          m.info(`${T} requested by Squirrel.Mac, pipe ${g}`);
          let k = !1;
          v.on("finish", () => {
            k || (this.nativeUpdater.removeListener("error", I), P([]));
          });
          const L = (0, h.createReadStream)(g);
          L.on("error", (q) => {
            try {
              v.end();
            } catch (F) {
              m.warn(`cannot end response: ${F}`);
            }
            k = !0, this.nativeUpdater.removeListener("error", I), I(new Error(`Cannot pipe "${g}": ${q}`));
          }), v.writeHead(200, {
            "Content-Type": "application/zip",
            "Content-Length": y
          }), L.pipe(v);
        }), this.debug(`Proxy server for native Squirrel.Mac is starting to listen (${w})`), this.server.listen(0, "127.0.0.1", () => {
          this.debug(`Proxy server for native Squirrel.Mac is listening (address=${S(this.server)}, ${w})`), this.nativeUpdater.setFeedURL({
            url: S(this.server),
            headers: {
              "Cache-Control": "no-cache",
              Authorization: `Basic ${O.toString("base64")}`
            }
          }), this.dispatchUpdateDownloaded(r), this.autoInstallOnAppQuit ? (this.nativeUpdater.once("error", I), this.nativeUpdater.checkForUpdates()) : P([]);
        });
      });
    }
    handleUpdateDownloaded() {
      this.autoRunAppAfterInstall ? this.nativeUpdater.quitAndInstall() : this.app.quit(), this.closeServerIfExists();
    }
    quitAndInstall() {
      this.squirrelDownloadedUpdate ? this.handleUpdateDownloaded() : (this.nativeUpdater.on("update-downloaded", () => this.handleUpdateDownloaded()), this.autoInstallOnAppQuit || this.nativeUpdater.checkForUpdates());
    }
  };
  return cr.MacUpdater = s, cr;
}
var fr = {}, Mr = {}, bl;
function Wf() {
  if (bl) return Mr;
  bl = 1, Object.defineProperty(Mr, "__esModule", { value: !0 }), Mr.verifySignature = u;
  const t = xe(), d = Br, h = Hr, c = Ce;
  function f(s, i) {
    return ['set "PSModulePath=" & chcp 65001 >NUL & powershell.exe', ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", s], {
      shell: !0,
      timeout: i
    }];
  }
  function u(s, i, n) {
    return new Promise((r, p) => {
      const g = i.replace(/'/g, "''");
      n.info(`Verifying signature ${g}`), (0, d.execFile)(...f(`"Get-AuthenticodeSignature -LiteralPath '${g}' | ConvertTo-Json -Compress"`, 20 * 1e3), (y, m, w) => {
        var S;
        try {
          if (y != null || w) {
            l(n, y, w, p), r(null);
            return;
          }
          const P = a(m);
          if (P.Status === 0) {
            try {
              const T = c.normalize(P.Path), A = c.normalize(i);
              if (n.info(`LiteralPath: ${T}. Update Path: ${A}`), T !== A) {
                l(n, new Error(`LiteralPath of ${T} is different than ${A}`), w, p), r(null);
                return;
              }
            } catch (T) {
              n.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${(S = T.message) !== null && S !== void 0 ? S : T.stack}`);
            }
            const b = (0, t.parseDn)(P.SignerCertificate.Subject);
            let O = !1;
            for (const T of s) {
              const A = (0, t.parseDn)(T);
              if (A.size ? O = Array.from(A.keys()).every(($) => A.get($) === b.get($)) : T === b.get("CN") && (n.warn(`Signature validated using only CN ${T}. Please add your full Distinguished Name (DN) to publisherNames configuration`), O = !0), O) {
                r(null);
                return;
              }
            }
          }
          const I = `publisherNames: ${s.join(" | ")}, raw info: ` + JSON.stringify(P, (b, O) => b === "RawData" ? void 0 : O, 2);
          n.warn(`Sign verification failed, installer signed with incorrect certificate: ${I}`), r(I);
        } catch (P) {
          l(n, P, null, p), r(null);
          return;
        }
      });
    });
  }
  function a(s) {
    const i = JSON.parse(s);
    delete i.PrivateKey, delete i.IsOSBinary, delete i.SignatureType;
    const n = i.SignerCertificate;
    return n != null && (delete n.Archived, delete n.Extensions, delete n.Handle, delete n.HasPrivateKey, delete n.SubjectName), i;
  }
  function l(s, i, n, r) {
    if (o()) {
      s.warn(`Cannot execute Get-AuthenticodeSignature: ${i || n}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
      return;
    }
    try {
      (0, d.execFileSync)(...f("ConvertTo-Json test", 10 * 1e3));
    } catch (p) {
      s.warn(`Cannot execute ConvertTo-Json: ${p.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
      return;
    }
    i != null && r(i), n && r(new Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${n}. Failing signature validation due to unknown stderr.`));
  }
  function o() {
    const s = h.release();
    return s.startsWith("6.") && !s.startsWith("6.3");
  }
  return Mr;
}
var Pl;
function Ol() {
  if (Pl) return fr;
  Pl = 1, Object.defineProperty(fr, "__esModule", { value: !0 }), fr.NsisUpdater = void 0;
  const t = xe(), d = Ce, h = Kr(), c = mu(), f = Ot(), u = Ye(), a = /* @__PURE__ */ gt(), l = Wf(), o = mt;
  let s = class extends h.BaseUpdater {
    constructor(n, r) {
      super(n, r), this._verifyUpdateCodeSignature = (p, g) => (0, l.verifySignature)(p, g, this._logger);
    }
    /**
     * The verifyUpdateCodeSignature. You can pass [win-verify-signature](https://github.com/beyondkmp/win-verify-trust) or another custom verify function: ` (publisherName: string[], path: string) => Promise<string | null>`.
     * The default verify function uses [windowsExecutableCodeSignatureVerifier](https://github.com/electron-userland/electron-builder/blob/master/packages/electron-updater/src/windowsExecutableCodeSignatureVerifier.ts)
     */
    get verifyUpdateCodeSignature() {
      return this._verifyUpdateCodeSignature;
    }
    set verifyUpdateCodeSignature(n) {
      n && (this._verifyUpdateCodeSignature = n);
    }
    /*** @private */
    doDownloadUpdate(n) {
      const r = n.updateInfoAndProvider.provider, p = (0, u.findFile)(r.resolveFiles(n.updateInfoAndProvider.info), "exe");
      return this.executeDownload({
        fileExtension: "exe",
        downloadUpdateOptions: n,
        fileInfo: p,
        task: async (g, y, m, w) => {
          const S = p.packageInfo, P = S != null && m != null;
          if (P && n.disableWebInstaller)
            throw (0, t.newError)(`Unable to download new version ${n.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
          !P && !n.disableWebInstaller && this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version."), (P || n.disableDifferentialDownload || await this.differentialDownloadInstaller(p, n, g, r, t.CURRENT_APP_INSTALLER_FILE_NAME)) && await this.httpExecutor.download(p.url, g, y);
          const I = await this.verifySignature(g);
          if (I != null)
            throw await w(), (0, t.newError)(`New version ${n.updateInfoAndProvider.info.version} is not signed by the application owner: ${I}`, "ERR_UPDATER_INVALID_SIGNATURE");
          if (P && await this.differentialDownloadWebPackage(n, S, m, r))
            try {
              await this.httpExecutor.download(new o.URL(S.path), m, {
                headers: n.requestHeaders,
                cancellationToken: n.cancellationToken,
                sha512: S.sha512
              });
            } catch (b) {
              try {
                await (0, a.unlink)(m);
              } catch {
              }
              throw b;
            }
        }
      });
    }
    // $certificateInfo = (Get-AuthenticodeSignature 'xxx\yyy.exe'
    // | where {$_.Status.Equals([System.Management.Automation.SignatureStatus]::Valid) -and $_.SignerCertificate.Subject.Contains("CN=siemens.com")})
    // | Out-String ; if ($certificateInfo) { exit 0 } else { exit 1 }
    async verifySignature(n) {
      let r;
      try {
        if (r = (await this.configOnDisk.value).publisherName, r == null)
          return null;
      } catch (p) {
        if (p.code === "ENOENT")
          return null;
        throw p;
      }
      return await this._verifyUpdateCodeSignature(Array.isArray(r) ? r : [r], n);
    }
    doInstall(n) {
      const r = this.installerPath;
      if (r == null)
        return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
      const p = ["--updated"];
      n.isSilent && p.push("/S"), n.isForceRunAfter && p.push("--force-run"), this.installDirectory && p.push(`/D=${this.installDirectory}`);
      const g = this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.packageFile;
      g != null && p.push(`--package-file=${g}`);
      const y = () => {
        this.spawnLog(d.join(process.resourcesPath, "elevate.exe"), [r].concat(p)).catch((m) => this.dispatchError(m));
      };
      return n.isAdminRightsRequired ? (this._logger.info("isAdminRightsRequired is set to true, run installer using elevate.exe"), y(), !0) : (this.spawnLog(r, p).catch((m) => {
        const w = m.code;
        this._logger.info(`Cannot run installer: error code: ${w}, error message: "${m.message}", will be executed again using elevate if EACCES, and will try to use electron.shell.openItem if ENOENT`), w === "UNKNOWN" || w === "EACCES" ? y() : w === "ENOENT" ? Ct.shell.openPath(r).catch((S) => this.dispatchError(S)) : this.dispatchError(m);
      }), !0);
    }
    async differentialDownloadWebPackage(n, r, p, g) {
      if (r.blockMapSize == null)
        return !0;
      try {
        const y = {
          newUrl: new o.URL(r.path),
          oldFile: d.join(this.downloadedUpdateHelper.cacheDir, t.CURRENT_APP_PACKAGE_FILE_NAME),
          logger: this._logger,
          newFile: p,
          requestHeaders: this.requestHeaders,
          isUseMultipleRangeRequest: g.isUseMultipleRangeRequest,
          cancellationToken: n.cancellationToken
        };
        this.listenerCount(f.DOWNLOAD_PROGRESS) > 0 && (y.onProgress = (m) => this.emit(f.DOWNLOAD_PROGRESS, m)), await new c.FileWithEmbeddedBlockMapDifferentialDownloader(r, this.httpExecutor, y).download();
      } catch (y) {
        return this._logger.error(`Cannot download differentially, fallback to full download: ${y.stack || y}`), process.platform === "win32";
      }
      return !1;
    }
  };
  return fr.NsisUpdater = s, fr;
}
var Il;
function Vf() {
  return Il || (Il = 1, function(t) {
    var d = Rt && Rt.__createBinding || (Object.create ? function(m, w, S, P) {
      P === void 0 && (P = S);
      var I = Object.getOwnPropertyDescriptor(w, S);
      (!I || ("get" in I ? !w.__esModule : I.writable || I.configurable)) && (I = { enumerable: !0, get: function() {
        return w[S];
      } }), Object.defineProperty(m, P, I);
    } : function(m, w, S, P) {
      P === void 0 && (P = S), m[P] = w[S];
    }), h = Rt && Rt.__exportStar || function(m, w) {
      for (var S in m) S !== "default" && !Object.prototype.hasOwnProperty.call(w, S) && d(w, m, S);
    };
    Object.defineProperty(t, "__esModule", { value: !0 }), t.NsisUpdater = t.MacUpdater = t.RpmUpdater = t.PacmanUpdater = t.DebUpdater = t.AppImageUpdater = t.Provider = t.NoOpLogger = t.AppUpdater = t.BaseUpdater = void 0;
    const c = /* @__PURE__ */ gt(), f = Ce;
    var u = Kr();
    Object.defineProperty(t, "BaseUpdater", { enumerable: !0, get: function() {
      return u.BaseUpdater;
    } });
    var a = ha();
    Object.defineProperty(t, "AppUpdater", { enumerable: !0, get: function() {
      return a.AppUpdater;
    } }), Object.defineProperty(t, "NoOpLogger", { enumerable: !0, get: function() {
      return a.NoOpLogger;
    } });
    var l = Ye();
    Object.defineProperty(t, "Provider", { enumerable: !0, get: function() {
      return l.Provider;
    } });
    var o = vl();
    Object.defineProperty(t, "AppImageUpdater", { enumerable: !0, get: function() {
      return o.AppImageUpdater;
    } });
    var s = wl();
    Object.defineProperty(t, "DebUpdater", { enumerable: !0, get: function() {
      return s.DebUpdater;
    } });
    var i = Rl();
    Object.defineProperty(t, "PacmanUpdater", { enumerable: !0, get: function() {
      return i.PacmanUpdater;
    } });
    var n = Sl();
    Object.defineProperty(t, "RpmUpdater", { enumerable: !0, get: function() {
      return n.RpmUpdater;
    } });
    var r = Cl();
    Object.defineProperty(t, "MacUpdater", { enumerable: !0, get: function() {
      return r.MacUpdater;
    } });
    var p = Ol();
    Object.defineProperty(t, "NsisUpdater", { enumerable: !0, get: function() {
      return p.NsisUpdater;
    } }), h(Ot(), t);
    let g;
    function y() {
      if (process.platform === "win32")
        g = new (Ol()).NsisUpdater();
      else if (process.platform === "darwin")
        g = new (Cl()).MacUpdater();
      else {
        g = new (vl()).AppImageUpdater();
        try {
          const m = f.join(process.resourcesPath, "package-type");
          if (!(0, c.existsSync)(m))
            return g;
          console.info("Checking for beta autoupdate feature for deb/rpm distributions");
          const w = (0, c.readFileSync)(m).toString().trim();
          switch (console.info("Found package-type:", w), w) {
            case "deb":
              g = new (wl()).DebUpdater();
              break;
            case "rpm":
              g = new (Sl()).RpmUpdater();
              break;
            case "pacman":
              g = new (Rl()).PacmanUpdater();
              break;
            default:
              break;
          }
        } catch (m) {
          console.warn("Unable to detect 'package-type' for autoUpdater (rpm/deb/pacman support). If you'd like to expand support, please consider contributing to electron-builder", m.message);
        }
      }
      return g;
    }
    Object.defineProperty(t, "autoUpdater", {
      enumerable: !0,
      get: () => g || y()
    });
  }(Rt)), Rt;
}
var _r = Vf();
const Yf = vc(import.meta.url), hr = Ce.dirname(Yf), zf = Ce.join(We.getPath("userData"), "app.log"), yu = rt.createWriteStream(zf, { flags: "a" }), ma = (t) => {
  const h = `[${(/* @__PURE__ */ new Date()).toISOString()}] ${t.toString().trim()}
`;
  yu.write(h), process.stdout.write(h);
}, Xf = (t) => {
  const h = `[${(/* @__PURE__ */ new Date()).toISOString()}] ERROR: ${t.toString().trim()}
`;
  yu.write(h), process.stderr.write(h);
};
console.log = ma;
console.error = Xf;
let pt = null, pr = null;
function Dl() {
  const t = new Fl({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: Ce.join(hr, "preload.js"),
      contextIsolation: !0,
      nodeIntegration: !1
    },
    autoHideMenuBar: !0,
    icon: We.isPackaged ? Ce.join(hr, "../dist/icon.png") : Ce.join(hr, "../public/icon.png")
  });
  t.maximize();
  const d = "http://localhost:5173/", h = Ce.join(hr, "../dist/index.html");
  We.isPackaged ? t.loadFile(h) : t.loadURL(d);
}
Nl.handle("get-backend-port", () => pr);
Nl.on("console-log", (t, d) => {
  console.log(`[Renderer] ${d}`);
});
const Kf = () => new Promise((t, d) => {
  let h, c, f;
  if (We.isPackaged) {
    const l = process.platform === "win32" ? "sAIve-backend.exe" : "sAIve-backend";
    if (h = Ce.join(process.resourcesPath, "backend", l), c = [], f = Ce.join(process.resourcesPath, "backend"), !rt.existsSync(h)) {
      const o = `Backend binary not found at: ${h}`;
      console.error(o), mr.showErrorBox("Backend Error", o), d(new Error(o));
      return;
    }
  } else
    h = "python", c = ["main.py"], f = Ce.join(hr, "..", "..", "Server");
  console.log(`Starting backend: ${h} ${c.join(" ")} in ${f}`);
  const u = { ...process.env };
  We.isPackaged && (u.SAIVE_USER_DATA = We.getPath("userData")), pt = gc(h, c, {
    cwd: f,
    stdio: "pipe",
    env: u
  });
  let a = !1;
  pt.stdout.on("data", (l) => {
    const o = l.toString();
    if (console.log(`Backend: ${o}`), !a) {
      const s = o.match(/PORT:(\d+)/);
      s && (pr = parseInt(s[1], 10), a = !0, console.log(`Backend port discovered: ${pr}`), t(pr));
    }
  }), pt.stderr.on("data", (l) => {
    console.error(`Backend: ${l}`);
  }), pt.on("error", (l) => {
    console.error(`Failed to start backend process: ${l}`), mr.showErrorBox("Backend Error", `Failed to start backend process: ${l.message}`), d(l);
  }), pt.on("close", (l) => {
    l !== 0 && console.error(`Backend process exited with code ${l}`), a || d(new Error(`Backend exited with code ${l} before reporting a port.`));
  }), setTimeout(() => {
    a || (console.error("Backend did not report a port within 30 seconds."), d(new Error("Backend startup timeout.")));
  }, 3e4);
}), Jf = (t) => {
  const d = pc.request({
    method: "GET",
    protocol: "http:",
    hostname: "127.0.0.1",
    port: pr,
    path: "/"
  });
  d.on("response", (h) => {
    t(h.statusCode === 200);
  }), d.on("error", () => {
    t(!1);
  }), d.end();
}, Qf = (t) => {
  let d = 0;
  const h = 30, c = 1e3, f = () => {
    Jf((u) => {
      if (u)
        console.log("Backend is ready. Proceeding to create window."), t();
      else if (d++, d < h)
        console.log(`Backend not ready, retrying in ${c / 1e3}s... (attempt ${d})`), setTimeout(f, c);
      else {
        const a = "Backend did not start within the expected time.";
        console.error(a), mr.showErrorBox("Backend Startup Error", a), We.quit();
      }
    });
  };
  f();
};
We.whenReady().then(async () => {
  console.log("App is ready. Starting backend...");
  try {
    await Kf(), Qf(() => {
      Dl();
    });
  } catch (t) {
    console.error(`Fatal: ${t.message}`), mr.showErrorBox("Backend Startup Error", t.message), We.quit();
  }
  We.on("activate", function() {
    Fl.getAllWindows().length === 0 && Dl();
  }), setTimeout(() => {
    _r.autoUpdater.checkForUpdates();
  }, 3e3);
});
_r.autoUpdater.autoDownload = !1;
_r.autoUpdater.allowPrerelease = !0;
_r.autoUpdater.on("update-available", (t) => {
  ma(`Update available: ${t.version}`), mr.showMessageBox({
    type: "info",
    title: "Update Available",
    message: `A new version (${t.version}) of sAIve is available.`,
    detail: 'Click "Download" to view the release on GitHub.',
    buttons: ["Download", "Later"],
    defaultId: 0,
    cancelId: 1
  }).then(({ response: d }) => {
    d === 0 && hc.openExternal("https://github.com/DIIZZYFPS/sAIve/releases/latest");
  });
});
_r.autoUpdater.on("error", (t) => {
  ma(`Updater error: ${t}`);
});
We.on("will-quit", () => {
  pt && (console.log("Killing backend process..."), pt.kill(), pt = null);
});
We.on("window-all-closed", () => {
  process.platform !== "darwin" && We.quit();
});

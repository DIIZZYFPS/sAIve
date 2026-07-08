import Ct, { app as Ve, ipcMain as eo, dialog as qt, BrowserWindow as Ll, shell as gc, net as Ec } from "electron";
import je from "fs";
import yc from "constants";
import Er from "stream";
import to from "util";
import Ul from "assert";
import _e from "path";
import jr, { spawn as wc } from "child_process";
import $l from "events";
import yr from "crypto";
import kl from "tty";
import Hr from "os";
import mt, { fileURLToPath as vc } from "url";
import ql from "zlib";
import _c from "http";
var Ze = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, Rt = {}, en = {}, Or = {}, Io;
function We() {
  return Io || (Io = 1, Or.fromCallback = function(r) {
    return Object.defineProperty(function(...c) {
      if (typeof c[c.length - 1] == "function") r.apply(this, c);
      else
        return new Promise((p, d) => {
          c.push((f, u) => f != null ? d(f) : p(u)), r.apply(this, c);
        });
    }, "name", { value: r.name });
  }, Or.fromPromise = function(r) {
    return Object.defineProperty(function(...c) {
      const p = c[c.length - 1];
      if (typeof p != "function") return r.apply(this, c);
      c.pop(), r.apply(this, c).then((d) => p(null, d), p);
    }, "name", { value: r.name });
  }), Or;
}
var tn, Do;
function Ac() {
  if (Do) return tn;
  Do = 1;
  var r = yc, c = process.cwd, p = null, d = process.env.GRACEFUL_FS_PLATFORM || process.platform;
  process.cwd = function() {
    return p || (p = c.call(process)), p;
  };
  try {
    process.cwd();
  } catch {
  }
  if (typeof process.chdir == "function") {
    var f = process.chdir;
    process.chdir = function(o) {
      p = null, f.call(process, o);
    }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, f);
  }
  tn = u;
  function u(o) {
    r.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && a(o), o.lutimes || l(o), o.chown = t(o.chown), o.fchown = t(o.fchown), o.lchown = t(o.lchown), o.chmod = i(o.chmod), o.fchmod = i(o.fchmod), o.lchmod = i(o.lchmod), o.chownSync = s(o.chownSync), o.fchownSync = s(o.fchownSync), o.lchownSync = s(o.lchownSync), o.chmodSync = n(o.chmodSync), o.fchmodSync = n(o.fchmodSync), o.lchmodSync = n(o.lchmodSync), o.stat = h(o.stat), o.fstat = h(o.fstat), o.lstat = h(o.lstat), o.statSync = g(o.statSync), o.fstatSync = g(o.fstatSync), o.lstatSync = g(o.lstatSync), o.chmod && !o.lchmod && (o.lchmod = function(m, _, R) {
      R && process.nextTick(R);
    }, o.lchmodSync = function() {
    }), o.chown && !o.lchown && (o.lchown = function(m, _, R, b) {
      b && process.nextTick(b);
    }, o.lchownSync = function() {
    }), d === "win32" && (o.rename = typeof o.rename != "function" ? o.rename : (function(m) {
      function _(R, b, D) {
        var C = Date.now(), F = 0;
        m(R, b, function I(x) {
          if (x && (x.code === "EACCES" || x.code === "EPERM" || x.code === "EBUSY") && Date.now() - C < 6e4) {
            setTimeout(function() {
              o.stat(b, function(B, S) {
                B && B.code === "ENOENT" ? m(R, b, I) : D(x);
              });
            }, F), F < 100 && (F += 10);
            return;
          }
          D && D(x);
        });
      }
      return Object.setPrototypeOf && Object.setPrototypeOf(_, m), _;
    })(o.rename)), o.read = typeof o.read != "function" ? o.read : (function(m) {
      function _(R, b, D, C, F, I) {
        var x;
        if (I && typeof I == "function") {
          var B = 0;
          x = function(S, Y, H) {
            if (S && S.code === "EAGAIN" && B < 10)
              return B++, m.call(o, R, b, D, C, F, x);
            I.apply(this, arguments);
          };
        }
        return m.call(o, R, b, D, C, F, x);
      }
      return Object.setPrototypeOf && Object.setPrototypeOf(_, m), _;
    })(o.read), o.readSync = typeof o.readSync != "function" ? o.readSync : /* @__PURE__ */ (function(m) {
      return function(_, R, b, D, C) {
        for (var F = 0; ; )
          try {
            return m.call(o, _, R, b, D, C);
          } catch (I) {
            if (I.code === "EAGAIN" && F < 10) {
              F++;
              continue;
            }
            throw I;
          }
      };
    })(o.readSync);
    function a(m) {
      m.lchmod = function(_, R, b) {
        m.open(
          _,
          r.O_WRONLY | r.O_SYMLINK,
          R,
          function(D, C) {
            if (D) {
              b && b(D);
              return;
            }
            m.fchmod(C, R, function(F) {
              m.close(C, function(I) {
                b && b(F || I);
              });
            });
          }
        );
      }, m.lchmodSync = function(_, R) {
        var b = m.openSync(_, r.O_WRONLY | r.O_SYMLINK, R), D = !0, C;
        try {
          C = m.fchmodSync(b, R), D = !1;
        } finally {
          if (D)
            try {
              m.closeSync(b);
            } catch {
            }
          else
            m.closeSync(b);
        }
        return C;
      };
    }
    function l(m) {
      r.hasOwnProperty("O_SYMLINK") && m.futimes ? (m.lutimes = function(_, R, b, D) {
        m.open(_, r.O_SYMLINK, function(C, F) {
          if (C) {
            D && D(C);
            return;
          }
          m.futimes(F, R, b, function(I) {
            m.close(F, function(x) {
              D && D(I || x);
            });
          });
        });
      }, m.lutimesSync = function(_, R, b) {
        var D = m.openSync(_, r.O_SYMLINK), C, F = !0;
        try {
          C = m.futimesSync(D, R, b), F = !1;
        } finally {
          if (F)
            try {
              m.closeSync(D);
            } catch {
            }
          else
            m.closeSync(D);
        }
        return C;
      }) : m.futimes && (m.lutimes = function(_, R, b, D) {
        D && process.nextTick(D);
      }, m.lutimesSync = function() {
      });
    }
    function i(m) {
      return m && function(_, R, b) {
        return m.call(o, _, R, function(D) {
          y(D) && (D = null), b && b.apply(this, arguments);
        });
      };
    }
    function n(m) {
      return m && function(_, R) {
        try {
          return m.call(o, _, R);
        } catch (b) {
          if (!y(b)) throw b;
        }
      };
    }
    function t(m) {
      return m && function(_, R, b, D) {
        return m.call(o, _, R, b, function(C) {
          y(C) && (C = null), D && D.apply(this, arguments);
        });
      };
    }
    function s(m) {
      return m && function(_, R, b) {
        try {
          return m.call(o, _, R, b);
        } catch (D) {
          if (!y(D)) throw D;
        }
      };
    }
    function h(m) {
      return m && function(_, R, b) {
        typeof R == "function" && (b = R, R = null);
        function D(C, F) {
          F && (F.uid < 0 && (F.uid += 4294967296), F.gid < 0 && (F.gid += 4294967296)), b && b.apply(this, arguments);
        }
        return R ? m.call(o, _, R, D) : m.call(o, _, D);
      };
    }
    function g(m) {
      return m && function(_, R) {
        var b = R ? m.call(o, _, R) : m.call(o, _);
        return b && (b.uid < 0 && (b.uid += 4294967296), b.gid < 0 && (b.gid += 4294967296)), b;
      };
    }
    function y(m) {
      if (!m || m.code === "ENOSYS")
        return !0;
      var _ = !process.getuid || process.getuid() !== 0;
      return !!(_ && (m.code === "EINVAL" || m.code === "EPERM"));
    }
  }
  return tn;
}
var rn, No;
function Rc() {
  if (No) return rn;
  No = 1;
  var r = Er.Stream;
  rn = c;
  function c(p) {
    return {
      ReadStream: d,
      WriteStream: f
    };
    function d(u, o) {
      if (!(this instanceof d)) return new d(u, o);
      r.call(this);
      var a = this;
      this.path = u, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", this.mode = 438, this.bufferSize = 64 * 1024, o = o || {};
      for (var l = Object.keys(o), i = 0, n = l.length; i < n; i++) {
        var t = l[i];
        this[t] = o[t];
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
          a._read();
        });
        return;
      }
      p.open(this.path, this.flags, this.mode, function(s, h) {
        if (s) {
          a.emit("error", s), a.readable = !1;
          return;
        }
        a.fd = h, a.emit("open", h), a._read();
      });
    }
    function f(u, o) {
      if (!(this instanceof f)) return new f(u, o);
      r.call(this), this.path = u, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, o = o || {};
      for (var a = Object.keys(o), l = 0, i = a.length; l < i; l++) {
        var n = a[l];
        this[n] = o[n];
      }
      if (this.start !== void 0) {
        if (typeof this.start != "number")
          throw TypeError("start must be a Number");
        if (this.start < 0)
          throw new Error("start must be >= zero");
        this.pos = this.start;
      }
      this.busy = !1, this._queue = [], this.fd === null && (this._open = p.open, this._queue.push([this._open, this.path, this.flags, this.mode, void 0]), this.flush());
    }
  }
  return rn;
}
var nn, Fo;
function Tc() {
  if (Fo) return nn;
  Fo = 1, nn = c;
  var r = Object.getPrototypeOf || function(p) {
    return p.__proto__;
  };
  function c(p) {
    if (p === null || typeof p != "object")
      return p;
    if (p instanceof Object)
      var d = { __proto__: r(p) };
    else
      var d = /* @__PURE__ */ Object.create(null);
    return Object.getOwnPropertyNames(p).forEach(function(f) {
      Object.defineProperty(d, f, Object.getOwnPropertyDescriptor(p, f));
    }), d;
  }
  return nn;
}
var Ir, xo;
function He() {
  if (xo) return Ir;
  xo = 1;
  var r = je, c = Ac(), p = Rc(), d = Tc(), f = to, u, o;
  typeof Symbol == "function" && typeof Symbol.for == "function" ? (u = Symbol.for("graceful-fs.queue"), o = Symbol.for("graceful-fs.previous")) : (u = "___graceful-fs.queue", o = "___graceful-fs.previous");
  function a() {
  }
  function l(m, _) {
    Object.defineProperty(m, u, {
      get: function() {
        return _;
      }
    });
  }
  var i = a;
  if (f.debuglog ? i = f.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (i = function() {
    var m = f.format.apply(f, arguments);
    m = "GFS4: " + m.split(/\n/).join(`
GFS4: `), console.error(m);
  }), !r[u]) {
    var n = Ze[u] || [];
    l(r, n), r.close = (function(m) {
      function _(R, b) {
        return m.call(r, R, function(D) {
          D || g(), typeof b == "function" && b.apply(this, arguments);
        });
      }
      return Object.defineProperty(_, o, {
        value: m
      }), _;
    })(r.close), r.closeSync = (function(m) {
      function _(R) {
        m.apply(r, arguments), g();
      }
      return Object.defineProperty(_, o, {
        value: m
      }), _;
    })(r.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
      i(r[u]), Ul.equal(r[u].length, 0);
    });
  }
  Ze[u] || l(Ze, r[u]), Ir = t(d(r)), process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !r.__patched && (Ir = t(r), r.__patched = !0);
  function t(m) {
    c(m), m.gracefulify = t, m.createReadStream = oe, m.createWriteStream = Z;
    var _ = m.readFile;
    m.readFile = R;
    function R(K, ue, he) {
      return typeof ue == "function" && (he = ue, ue = null), me(K, ue, he);
      function me(pe, Ae, we, w) {
        return _(pe, Ae, function(E) {
          E && (E.code === "EMFILE" || E.code === "ENFILE") ? s([me, [pe, Ae, we], E, w || Date.now(), Date.now()]) : typeof we == "function" && we.apply(this, arguments);
        });
      }
    }
    var b = m.writeFile;
    m.writeFile = D;
    function D(K, ue, he, me) {
      return typeof he == "function" && (me = he, he = null), pe(K, ue, he, me);
      function pe(Ae, we, w, E, q) {
        return b(Ae, we, w, function(N) {
          N && (N.code === "EMFILE" || N.code === "ENFILE") ? s([pe, [Ae, we, w, E], N, q || Date.now(), Date.now()]) : typeof E == "function" && E.apply(this, arguments);
        });
      }
    }
    var C = m.appendFile;
    C && (m.appendFile = F);
    function F(K, ue, he, me) {
      return typeof he == "function" && (me = he, he = null), pe(K, ue, he, me);
      function pe(Ae, we, w, E, q) {
        return C(Ae, we, w, function(N) {
          N && (N.code === "EMFILE" || N.code === "ENFILE") ? s([pe, [Ae, we, w, E], N, q || Date.now(), Date.now()]) : typeof E == "function" && E.apply(this, arguments);
        });
      }
    }
    var I = m.copyFile;
    I && (m.copyFile = x);
    function x(K, ue, he, me) {
      return typeof he == "function" && (me = he, he = 0), pe(K, ue, he, me);
      function pe(Ae, we, w, E, q) {
        return I(Ae, we, w, function(N) {
          N && (N.code === "EMFILE" || N.code === "ENFILE") ? s([pe, [Ae, we, w, E], N, q || Date.now(), Date.now()]) : typeof E == "function" && E.apply(this, arguments);
        });
      }
    }
    var B = m.readdir;
    m.readdir = Y;
    var S = /^v[0-5]\./;
    function Y(K, ue, he) {
      typeof ue == "function" && (he = ue, ue = null);
      var me = S.test(process.version) ? function(we, w, E, q) {
        return B(we, pe(
          we,
          w,
          E,
          q
        ));
      } : function(we, w, E, q) {
        return B(we, w, pe(
          we,
          w,
          E,
          q
        ));
      };
      return me(K, ue, he);
      function pe(Ae, we, w, E) {
        return function(q, N) {
          q && (q.code === "EMFILE" || q.code === "ENFILE") ? s([
            me,
            [Ae, we, w],
            q,
            E || Date.now(),
            Date.now()
          ]) : (N && N.sort && N.sort(), typeof w == "function" && w.call(this, q, N));
        };
      }
    }
    if (process.version.substr(0, 4) === "v0.8") {
      var H = p(m);
      O = H.ReadStream, j = H.WriteStream;
    }
    var V = m.ReadStream;
    V && (O.prototype = Object.create(V.prototype), O.prototype.open = $);
    var L = m.WriteStream;
    L && (j.prototype = Object.create(L.prototype), j.prototype.open = X), Object.defineProperty(m, "ReadStream", {
      get: function() {
        return O;
      },
      set: function(K) {
        O = K;
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(m, "WriteStream", {
      get: function() {
        return j;
      },
      set: function(K) {
        j = K;
      },
      enumerable: !0,
      configurable: !0
    });
    var P = O;
    Object.defineProperty(m, "FileReadStream", {
      get: function() {
        return P;
      },
      set: function(K) {
        P = K;
      },
      enumerable: !0,
      configurable: !0
    });
    var A = j;
    Object.defineProperty(m, "FileWriteStream", {
      get: function() {
        return A;
      },
      set: function(K) {
        A = K;
      },
      enumerable: !0,
      configurable: !0
    });
    function O(K, ue) {
      return this instanceof O ? (V.apply(this, arguments), this) : O.apply(Object.create(O.prototype), arguments);
    }
    function $() {
      var K = this;
      Ee(K.path, K.flags, K.mode, function(ue, he) {
        ue ? (K.autoClose && K.destroy(), K.emit("error", ue)) : (K.fd = he, K.emit("open", he), K.read());
      });
    }
    function j(K, ue) {
      return this instanceof j ? (L.apply(this, arguments), this) : j.apply(Object.create(j.prototype), arguments);
    }
    function X() {
      var K = this;
      Ee(K.path, K.flags, K.mode, function(ue, he) {
        ue ? (K.destroy(), K.emit("error", ue)) : (K.fd = he, K.emit("open", he));
      });
    }
    function oe(K, ue) {
      return new m.ReadStream(K, ue);
    }
    function Z(K, ue) {
      return new m.WriteStream(K, ue);
    }
    var de = m.open;
    m.open = Ee;
    function Ee(K, ue, he, me) {
      return typeof he == "function" && (me = he, he = null), pe(K, ue, he, me);
      function pe(Ae, we, w, E, q) {
        return de(Ae, we, w, function(N, ve) {
          N && (N.code === "EMFILE" || N.code === "ENFILE") ? s([pe, [Ae, we, w, E], N, q || Date.now(), Date.now()]) : typeof E == "function" && E.apply(this, arguments);
        });
      }
    }
    return m;
  }
  function s(m) {
    i("ENQUEUE", m[0].name, m[1]), r[u].push(m), y();
  }
  var h;
  function g() {
    for (var m = Date.now(), _ = 0; _ < r[u].length; ++_)
      r[u][_].length > 2 && (r[u][_][3] = m, r[u][_][4] = m);
    y();
  }
  function y() {
    if (clearTimeout(h), h = void 0, r[u].length !== 0) {
      var m = r[u].shift(), _ = m[0], R = m[1], b = m[2], D = m[3], C = m[4];
      if (D === void 0)
        i("RETRY", _.name, R), _.apply(null, R);
      else if (Date.now() - D >= 6e4) {
        i("TIMEOUT", _.name, R);
        var F = R.pop();
        typeof F == "function" && F.call(null, b);
      } else {
        var I = Date.now() - C, x = Math.max(C - D, 1), B = Math.min(x * 1.2, 100);
        I >= B ? (i("RETRY", _.name, R), _.apply(null, R.concat([D]))) : r[u].push(m);
      }
      h === void 0 && (h = setTimeout(y, 0));
    }
  }
  return Ir;
}
var Lo;
function Mt() {
  return Lo || (Lo = 1, (function(r) {
    const c = We().fromCallback, p = He(), d = [
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
    ].filter((f) => typeof p[f] == "function");
    Object.assign(r, p), d.forEach((f) => {
      r[f] = c(p[f]);
    }), r.exists = function(f, u) {
      return typeof u == "function" ? p.exists(f, u) : new Promise((o) => p.exists(f, o));
    }, r.read = function(f, u, o, a, l, i) {
      return typeof i == "function" ? p.read(f, u, o, a, l, i) : new Promise((n, t) => {
        p.read(f, u, o, a, l, (s, h, g) => {
          if (s) return t(s);
          n({ bytesRead: h, buffer: g });
        });
      });
    }, r.write = function(f, u, ...o) {
      return typeof o[o.length - 1] == "function" ? p.write(f, u, ...o) : new Promise((a, l) => {
        p.write(f, u, ...o, (i, n, t) => {
          if (i) return l(i);
          a({ bytesWritten: n, buffer: t });
        });
      });
    }, typeof p.writev == "function" && (r.writev = function(f, u, ...o) {
      return typeof o[o.length - 1] == "function" ? p.writev(f, u, ...o) : new Promise((a, l) => {
        p.writev(f, u, ...o, (i, n, t) => {
          if (i) return l(i);
          a({ bytesWritten: n, buffers: t });
        });
      });
    }), typeof p.realpath.native == "function" ? r.realpath.native = c(p.realpath.native) : process.emitWarning(
      "fs.realpath.native is not a function. Is fs being monkey-patched?",
      "Warning",
      "fs-extra-WARN0003"
    );
  })(en)), en;
}
var Dr = {}, on = {}, Uo;
function Sc() {
  if (Uo) return on;
  Uo = 1;
  const r = _e;
  return on.checkPath = function(p) {
    if (process.platform === "win32" && /[<>:"|?*]/.test(p.replace(r.parse(p).root, ""))) {
      const f = new Error(`Path contains invalid characters: ${p}`);
      throw f.code = "EINVAL", f;
    }
  }, on;
}
var $o;
function bc() {
  if ($o) return Dr;
  $o = 1;
  const r = /* @__PURE__ */ Mt(), { checkPath: c } = /* @__PURE__ */ Sc(), p = (d) => {
    const f = { mode: 511 };
    return typeof d == "number" ? d : { ...f, ...d }.mode;
  };
  return Dr.makeDir = async (d, f) => (c(d), r.mkdir(d, {
    mode: p(f),
    recursive: !0
  })), Dr.makeDirSync = (d, f) => (c(d), r.mkdirSync(d, {
    mode: p(f),
    recursive: !0
  })), Dr;
}
var sn, ko;
function nt() {
  if (ko) return sn;
  ko = 1;
  const r = We().fromPromise, { makeDir: c, makeDirSync: p } = /* @__PURE__ */ bc(), d = r(c);
  return sn = {
    mkdirs: d,
    mkdirsSync: p,
    // alias
    mkdirp: d,
    mkdirpSync: p,
    ensureDir: d,
    ensureDirSync: p
  }, sn;
}
var an, qo;
function Pt() {
  if (qo) return an;
  qo = 1;
  const r = We().fromPromise, c = /* @__PURE__ */ Mt();
  function p(d) {
    return c.access(d).then(() => !0).catch(() => !1);
  }
  return an = {
    pathExists: r(p),
    pathExistsSync: c.existsSync
  }, an;
}
var ln, Mo;
function Ml() {
  if (Mo) return ln;
  Mo = 1;
  const r = He();
  function c(d, f, u, o) {
    r.open(d, "r+", (a, l) => {
      if (a) return o(a);
      r.futimes(l, f, u, (i) => {
        r.close(l, (n) => {
          o && o(i || n);
        });
      });
    });
  }
  function p(d, f, u) {
    const o = r.openSync(d, "r+");
    return r.futimesSync(o, f, u), r.closeSync(o);
  }
  return ln = {
    utimesMillis: c,
    utimesMillisSync: p
  }, ln;
}
var un, Bo;
function Bt() {
  if (Bo) return un;
  Bo = 1;
  const r = /* @__PURE__ */ Mt(), c = _e, p = to;
  function d(s, h, g) {
    const y = g.dereference ? (m) => r.stat(m, { bigint: !0 }) : (m) => r.lstat(m, { bigint: !0 });
    return Promise.all([
      y(s),
      y(h).catch((m) => {
        if (m.code === "ENOENT") return null;
        throw m;
      })
    ]).then(([m, _]) => ({ srcStat: m, destStat: _ }));
  }
  function f(s, h, g) {
    let y;
    const m = g.dereference ? (R) => r.statSync(R, { bigint: !0 }) : (R) => r.lstatSync(R, { bigint: !0 }), _ = m(s);
    try {
      y = m(h);
    } catch (R) {
      if (R.code === "ENOENT") return { srcStat: _, destStat: null };
      throw R;
    }
    return { srcStat: _, destStat: y };
  }
  function u(s, h, g, y, m) {
    p.callbackify(d)(s, h, y, (_, R) => {
      if (_) return m(_);
      const { srcStat: b, destStat: D } = R;
      if (D) {
        if (i(b, D)) {
          const C = c.basename(s), F = c.basename(h);
          return g === "move" && C !== F && C.toLowerCase() === F.toLowerCase() ? m(null, { srcStat: b, destStat: D, isChangingCase: !0 }) : m(new Error("Source and destination must not be the same."));
        }
        if (b.isDirectory() && !D.isDirectory())
          return m(new Error(`Cannot overwrite non-directory '${h}' with directory '${s}'.`));
        if (!b.isDirectory() && D.isDirectory())
          return m(new Error(`Cannot overwrite directory '${h}' with non-directory '${s}'.`));
      }
      return b.isDirectory() && n(s, h) ? m(new Error(t(s, h, g))) : m(null, { srcStat: b, destStat: D });
    });
  }
  function o(s, h, g, y) {
    const { srcStat: m, destStat: _ } = f(s, h, y);
    if (_) {
      if (i(m, _)) {
        const R = c.basename(s), b = c.basename(h);
        if (g === "move" && R !== b && R.toLowerCase() === b.toLowerCase())
          return { srcStat: m, destStat: _, isChangingCase: !0 };
        throw new Error("Source and destination must not be the same.");
      }
      if (m.isDirectory() && !_.isDirectory())
        throw new Error(`Cannot overwrite non-directory '${h}' with directory '${s}'.`);
      if (!m.isDirectory() && _.isDirectory())
        throw new Error(`Cannot overwrite directory '${h}' with non-directory '${s}'.`);
    }
    if (m.isDirectory() && n(s, h))
      throw new Error(t(s, h, g));
    return { srcStat: m, destStat: _ };
  }
  function a(s, h, g, y, m) {
    const _ = c.resolve(c.dirname(s)), R = c.resolve(c.dirname(g));
    if (R === _ || R === c.parse(R).root) return m();
    r.stat(R, { bigint: !0 }, (b, D) => b ? b.code === "ENOENT" ? m() : m(b) : i(h, D) ? m(new Error(t(s, g, y))) : a(s, h, R, y, m));
  }
  function l(s, h, g, y) {
    const m = c.resolve(c.dirname(s)), _ = c.resolve(c.dirname(g));
    if (_ === m || _ === c.parse(_).root) return;
    let R;
    try {
      R = r.statSync(_, { bigint: !0 });
    } catch (b) {
      if (b.code === "ENOENT") return;
      throw b;
    }
    if (i(h, R))
      throw new Error(t(s, g, y));
    return l(s, h, _, y);
  }
  function i(s, h) {
    return h.ino && h.dev && h.ino === s.ino && h.dev === s.dev;
  }
  function n(s, h) {
    const g = c.resolve(s).split(c.sep).filter((m) => m), y = c.resolve(h).split(c.sep).filter((m) => m);
    return g.reduce((m, _, R) => m && y[R] === _, !0);
  }
  function t(s, h, g) {
    return `Cannot ${g} '${s}' to a subdirectory of itself, '${h}'.`;
  }
  return un = {
    checkPaths: u,
    checkPathsSync: o,
    checkParentPaths: a,
    checkParentPathsSync: l,
    isSrcSubdir: n,
    areIdentical: i
  }, un;
}
var cn, jo;
function Cc() {
  if (jo) return cn;
  jo = 1;
  const r = He(), c = _e, p = nt().mkdirs, d = Pt().pathExists, f = Ml().utimesMillis, u = /* @__PURE__ */ Bt();
  function o(Y, H, V, L) {
    typeof V == "function" && !L ? (L = V, V = {}) : typeof V == "function" && (V = { filter: V }), L = L || function() {
    }, V = V || {}, V.clobber = "clobber" in V ? !!V.clobber : !0, V.overwrite = "overwrite" in V ? !!V.overwrite : V.clobber, V.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
      `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
      "Warning",
      "fs-extra-WARN0001"
    ), u.checkPaths(Y, H, "copy", V, (P, A) => {
      if (P) return L(P);
      const { srcStat: O, destStat: $ } = A;
      u.checkParentPaths(Y, O, H, "copy", (j) => j ? L(j) : V.filter ? l(a, $, Y, H, V, L) : a($, Y, H, V, L));
    });
  }
  function a(Y, H, V, L, P) {
    const A = c.dirname(V);
    d(A, (O, $) => {
      if (O) return P(O);
      if ($) return n(Y, H, V, L, P);
      p(A, (j) => j ? P(j) : n(Y, H, V, L, P));
    });
  }
  function l(Y, H, V, L, P, A) {
    Promise.resolve(P.filter(V, L)).then((O) => O ? Y(H, V, L, P, A) : A(), (O) => A(O));
  }
  function i(Y, H, V, L, P) {
    return L.filter ? l(n, Y, H, V, L, P) : n(Y, H, V, L, P);
  }
  function n(Y, H, V, L, P) {
    (L.dereference ? r.stat : r.lstat)(H, (O, $) => O ? P(O) : $.isDirectory() ? D($, Y, H, V, L, P) : $.isFile() || $.isCharacterDevice() || $.isBlockDevice() ? t($, Y, H, V, L, P) : $.isSymbolicLink() ? B(Y, H, V, L, P) : $.isSocket() ? P(new Error(`Cannot copy a socket file: ${H}`)) : $.isFIFO() ? P(new Error(`Cannot copy a FIFO pipe: ${H}`)) : P(new Error(`Unknown file: ${H}`)));
  }
  function t(Y, H, V, L, P, A) {
    return H ? s(Y, V, L, P, A) : h(Y, V, L, P, A);
  }
  function s(Y, H, V, L, P) {
    if (L.overwrite)
      r.unlink(V, (A) => A ? P(A) : h(Y, H, V, L, P));
    else return L.errorOnExist ? P(new Error(`'${V}' already exists`)) : P();
  }
  function h(Y, H, V, L, P) {
    r.copyFile(H, V, (A) => A ? P(A) : L.preserveTimestamps ? g(Y.mode, H, V, P) : R(V, Y.mode, P));
  }
  function g(Y, H, V, L) {
    return y(Y) ? m(V, Y, (P) => P ? L(P) : _(Y, H, V, L)) : _(Y, H, V, L);
  }
  function y(Y) {
    return (Y & 128) === 0;
  }
  function m(Y, H, V) {
    return R(Y, H | 128, V);
  }
  function _(Y, H, V, L) {
    b(H, V, (P) => P ? L(P) : R(V, Y, L));
  }
  function R(Y, H, V) {
    return r.chmod(Y, H, V);
  }
  function b(Y, H, V) {
    r.stat(Y, (L, P) => L ? V(L) : f(H, P.atime, P.mtime, V));
  }
  function D(Y, H, V, L, P, A) {
    return H ? F(V, L, P, A) : C(Y.mode, V, L, P, A);
  }
  function C(Y, H, V, L, P) {
    r.mkdir(V, (A) => {
      if (A) return P(A);
      F(H, V, L, (O) => O ? P(O) : R(V, Y, P));
    });
  }
  function F(Y, H, V, L) {
    r.readdir(Y, (P, A) => P ? L(P) : I(A, Y, H, V, L));
  }
  function I(Y, H, V, L, P) {
    const A = Y.pop();
    return A ? x(Y, A, H, V, L, P) : P();
  }
  function x(Y, H, V, L, P, A) {
    const O = c.join(V, H), $ = c.join(L, H);
    u.checkPaths(O, $, "copy", P, (j, X) => {
      if (j) return A(j);
      const { destStat: oe } = X;
      i(oe, O, $, P, (Z) => Z ? A(Z) : I(Y, V, L, P, A));
    });
  }
  function B(Y, H, V, L, P) {
    r.readlink(H, (A, O) => {
      if (A) return P(A);
      if (L.dereference && (O = c.resolve(process.cwd(), O)), Y)
        r.readlink(V, ($, j) => $ ? $.code === "EINVAL" || $.code === "UNKNOWN" ? r.symlink(O, V, P) : P($) : (L.dereference && (j = c.resolve(process.cwd(), j)), u.isSrcSubdir(O, j) ? P(new Error(`Cannot copy '${O}' to a subdirectory of itself, '${j}'.`)) : Y.isDirectory() && u.isSrcSubdir(j, O) ? P(new Error(`Cannot overwrite '${j}' with '${O}'.`)) : S(O, V, P)));
      else
        return r.symlink(O, V, P);
    });
  }
  function S(Y, H, V) {
    r.unlink(H, (L) => L ? V(L) : r.symlink(Y, H, V));
  }
  return cn = o, cn;
}
var fn, Ho;
function Pc() {
  if (Ho) return fn;
  Ho = 1;
  const r = He(), c = _e, p = nt().mkdirsSync, d = Ml().utimesMillisSync, f = /* @__PURE__ */ Bt();
  function u(I, x, B) {
    typeof B == "function" && (B = { filter: B }), B = B || {}, B.clobber = "clobber" in B ? !!B.clobber : !0, B.overwrite = "overwrite" in B ? !!B.overwrite : B.clobber, B.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
      `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
      "Warning",
      "fs-extra-WARN0002"
    );
    const { srcStat: S, destStat: Y } = f.checkPathsSync(I, x, "copy", B);
    return f.checkParentPathsSync(I, S, x, "copy"), o(Y, I, x, B);
  }
  function o(I, x, B, S) {
    if (S.filter && !S.filter(x, B)) return;
    const Y = c.dirname(B);
    return r.existsSync(Y) || p(Y), l(I, x, B, S);
  }
  function a(I, x, B, S) {
    if (!(S.filter && !S.filter(x, B)))
      return l(I, x, B, S);
  }
  function l(I, x, B, S) {
    const H = (S.dereference ? r.statSync : r.lstatSync)(x);
    if (H.isDirectory()) return _(H, I, x, B, S);
    if (H.isFile() || H.isCharacterDevice() || H.isBlockDevice()) return i(H, I, x, B, S);
    if (H.isSymbolicLink()) return C(I, x, B, S);
    throw H.isSocket() ? new Error(`Cannot copy a socket file: ${x}`) : H.isFIFO() ? new Error(`Cannot copy a FIFO pipe: ${x}`) : new Error(`Unknown file: ${x}`);
  }
  function i(I, x, B, S, Y) {
    return x ? n(I, B, S, Y) : t(I, B, S, Y);
  }
  function n(I, x, B, S) {
    if (S.overwrite)
      return r.unlinkSync(B), t(I, x, B, S);
    if (S.errorOnExist)
      throw new Error(`'${B}' already exists`);
  }
  function t(I, x, B, S) {
    return r.copyFileSync(x, B), S.preserveTimestamps && s(I.mode, x, B), y(B, I.mode);
  }
  function s(I, x, B) {
    return h(I) && g(B, I), m(x, B);
  }
  function h(I) {
    return (I & 128) === 0;
  }
  function g(I, x) {
    return y(I, x | 128);
  }
  function y(I, x) {
    return r.chmodSync(I, x);
  }
  function m(I, x) {
    const B = r.statSync(I);
    return d(x, B.atime, B.mtime);
  }
  function _(I, x, B, S, Y) {
    return x ? b(B, S, Y) : R(I.mode, B, S, Y);
  }
  function R(I, x, B, S) {
    return r.mkdirSync(B), b(x, B, S), y(B, I);
  }
  function b(I, x, B) {
    r.readdirSync(I).forEach((S) => D(S, I, x, B));
  }
  function D(I, x, B, S) {
    const Y = c.join(x, I), H = c.join(B, I), { destStat: V } = f.checkPathsSync(Y, H, "copy", S);
    return a(V, Y, H, S);
  }
  function C(I, x, B, S) {
    let Y = r.readlinkSync(x);
    if (S.dereference && (Y = c.resolve(process.cwd(), Y)), I) {
      let H;
      try {
        H = r.readlinkSync(B);
      } catch (V) {
        if (V.code === "EINVAL" || V.code === "UNKNOWN") return r.symlinkSync(Y, B);
        throw V;
      }
      if (S.dereference && (H = c.resolve(process.cwd(), H)), f.isSrcSubdir(Y, H))
        throw new Error(`Cannot copy '${Y}' to a subdirectory of itself, '${H}'.`);
      if (r.statSync(B).isDirectory() && f.isSrcSubdir(H, Y))
        throw new Error(`Cannot overwrite '${H}' with '${Y}'.`);
      return F(Y, B);
    } else
      return r.symlinkSync(Y, B);
  }
  function F(I, x) {
    return r.unlinkSync(x), r.symlinkSync(I, x);
  }
  return fn = u, fn;
}
var dn, Go;
function ro() {
  if (Go) return dn;
  Go = 1;
  const r = We().fromCallback;
  return dn = {
    copy: r(/* @__PURE__ */ Cc()),
    copySync: /* @__PURE__ */ Pc()
  }, dn;
}
var hn, Vo;
function Oc() {
  if (Vo) return hn;
  Vo = 1;
  const r = He(), c = _e, p = Ul, d = process.platform === "win32";
  function f(g) {
    [
      "unlink",
      "chmod",
      "stat",
      "lstat",
      "rmdir",
      "readdir"
    ].forEach((m) => {
      g[m] = g[m] || r[m], m = m + "Sync", g[m] = g[m] || r[m];
    }), g.maxBusyTries = g.maxBusyTries || 3;
  }
  function u(g, y, m) {
    let _ = 0;
    typeof y == "function" && (m = y, y = {}), p(g, "rimraf: missing path"), p.strictEqual(typeof g, "string", "rimraf: path should be a string"), p.strictEqual(typeof m, "function", "rimraf: callback function required"), p(y, "rimraf: invalid options argument provided"), p.strictEqual(typeof y, "object", "rimraf: options should be object"), f(y), o(g, y, function R(b) {
      if (b) {
        if ((b.code === "EBUSY" || b.code === "ENOTEMPTY" || b.code === "EPERM") && _ < y.maxBusyTries) {
          _++;
          const D = _ * 100;
          return setTimeout(() => o(g, y, R), D);
        }
        b.code === "ENOENT" && (b = null);
      }
      m(b);
    });
  }
  function o(g, y, m) {
    p(g), p(y), p(typeof m == "function"), y.lstat(g, (_, R) => {
      if (_ && _.code === "ENOENT")
        return m(null);
      if (_ && _.code === "EPERM" && d)
        return a(g, y, _, m);
      if (R && R.isDirectory())
        return i(g, y, _, m);
      y.unlink(g, (b) => {
        if (b) {
          if (b.code === "ENOENT")
            return m(null);
          if (b.code === "EPERM")
            return d ? a(g, y, b, m) : i(g, y, b, m);
          if (b.code === "EISDIR")
            return i(g, y, b, m);
        }
        return m(b);
      });
    });
  }
  function a(g, y, m, _) {
    p(g), p(y), p(typeof _ == "function"), y.chmod(g, 438, (R) => {
      R ? _(R.code === "ENOENT" ? null : m) : y.stat(g, (b, D) => {
        b ? _(b.code === "ENOENT" ? null : m) : D.isDirectory() ? i(g, y, m, _) : y.unlink(g, _);
      });
    });
  }
  function l(g, y, m) {
    let _;
    p(g), p(y);
    try {
      y.chmodSync(g, 438);
    } catch (R) {
      if (R.code === "ENOENT")
        return;
      throw m;
    }
    try {
      _ = y.statSync(g);
    } catch (R) {
      if (R.code === "ENOENT")
        return;
      throw m;
    }
    _.isDirectory() ? s(g, y, m) : y.unlinkSync(g);
  }
  function i(g, y, m, _) {
    p(g), p(y), p(typeof _ == "function"), y.rmdir(g, (R) => {
      R && (R.code === "ENOTEMPTY" || R.code === "EEXIST" || R.code === "EPERM") ? n(g, y, _) : R && R.code === "ENOTDIR" ? _(m) : _(R);
    });
  }
  function n(g, y, m) {
    p(g), p(y), p(typeof m == "function"), y.readdir(g, (_, R) => {
      if (_) return m(_);
      let b = R.length, D;
      if (b === 0) return y.rmdir(g, m);
      R.forEach((C) => {
        u(c.join(g, C), y, (F) => {
          if (!D) {
            if (F) return m(D = F);
            --b === 0 && y.rmdir(g, m);
          }
        });
      });
    });
  }
  function t(g, y) {
    let m;
    y = y || {}, f(y), p(g, "rimraf: missing path"), p.strictEqual(typeof g, "string", "rimraf: path should be a string"), p(y, "rimraf: missing options"), p.strictEqual(typeof y, "object", "rimraf: options should be object");
    try {
      m = y.lstatSync(g);
    } catch (_) {
      if (_.code === "ENOENT")
        return;
      _.code === "EPERM" && d && l(g, y, _);
    }
    try {
      m && m.isDirectory() ? s(g, y, null) : y.unlinkSync(g);
    } catch (_) {
      if (_.code === "ENOENT")
        return;
      if (_.code === "EPERM")
        return d ? l(g, y, _) : s(g, y, _);
      if (_.code !== "EISDIR")
        throw _;
      s(g, y, _);
    }
  }
  function s(g, y, m) {
    p(g), p(y);
    try {
      y.rmdirSync(g);
    } catch (_) {
      if (_.code === "ENOTDIR")
        throw m;
      if (_.code === "ENOTEMPTY" || _.code === "EEXIST" || _.code === "EPERM")
        h(g, y);
      else if (_.code !== "ENOENT")
        throw _;
    }
  }
  function h(g, y) {
    if (p(g), p(y), y.readdirSync(g).forEach((m) => t(c.join(g, m), y)), d) {
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
  return hn = u, u.sync = t, hn;
}
var pn, Wo;
function Gr() {
  if (Wo) return pn;
  Wo = 1;
  const r = He(), c = We().fromCallback, p = /* @__PURE__ */ Oc();
  function d(u, o) {
    if (r.rm) return r.rm(u, { recursive: !0, force: !0 }, o);
    p(u, o);
  }
  function f(u) {
    if (r.rmSync) return r.rmSync(u, { recursive: !0, force: !0 });
    p.sync(u);
  }
  return pn = {
    remove: c(d),
    removeSync: f
  }, pn;
}
var mn, Yo;
function Ic() {
  if (Yo) return mn;
  Yo = 1;
  const r = We().fromPromise, c = /* @__PURE__ */ Mt(), p = _e, d = /* @__PURE__ */ nt(), f = /* @__PURE__ */ Gr(), u = r(async function(l) {
    let i;
    try {
      i = await c.readdir(l);
    } catch {
      return d.mkdirs(l);
    }
    return Promise.all(i.map((n) => f.remove(p.join(l, n))));
  });
  function o(a) {
    let l;
    try {
      l = c.readdirSync(a);
    } catch {
      return d.mkdirsSync(a);
    }
    l.forEach((i) => {
      i = p.join(a, i), f.removeSync(i);
    });
  }
  return mn = {
    emptyDirSync: o,
    emptydirSync: o,
    emptyDir: u,
    emptydir: u
  }, mn;
}
var gn, zo;
function Dc() {
  if (zo) return gn;
  zo = 1;
  const r = We().fromCallback, c = _e, p = He(), d = /* @__PURE__ */ nt();
  function f(o, a) {
    function l() {
      p.writeFile(o, "", (i) => {
        if (i) return a(i);
        a();
      });
    }
    p.stat(o, (i, n) => {
      if (!i && n.isFile()) return a();
      const t = c.dirname(o);
      p.stat(t, (s, h) => {
        if (s)
          return s.code === "ENOENT" ? d.mkdirs(t, (g) => {
            if (g) return a(g);
            l();
          }) : a(s);
        h.isDirectory() ? l() : p.readdir(t, (g) => {
          if (g) return a(g);
        });
      });
    });
  }
  function u(o) {
    let a;
    try {
      a = p.statSync(o);
    } catch {
    }
    if (a && a.isFile()) return;
    const l = c.dirname(o);
    try {
      p.statSync(l).isDirectory() || p.readdirSync(l);
    } catch (i) {
      if (i && i.code === "ENOENT") d.mkdirsSync(l);
      else throw i;
    }
    p.writeFileSync(o, "");
  }
  return gn = {
    createFile: r(f),
    createFileSync: u
  }, gn;
}
var En, Xo;
function Nc() {
  if (Xo) return En;
  Xo = 1;
  const r = We().fromCallback, c = _e, p = He(), d = /* @__PURE__ */ nt(), f = Pt().pathExists, { areIdentical: u } = /* @__PURE__ */ Bt();
  function o(l, i, n) {
    function t(s, h) {
      p.link(s, h, (g) => {
        if (g) return n(g);
        n(null);
      });
    }
    p.lstat(i, (s, h) => {
      p.lstat(l, (g, y) => {
        if (g)
          return g.message = g.message.replace("lstat", "ensureLink"), n(g);
        if (h && u(y, h)) return n(null);
        const m = c.dirname(i);
        f(m, (_, R) => {
          if (_) return n(_);
          if (R) return t(l, i);
          d.mkdirs(m, (b) => {
            if (b) return n(b);
            t(l, i);
          });
        });
      });
    });
  }
  function a(l, i) {
    let n;
    try {
      n = p.lstatSync(i);
    } catch {
    }
    try {
      const h = p.lstatSync(l);
      if (n && u(h, n)) return;
    } catch (h) {
      throw h.message = h.message.replace("lstat", "ensureLink"), h;
    }
    const t = c.dirname(i);
    return p.existsSync(t) || d.mkdirsSync(t), p.linkSync(l, i);
  }
  return En = {
    createLink: r(o),
    createLinkSync: a
  }, En;
}
var yn, Ko;
function Fc() {
  if (Ko) return yn;
  Ko = 1;
  const r = _e, c = He(), p = Pt().pathExists;
  function d(u, o, a) {
    if (r.isAbsolute(u))
      return c.lstat(u, (l) => l ? (l.message = l.message.replace("lstat", "ensureSymlink"), a(l)) : a(null, {
        toCwd: u,
        toDst: u
      }));
    {
      const l = r.dirname(o), i = r.join(l, u);
      return p(i, (n, t) => n ? a(n) : t ? a(null, {
        toCwd: i,
        toDst: u
      }) : c.lstat(u, (s) => s ? (s.message = s.message.replace("lstat", "ensureSymlink"), a(s)) : a(null, {
        toCwd: u,
        toDst: r.relative(l, u)
      })));
    }
  }
  function f(u, o) {
    let a;
    if (r.isAbsolute(u)) {
      if (a = c.existsSync(u), !a) throw new Error("absolute srcpath does not exist");
      return {
        toCwd: u,
        toDst: u
      };
    } else {
      const l = r.dirname(o), i = r.join(l, u);
      if (a = c.existsSync(i), a)
        return {
          toCwd: i,
          toDst: u
        };
      if (a = c.existsSync(u), !a) throw new Error("relative srcpath does not exist");
      return {
        toCwd: u,
        toDst: r.relative(l, u)
      };
    }
  }
  return yn = {
    symlinkPaths: d,
    symlinkPathsSync: f
  }, yn;
}
var wn, Jo;
function xc() {
  if (Jo) return wn;
  Jo = 1;
  const r = He();
  function c(d, f, u) {
    if (u = typeof f == "function" ? f : u, f = typeof f == "function" ? !1 : f, f) return u(null, f);
    r.lstat(d, (o, a) => {
      if (o) return u(null, "file");
      f = a && a.isDirectory() ? "dir" : "file", u(null, f);
    });
  }
  function p(d, f) {
    let u;
    if (f) return f;
    try {
      u = r.lstatSync(d);
    } catch {
      return "file";
    }
    return u && u.isDirectory() ? "dir" : "file";
  }
  return wn = {
    symlinkType: c,
    symlinkTypeSync: p
  }, wn;
}
var vn, Qo;
function Lc() {
  if (Qo) return vn;
  Qo = 1;
  const r = We().fromCallback, c = _e, p = /* @__PURE__ */ Mt(), d = /* @__PURE__ */ nt(), f = d.mkdirs, u = d.mkdirsSync, o = /* @__PURE__ */ Fc(), a = o.symlinkPaths, l = o.symlinkPathsSync, i = /* @__PURE__ */ xc(), n = i.symlinkType, t = i.symlinkTypeSync, s = Pt().pathExists, { areIdentical: h } = /* @__PURE__ */ Bt();
  function g(_, R, b, D) {
    D = typeof b == "function" ? b : D, b = typeof b == "function" ? !1 : b, p.lstat(R, (C, F) => {
      !C && F.isSymbolicLink() ? Promise.all([
        p.stat(_),
        p.stat(R)
      ]).then(([I, x]) => {
        if (h(I, x)) return D(null);
        y(_, R, b, D);
      }) : y(_, R, b, D);
    });
  }
  function y(_, R, b, D) {
    a(_, R, (C, F) => {
      if (C) return D(C);
      _ = F.toDst, n(F.toCwd, b, (I, x) => {
        if (I) return D(I);
        const B = c.dirname(R);
        s(B, (S, Y) => {
          if (S) return D(S);
          if (Y) return p.symlink(_, R, x, D);
          f(B, (H) => {
            if (H) return D(H);
            p.symlink(_, R, x, D);
          });
        });
      });
    });
  }
  function m(_, R, b) {
    let D;
    try {
      D = p.lstatSync(R);
    } catch {
    }
    if (D && D.isSymbolicLink()) {
      const x = p.statSync(_), B = p.statSync(R);
      if (h(x, B)) return;
    }
    const C = l(_, R);
    _ = C.toDst, b = t(C.toCwd, b);
    const F = c.dirname(R);
    return p.existsSync(F) || u(F), p.symlinkSync(_, R, b);
  }
  return vn = {
    createSymlink: r(g),
    createSymlinkSync: m
  }, vn;
}
var _n, Zo;
function Uc() {
  if (Zo) return _n;
  Zo = 1;
  const { createFile: r, createFileSync: c } = /* @__PURE__ */ Dc(), { createLink: p, createLinkSync: d } = /* @__PURE__ */ Nc(), { createSymlink: f, createSymlinkSync: u } = /* @__PURE__ */ Lc();
  return _n = {
    // file
    createFile: r,
    createFileSync: c,
    ensureFile: r,
    ensureFileSync: c,
    // link
    createLink: p,
    createLinkSync: d,
    ensureLink: p,
    ensureLinkSync: d,
    // symlink
    createSymlink: f,
    createSymlinkSync: u,
    ensureSymlink: f,
    ensureSymlinkSync: u
  }, _n;
}
var An, es;
function no() {
  if (es) return An;
  es = 1;
  function r(p, { EOL: d = `
`, finalEOL: f = !0, replacer: u = null, spaces: o } = {}) {
    const a = f ? d : "", l = JSON.stringify(p, u, o);
    if (l === void 0)
      throw new TypeError(`Converting ${typeof p} value to JSON is not supported`);
    return l.replace(/\n/g, d) + a;
  }
  function c(p) {
    return Buffer.isBuffer(p) && (p = p.toString("utf8")), p.replace(/^\uFEFF/, "");
  }
  return An = { stringify: r, stripBom: c }, An;
}
var Rn, ts;
function $c() {
  if (ts) return Rn;
  ts = 1;
  let r;
  try {
    r = He();
  } catch {
    r = je;
  }
  const c = We(), { stringify: p, stripBom: d } = no();
  async function f(n, t = {}) {
    typeof t == "string" && (t = { encoding: t });
    const s = t.fs || r, h = "throws" in t ? t.throws : !0;
    let g = await c.fromCallback(s.readFile)(n, t);
    g = d(g);
    let y;
    try {
      y = JSON.parse(g, t ? t.reviver : null);
    } catch (m) {
      if (h)
        throw m.message = `${n}: ${m.message}`, m;
      return null;
    }
    return y;
  }
  const u = c.fromPromise(f);
  function o(n, t = {}) {
    typeof t == "string" && (t = { encoding: t });
    const s = t.fs || r, h = "throws" in t ? t.throws : !0;
    try {
      let g = s.readFileSync(n, t);
      return g = d(g), JSON.parse(g, t.reviver);
    } catch (g) {
      if (h)
        throw g.message = `${n}: ${g.message}`, g;
      return null;
    }
  }
  async function a(n, t, s = {}) {
    const h = s.fs || r, g = p(t, s);
    await c.fromCallback(h.writeFile)(n, g, s);
  }
  const l = c.fromPromise(a);
  function i(n, t, s = {}) {
    const h = s.fs || r, g = p(t, s);
    return h.writeFileSync(n, g, s);
  }
  return Rn = {
    readFile: u,
    readFileSync: o,
    writeFile: l,
    writeFileSync: i
  }, Rn;
}
var Tn, rs;
function kc() {
  if (rs) return Tn;
  rs = 1;
  const r = $c();
  return Tn = {
    // jsonfile exports
    readJson: r.readFile,
    readJsonSync: r.readFileSync,
    writeJson: r.writeFile,
    writeJsonSync: r.writeFileSync
  }, Tn;
}
var Sn, ns;
function io() {
  if (ns) return Sn;
  ns = 1;
  const r = We().fromCallback, c = He(), p = _e, d = /* @__PURE__ */ nt(), f = Pt().pathExists;
  function u(a, l, i, n) {
    typeof i == "function" && (n = i, i = "utf8");
    const t = p.dirname(a);
    f(t, (s, h) => {
      if (s) return n(s);
      if (h) return c.writeFile(a, l, i, n);
      d.mkdirs(t, (g) => {
        if (g) return n(g);
        c.writeFile(a, l, i, n);
      });
    });
  }
  function o(a, ...l) {
    const i = p.dirname(a);
    if (c.existsSync(i))
      return c.writeFileSync(a, ...l);
    d.mkdirsSync(i), c.writeFileSync(a, ...l);
  }
  return Sn = {
    outputFile: r(u),
    outputFileSync: o
  }, Sn;
}
var bn, is;
function qc() {
  if (is) return bn;
  is = 1;
  const { stringify: r } = no(), { outputFile: c } = /* @__PURE__ */ io();
  async function p(d, f, u = {}) {
    const o = r(f, u);
    await c(d, o, u);
  }
  return bn = p, bn;
}
var Cn, os;
function Mc() {
  if (os) return Cn;
  os = 1;
  const { stringify: r } = no(), { outputFileSync: c } = /* @__PURE__ */ io();
  function p(d, f, u) {
    const o = r(f, u);
    c(d, o, u);
  }
  return Cn = p, Cn;
}
var Pn, ss;
function Bc() {
  if (ss) return Pn;
  ss = 1;
  const r = We().fromPromise, c = /* @__PURE__ */ kc();
  return c.outputJson = r(/* @__PURE__ */ qc()), c.outputJsonSync = /* @__PURE__ */ Mc(), c.outputJSON = c.outputJson, c.outputJSONSync = c.outputJsonSync, c.writeJSON = c.writeJson, c.writeJSONSync = c.writeJsonSync, c.readJSON = c.readJson, c.readJSONSync = c.readJsonSync, Pn = c, Pn;
}
var On, as;
function jc() {
  if (as) return On;
  as = 1;
  const r = He(), c = _e, p = ro().copy, d = Gr().remove, f = nt().mkdirp, u = Pt().pathExists, o = /* @__PURE__ */ Bt();
  function a(s, h, g, y) {
    typeof g == "function" && (y = g, g = {}), g = g || {};
    const m = g.overwrite || g.clobber || !1;
    o.checkPaths(s, h, "move", g, (_, R) => {
      if (_) return y(_);
      const { srcStat: b, isChangingCase: D = !1 } = R;
      o.checkParentPaths(s, b, h, "move", (C) => {
        if (C) return y(C);
        if (l(h)) return i(s, h, m, D, y);
        f(c.dirname(h), (F) => F ? y(F) : i(s, h, m, D, y));
      });
    });
  }
  function l(s) {
    const h = c.dirname(s);
    return c.parse(h).root === h;
  }
  function i(s, h, g, y, m) {
    if (y) return n(s, h, g, m);
    if (g)
      return d(h, (_) => _ ? m(_) : n(s, h, g, m));
    u(h, (_, R) => _ ? m(_) : R ? m(new Error("dest already exists.")) : n(s, h, g, m));
  }
  function n(s, h, g, y) {
    r.rename(s, h, (m) => m ? m.code !== "EXDEV" ? y(m) : t(s, h, g, y) : y());
  }
  function t(s, h, g, y) {
    p(s, h, {
      overwrite: g,
      errorOnExist: !0
    }, (_) => _ ? y(_) : d(s, y));
  }
  return On = a, On;
}
var In, ls;
function Hc() {
  if (ls) return In;
  ls = 1;
  const r = He(), c = _e, p = ro().copySync, d = Gr().removeSync, f = nt().mkdirpSync, u = /* @__PURE__ */ Bt();
  function o(t, s, h) {
    h = h || {};
    const g = h.overwrite || h.clobber || !1, { srcStat: y, isChangingCase: m = !1 } = u.checkPathsSync(t, s, "move", h);
    return u.checkParentPathsSync(t, y, s, "move"), a(s) || f(c.dirname(s)), l(t, s, g, m);
  }
  function a(t) {
    const s = c.dirname(t);
    return c.parse(s).root === s;
  }
  function l(t, s, h, g) {
    if (g) return i(t, s, h);
    if (h)
      return d(s), i(t, s, h);
    if (r.existsSync(s)) throw new Error("dest already exists.");
    return i(t, s, h);
  }
  function i(t, s, h) {
    try {
      r.renameSync(t, s);
    } catch (g) {
      if (g.code !== "EXDEV") throw g;
      return n(t, s, h);
    }
  }
  function n(t, s, h) {
    return p(t, s, {
      overwrite: h,
      errorOnExist: !0
    }), d(t);
  }
  return In = o, In;
}
var Dn, us;
function Gc() {
  if (us) return Dn;
  us = 1;
  const r = We().fromCallback;
  return Dn = {
    move: r(/* @__PURE__ */ jc()),
    moveSync: /* @__PURE__ */ Hc()
  }, Dn;
}
var Nn, cs;
function gt() {
  return cs || (cs = 1, Nn = {
    // Export promiseified graceful-fs:
    .../* @__PURE__ */ Mt(),
    // Export extra methods:
    .../* @__PURE__ */ ro(),
    .../* @__PURE__ */ Ic(),
    .../* @__PURE__ */ Uc(),
    .../* @__PURE__ */ Bc(),
    .../* @__PURE__ */ nt(),
    .../* @__PURE__ */ Gc(),
    .../* @__PURE__ */ io(),
    .../* @__PURE__ */ Pt(),
    .../* @__PURE__ */ Gr()
  }), Nn;
}
var Vt = {}, Tt = {}, Fn = {}, St = {}, fs;
function oo() {
  if (fs) return St;
  fs = 1, Object.defineProperty(St, "__esModule", { value: !0 }), St.CancellationError = St.CancellationToken = void 0;
  const r = $l;
  let c = class extends r.EventEmitter {
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
        return Promise.reject(new p());
      const u = () => {
        if (o != null)
          try {
            this.removeListener("cancel", o), o = null;
          } catch {
          }
      };
      let o = null;
      return new Promise((a, l) => {
        let i = null;
        if (o = () => {
          try {
            i != null && (i(), i = null);
          } finally {
            l(new p());
          }
        }, this.cancelled) {
          o();
          return;
        }
        this.onCancel(o), f(a, l, (n) => {
          i = n;
        });
      }).then((a) => (u(), a)).catch((a) => {
        throw u(), a;
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
  St.CancellationToken = c;
  class p extends Error {
    constructor() {
      super("cancelled");
    }
  }
  return St.CancellationError = p, St;
}
var Nr = {}, ds;
function Vr() {
  if (ds) return Nr;
  ds = 1, Object.defineProperty(Nr, "__esModule", { value: !0 }), Nr.newError = r;
  function r(c, p) {
    const d = new Error(c);
    return d.code = p, d;
  }
  return Nr;
}
var Fe = {}, Fr = { exports: {} }, xr = { exports: {} }, xn, hs;
function Vc() {
  if (hs) return xn;
  hs = 1;
  var r = 1e3, c = r * 60, p = c * 60, d = p * 24, f = d * 7, u = d * 365.25;
  xn = function(n, t) {
    t = t || {};
    var s = typeof n;
    if (s === "string" && n.length > 0)
      return o(n);
    if (s === "number" && isFinite(n))
      return t.long ? l(n) : a(n);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(n)
    );
  };
  function o(n) {
    if (n = String(n), !(n.length > 100)) {
      var t = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        n
      );
      if (t) {
        var s = parseFloat(t[1]), h = (t[2] || "ms").toLowerCase();
        switch (h) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return s * u;
          case "weeks":
          case "week":
          case "w":
            return s * f;
          case "days":
          case "day":
          case "d":
            return s * d;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return s * p;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return s * c;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return s * r;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return s;
          default:
            return;
        }
      }
    }
  }
  function a(n) {
    var t = Math.abs(n);
    return t >= d ? Math.round(n / d) + "d" : t >= p ? Math.round(n / p) + "h" : t >= c ? Math.round(n / c) + "m" : t >= r ? Math.round(n / r) + "s" : n + "ms";
  }
  function l(n) {
    var t = Math.abs(n);
    return t >= d ? i(n, t, d, "day") : t >= p ? i(n, t, p, "hour") : t >= c ? i(n, t, c, "minute") : t >= r ? i(n, t, r, "second") : n + " ms";
  }
  function i(n, t, s, h) {
    var g = t >= s * 1.5;
    return Math.round(n / s) + " " + h + (g ? "s" : "");
  }
  return xn;
}
var Ln, ps;
function Bl() {
  if (ps) return Ln;
  ps = 1;
  function r(c) {
    d.debug = d, d.default = d, d.coerce = i, d.disable = a, d.enable = u, d.enabled = l, d.humanize = Vc(), d.destroy = n, Object.keys(c).forEach((t) => {
      d[t] = c[t];
    }), d.names = [], d.skips = [], d.formatters = {};
    function p(t) {
      let s = 0;
      for (let h = 0; h < t.length; h++)
        s = (s << 5) - s + t.charCodeAt(h), s |= 0;
      return d.colors[Math.abs(s) % d.colors.length];
    }
    d.selectColor = p;
    function d(t) {
      let s, h = null, g, y;
      function m(..._) {
        if (!m.enabled)
          return;
        const R = m, b = Number(/* @__PURE__ */ new Date()), D = b - (s || b);
        R.diff = D, R.prev = s, R.curr = b, s = b, _[0] = d.coerce(_[0]), typeof _[0] != "string" && _.unshift("%O");
        let C = 0;
        _[0] = _[0].replace(/%([a-zA-Z%])/g, (I, x) => {
          if (I === "%%")
            return "%";
          C++;
          const B = d.formatters[x];
          if (typeof B == "function") {
            const S = _[C];
            I = B.call(R, S), _.splice(C, 1), C--;
          }
          return I;
        }), d.formatArgs.call(R, _), (R.log || d.log).apply(R, _);
      }
      return m.namespace = t, m.useColors = d.useColors(), m.color = d.selectColor(t), m.extend = f, m.destroy = d.destroy, Object.defineProperty(m, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => h !== null ? h : (g !== d.namespaces && (g = d.namespaces, y = d.enabled(t)), y),
        set: (_) => {
          h = _;
        }
      }), typeof d.init == "function" && d.init(m), m;
    }
    function f(t, s) {
      const h = d(this.namespace + (typeof s > "u" ? ":" : s) + t);
      return h.log = this.log, h;
    }
    function u(t) {
      d.save(t), d.namespaces = t, d.names = [], d.skips = [];
      const s = (typeof t == "string" ? t : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
      for (const h of s)
        h[0] === "-" ? d.skips.push(h.slice(1)) : d.names.push(h);
    }
    function o(t, s) {
      let h = 0, g = 0, y = -1, m = 0;
      for (; h < t.length; )
        if (g < s.length && (s[g] === t[h] || s[g] === "*"))
          s[g] === "*" ? (y = g, m = h, g++) : (h++, g++);
        else if (y !== -1)
          g = y + 1, m++, h = m;
        else
          return !1;
      for (; g < s.length && s[g] === "*"; )
        g++;
      return g === s.length;
    }
    function a() {
      const t = [
        ...d.names,
        ...d.skips.map((s) => "-" + s)
      ].join(",");
      return d.enable(""), t;
    }
    function l(t) {
      for (const s of d.skips)
        if (o(t, s))
          return !1;
      for (const s of d.names)
        if (o(t, s))
          return !0;
      return !1;
    }
    function i(t) {
      return t instanceof Error ? t.stack || t.message : t;
    }
    function n() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    return d.enable(d.load()), d;
  }
  return Ln = r, Ln;
}
var ms;
function Wc() {
  return ms || (ms = 1, (function(r, c) {
    c.formatArgs = d, c.save = f, c.load = u, c.useColors = p, c.storage = o(), c.destroy = /* @__PURE__ */ (() => {
      let l = !1;
      return () => {
        l || (l = !0, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
      };
    })(), c.colors = [
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
    function p() {
      if (typeof window < "u" && window.process && (window.process.type === "renderer" || window.process.__nwjs))
        return !0;
      if (typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))
        return !1;
      let l;
      return typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && (l = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(l[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function d(l) {
      if (l[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + l[0] + (this.useColors ? "%c " : " ") + "+" + r.exports.humanize(this.diff), !this.useColors)
        return;
      const i = "color: " + this.color;
      l.splice(1, 0, i, "color: inherit");
      let n = 0, t = 0;
      l[0].replace(/%[a-zA-Z%]/g, (s) => {
        s !== "%%" && (n++, s === "%c" && (t = n));
      }), l.splice(t, 0, i);
    }
    c.log = console.debug || console.log || (() => {
    });
    function f(l) {
      try {
        l ? c.storage.setItem("debug", l) : c.storage.removeItem("debug");
      } catch {
      }
    }
    function u() {
      let l;
      try {
        l = c.storage.getItem("debug") || c.storage.getItem("DEBUG");
      } catch {
      }
      return !l && typeof process < "u" && "env" in process && (l = process.env.DEBUG), l;
    }
    function o() {
      try {
        return localStorage;
      } catch {
      }
    }
    r.exports = Bl()(c);
    const { formatters: a } = r.exports;
    a.j = function(l) {
      try {
        return JSON.stringify(l);
      } catch (i) {
        return "[UnexpectedJSONParseError]: " + i.message;
      }
    };
  })(xr, xr.exports)), xr.exports;
}
var Lr = { exports: {} }, Un, gs;
function Yc() {
  return gs || (gs = 1, Un = (r, c = process.argv) => {
    const p = r.startsWith("-") ? "" : r.length === 1 ? "-" : "--", d = c.indexOf(p + r), f = c.indexOf("--");
    return d !== -1 && (f === -1 || d < f);
  }), Un;
}
var $n, Es;
function zc() {
  if (Es) return $n;
  Es = 1;
  const r = Hr, c = kl, p = Yc(), { env: d } = process;
  let f;
  p("no-color") || p("no-colors") || p("color=false") || p("color=never") ? f = 0 : (p("color") || p("colors") || p("color=true") || p("color=always")) && (f = 1);
  function u() {
    if ("FORCE_COLOR" in d)
      return d.FORCE_COLOR === "true" ? 1 : d.FORCE_COLOR === "false" ? 0 : d.FORCE_COLOR.length === 0 ? 1 : Math.min(Number.parseInt(d.FORCE_COLOR, 10), 3);
  }
  function o(i) {
    return i === 0 ? !1 : {
      level: i,
      hasBasic: !0,
      has256: i >= 2,
      has16m: i >= 3
    };
  }
  function a(i, { streamIsTTY: n, sniffFlags: t = !0 } = {}) {
    const s = u();
    s !== void 0 && (f = s);
    const h = t ? f : s;
    if (h === 0)
      return 0;
    if (t) {
      if (p("color=16m") || p("color=full") || p("color=truecolor"))
        return 3;
      if (p("color=256"))
        return 2;
    }
    if (i && !n && h === void 0)
      return 0;
    const g = h || 0;
    if (d.TERM === "dumb")
      return g;
    if (process.platform === "win32") {
      const y = r.release().split(".");
      return Number(y[0]) >= 10 && Number(y[2]) >= 10586 ? Number(y[2]) >= 14931 ? 3 : 2 : 1;
    }
    if ("CI" in d)
      return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE", "DRONE"].some((y) => y in d) || d.CI_NAME === "codeship" ? 1 : g;
    if ("TEAMCITY_VERSION" in d)
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(d.TEAMCITY_VERSION) ? 1 : 0;
    if (d.COLORTERM === "truecolor")
      return 3;
    if ("TERM_PROGRAM" in d) {
      const y = Number.parseInt((d.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (d.TERM_PROGRAM) {
        case "iTerm.app":
          return y >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    return /-256(color)?$/i.test(d.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(d.TERM) || "COLORTERM" in d ? 1 : g;
  }
  function l(i, n = {}) {
    const t = a(i, {
      streamIsTTY: i && i.isTTY,
      ...n
    });
    return o(t);
  }
  return $n = {
    supportsColor: l,
    stdout: l({ isTTY: c.isatty(1) }),
    stderr: l({ isTTY: c.isatty(2) })
  }, $n;
}
var ys;
function Xc() {
  return ys || (ys = 1, (function(r, c) {
    const p = kl, d = to;
    c.init = n, c.log = a, c.formatArgs = u, c.save = l, c.load = i, c.useColors = f, c.destroy = d.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), c.colors = [6, 2, 3, 4, 5, 1];
    try {
      const s = zc();
      s && (s.stderr || s).level >= 2 && (c.colors = [
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
    c.inspectOpts = Object.keys(process.env).filter((s) => /^debug_/i.test(s)).reduce((s, h) => {
      const g = h.substring(6).toLowerCase().replace(/_([a-z])/g, (m, _) => _.toUpperCase());
      let y = process.env[h];
      return /^(yes|on|true|enabled)$/i.test(y) ? y = !0 : /^(no|off|false|disabled)$/i.test(y) ? y = !1 : y === "null" ? y = null : y = Number(y), s[g] = y, s;
    }, {});
    function f() {
      return "colors" in c.inspectOpts ? !!c.inspectOpts.colors : p.isatty(process.stderr.fd);
    }
    function u(s) {
      const { namespace: h, useColors: g } = this;
      if (g) {
        const y = this.color, m = "\x1B[3" + (y < 8 ? y : "8;5;" + y), _ = `  ${m};1m${h} \x1B[0m`;
        s[0] = _ + s[0].split(`
`).join(`
` + _), s.push(m + "m+" + r.exports.humanize(this.diff) + "\x1B[0m");
      } else
        s[0] = o() + h + " " + s[0];
    }
    function o() {
      return c.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function a(...s) {
      return process.stderr.write(d.formatWithOptions(c.inspectOpts, ...s) + `
`);
    }
    function l(s) {
      s ? process.env.DEBUG = s : delete process.env.DEBUG;
    }
    function i() {
      return process.env.DEBUG;
    }
    function n(s) {
      s.inspectOpts = {};
      const h = Object.keys(c.inspectOpts);
      for (let g = 0; g < h.length; g++)
        s.inspectOpts[h[g]] = c.inspectOpts[h[g]];
    }
    r.exports = Bl()(c);
    const { formatters: t } = r.exports;
    t.o = function(s) {
      return this.inspectOpts.colors = this.useColors, d.inspect(s, this.inspectOpts).split(`
`).map((h) => h.trim()).join(" ");
    }, t.O = function(s) {
      return this.inspectOpts.colors = this.useColors, d.inspect(s, this.inspectOpts);
    };
  })(Lr, Lr.exports)), Lr.exports;
}
var ws;
function Kc() {
  return ws || (ws = 1, typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? Fr.exports = Wc() : Fr.exports = Xc()), Fr.exports;
}
var Wt = {}, vs;
function jl() {
  if (vs) return Wt;
  vs = 1, Object.defineProperty(Wt, "__esModule", { value: !0 }), Wt.ProgressCallbackTransform = void 0;
  const r = Er;
  let c = class extends r.Transform {
    constructor(d, f, u) {
      super(), this.total = d, this.cancellationToken = f, this.onProgress = u, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.nextUpdate = this.start + 1e3;
    }
    _transform(d, f, u) {
      if (this.cancellationToken.cancelled) {
        u(new Error("cancelled"), null);
        return;
      }
      this.transferred += d.length, this.delta += d.length;
      const o = Date.now();
      o >= this.nextUpdate && this.transferred !== this.total && (this.nextUpdate = o + 1e3, this.onProgress({
        total: this.total,
        delta: this.delta,
        transferred: this.transferred,
        percent: this.transferred / this.total * 100,
        bytesPerSecond: Math.round(this.transferred / ((o - this.start) / 1e3))
      }), this.delta = 0), u(null, d);
    }
    _flush(d) {
      if (this.cancellationToken.cancelled) {
        d(new Error("cancelled"));
        return;
      }
      this.onProgress({
        total: this.total,
        delta: this.delta,
        transferred: this.total,
        percent: 100,
        bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
      }), this.delta = 0, d(null);
    }
  };
  return Wt.ProgressCallbackTransform = c, Wt;
}
var _s;
function Jc() {
  if (_s) return Fe;
  _s = 1, Object.defineProperty(Fe, "__esModule", { value: !0 }), Fe.DigestTransform = Fe.HttpExecutor = Fe.HttpError = void 0, Fe.addSensitiveRedirectHeader = h, Fe.addSensitiveFieldPattern = g, Fe.createHttpError = y, Fe.parseJson = R, Fe.configureRequestOptionsFromUrl = C, Fe.configureRequestUrl = F, Fe.safeGetHeader = B, Fe.configureRequestOptions = Y, Fe.isSensitiveFieldName = H, Fe.hashSensitiveValue = V, Fe.safeStringifyJson = L;
  const r = yr, c = Kc(), p = je, d = Er, f = mt, u = oo(), o = Vr(), a = jl(), l = (0, c.default)("electron-builder"), i = (P) => P.toLowerCase().replace(/[-_]/g, ""), n = /* @__PURE__ */ new Set(["authorization", "proxyauthorization", "privatetoken", "xapikey", "xauthtoken", "xaccesstoken", "xgitlabtoken", "cookie", "xcsrftoken"]), t = ["token", "password", "secret", "authorization", "credential", "apikey", "passphrase", "auth"], s = ["key"];
  function h(P) {
    n.add(i(P));
  }
  function g(P) {
    t.push(P.toLowerCase().replace(/[-_]/g, ""));
  }
  function y(P, A = null) {
    return new _(P.statusCode || -1, `${P.statusCode} ${P.statusMessage}` + (A == null ? "" : `
` + JSON.stringify(A, null, "  ")) + `
Headers: ` + L(P.headers), A);
  }
  const m = /* @__PURE__ */ new Map([
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
  class _ extends Error {
    constructor(A, O = `HTTP error: ${m.get(A) || A}`, $ = null) {
      super(O), this.statusCode = A, this.description = $, this.name = "HttpError", this.code = `HTTP_ERROR_${A}`;
    }
    isServerError() {
      return this.statusCode >= 500 && this.statusCode <= 599;
    }
  }
  Fe.HttpError = _;
  function R(P) {
    return P.then((A) => A == null || A.length === 0 ? null : JSON.parse(A));
  }
  class b {
    constructor() {
      this.maxRedirects = 10;
    }
    request(A, O = new u.CancellationToken(), $) {
      Y(A);
      const j = $ == null ? void 0 : JSON.stringify($), X = j ? Buffer.from(j) : void 0;
      if (X != null) {
        l.enabled && l(L($));
        const { headers: oe, ...Z } = A;
        A = {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": X.length,
            ...oe
          },
          ...Z
        };
      }
      return this.doApiRequest(A, O, (oe) => oe.end(X));
    }
    doApiRequest(A, O, $, j = 0) {
      if (l.enabled) {
        const { headers: X, auth: oe, ...Z } = A;
        l(`Request: ${L(Z)}`);
      }
      return O.createPromise((X, oe, Z) => {
        const de = this.createRequest(A, (Ee) => {
          try {
            this.handleResponse(Ee, A, O, X, oe, j, $);
          } catch (K) {
            oe(K);
          }
        });
        this.addErrorAndTimeoutHandlers(de, oe, A.timeout), this.addRedirectHandlers(de, A, oe, j, (Ee) => {
          this.doApiRequest(Ee, O, $, j).then(X).catch(oe);
        }), $(de, oe), Z(() => de.abort());
      });
    }
    // noinspection JSUnusedLocalSymbols
    // eslint-disable-next-line
    addRedirectHandlers(A, O, $, j, X) {
    }
    addErrorAndTimeoutHandlers(A, O, $ = 60 * 1e3) {
      this.addTimeOutHandler(A, O, $), A.on("error", O), A.on("aborted", () => {
        O(new Error("Request has been aborted by the server"));
      });
    }
    handleResponse(A, O, $, j, X, oe, Z) {
      var de;
      if (l.enabled) {
        const { headers: me, auth: pe, ...Ae } = O;
        l(`Response: ${A.statusCode} ${A.statusMessage}, request options: ${L(Ae)}`);
      }
      if (A.statusCode === 404) {
        X(y(A, `method: ${O.method || "GET"} url: ${O.protocol || "https:"}//${O.hostname}${O.port ? `:${O.port}` : ""}${O.path}

Please double check that your authentication token is correct. Due to security reasons, actual status maybe not reported, but 404.
`));
        return;
      } else if (A.statusCode === 204) {
        j();
        return;
      }
      const Ee = (de = A.statusCode) !== null && de !== void 0 ? de : 0, K = Ee >= 300 && Ee < 400, ue = B(A, "location");
      if (K && ue != null) {
        if (oe > this.maxRedirects) {
          X(this.createMaxRedirectError());
          return;
        }
        this.doApiRequest(b.prepareRedirectUrlOptions(ue, O), $, Z, oe).then(j).catch(X);
        return;
      }
      A.setEncoding("utf8");
      let he = "";
      A.on("error", X), A.on("data", (me) => he += me), A.on("end", () => {
        try {
          if (A.statusCode != null && A.statusCode >= 400) {
            const me = B(A, "content-type"), pe = me != null && (Array.isArray(me) ? me.find((Ae) => Ae.includes("json")) != null : me.includes("json"));
            X(y(A, `method: ${O.method || "GET"} url: ${O.protocol || "https:"}//${O.hostname}${O.port ? `:${O.port}` : ""}${O.path}

          Data:
          ${pe ? L(JSON.parse(he)) : he}
          `));
          } else
            j(he.length === 0 ? null : he);
        } catch (me) {
          X(me);
        }
      });
    }
    async downloadToBuffer(A, O) {
      return await O.cancellationToken.createPromise(($, j, X) => {
        const oe = [], Z = {
          headers: O.headers || void 0,
          // because PrivateGitHubProvider requires HttpExecutor.prepareRedirectUrlOptions logic, so, we need to redirect manually
          redirect: "manual"
        };
        F(A, Z), Y(Z), this.doDownload(Z, {
          destination: null,
          options: O,
          onCancel: X,
          callback: (de) => {
            de == null ? $(Buffer.concat(oe)) : j(de);
          },
          responseHandler: (de, Ee) => {
            let K = 0;
            de.on("data", (ue) => {
              if (K += ue.length, K > 524288e3) {
                Ee(new Error("Maximum allowed size is 500 MB"));
                return;
              }
              oe.push(ue);
            }), de.on("end", () => {
              Ee(null);
            });
          }
        }, 0);
      });
    }
    doDownload(A, O, $) {
      const j = this.createRequest(A, (X) => {
        if (X.statusCode >= 400) {
          O.callback(new Error(`Cannot download "${A.protocol || "https:"}//${A.hostname}${A.path}", status ${X.statusCode}: ${X.statusMessage}`));
          return;
        }
        X.on("error", O.callback);
        const oe = B(X, "location");
        if (oe != null) {
          $ < this.maxRedirects ? this.doDownload(b.prepareRedirectUrlOptions(oe, A), O, $++) : O.callback(this.createMaxRedirectError());
          return;
        }
        O.responseHandler == null ? S(O, X) : O.responseHandler(X, O.callback);
      });
      this.addErrorAndTimeoutHandlers(j, O.callback, A.timeout), this.addRedirectHandlers(j, A, O.callback, $, (X) => {
        this.doDownload(X, O, $++);
      }), j.end();
    }
    createMaxRedirectError() {
      return new Error(`Too many redirects (> ${this.maxRedirects})`);
    }
    addTimeOutHandler(A, O, $) {
      A.on("socket", (j) => {
        j.setTimeout($, () => {
          A.abort(), O(new Error("Request timed out"));
        });
      });
    }
    static prepareRedirectUrlOptions(A, O) {
      const $ = C(A, { ...O }), j = $.headers;
      if (j == null)
        return $;
      const X = b.reconstructOriginalUrl(O), oe = D(A, O);
      if (b.isCrossOriginRedirect(X, oe)) {
        l.enabled && l(`Cross-origin redirect (${X.host} → ${oe.host}): stripping sensitive headers`);
        for (const Z of Object.keys(j))
          n.has(i(Z)) && delete j[Z];
      }
      return $;
    }
    static reconstructOriginalUrl(A) {
      const O = A.protocol || "https:";
      if (!A.hostname)
        throw new Error("Missing hostname in request options");
      const $ = A.hostname, j = A.port ? `:${A.port}` : "", X = A.path || "/";
      return new f.URL(`${O}//${$}${j}${X}`);
    }
    static isCrossOriginRedirect(A, O) {
      if (A.hostname.toLowerCase() !== O.hostname.toLowerCase())
        return !0;
      if (A.protocol === "http:" && // This can be replaced with `!originalUrl.port`, but for the sake of clarity.
      ["80", ""].includes(A.port) && O.protocol === "https:" && // This can be replaced with `!redirectUrl.port`, but for the sake of clarity.
      ["443", ""].includes(O.port))
        return !1;
      if (A.protocol !== O.protocol)
        return !0;
      const $ = A.port, j = O.port;
      return $ !== j;
    }
    static async retryOnServerError(A, O = 3) {
      for (let $ = 0; ; $++)
        try {
          return await A();
        } catch (j) {
          if ($ < O && (j instanceof _ && j.isServerError() || j.code === "EPIPE")) {
            await new Promise((X) => setTimeout(X, 1e3 * ($ + 1)));
            continue;
          }
          throw j;
        }
    }
  }
  Fe.HttpExecutor = b;
  function D(P, A) {
    try {
      return new f.URL(P);
    } catch {
      const O = A.hostname, $ = A.protocol || "https:", j = A.port ? `:${A.port}` : "", X = `${$}//${O}${j}`;
      return new f.URL(P, X);
    }
  }
  function C(P, A) {
    const O = Y(A), $ = D(P, A);
    return F($, O), O;
  }
  function F(P, A) {
    A.protocol = P.protocol, A.hostname = P.hostname, P.port ? A.port = P.port : A.port && delete A.port, A.path = P.pathname + P.search;
  }
  class I extends d.Transform {
    // noinspection JSUnusedGlobalSymbols
    get actual() {
      return this._actual;
    }
    constructor(A, O = "sha512", $ = "base64") {
      super(), this.expected = A, this.algorithm = O, this.encoding = $, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, r.createHash)(O);
    }
    // noinspection JSUnusedGlobalSymbols
    _transform(A, O, $) {
      this.digester.update(A), $(null, A);
    }
    // noinspection JSUnusedGlobalSymbols
    _flush(A) {
      if (this._actual = this.digester.digest(this.encoding), this.isValidateOnEnd)
        try {
          this.validate();
        } catch (O) {
          A(O);
          return;
        }
      A(null);
    }
    validate() {
      if (this._actual == null)
        throw (0, o.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
      if (this._actual !== this.expected)
        throw (0, o.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
      return null;
    }
  }
  Fe.DigestTransform = I;
  function x(P, A, O) {
    return P != null && A != null && P !== A ? (O(new Error(`checksum mismatch: expected ${A} but got ${P} (X-Checksum-Sha2 header)`)), !1) : !0;
  }
  function B(P, A) {
    const O = P.headers[A];
    return O == null ? null : Array.isArray(O) ? O.length === 0 ? null : O[O.length - 1] : O;
  }
  function S(P, A) {
    if (!x(B(A, "X-Checksum-Sha2"), P.options.sha2, P.callback))
      return;
    const O = [];
    if (P.options.onProgress != null) {
      const oe = B(A, "content-length");
      oe != null && O.push(new a.ProgressCallbackTransform(parseInt(oe, 10), P.options.cancellationToken, P.options.onProgress));
    }
    const $ = P.options.sha512;
    $ != null ? O.push(new I($, "sha512", $.length === 128 && !$.includes("+") && !$.includes("Z") && !$.includes("=") ? "hex" : "base64")) : P.options.sha2 != null && O.push(new I(P.options.sha2, "sha256", "hex"));
    const j = (0, p.createWriteStream)(P.destination);
    O.push(j);
    let X = A;
    for (const oe of O)
      oe.on("error", (Z) => {
        j.close(), P.options.cancellationToken.cancelled || P.callback(Z);
      }), X = X.pipe(oe);
    j.on("finish", () => {
      j.close(P.callback);
    });
  }
  function Y(P, A, O) {
    O != null && (P.method = O), P.headers = { ...P.headers };
    const $ = P.headers;
    return A != null && ($.authorization = A.startsWith("Basic") || A.startsWith("Bearer") ? A : `token ${A}`), $["User-Agent"] == null && ($["User-Agent"] = "electron-builder"), (O == null || O === "GET" || $["Cache-Control"] == null) && ($["Cache-Control"] = "no-cache"), P.protocol == null && process.versions.electron != null && (P.protocol = "https:"), P;
  }
  function H(P) {
    const A = i(P);
    return t.some((O) => A.includes(O)) || s.some((O) => A.endsWith(O));
  }
  function V(P) {
    return `${(0, r.createHash)("sha256").update(P).digest("hex")} (sha256 hash)`;
  }
  function L(P, A) {
    return JSON.stringify(P, (O, $) => H(O) || A != null && A.has(O) ? typeof $ == "string" ? V($) : "<stripped sensitive data>" : $, 2);
  }
  return Fe;
}
var Yt = {}, As;
function Qc() {
  if (As) return Yt;
  As = 1, Object.defineProperty(Yt, "__esModule", { value: !0 }), Yt.MemoLazy = void 0;
  let r = class {
    constructor(d, f) {
      this.selector = d, this.creator = f, this.selected = void 0, this._value = void 0;
    }
    get hasValue() {
      return this._value !== void 0;
    }
    get value() {
      const d = this.selector();
      if (this._value !== void 0 && c(this.selected, d))
        return this._value;
      this.selected = d;
      const f = this.creator(d);
      return this.value = f, f;
    }
    set value(d) {
      this._value = d;
    }
  };
  Yt.MemoLazy = r;
  function c(p, d) {
    if (typeof p == "object" && p !== null && (typeof d == "object" && d !== null)) {
      const o = Object.keys(p), a = Object.keys(d);
      return o.length === a.length && o.every((l) => c(p[l], d[l]));
    }
    return p === d;
  }
  return Yt;
}
var Ft = {}, Rs;
function Zc() {
  if (Rs) return Ft;
  Rs = 1, Object.defineProperty(Ft, "__esModule", { value: !0 }), Ft.githubUrl = r, Ft.githubTagPrefix = c, Ft.getS3LikeProviderBaseUrl = p;
  function r(o, a = "github.com") {
    return `${o.protocol || "https"}://${o.host || a}`;
  }
  function c(o) {
    var a;
    return o.tagNamePrefix ? o.tagNamePrefix : !((a = o.vPrefixedTagName) !== null && a !== void 0) || a ? "v" : "";
  }
  function p(o) {
    const a = o.provider;
    if (a === "s3")
      return d(o);
    if (a === "spaces")
      return u(o);
    throw new Error(`Not supported provider: ${a}`);
  }
  function d(o) {
    let a;
    if (o.accelerate == !0)
      a = `https://${o.bucket}.s3-accelerate.amazonaws.com`;
    else if (o.endpoint != null)
      a = `${o.endpoint}/${o.bucket}`;
    else if (o.bucket.includes(".")) {
      if (o.region == null)
        throw new Error(`Bucket name "${o.bucket}" includes a dot, but S3 region is missing`);
      o.region === "us-east-1" ? a = `https://s3.amazonaws.com/${o.bucket}` : a = `https://s3-${o.region}.amazonaws.com/${o.bucket}`;
    } else o.region === "cn-north-1" ? a = `https://${o.bucket}.s3.${o.region}.amazonaws.com.cn` : a = `https://${o.bucket}.s3.amazonaws.com`;
    return f(a, o.path);
  }
  function f(o, a) {
    return a != null && a.length > 0 && (a.startsWith("/") || (o += "/"), o += a), o;
  }
  function u(o) {
    if (o.name == null)
      throw new Error("name is missing");
    if (o.region == null)
      throw new Error("region is missing");
    return f(`https://${o.name}.${o.region}.digitaloceanspaces.com`, o.path);
  }
  return Ft;
}
var Ur = {}, Ts;
function ef() {
  if (Ts) return Ur;
  Ts = 1, Object.defineProperty(Ur, "__esModule", { value: !0 }), Ur.retry = c;
  const r = oo();
  async function c(p, d) {
    var f;
    const { retries: u, interval: o, backoff: a = 0, attempt: l = 0, shouldRetry: i, cancellationToken: n = new r.CancellationToken() } = d;
    try {
      return await p();
    } catch (t) {
      if (await Promise.resolve((f = i == null ? void 0 : i(t)) !== null && f !== void 0 ? f : !0) && u > 0 && !n.cancelled)
        return await new Promise((s) => setTimeout(s, o + a * l)), await c(p, { ...d, retries: u - 1, attempt: l + 1 });
      throw t;
    }
  }
  return Ur;
}
var $r = {}, Ss;
function tf() {
  if (Ss) return $r;
  Ss = 1, Object.defineProperty($r, "__esModule", { value: !0 }), $r.parseDn = r;
  function r(c) {
    let p = !1, d = null, f = "", u = 0;
    c = c.trim();
    const o = /* @__PURE__ */ new Map();
    for (let a = 0; a <= c.length; a++) {
      if (a === c.length) {
        d !== null && o.set(d, f);
        break;
      }
      const l = c[a];
      if (p) {
        if (l === '"') {
          p = !1;
          continue;
        }
      } else {
        if (l === '"') {
          p = !0;
          continue;
        }
        if (l === "\\") {
          a++;
          const i = parseInt(c.slice(a, a + 2), 16);
          Number.isNaN(i) ? f += c[a] : (a++, f += String.fromCharCode(i));
          continue;
        }
        if (d === null && l === "=") {
          d = f, f = "";
          continue;
        }
        if (l === "," || l === ";" || l === "+") {
          d !== null && o.set(d, f), d = null, f = "";
          continue;
        }
      }
      if (l === " " && !p) {
        if (f.length === 0)
          continue;
        if (a > u) {
          let i = a;
          for (; c[i] === " "; )
            i++;
          u = i;
        }
        if (u >= c.length || c[u] === "," || c[u] === ";" || d === null && c[u] === "=" || d !== null && c[u] === "+") {
          a = u - 1;
          continue;
        }
      }
      f += l;
    }
    return o;
  }
  return $r;
}
var bt = {}, bs;
function rf() {
  if (bs) return bt;
  bs = 1, Object.defineProperty(bt, "__esModule", { value: !0 }), bt.nil = bt.UUID = void 0;
  const r = yr, c = Vr(), p = "options.name must be either a string or a Buffer", d = (0, r.randomBytes)(16);
  d[0] = d[0] | 1;
  const f = {}, u = [];
  for (let t = 0; t < 256; t++) {
    const s = (t + 256).toString(16).substr(1);
    f[s] = t, u[t] = s;
  }
  class o {
    constructor(s) {
      this.ascii = null, this.binary = null;
      const h = o.check(s);
      if (!h)
        throw new Error("not a UUID");
      this.version = h.version, h.format === "ascii" ? this.ascii = s : this.binary = s;
    }
    static v5(s, h) {
      return i(s, "sha1", 80, h);
    }
    toString() {
      return this.ascii == null && (this.ascii = n(this.binary)), this.ascii;
    }
    inspect() {
      return `UUID v${this.version} ${this.toString()}`;
    }
    static check(s, h = 0) {
      if (typeof s == "string")
        return s = s.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(s) ? s === "00000000-0000-0000-0000-000000000000" ? { version: void 0, variant: "nil", format: "ascii" } : {
          version: (f[s[14] + s[15]] & 240) >> 4,
          variant: a((f[s[19] + s[20]] & 224) >> 5),
          format: "ascii"
        } : !1;
      if (Buffer.isBuffer(s)) {
        if (s.length < h + 16)
          return !1;
        let g = 0;
        for (; g < 16 && s[h + g] === 0; g++)
          ;
        return g === 16 ? { version: void 0, variant: "nil", format: "binary" } : {
          version: (s[h + 6] & 240) >> 4,
          variant: a((s[h + 8] & 224) >> 5),
          format: "binary"
        };
      }
      throw (0, c.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
    }
    // read stringified uuid into a Buffer
    static parse(s) {
      const h = Buffer.allocUnsafe(16);
      let g = 0;
      for (let y = 0; y < 16; y++)
        h[y] = f[s[g++] + s[g++]], (y === 3 || y === 5 || y === 7 || y === 9) && (g += 1);
      return h;
    }
  }
  bt.UUID = o, o.OID = o.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
  function a(t) {
    switch (t) {
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
  var l;
  (function(t) {
    t[t.ASCII = 0] = "ASCII", t[t.BINARY = 1] = "BINARY", t[t.OBJECT = 2] = "OBJECT";
  })(l || (l = {}));
  function i(t, s, h, g, y = l.ASCII) {
    const m = (0, r.createHash)(s);
    if (typeof t != "string" && !Buffer.isBuffer(t))
      throw (0, c.newError)(p, "ERR_INVALID_UUID_NAME");
    m.update(g), m.update(t);
    const R = m.digest();
    let b;
    switch (y) {
      case l.BINARY:
        R[6] = R[6] & 15 | h, R[8] = R[8] & 63 | 128, b = R;
        break;
      case l.OBJECT:
        R[6] = R[6] & 15 | h, R[8] = R[8] & 63 | 128, b = new o(R);
        break;
      default:
        b = u[R[0]] + u[R[1]] + u[R[2]] + u[R[3]] + "-" + u[R[4]] + u[R[5]] + "-" + u[R[6] & 15 | h] + u[R[7]] + "-" + u[R[8] & 63 | 128] + u[R[9]] + "-" + u[R[10]] + u[R[11]] + u[R[12]] + u[R[13]] + u[R[14]] + u[R[15]];
        break;
    }
    return b;
  }
  function n(t) {
    return u[t[0]] + u[t[1]] + u[t[2]] + u[t[3]] + "-" + u[t[4]] + u[t[5]] + "-" + u[t[6]] + u[t[7]] + "-" + u[t[8]] + u[t[9]] + "-" + u[t[10]] + u[t[11]] + u[t[12]] + u[t[13]] + u[t[14]] + u[t[15]];
  }
  return bt.nil = new o("00000000-0000-0000-0000-000000000000"), bt;
}
var xt = {}, kn = {}, Cs;
function nf() {
  return Cs || (Cs = 1, (function(r) {
    (function(c) {
      c.parser = function(w, E) {
        return new d(w, E);
      }, c.SAXParser = d, c.SAXStream = t, c.createStream = i, c.MAX_BUFFER_LENGTH = 64 * 1024;
      var p = [
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
      c.EVENTS = [
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
      function d(w, E) {
        if (!(this instanceof d))
          return new d(w, E);
        var q = this;
        u(q), q.q = q.c = "", q.bufferCheckPosition = c.MAX_BUFFER_LENGTH, q.encoding = null, q.opt = E || {}, q.opt.lowercase = q.opt.lowercase || q.opt.lowercasetags, q.looseCase = q.opt.lowercase ? "toLowerCase" : "toUpperCase", q.opt.maxEntityCount = q.opt.maxEntityCount || 512, q.opt.maxEntityDepth = q.opt.maxEntityDepth || 4, q.entityCount = q.entityDepth = 0, q.tags = [], q.closed = q.closedRoot = q.sawRoot = !1, q.tag = q.error = null, q.strict = !!w, q.noscript = !!(w || q.opt.noscript), q.state = S.BEGIN, q.strictEntities = q.opt.strictEntities, q.ENTITIES = q.strictEntities ? Object.create(c.XML_ENTITIES) : Object.create(c.ENTITIES), q.attribList = [], q.opt.xmlns && (q.ns = Object.create(m)), q.opt.unquotedAttributeValues === void 0 && (q.opt.unquotedAttributeValues = !w), q.trackPosition = q.opt.position !== !1, q.trackPosition && (q.position = q.line = q.column = 0), H(q, "onready");
      }
      Object.create || (Object.create = function(w) {
        function E() {
        }
        E.prototype = w;
        var q = new E();
        return q;
      }), Object.keys || (Object.keys = function(w) {
        var E = [];
        for (var q in w) w.hasOwnProperty(q) && E.push(q);
        return E;
      });
      function f(w) {
        for (var E = Math.max(c.MAX_BUFFER_LENGTH, 10), q = 0, N = 0, ve = p.length; N < ve; N++) {
          var Re = w[p[N]].length;
          if (Re > E)
            switch (p[N]) {
              case "textNode":
                $(w);
                break;
              case "cdata":
                O(w, "oncdata", w.cdata), w.cdata = "";
                break;
              case "script":
                O(w, "onscript", w.script), w.script = "";
                break;
              default:
                X(w, "Max buffer length exceeded: " + p[N]);
            }
          q = Math.max(q, Re);
        }
        var Se = c.MAX_BUFFER_LENGTH - q;
        w.bufferCheckPosition = Se + w.position;
      }
      function u(w) {
        for (var E = 0, q = p.length; E < q; E++)
          w[p[E]] = "";
      }
      function o(w) {
        $(w), w.cdata !== "" && (O(w, "oncdata", w.cdata), w.cdata = ""), w.script !== "" && (O(w, "onscript", w.script), w.script = "");
      }
      d.prototype = {
        end: function() {
          oe(this);
        },
        write: we,
        resume: function() {
          return this.error = null, this;
        },
        close: function() {
          return this.write(null);
        },
        flush: function() {
          o(this);
        }
      };
      var a;
      try {
        a = require("stream").Stream;
      } catch {
        a = function() {
        };
      }
      a || (a = function() {
      });
      var l = c.EVENTS.filter(function(w) {
        return w !== "error" && w !== "end";
      });
      function i(w, E) {
        return new t(w, E);
      }
      function n(w, E) {
        if (w.length >= 2) {
          if (w[0] === 255 && w[1] === 254)
            return "utf-16le";
          if (w[0] === 254 && w[1] === 255)
            return "utf-16be";
        }
        return w.length >= 3 && w[0] === 239 && w[1] === 187 && w[2] === 191 ? "utf8" : w.length >= 4 ? w[0] === 60 && w[1] === 0 && w[2] === 63 && w[3] === 0 ? "utf-16le" : w[0] === 0 && w[1] === 60 && w[2] === 0 && w[3] === 63 ? "utf-16be" : "utf8" : E ? "utf8" : null;
      }
      function t(w, E) {
        if (!(this instanceof t))
          return new t(w, E);
        a.apply(this), this._parser = new d(w, E), this.writable = !0, this.readable = !0;
        var q = this;
        this._parser.onend = function() {
          q.emit("end");
        }, this._parser.onerror = function(N) {
          q.emit("error", N), q._parser.error = null;
        }, this._decoder = null, this._decoderBuffer = null, l.forEach(function(N) {
          Object.defineProperty(q, "on" + N, {
            get: function() {
              return q._parser["on" + N];
            },
            set: function(ve) {
              if (!ve)
                return q.removeAllListeners(N), q._parser["on" + N] = ve, ve;
              q.on(N, ve);
            },
            enumerable: !0,
            configurable: !1
          });
        });
      }
      t.prototype = Object.create(a.prototype, {
        constructor: {
          value: t
        }
      }), t.prototype._decodeBuffer = function(w, E) {
        if (this._decoderBuffer && (w = Buffer.concat([this._decoderBuffer, w]), this._decoderBuffer = null), !this._decoder) {
          var q = n(w, E);
          if (!q)
            return this._decoderBuffer = w, "";
          this._parser.encoding = q, this._decoder = new TextDecoder(q);
        }
        return this._decoder.decode(w, { stream: !E });
      }, t.prototype.write = function(w) {
        if (typeof Buffer == "function" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(w))
          w = this._decodeBuffer(w, !1);
        else if (this._decoderBuffer) {
          var E = this._decodeBuffer(Buffer.alloc(0), !0);
          E && (this._parser.write(E), this.emit("data", E));
        }
        return this._parser.write(w.toString()), this.emit("data", w), !0;
      }, t.prototype.end = function(w) {
        if (w && w.length && this.write(w), this._decoderBuffer) {
          var E = this._decodeBuffer(Buffer.alloc(0), !0);
          E && (this._parser.write(E), this.emit("data", E));
        } else if (this._decoder) {
          var q = this._decoder.decode();
          q && (this._parser.write(q), this.emit("data", q));
        }
        return this._parser.end(), !0;
      }, t.prototype.on = function(w, E) {
        var q = this;
        return !q._parser["on" + w] && l.indexOf(w) !== -1 && (q._parser["on" + w] = function() {
          var N = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
          N.splice(0, 0, w), q.emit.apply(q, N);
        }), a.prototype.on.call(q, w, E);
      };
      var s = "[CDATA[", h = "DOCTYPE", g = "http://www.w3.org/XML/1998/namespace", y = "http://www.w3.org/2000/xmlns/", m = { xml: g, xmlns: y }, _ = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, R = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, b = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, D = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
      function C(w) {
        return w === " " || w === `
` || w === "\r" || w === "	";
      }
      function F(w) {
        return w === '"' || w === "'";
      }
      function I(w) {
        return w === ">" || C(w);
      }
      function x(w, E) {
        return w.test(E);
      }
      function B(w, E) {
        return !x(w, E);
      }
      var S = 0;
      c.STATE = {
        BEGIN: S++,
        // leading byte order mark or whitespace
        BEGIN_WHITESPACE: S++,
        // leading whitespace
        TEXT: S++,
        // general stuff
        TEXT_ENTITY: S++,
        // &amp and such.
        OPEN_WAKA: S++,
        // <
        SGML_DECL: S++,
        // <!BLARG
        SGML_DECL_QUOTED: S++,
        // <!BLARG foo "bar
        DOCTYPE: S++,
        // <!DOCTYPE
        DOCTYPE_QUOTED: S++,
        // <!DOCTYPE "//blah
        DOCTYPE_DTD: S++,
        // <!DOCTYPE "//blah" [ ...
        DOCTYPE_DTD_QUOTED: S++,
        // <!DOCTYPE "//blah" [ "foo
        COMMENT_STARTING: S++,
        // <!-
        COMMENT: S++,
        // <!--
        COMMENT_ENDING: S++,
        // <!-- blah -
        COMMENT_ENDED: S++,
        // <!-- blah --
        CDATA: S++,
        // <![CDATA[ something
        CDATA_ENDING: S++,
        // ]
        CDATA_ENDING_2: S++,
        // ]]
        PROC_INST: S++,
        // <?hi
        PROC_INST_BODY: S++,
        // <?hi there
        PROC_INST_ENDING: S++,
        // <?hi "there" ?
        OPEN_TAG: S++,
        // <strong
        OPEN_TAG_SLASH: S++,
        // <strong /
        ATTRIB: S++,
        // <a
        ATTRIB_NAME: S++,
        // <a foo
        ATTRIB_NAME_SAW_WHITE: S++,
        // <a foo _
        ATTRIB_VALUE: S++,
        // <a foo=
        ATTRIB_VALUE_QUOTED: S++,
        // <a foo="bar
        ATTRIB_VALUE_CLOSED: S++,
        // <a foo="bar"
        ATTRIB_VALUE_UNQUOTED: S++,
        // <a foo=bar
        ATTRIB_VALUE_ENTITY_Q: S++,
        // <foo bar="&quot;"
        ATTRIB_VALUE_ENTITY_U: S++,
        // <foo bar=&quot
        CLOSE_TAG: S++,
        // </a
        CLOSE_TAG_SAW_WHITE: S++,
        // </a   >
        SCRIPT: S++,
        // <script> ...
        SCRIPT_ENDING: S++
        // <script> ... <
      }, c.XML_ENTITIES = {
        amp: "&",
        gt: ">",
        lt: "<",
        quot: '"',
        apos: "'"
      }, c.ENTITIES = {
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
      }, Object.keys(c.ENTITIES).forEach(function(w) {
        var E = c.ENTITIES[w], q = typeof E == "number" ? String.fromCharCode(E) : E;
        c.ENTITIES[w] = q;
      });
      for (var Y in c.STATE)
        c.STATE[c.STATE[Y]] = Y;
      S = c.STATE;
      function H(w, E, q) {
        w[E] && w[E](q);
      }
      function V(w) {
        var E = w && w.match(/(?:^|\s)encoding\s*=\s*(['"])([^'"]+)\1/i);
        return E ? E[2] : null;
      }
      function L(w) {
        return w ? w.toLowerCase().replace(/[^a-z0-9]/g, "") : null;
      }
      function P(w, E) {
        const q = L(w), N = L(E);
        return !q || !N ? !0 : N === "utf16" ? q === "utf16le" || q === "utf16be" : q === N;
      }
      function A(w, E) {
        if (!(!w.strict || !w.encoding || !E || E.name !== "xml")) {
          var q = V(E.body);
          q && !P(w.encoding, q) && Z(
            w,
            "XML declaration encoding " + q + " does not match detected stream encoding " + w.encoding.toUpperCase()
          );
        }
      }
      function O(w, E, q) {
        w.textNode && $(w), H(w, E, q);
      }
      function $(w) {
        w.textNode = j(w.opt, w.textNode), w.textNode && H(w, "ontext", w.textNode), w.textNode = "";
      }
      function j(w, E) {
        return w.trim && (E = E.trim()), w.normalize && (E = E.replace(/\s+/g, " ")), E;
      }
      function X(w, E) {
        return $(w), w.trackPosition && (E += `
Line: ` + w.line + `
Column: ` + w.column + `
Char: ` + w.c), E = new Error(E), w.error = E, H(w, "onerror", E), w;
      }
      function oe(w) {
        return w.sawRoot && !w.closedRoot && Z(w, "Unclosed root tag"), w.state !== S.BEGIN && w.state !== S.BEGIN_WHITESPACE && w.state !== S.TEXT && X(w, "Unexpected end"), $(w), w.c = "", w.closed = !0, H(w, "onend"), d.call(w, w.strict, w.opt), w;
      }
      function Z(w, E) {
        if (typeof w != "object" || !(w instanceof d))
          throw new Error("bad call to strictFail");
        w.strict && X(w, E);
      }
      function de(w) {
        w.strict || (w.tagName = w.tagName[w.looseCase]());
        var E = w.tags[w.tags.length - 1] || w, q = w.tag = { name: w.tagName, attributes: {} };
        w.opt.xmlns && (q.ns = E.ns), w.attribList.length = 0, O(w, "onopentagstart", q);
      }
      function Ee(w, E) {
        var q = w.indexOf(":"), N = q < 0 ? ["", w] : w.split(":"), ve = N[0], Re = N[1];
        return E && w === "xmlns" && (ve = "xmlns", Re = ""), { prefix: ve, local: Re };
      }
      function K(w) {
        if (w.strict || (w.attribName = w.attribName[w.looseCase]()), w.attribList.indexOf(w.attribName) !== -1 || w.tag.attributes.hasOwnProperty(w.attribName)) {
          w.attribName = w.attribValue = "";
          return;
        }
        if (w.opt.xmlns) {
          var E = Ee(w.attribName, !0), q = E.prefix, N = E.local;
          if (q === "xmlns")
            if (N === "xml" && w.attribValue !== g)
              Z(
                w,
                "xml: prefix must be bound to " + g + `
Actual: ` + w.attribValue
              );
            else if (N === "xmlns" && w.attribValue !== y)
              Z(
                w,
                "xmlns: prefix must be bound to " + y + `
Actual: ` + w.attribValue
              );
            else {
              var ve = w.tag, Re = w.tags[w.tags.length - 1] || w;
              ve.ns === Re.ns && (ve.ns = Object.create(Re.ns)), ve.ns[N] = w.attribValue;
            }
          w.attribList.push([w.attribName, w.attribValue]);
        } else
          w.tag.attributes[w.attribName] = w.attribValue, O(w, "onattribute", {
            name: w.attribName,
            value: w.attribValue
          });
        w.attribName = w.attribValue = "";
      }
      function ue(w, E) {
        if (w.opt.xmlns) {
          var q = w.tag, N = Ee(w.tagName);
          q.prefix = N.prefix, q.local = N.local, q.uri = q.ns[N.prefix] || "", q.prefix && !q.uri && (Z(
            w,
            "Unbound namespace prefix: " + JSON.stringify(w.tagName)
          ), q.uri = N.prefix);
          var ve = w.tags[w.tags.length - 1] || w;
          q.ns && ve.ns !== q.ns && Object.keys(q.ns).forEach(function(Ke) {
            O(w, "onopennamespace", {
              prefix: Ke,
              uri: q.ns[Ke]
            });
          });
          for (var Re = 0, Se = w.attribList.length; Re < Se; Re++) {
            var Ne = w.attribList[Re], Ie = Ne[0], $e = Ne[1], Ce = Ee(Ie, !0), De = Ce.prefix, Et = Ce.local, it = De === "" ? "" : q.ns[De] || "", rt = {
              name: Ie,
              value: $e,
              prefix: De,
              local: Et,
              uri: it
            };
            De && De !== "xmlns" && !it && (Z(
              w,
              "Unbound namespace prefix: " + JSON.stringify(De)
            ), rt.uri = De), w.tag.attributes[Ie] = rt, O(w, "onattribute", rt);
          }
          w.attribList.length = 0;
        }
        w.tag.isSelfClosing = !!E, w.sawRoot = !0, w.tags.push(w.tag), O(w, "onopentag", w.tag), E || (!w.noscript && w.tagName.toLowerCase() === "script" ? w.state = S.SCRIPT : w.state = S.TEXT, w.tag = null, w.tagName = ""), w.attribName = w.attribValue = "", w.attribList.length = 0;
      }
      function he(w) {
        if (!w.tagName) {
          Z(w, "Weird empty close tag."), w.textNode += "</>", w.state = S.TEXT;
          return;
        }
        if (w.script) {
          if (w.tagName !== "script") {
            w.script += "</" + w.tagName + ">", w.tagName = "", w.state = S.SCRIPT;
            return;
          }
          O(w, "onscript", w.script), w.script = "";
        }
        var E = w.tags.length, q = w.tagName;
        w.strict || (q = q[w.looseCase]());
        for (var N = q; E--; ) {
          var ve = w.tags[E];
          if (ve.name !== N)
            Z(w, "Unexpected close tag");
          else
            break;
        }
        if (E < 0) {
          Z(w, "Unmatched closing tag: " + w.tagName), w.textNode += "</" + w.tagName + ">", w.state = S.TEXT;
          return;
        }
        w.tagName = q;
        for (var Re = w.tags.length; Re-- > E; ) {
          var Se = w.tag = w.tags.pop();
          w.tagName = w.tag.name, O(w, "onclosetag", w.tagName);
          var Ne = {};
          for (var Ie in Se.ns)
            Ne[Ie] = Se.ns[Ie];
          var $e = w.tags[w.tags.length - 1] || w;
          w.opt.xmlns && Se.ns !== $e.ns && Object.keys(Se.ns).forEach(function(Ce) {
            var De = Se.ns[Ce];
            O(w, "onclosenamespace", { prefix: Ce, uri: De });
          });
        }
        E === 0 && (w.closedRoot = !0), w.tagName = w.attribValue = w.attribName = "", w.attribList.length = 0, w.state = S.TEXT;
      }
      function me(w) {
        var E = w.entity, q = E.toLowerCase(), N, ve = "";
        return w.ENTITIES[E] ? w.ENTITIES[E] : w.ENTITIES[q] ? w.ENTITIES[q] : (E = q, E.charAt(0) === "#" && (E.charAt(1) === "x" ? (E = E.slice(2), N = parseInt(E, 16), ve = N.toString(16)) : (E = E.slice(1), N = parseInt(E, 10), ve = N.toString(10))), E = E.replace(/^0+/, ""), isNaN(N) || ve.toLowerCase() !== E || N < 0 || N > 1114111 ? (Z(w, "Invalid character entity"), "&" + w.entity + ";") : String.fromCodePoint(N));
      }
      function pe(w, E) {
        E === "<" ? (w.state = S.OPEN_WAKA, w.startTagPosition = w.position) : C(E) || (Z(w, "Non-whitespace before first tag."), w.textNode = E, w.state = S.TEXT);
      }
      function Ae(w, E) {
        var q = "";
        return E < w.length && (q = w.charAt(E)), q;
      }
      function we(w) {
        var E = this;
        if (this.error)
          throw this.error;
        if (E.closed)
          return X(
            E,
            "Cannot write after close. Assign an onready handler."
          );
        if (w === null)
          return oe(E);
        typeof w == "object" && (w = w.toString());
        for (var q = 0, N = ""; N = Ae(w, q++), E.c = N, !!N; )
          switch (E.trackPosition && (E.position++, N === `
` ? (E.line++, E.column = 0) : E.column++), E.state) {
            case S.BEGIN:
              if (E.state = S.BEGIN_WHITESPACE, N === "\uFEFF")
                continue;
              pe(E, N);
              continue;
            case S.BEGIN_WHITESPACE:
              pe(E, N);
              continue;
            case S.TEXT:
              if (E.sawRoot && !E.closedRoot) {
                for (var Re = q - 1; N && N !== "<" && N !== "&"; )
                  N = Ae(w, q++), N && E.trackPosition && (E.position++, N === `
` ? (E.line++, E.column = 0) : E.column++);
                E.textNode += w.substring(Re, q - 1);
              }
              N === "<" && !(E.sawRoot && E.closedRoot && !E.strict) ? (E.state = S.OPEN_WAKA, E.startTagPosition = E.position) : (!C(N) && (!E.sawRoot || E.closedRoot) && Z(E, "Text data outside of root node."), N === "&" ? E.state = S.TEXT_ENTITY : E.textNode += N);
              continue;
            case S.SCRIPT:
              N === "<" ? E.state = S.SCRIPT_ENDING : E.script += N;
              continue;
            case S.SCRIPT_ENDING:
              N === "/" ? E.state = S.CLOSE_TAG : (E.script += "<" + N, E.state = S.SCRIPT);
              continue;
            case S.OPEN_WAKA:
              if (N === "!")
                E.state = S.SGML_DECL, E.sgmlDecl = "";
              else if (!C(N)) if (x(_, N))
                E.state = S.OPEN_TAG, E.tagName = N;
              else if (N === "/")
                E.state = S.CLOSE_TAG, E.tagName = "";
              else if (N === "?")
                E.state = S.PROC_INST, E.procInstName = E.procInstBody = "";
              else {
                if (Z(E, "Unencoded <"), E.startTagPosition + 1 < E.position) {
                  var ve = E.position - E.startTagPosition;
                  N = new Array(ve).join(" ") + N;
                }
                E.textNode += "<" + N, E.state = S.TEXT;
              }
              continue;
            case S.SGML_DECL:
              if (E.sgmlDecl + N === "--") {
                E.state = S.COMMENT, E.comment = "", E.sgmlDecl = "";
                continue;
              }
              E.doctype && E.doctype !== !0 && E.sgmlDecl ? (E.state = S.DOCTYPE_DTD, E.doctype += "<!" + E.sgmlDecl + N, E.sgmlDecl = "") : (E.sgmlDecl + N).toUpperCase() === s ? (O(E, "onopencdata"), E.state = S.CDATA, E.sgmlDecl = "", E.cdata = "") : (E.sgmlDecl + N).toUpperCase() === h ? (E.state = S.DOCTYPE, (E.doctype || E.sawRoot) && Z(
                E,
                "Inappropriately located doctype declaration"
              ), E.doctype = "", E.sgmlDecl = "") : N === ">" ? (O(E, "onsgmldeclaration", E.sgmlDecl), E.sgmlDecl = "", E.state = S.TEXT) : (F(N) && (E.state = S.SGML_DECL_QUOTED), E.sgmlDecl += N);
              continue;
            case S.SGML_DECL_QUOTED:
              N === E.q && (E.state = S.SGML_DECL, E.q = ""), E.sgmlDecl += N;
              continue;
            case S.DOCTYPE:
              N === ">" ? (E.state = S.TEXT, O(E, "ondoctype", E.doctype), E.doctype = !0) : (E.doctype += N, N === "[" ? E.state = S.DOCTYPE_DTD : F(N) && (E.state = S.DOCTYPE_QUOTED, E.q = N));
              continue;
            case S.DOCTYPE_QUOTED:
              E.doctype += N, N === E.q && (E.q = "", E.state = S.DOCTYPE);
              continue;
            case S.DOCTYPE_DTD:
              N === "]" ? (E.doctype += N, E.state = S.DOCTYPE) : N === "<" ? (E.state = S.OPEN_WAKA, E.startTagPosition = E.position) : F(N) ? (E.doctype += N, E.state = S.DOCTYPE_DTD_QUOTED, E.q = N) : E.doctype += N;
              continue;
            case S.DOCTYPE_DTD_QUOTED:
              E.doctype += N, N === E.q && (E.state = S.DOCTYPE_DTD, E.q = "");
              continue;
            case S.COMMENT:
              N === "-" ? E.state = S.COMMENT_ENDING : E.comment += N;
              continue;
            case S.COMMENT_ENDING:
              N === "-" ? (E.state = S.COMMENT_ENDED, E.comment = j(E.opt, E.comment), E.comment && O(E, "oncomment", E.comment), E.comment = "") : (E.comment += "-" + N, E.state = S.COMMENT);
              continue;
            case S.COMMENT_ENDED:
              N !== ">" ? (Z(E, "Malformed comment"), E.comment += "--" + N, E.state = S.COMMENT) : E.doctype && E.doctype !== !0 ? E.state = S.DOCTYPE_DTD : E.state = S.TEXT;
              continue;
            case S.CDATA:
              for (var Re = q - 1; N && N !== "]"; )
                N = Ae(w, q++), N && E.trackPosition && (E.position++, N === `
` ? (E.line++, E.column = 0) : E.column++);
              E.cdata += w.substring(Re, q - 1), N === "]" && (E.state = S.CDATA_ENDING);
              continue;
            case S.CDATA_ENDING:
              N === "]" ? E.state = S.CDATA_ENDING_2 : (E.cdata += "]" + N, E.state = S.CDATA);
              continue;
            case S.CDATA_ENDING_2:
              N === ">" ? (E.cdata && O(E, "oncdata", E.cdata), O(E, "onclosecdata"), E.cdata = "", E.state = S.TEXT) : N === "]" ? E.cdata += "]" : (E.cdata += "]]" + N, E.state = S.CDATA);
              continue;
            case S.PROC_INST:
              N === "?" ? E.state = S.PROC_INST_ENDING : C(N) ? E.state = S.PROC_INST_BODY : E.procInstName += N;
              continue;
            case S.PROC_INST_BODY:
              if (!E.procInstBody && C(N))
                continue;
              N === "?" ? E.state = S.PROC_INST_ENDING : E.procInstBody += N;
              continue;
            case S.PROC_INST_ENDING:
              if (N === ">") {
                const $e = {
                  name: E.procInstName,
                  body: E.procInstBody
                };
                A(E, $e), O(E, "onprocessinginstruction", $e), E.procInstName = E.procInstBody = "", E.state = S.TEXT;
              } else
                E.procInstBody += "?" + N, E.state = S.PROC_INST_BODY;
              continue;
            case S.OPEN_TAG:
              x(R, N) ? E.tagName += N : (de(E), N === ">" ? ue(E) : N === "/" ? E.state = S.OPEN_TAG_SLASH : (C(N) || Z(E, "Invalid character in tag name"), E.state = S.ATTRIB));
              continue;
            case S.OPEN_TAG_SLASH:
              N === ">" ? (ue(E, !0), he(E)) : (Z(
                E,
                "Forward-slash in opening tag not followed by >"
              ), E.state = S.ATTRIB);
              continue;
            case S.ATTRIB:
              if (C(N))
                continue;
              N === ">" ? ue(E) : N === "/" ? E.state = S.OPEN_TAG_SLASH : x(_, N) ? (E.attribName = N, E.attribValue = "", E.state = S.ATTRIB_NAME) : Z(E, "Invalid attribute name");
              continue;
            case S.ATTRIB_NAME:
              N === "=" ? E.state = S.ATTRIB_VALUE : N === ">" ? (Z(E, "Attribute without value"), E.attribValue = E.attribName, K(E), ue(E)) : C(N) ? E.state = S.ATTRIB_NAME_SAW_WHITE : x(R, N) ? E.attribName += N : Z(E, "Invalid attribute name");
              continue;
            case S.ATTRIB_NAME_SAW_WHITE:
              if (N === "=")
                E.state = S.ATTRIB_VALUE;
              else {
                if (C(N))
                  continue;
                Z(E, "Attribute without value"), E.tag.attributes[E.attribName] = "", E.attribValue = "", O(E, "onattribute", {
                  name: E.attribName,
                  value: ""
                }), E.attribName = "", N === ">" ? ue(E) : x(_, N) ? (E.attribName = N, E.state = S.ATTRIB_NAME) : (Z(E, "Invalid attribute name"), E.state = S.ATTRIB);
              }
              continue;
            case S.ATTRIB_VALUE:
              if (C(N))
                continue;
              F(N) ? (E.q = N, E.state = S.ATTRIB_VALUE_QUOTED) : (E.opt.unquotedAttributeValues || X(E, "Unquoted attribute value"), E.state = S.ATTRIB_VALUE_UNQUOTED, E.attribValue = N);
              continue;
            case S.ATTRIB_VALUE_QUOTED:
              if (N !== E.q) {
                N === "&" ? E.state = S.ATTRIB_VALUE_ENTITY_Q : E.attribValue += N;
                continue;
              }
              K(E), E.q = "", E.state = S.ATTRIB_VALUE_CLOSED;
              continue;
            case S.ATTRIB_VALUE_CLOSED:
              C(N) ? E.state = S.ATTRIB : N === ">" ? ue(E) : N === "/" ? E.state = S.OPEN_TAG_SLASH : x(_, N) ? (Z(E, "No whitespace between attributes"), E.attribName = N, E.attribValue = "", E.state = S.ATTRIB_NAME) : Z(E, "Invalid attribute name");
              continue;
            case S.ATTRIB_VALUE_UNQUOTED:
              if (!I(N)) {
                N === "&" ? E.state = S.ATTRIB_VALUE_ENTITY_U : E.attribValue += N;
                continue;
              }
              K(E), N === ">" ? ue(E) : E.state = S.ATTRIB;
              continue;
            case S.CLOSE_TAG:
              if (E.tagName)
                N === ">" ? he(E) : x(R, N) ? E.tagName += N : E.script ? (E.script += "</" + E.tagName + N, E.tagName = "", E.state = S.SCRIPT) : (C(N) || Z(E, "Invalid tagname in closing tag"), E.state = S.CLOSE_TAG_SAW_WHITE);
              else {
                if (C(N))
                  continue;
                B(_, N) ? E.script ? (E.script += "</" + N, E.state = S.SCRIPT) : Z(E, "Invalid tagname in closing tag.") : E.tagName = N;
              }
              continue;
            case S.CLOSE_TAG_SAW_WHITE:
              if (C(N))
                continue;
              N === ">" ? he(E) : Z(E, "Invalid characters in closing tag");
              continue;
            case S.TEXT_ENTITY:
            case S.ATTRIB_VALUE_ENTITY_Q:
            case S.ATTRIB_VALUE_ENTITY_U:
              var Se, Ne;
              switch (E.state) {
                case S.TEXT_ENTITY:
                  Se = S.TEXT, Ne = "textNode";
                  break;
                case S.ATTRIB_VALUE_ENTITY_Q:
                  Se = S.ATTRIB_VALUE_QUOTED, Ne = "attribValue";
                  break;
                case S.ATTRIB_VALUE_ENTITY_U:
                  Se = S.ATTRIB_VALUE_UNQUOTED, Ne = "attribValue";
                  break;
              }
              if (N === ";") {
                var Ie = me(E);
                E.opt.unparsedEntities && !Object.values(c.XML_ENTITIES).includes(Ie) ? ((E.entityCount += 1) > E.opt.maxEntityCount && X(
                  E,
                  "Parsed entity count exceeds max entity count"
                ), (E.entityDepth += 1) > E.opt.maxEntityDepth && X(
                  E,
                  "Parsed entity depth exceeds max entity depth"
                ), E.entity = "", E.state = Se, E.write(Ie), E.entityDepth -= 1) : (E[Ne] += Ie, E.entity = "", E.state = Se);
              } else x(E.entity.length ? D : b, N) ? E.entity += N : (Z(E, "Invalid character in entity name"), E[Ne] += "&" + E.entity + N, E.entity = "", E.state = Se);
              continue;
            default:
              throw new Error(E, "Unknown state: " + E.state);
          }
        return E.position >= E.bufferCheckPosition && f(E), E;
      }
      /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
      String.fromCodePoint || (function() {
        var w = String.fromCharCode, E = Math.floor, q = function() {
          var N = 16384, ve = [], Re, Se, Ne = -1, Ie = arguments.length;
          if (!Ie)
            return "";
          for (var $e = ""; ++Ne < Ie; ) {
            var Ce = Number(arguments[Ne]);
            if (!isFinite(Ce) || // `NaN`, `+Infinity`, or `-Infinity`
            Ce < 0 || // not a valid Unicode code point
            Ce > 1114111 || // not a valid Unicode code point
            E(Ce) !== Ce)
              throw RangeError("Invalid code point: " + Ce);
            Ce <= 65535 ? ve.push(Ce) : (Ce -= 65536, Re = (Ce >> 10) + 55296, Se = Ce % 1024 + 56320, ve.push(Re, Se)), (Ne + 1 === Ie || ve.length > N) && ($e += w.apply(null, ve), ve.length = 0);
          }
          return $e;
        };
        Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
          value: q,
          configurable: !0,
          writable: !0
        }) : String.fromCodePoint = q;
      })();
    })(r);
  })(kn)), kn;
}
var Ps;
function of() {
  if (Ps) return xt;
  Ps = 1, Object.defineProperty(xt, "__esModule", { value: !0 }), xt.XElement = void 0, xt.parseXml = o;
  const r = nf(), c = Vr();
  class p {
    constructor(l) {
      if (this.name = l, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !l)
        throw (0, c.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
      if (!f(l))
        throw (0, c.newError)(`Invalid element name: ${l}`, "ERR_XML_ELEMENT_INVALID_NAME");
    }
    attribute(l) {
      const i = this.attributes === null ? null : this.attributes[l];
      if (i == null)
        throw (0, c.newError)(`No attribute "${l}"`, "ERR_XML_MISSED_ATTRIBUTE");
      return i;
    }
    removeAttribute(l) {
      this.attributes !== null && delete this.attributes[l];
    }
    element(l, i = !1, n = null) {
      const t = this.elementOrNull(l, i);
      if (t === null)
        throw (0, c.newError)(n || `No element "${l}"`, "ERR_XML_MISSED_ELEMENT");
      return t;
    }
    elementOrNull(l, i = !1) {
      if (this.elements === null)
        return null;
      for (const n of this.elements)
        if (u(n, l, i))
          return n;
      return null;
    }
    getElements(l, i = !1) {
      return this.elements === null ? [] : this.elements.filter((n) => u(n, l, i));
    }
    elementValueOrEmpty(l, i = !1) {
      const n = this.elementOrNull(l, i);
      return n === null ? "" : n.value;
    }
  }
  xt.XElement = p;
  const d = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
  function f(a) {
    return d.test(a);
  }
  function u(a, l, i) {
    const n = a.name;
    return n === l || i === !0 && n.length === l.length && n.toLowerCase() === l.toLowerCase();
  }
  function o(a) {
    let l = null;
    const i = r.parser(!0, {}), n = [];
    return i.onopentag = (t) => {
      const s = new p(t.name);
      if (s.attributes = t.attributes, l === null)
        l = s;
      else {
        const h = n[n.length - 1];
        h.elements == null && (h.elements = []), h.elements.push(s);
      }
      n.push(s);
    }, i.onclosetag = () => {
      n.pop();
    }, i.ontext = (t) => {
      n.length > 0 && (n[n.length - 1].value = t);
    }, i.oncdata = (t) => {
      const s = n[n.length - 1];
      s.value = t, s.isCData = !0;
    }, i.onerror = (t) => {
      throw t;
    }, i.write(a), l;
  }
  return xt;
}
var ft = {}, Os;
function sf() {
  if (Os) return ft;
  Os = 1, Object.defineProperty(ft, "__esModule", { value: !0 }), ft.mapToObject = r, ft.isValidKey = c, ft.asArray = p, ft.deepAssign = o, ft.objectToArgs = i;
  function r(n) {
    const t = {};
    for (const [s, h] of n)
      c(s) && (h instanceof Map ? t[s] = r(h) : t[s] = h);
    return t;
  }
  function c(n) {
    return ["__proto__", "prototype", "constructor"].includes(n) ? !1 : ["string", "number", "symbol", "boolean"].includes(typeof n) || n === null;
  }
  function p(n) {
    return n == null ? [] : Array.isArray(n) ? n : [n];
  }
  function d(n) {
    if (Array.isArray(n))
      return !1;
    const t = typeof n;
    return t === "object" || t === "function";
  }
  function f(n, t, s) {
    const h = t[s];
    if (h === void 0)
      return;
    const g = n[s];
    g == null || h == null || !d(g) || !d(h) ? Array.isArray(g) && Array.isArray(h) ? n[s] = Array.from(new Set(g.concat(h))) : n[s] = h : n[s] = u(g, h);
  }
  function u(n, t) {
    if (n !== t)
      for (const s of Object.getOwnPropertyNames(t))
        c(s) && f(n, t, s);
    return n;
  }
  function o(n, ...t) {
    for (const s of t)
      s != null && u(n, s);
    return n;
  }
  const a = /^[a-zA-Z][a-zA-Z0-9-]*$/, l = /[\0\r\n]/;
  function i(n) {
    const t = Object.entries(n).reduce((s, [h, g]) => {
      if (!c(h) || g == null)
        return s;
      if (!a.test(h))
        throw new Error(`objectToArgs: unsafe flag name rejected: ${JSON.stringify(h)}`);
      if (l.test(g))
        throw new Error(`objectToArgs: value for --${h} contains a null byte or newline`);
      return s.concat([`--${h}`, g]);
    }, []);
    return Object.freeze(t);
  }
  return ft;
}
var Is;
function Le() {
  return Is || (Is = 1, (function(r) {
    Object.defineProperty(r, "__esModule", { value: !0 }), r.CURRENT_APP_PACKAGE_FILE_NAME = r.CURRENT_APP_INSTALLER_FILE_NAME = r.objectToArgs = r.deepAssign = r.asArray = r.mapToObject = r.isValidKey = r.XElement = r.parseXml = r.UUID = r.parseDn = r.retry = r.githubTagPrefix = r.githubUrl = r.getS3LikeProviderBaseUrl = r.ProgressCallbackTransform = r.MemoLazy = r.safeStringifyJson = r.safeGetHeader = r.parseJson = r.isSensitiveFieldName = r.HttpExecutor = r.hashSensitiveValue = r.HttpError = r.DigestTransform = r.createHttpError = r.configureRequestUrl = r.configureRequestOptionsFromUrl = r.configureRequestOptions = r.newError = r.CancellationToken = r.CancellationError = void 0;
    var c = oo();
    Object.defineProperty(r, "CancellationError", { enumerable: !0, get: function() {
      return c.CancellationError;
    } }), Object.defineProperty(r, "CancellationToken", { enumerable: !0, get: function() {
      return c.CancellationToken;
    } });
    var p = Vr();
    Object.defineProperty(r, "newError", { enumerable: !0, get: function() {
      return p.newError;
    } });
    var d = Jc();
    Object.defineProperty(r, "configureRequestOptions", { enumerable: !0, get: function() {
      return d.configureRequestOptions;
    } }), Object.defineProperty(r, "configureRequestOptionsFromUrl", { enumerable: !0, get: function() {
      return d.configureRequestOptionsFromUrl;
    } }), Object.defineProperty(r, "configureRequestUrl", { enumerable: !0, get: function() {
      return d.configureRequestUrl;
    } }), Object.defineProperty(r, "createHttpError", { enumerable: !0, get: function() {
      return d.createHttpError;
    } }), Object.defineProperty(r, "DigestTransform", { enumerable: !0, get: function() {
      return d.DigestTransform;
    } }), Object.defineProperty(r, "HttpError", { enumerable: !0, get: function() {
      return d.HttpError;
    } }), Object.defineProperty(r, "hashSensitiveValue", { enumerable: !0, get: function() {
      return d.hashSensitiveValue;
    } }), Object.defineProperty(r, "HttpExecutor", { enumerable: !0, get: function() {
      return d.HttpExecutor;
    } }), Object.defineProperty(r, "isSensitiveFieldName", { enumerable: !0, get: function() {
      return d.isSensitiveFieldName;
    } }), Object.defineProperty(r, "parseJson", { enumerable: !0, get: function() {
      return d.parseJson;
    } }), Object.defineProperty(r, "safeGetHeader", { enumerable: !0, get: function() {
      return d.safeGetHeader;
    } }), Object.defineProperty(r, "safeStringifyJson", { enumerable: !0, get: function() {
      return d.safeStringifyJson;
    } });
    var f = Qc();
    Object.defineProperty(r, "MemoLazy", { enumerable: !0, get: function() {
      return f.MemoLazy;
    } });
    var u = jl();
    Object.defineProperty(r, "ProgressCallbackTransform", { enumerable: !0, get: function() {
      return u.ProgressCallbackTransform;
    } });
    var o = Zc();
    Object.defineProperty(r, "getS3LikeProviderBaseUrl", { enumerable: !0, get: function() {
      return o.getS3LikeProviderBaseUrl;
    } }), Object.defineProperty(r, "githubUrl", { enumerable: !0, get: function() {
      return o.githubUrl;
    } }), Object.defineProperty(r, "githubTagPrefix", { enumerable: !0, get: function() {
      return o.githubTagPrefix;
    } });
    var a = ef();
    Object.defineProperty(r, "retry", { enumerable: !0, get: function() {
      return a.retry;
    } });
    var l = tf();
    Object.defineProperty(r, "parseDn", { enumerable: !0, get: function() {
      return l.parseDn;
    } });
    var i = rf();
    Object.defineProperty(r, "UUID", { enumerable: !0, get: function() {
      return i.UUID;
    } });
    var n = of();
    Object.defineProperty(r, "parseXml", { enumerable: !0, get: function() {
      return n.parseXml;
    } }), Object.defineProperty(r, "XElement", { enumerable: !0, get: function() {
      return n.XElement;
    } });
    var t = sf();
    Object.defineProperty(r, "isValidKey", { enumerable: !0, get: function() {
      return t.isValidKey;
    } }), Object.defineProperty(r, "mapToObject", { enumerable: !0, get: function() {
      return t.mapToObject;
    } }), Object.defineProperty(r, "asArray", { enumerable: !0, get: function() {
      return t.asArray;
    } }), Object.defineProperty(r, "deepAssign", { enumerable: !0, get: function() {
      return t.deepAssign;
    } }), Object.defineProperty(r, "objectToArgs", { enumerable: !0, get: function() {
      return t.objectToArgs;
    } }), r.CURRENT_APP_INSTALLER_FILE_NAME = "installer.exe", r.CURRENT_APP_PACKAGE_FILE_NAME = "package.7z";
  })(Fn)), Fn;
}
var qe = {}, kr = {}, dt = {}, Ds;
function wr() {
  if (Ds) return dt;
  Ds = 1;
  function r(o) {
    return typeof o > "u" || o === null;
  }
  function c(o) {
    return typeof o == "object" && o !== null;
  }
  function p(o) {
    return Array.isArray(o) ? o : r(o) ? [] : [o];
  }
  function d(o, a) {
    if (a) {
      const l = Object.keys(a);
      for (let i = 0, n = l.length; i < n; i += 1) {
        const t = l[i];
        o[t] = a[t];
      }
    }
    return o;
  }
  function f(o, a) {
    let l = "";
    for (let i = 0; i < a; i += 1)
      l += o;
    return l;
  }
  function u(o) {
    return o === 0 && Number.NEGATIVE_INFINITY === 1 / o;
  }
  return dt.isNothing = r, dt.isObject = c, dt.toArray = p, dt.repeat = f, dt.isNegativeZero = u, dt.extend = d, dt;
}
var qn, Ns;
function vr() {
  if (Ns) return qn;
  Ns = 1;
  function r(p, d) {
    let f = "";
    const u = p.reason || "(unknown reason)";
    return p.mark ? (p.mark.name && (f += 'in "' + p.mark.name + '" '), f += "(" + (p.mark.line + 1) + ":" + (p.mark.column + 1) + ")", !d && p.mark.snippet && (f += `

` + p.mark.snippet), u + " " + f) : u;
  }
  function c(p, d) {
    Error.call(this), this.name = "YAMLException", this.reason = p, this.mark = d, this.message = r(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
  }
  return c.prototype = Object.create(Error.prototype), c.prototype.constructor = c, c.prototype.toString = function(d) {
    return this.name + ": " + r(this, d);
  }, qn = c, qn;
}
var Mn, Fs;
function af() {
  if (Fs) return Mn;
  Fs = 1;
  const r = wr();
  function c(f, u, o, a, l) {
    let i = "", n = "";
    const t = Math.floor(l / 2) - 1;
    return a - u > t && (i = " ... ", u = a - t + i.length), o - a > t && (n = " ...", o = a + t - n.length), {
      str: i + f.slice(u, o).replace(/\t/g, "→") + n,
      pos: a - u + i.length
      // relative position
    };
  }
  function p(f, u) {
    return r.repeat(" ", u - f.length) + f;
  }
  function d(f, u) {
    if (u = Object.create(u || null), !f.buffer) return null;
    u.maxLength || (u.maxLength = 79), typeof u.indent != "number" && (u.indent = 1), typeof u.linesBefore != "number" && (u.linesBefore = 3), typeof u.linesAfter != "number" && (u.linesAfter = 2);
    const o = /\r?\n|\r|\0/g, a = [0], l = [];
    let i, n = -1;
    for (; i = o.exec(f.buffer); )
      l.push(i.index), a.push(i.index + i[0].length), f.position <= i.index && n < 0 && (n = a.length - 2);
    n < 0 && (n = a.length - 1);
    let t = "";
    const s = Math.min(f.line + u.linesAfter, l.length).toString().length, h = u.maxLength - (u.indent + s + 3);
    for (let y = 1; y <= u.linesBefore && !(n - y < 0); y++) {
      const m = c(
        f.buffer,
        a[n - y],
        l[n - y],
        f.position - (a[n] - a[n - y]),
        h
      );
      t = r.repeat(" ", u.indent) + p((f.line - y + 1).toString(), s) + " | " + m.str + `
` + t;
    }
    const g = c(f.buffer, a[n], l[n], f.position, h);
    t += r.repeat(" ", u.indent) + p((f.line + 1).toString(), s) + " | " + g.str + `
`, t += r.repeat("-", u.indent + s + 3 + g.pos) + `^
`;
    for (let y = 1; y <= u.linesAfter && !(n + y >= l.length); y++) {
      const m = c(
        f.buffer,
        a[n + y],
        l[n + y],
        f.position - (a[n] - a[n + y]),
        h
      );
      t += r.repeat(" ", u.indent) + p((f.line + y + 1).toString(), s) + " | " + m.str + `
`;
    }
    return t.replace(/\n$/, "");
  }
  return Mn = d, Mn;
}
var Bn, xs;
function Me() {
  if (xs) return Bn;
  xs = 1;
  const r = vr(), c = [
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
  ], p = [
    "scalar",
    "sequence",
    "mapping"
  ];
  function d(u) {
    const o = {};
    return u !== null && Object.keys(u).forEach(function(a) {
      u[a].forEach(function(l) {
        o[String(l)] = a;
      });
    }), o;
  }
  function f(u, o) {
    if (o = o || {}, Object.keys(o).forEach(function(a) {
      if (c.indexOf(a) === -1)
        throw new r('Unknown option "' + a + '" is met in definition of "' + u + '" YAML type.');
    }), this.options = o, this.tag = u, this.kind = o.kind || null, this.resolve = o.resolve || function() {
      return !0;
    }, this.construct = o.construct || function(a) {
      return a;
    }, this.instanceOf = o.instanceOf || null, this.predicate = o.predicate || null, this.represent = o.represent || null, this.representName = o.representName || null, this.defaultStyle = o.defaultStyle || null, this.multi = o.multi || !1, this.styleAliases = d(o.styleAliases || null), p.indexOf(this.kind) === -1)
      throw new r('Unknown kind "' + this.kind + '" is specified for "' + u + '" YAML type.');
  }
  return Bn = f, Bn;
}
var jn, Ls;
function Hl() {
  if (Ls) return jn;
  Ls = 1;
  const r = vr(), c = Me();
  function p(u, o) {
    const a = [];
    return u[o].forEach(function(l) {
      let i = a.length;
      a.forEach(function(n, t) {
        n.tag === l.tag && n.kind === l.kind && n.multi === l.multi && (i = t);
      }), a[i] = l;
    }), a;
  }
  function d() {
    const u = {
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
    };
    function o(a) {
      a.multi ? (u.multi[a.kind].push(a), u.multi.fallback.push(a)) : u[a.kind][a.tag] = u.fallback[a.tag] = a;
    }
    for (let a = 0, l = arguments.length; a < l; a += 1)
      arguments[a].forEach(o);
    return u;
  }
  function f(u) {
    return this.extend(u);
  }
  return f.prototype.extend = function(o) {
    let a = [], l = [];
    if (o instanceof c)
      l.push(o);
    else if (Array.isArray(o))
      l = l.concat(o);
    else if (o && (Array.isArray(o.implicit) || Array.isArray(o.explicit)))
      o.implicit && (a = a.concat(o.implicit)), o.explicit && (l = l.concat(o.explicit));
    else
      throw new r("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
    a.forEach(function(n) {
      if (!(n instanceof c))
        throw new r("Specified list of YAML types (or a single Type object) contains a non-Type object.");
      if (n.loadKind && n.loadKind !== "scalar")
        throw new r("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
      if (n.multi)
        throw new r("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
    }), l.forEach(function(n) {
      if (!(n instanceof c))
        throw new r("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    });
    const i = Object.create(f.prototype);
    return i.implicit = (this.implicit || []).concat(a), i.explicit = (this.explicit || []).concat(l), i.compiledImplicit = p(i, "implicit"), i.compiledExplicit = p(i, "explicit"), i.compiledTypeMap = d(i.compiledImplicit, i.compiledExplicit), i;
  }, jn = f, jn;
}
var Hn, Us;
function Gl() {
  if (Us) return Hn;
  Us = 1;
  const r = Me();
  return Hn = new r("tag:yaml.org,2002:str", {
    kind: "scalar",
    construct: function(c) {
      return c !== null ? c : "";
    }
  }), Hn;
}
var Gn, $s;
function Vl() {
  if ($s) return Gn;
  $s = 1;
  const r = Me();
  return Gn = new r("tag:yaml.org,2002:seq", {
    kind: "sequence",
    construct: function(c) {
      return c !== null ? c : [];
    }
  }), Gn;
}
var Vn, ks;
function Wl() {
  if (ks) return Vn;
  ks = 1;
  const r = Me();
  return Vn = new r("tag:yaml.org,2002:map", {
    kind: "mapping",
    construct: function(c) {
      return c !== null ? c : {};
    }
  }), Vn;
}
var Wn, qs;
function Yl() {
  if (qs) return Wn;
  qs = 1;
  const r = Hl();
  return Wn = new r({
    explicit: [
      Gl(),
      Vl(),
      Wl()
    ]
  }), Wn;
}
var Yn, Ms;
function zl() {
  if (Ms) return Yn;
  Ms = 1;
  const r = Me();
  function c(f) {
    if (f === null) return !0;
    const u = f.length;
    return u === 1 && f === "~" || u === 4 && (f === "null" || f === "Null" || f === "NULL");
  }
  function p() {
    return null;
  }
  function d(f) {
    return f === null;
  }
  return Yn = new r("tag:yaml.org,2002:null", {
    kind: "scalar",
    resolve: c,
    construct: p,
    predicate: d,
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
  }), Yn;
}
var zn, Bs;
function Xl() {
  if (Bs) return zn;
  Bs = 1;
  const r = Me();
  function c(f) {
    if (f === null) return !1;
    const u = f.length;
    return u === 4 && (f === "true" || f === "True" || f === "TRUE") || u === 5 && (f === "false" || f === "False" || f === "FALSE");
  }
  function p(f) {
    return f === "true" || f === "True" || f === "TRUE";
  }
  function d(f) {
    return Object.prototype.toString.call(f) === "[object Boolean]";
  }
  return zn = new r("tag:yaml.org,2002:bool", {
    kind: "scalar",
    resolve: c,
    construct: p,
    predicate: d,
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
  }), zn;
}
var Xn, js;
function Kl() {
  if (js) return Xn;
  js = 1;
  const r = wr(), c = Me();
  function p(i) {
    return i >= 48 && i <= 57 || i >= 65 && i <= 70 || i >= 97 && i <= 102;
  }
  function d(i) {
    return i >= 48 && i <= 55;
  }
  function f(i) {
    return i >= 48 && i <= 57;
  }
  function u(i) {
    if (i === null) return !1;
    const n = i.length;
    let t = 0, s = !1;
    if (!n) return !1;
    let h = i[t];
    if ((h === "-" || h === "+") && (h = i[++t]), h === "0") {
      if (t + 1 === n) return !0;
      if (h = i[++t], h === "b") {
        for (t++; t < n; t++) {
          if (h = i[t], h !== "0" && h !== "1") return !1;
          s = !0;
        }
        return s && isFinite(o(i));
      }
      if (h === "x") {
        for (t++; t < n; t++) {
          if (!p(i.charCodeAt(t))) return !1;
          s = !0;
        }
        return s && isFinite(o(i));
      }
      if (h === "o") {
        for (t++; t < n; t++) {
          if (!d(i.charCodeAt(t))) return !1;
          s = !0;
        }
        return s && isFinite(o(i));
      }
    }
    for (; t < n; t++) {
      if (!f(i.charCodeAt(t)))
        return !1;
      s = !0;
    }
    return s ? isFinite(o(i)) : !1;
  }
  function o(i) {
    let n = i, t = 1, s = n[0];
    if ((s === "-" || s === "+") && (s === "-" && (t = -1), n = n.slice(1), s = n[0]), n === "0") return 0;
    if (s === "0") {
      if (n[1] === "b") return t * parseInt(n.slice(2), 2);
      if (n[1] === "x") return t * parseInt(n.slice(2), 16);
      if (n[1] === "o") return t * parseInt(n.slice(2), 8);
    }
    return t * parseInt(n, 10);
  }
  function a(i) {
    return o(i);
  }
  function l(i) {
    return Object.prototype.toString.call(i) === "[object Number]" && i % 1 === 0 && !r.isNegativeZero(i);
  }
  return Xn = new c("tag:yaml.org,2002:int", {
    kind: "scalar",
    resolve: u,
    construct: a,
    predicate: l,
    represent: {
      binary: function(i) {
        return i >= 0 ? "0b" + i.toString(2) : "-0b" + i.toString(2).slice(1);
      },
      octal: function(i) {
        return i >= 0 ? "0o" + i.toString(8) : "-0o" + i.toString(8).slice(1);
      },
      decimal: function(i) {
        return i.toString(10);
      },
      hexadecimal: function(i) {
        return i >= 0 ? "0x" + i.toString(16).toUpperCase() : "-0x" + i.toString(16).toUpperCase().slice(1);
      }
    },
    defaultStyle: "decimal",
    styleAliases: {
      binary: [2, "bin"],
      octal: [8, "oct"],
      decimal: [10, "dec"],
      hexadecimal: [16, "hex"]
    }
  }), Xn;
}
var Kn, Hs;
function Jl() {
  if (Hs) return Kn;
  Hs = 1;
  const r = wr(), c = Me(), p = new RegExp(
    // 2.5e4, 2.5 and integers
    "^(?:[-+]?(?:[0-9]+)(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
  ), d = new RegExp(
    "^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
  );
  function f(i) {
    return i === null || !p.test(i) ? !1 : isFinite(parseFloat(i, 10)) ? !0 : d.test(i);
  }
  function u(i) {
    let n = i.toLowerCase();
    const t = n[0] === "-" ? -1 : 1;
    return "+-".indexOf(n[0]) >= 0 && (n = n.slice(1)), n === ".inf" ? t === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : n === ".nan" ? NaN : t * parseFloat(n, 10);
  }
  const o = /^[-+]?[0-9]+e/;
  function a(i, n) {
    if (isNaN(i))
      switch (n) {
        case "lowercase":
          return ".nan";
        case "uppercase":
          return ".NAN";
        case "camelcase":
          return ".NaN";
      }
    else if (Number.POSITIVE_INFINITY === i)
      switch (n) {
        case "lowercase":
          return ".inf";
        case "uppercase":
          return ".INF";
        case "camelcase":
          return ".Inf";
      }
    else if (Number.NEGATIVE_INFINITY === i)
      switch (n) {
        case "lowercase":
          return "-.inf";
        case "uppercase":
          return "-.INF";
        case "camelcase":
          return "-.Inf";
      }
    else if (r.isNegativeZero(i))
      return "-0.0";
    const t = i.toString(10);
    return o.test(t) ? t.replace("e", ".e") : t;
  }
  function l(i) {
    return Object.prototype.toString.call(i) === "[object Number]" && (i % 1 !== 0 || r.isNegativeZero(i));
  }
  return Kn = new c("tag:yaml.org,2002:float", {
    kind: "scalar",
    resolve: f,
    construct: u,
    predicate: l,
    represent: a,
    defaultStyle: "lowercase"
  }), Kn;
}
var Jn, Gs;
function Ql() {
  return Gs || (Gs = 1, Jn = Yl().extend({
    implicit: [
      zl(),
      Xl(),
      Kl(),
      Jl()
    ]
  })), Jn;
}
var Qn, Vs;
function Zl() {
  return Vs || (Vs = 1, Qn = Ql()), Qn;
}
var Zn, Ws;
function eu() {
  if (Ws) return Zn;
  Ws = 1;
  const r = Me(), c = new RegExp(
    "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
  ), p = new RegExp(
    "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
  );
  function d(o) {
    return o === null ? !1 : c.exec(o) !== null || p.exec(o) !== null;
  }
  function f(o) {
    let a = 0, l = null, i = c.exec(o);
    if (i === null && (i = p.exec(o)), i === null) throw new Error("Date resolve error");
    const n = +i[1], t = +i[2] - 1, s = +i[3];
    if (!i[4])
      return new Date(Date.UTC(n, t, s));
    const h = +i[4], g = +i[5], y = +i[6];
    if (i[7]) {
      for (a = i[7].slice(0, 3); a.length < 3; )
        a += "0";
      a = +a;
    }
    if (i[9]) {
      const _ = +i[10], R = +(i[11] || 0);
      l = (_ * 60 + R) * 6e4, i[9] === "-" && (l = -l);
    }
    const m = new Date(Date.UTC(n, t, s, h, g, y, a));
    return l && m.setTime(m.getTime() - l), m;
  }
  function u(o) {
    return o.toISOString();
  }
  return Zn = new r("tag:yaml.org,2002:timestamp", {
    kind: "scalar",
    resolve: d,
    construct: f,
    instanceOf: Date,
    represent: u
  }), Zn;
}
var ei, Ys;
function tu() {
  if (Ys) return ei;
  Ys = 1;
  const r = Me();
  function c(p) {
    return p === "<<" || p === null;
  }
  return ei = new r("tag:yaml.org,2002:merge", {
    kind: "scalar",
    resolve: c
  }), ei;
}
var ti, zs;
function ru() {
  if (zs) return ti;
  zs = 1;
  const r = Me(), c = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
  function p(o) {
    if (o === null) return !1;
    let a = 0;
    const l = o.length, i = c;
    for (let n = 0; n < l; n++) {
      const t = i.indexOf(o.charAt(n));
      if (!(t > 64)) {
        if (t < 0) return !1;
        a += 6;
      }
    }
    return a % 8 === 0;
  }
  function d(o) {
    const a = o.replace(/[\r\n=]/g, ""), l = a.length, i = c;
    let n = 0;
    const t = [];
    for (let h = 0; h < l; h++)
      h % 4 === 0 && h && (t.push(n >> 16 & 255), t.push(n >> 8 & 255), t.push(n & 255)), n = n << 6 | i.indexOf(a.charAt(h));
    const s = l % 4 * 6;
    return s === 0 ? (t.push(n >> 16 & 255), t.push(n >> 8 & 255), t.push(n & 255)) : s === 18 ? (t.push(n >> 10 & 255), t.push(n >> 2 & 255)) : s === 12 && t.push(n >> 4 & 255), new Uint8Array(t);
  }
  function f(o) {
    let a = "", l = 0;
    const i = o.length, n = c;
    for (let s = 0; s < i; s++)
      s % 3 === 0 && s && (a += n[l >> 18 & 63], a += n[l >> 12 & 63], a += n[l >> 6 & 63], a += n[l & 63]), l = (l << 8) + o[s];
    const t = i % 3;
    return t === 0 ? (a += n[l >> 18 & 63], a += n[l >> 12 & 63], a += n[l >> 6 & 63], a += n[l & 63]) : t === 2 ? (a += n[l >> 10 & 63], a += n[l >> 4 & 63], a += n[l << 2 & 63], a += n[64]) : t === 1 && (a += n[l >> 2 & 63], a += n[l << 4 & 63], a += n[64], a += n[64]), a;
  }
  function u(o) {
    return Object.prototype.toString.call(o) === "[object Uint8Array]";
  }
  return ti = new r("tag:yaml.org,2002:binary", {
    kind: "scalar",
    resolve: p,
    construct: d,
    predicate: u,
    represent: f
  }), ti;
}
var ri, Xs;
function nu() {
  if (Xs) return ri;
  Xs = 1;
  const r = Me(), c = Object.prototype.hasOwnProperty, p = Object.prototype.toString;
  function d(u) {
    if (u === null) return !0;
    const o = [], a = u;
    for (let l = 0, i = a.length; l < i; l += 1) {
      const n = a[l];
      let t = !1;
      if (p.call(n) !== "[object Object]") return !1;
      let s;
      for (s in n)
        if (c.call(n, s))
          if (!t) t = !0;
          else return !1;
      if (!t) return !1;
      if (o.indexOf(s) === -1) o.push(s);
      else return !1;
    }
    return !0;
  }
  function f(u) {
    return u !== null ? u : [];
  }
  return ri = new r("tag:yaml.org,2002:omap", {
    kind: "sequence",
    resolve: d,
    construct: f
  }), ri;
}
var ni, Ks;
function iu() {
  if (Ks) return ni;
  Ks = 1;
  const r = Me(), c = Object.prototype.toString;
  function p(f) {
    if (f === null) return !0;
    const u = f, o = new Array(u.length);
    for (let a = 0, l = u.length; a < l; a += 1) {
      const i = u[a];
      if (c.call(i) !== "[object Object]") return !1;
      const n = Object.keys(i);
      if (n.length !== 1) return !1;
      o[a] = [n[0], i[n[0]]];
    }
    return !0;
  }
  function d(f) {
    if (f === null) return [];
    const u = f, o = new Array(u.length);
    for (let a = 0, l = u.length; a < l; a += 1) {
      const i = u[a], n = Object.keys(i);
      o[a] = [n[0], i[n[0]]];
    }
    return o;
  }
  return ni = new r("tag:yaml.org,2002:pairs", {
    kind: "sequence",
    resolve: p,
    construct: d
  }), ni;
}
var ii, Js;
function ou() {
  if (Js) return ii;
  Js = 1;
  const r = Me(), c = Object.prototype.hasOwnProperty;
  function p(f) {
    if (f === null) return !0;
    const u = f;
    for (const o in u)
      if (c.call(u, o) && u[o] !== null)
        return !1;
    return !0;
  }
  function d(f) {
    return f !== null ? f : {};
  }
  return ii = new r("tag:yaml.org,2002:set", {
    kind: "mapping",
    resolve: p,
    construct: d
  }), ii;
}
var oi, Qs;
function so() {
  return Qs || (Qs = 1, oi = Zl().extend({
    implicit: [
      eu(),
      tu()
    ],
    explicit: [
      ru(),
      nu(),
      iu(),
      ou()
    ]
  })), oi;
}
var Zs;
function lf() {
  if (Zs) return kr;
  Zs = 1;
  const r = wr(), c = vr(), p = af(), d = so(), f = Object.prototype.hasOwnProperty, u = 1, o = 2, a = 3, l = 4, i = 1, n = 2, t = 3, s = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, h = /[\x85\u2028\u2029]/, g = /[,\[\]{}]/, y = /^(?:!|!!|![0-9A-Za-z-]+!)$/, m = /^(?:!|[^,\[\]{}])(?:%[0-9a-f]{2}|[0-9a-z\-#;/?:@&=+$,_.!~*'()\[\]])*$/i;
  function _(e) {
    return Object.prototype.toString.call(e);
  }
  function R(e) {
    return e === 10 || e === 13;
  }
  function b(e) {
    return e === 9 || e === 32;
  }
  function D(e) {
    return e === 9 || e === 32 || e === 10 || e === 13;
  }
  function C(e) {
    return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
  }
  function F(e) {
    if (e >= 48 && e <= 57)
      return e - 48;
    const k = e | 32;
    return k >= 97 && k <= 102 ? k - 97 + 10 : -1;
  }
  function I(e) {
    return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
  }
  function x(e) {
    return e >= 48 && e <= 57 ? e - 48 : -1;
  }
  function B(e) {
    switch (e) {
      case 48:
        return "\0";
      case 97:
        return "\x07";
      case 98:
        return "\b";
      case 116:
        return "	";
      case 9:
        return "	";
      case 110:
        return `
`;
      case 118:
        return "\v";
      case 102:
        return "\f";
      case 114:
        return "\r";
      case 101:
        return "\x1B";
      case 32:
        return " ";
      case 34:
        return '"';
      case 47:
        return "/";
      case 92:
        return "\\";
      case 78:
        return "";
      case 95:
        return " ";
      case 76:
        return "\u2028";
      case 80:
        return "\u2029";
      default:
        return "";
    }
  }
  function S(e) {
    return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
      (e - 65536 >> 10) + 55296,
      (e - 65536 & 1023) + 56320
    );
  }
  function Y(e, k, W) {
    k === "__proto__" ? Object.defineProperty(e, k, {
      configurable: !0,
      enumerable: !0,
      writable: !0,
      value: W
    }) : e[k] = W;
  }
  const H = new Array(256), V = new Array(256);
  for (let e = 0; e < 256; e++)
    H[e] = B(e) ? 1 : 0, V[e] = B(e);
  function L(e, k) {
    this.input = e, this.filename = k.filename || null, this.schema = k.schema || d, this.onWarning = k.onWarning || null, this.legacy = k.legacy || !1, this.json = k.json || !1, this.listener = k.listener || null, this.maxDepth = typeof k.maxDepth == "number" ? k.maxDepth : 100, this.maxTotalMergeKeys = typeof k.maxTotalMergeKeys == "number" ? k.maxTotalMergeKeys : 1e4, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.depth = 0, this.totalMergeKeys = 0, this.firstTabInLine = -1, this.documents = [], this.anchorMapTransactions = [];
  }
  function P(e, k) {
    const W = {
      name: e.filename,
      buffer: e.input.slice(0, -1),
      // omit trailing \0
      position: e.position,
      line: e.line,
      column: e.position - e.lineStart
    };
    return W.snippet = p(W), new c(k, W);
  }
  function A(e, k) {
    throw P(e, k);
  }
  function O(e, k) {
    e.onWarning && e.onWarning.call(null, P(e, k));
  }
  function $(e, k, W) {
    const Q = e.anchorMapTransactions;
    if (Q.length !== 0) {
      const G = Q[Q.length - 1];
      f.call(G, k) || (G[k] = {
        existed: f.call(e.anchorMap, k),
        value: e.anchorMap[k]
      });
    }
    e.anchorMap[k] = W;
  }
  function j(e) {
    e.anchorMapTransactions.push(/* @__PURE__ */ Object.create(null));
  }
  function X(e) {
    const k = e.anchorMapTransactions.pop(), W = e.anchorMapTransactions;
    if (W.length === 0) return;
    const Q = W[W.length - 1], G = Object.keys(k);
    for (let ie = 0, v = G.length; ie < v; ie += 1) {
      const M = G[ie];
      f.call(Q, M) || (Q[M] = k[M]);
    }
  }
  function oe(e) {
    const k = e.anchorMapTransactions.pop(), W = Object.keys(k);
    for (let Q = W.length - 1; Q >= 0; Q -= 1) {
      const G = k[W[Q]];
      G.existed ? e.anchorMap[W[Q]] = G.value : delete e.anchorMap[W[Q]];
    }
  }
  function Z(e) {
    return {
      position: e.position,
      line: e.line,
      lineStart: e.lineStart,
      lineIndent: e.lineIndent,
      firstTabInLine: e.firstTabInLine,
      tag: e.tag,
      anchor: e.anchor,
      kind: e.kind,
      result: e.result
    };
  }
  function de(e, k) {
    e.position = k.position, e.line = k.line, e.lineStart = k.lineStart, e.lineIndent = k.lineIndent, e.firstTabInLine = k.firstTabInLine, e.tag = k.tag, e.anchor = k.anchor, e.kind = k.kind, e.result = k.result;
  }
  const Ee = {
    YAML: function(k, W, Q) {
      k.version !== null && A(k, "duplication of %YAML directive"), Q.length !== 1 && A(k, "YAML directive accepts exactly one argument");
      const G = /^([0-9]+)\.([0-9]+)$/.exec(Q[0]);
      G === null && A(k, "ill-formed argument of the YAML directive");
      const ie = parseInt(G[1], 10), v = parseInt(G[2], 10);
      ie !== 1 && A(k, "unacceptable YAML version of the document"), k.version = Q[0], k.checkLineBreaks = v < 2, v !== 1 && v !== 2 && O(k, "unsupported YAML version of the document");
    },
    TAG: function(k, W, Q) {
      let G;
      Q.length !== 2 && A(k, "TAG directive accepts exactly two arguments");
      const ie = Q[0];
      G = Q[1], y.test(ie) || A(k, "ill-formed tag handle (first argument) of the TAG directive"), f.call(k.tagMap, ie) && A(k, 'there is a previously declared suffix for "' + ie + '" tag handle'), m.test(G) || A(k, "ill-formed tag prefix (second argument) of the TAG directive");
      try {
        G = decodeURIComponent(G);
      } catch {
        A(k, "tag prefix is malformed: " + G);
      }
      k.tagMap[ie] = G;
    }
  };
  function K(e, k, W, Q) {
    if (k < W) {
      const G = e.input.slice(k, W);
      if (Q)
        for (let ie = 0, v = G.length; ie < v; ie += 1) {
          const M = G.charCodeAt(ie);
          M === 9 || M >= 32 && M <= 1114111 || A(e, "expected valid JSON character");
        }
      else s.test(G) && A(e, "the stream contains non-printable characters");
      e.result += G;
    }
  }
  function ue(e, k, W, Q) {
    r.isObject(W) || A(e, "cannot merge mappings; the provided source object is unacceptable");
    const G = Object.keys(W);
    for (let ie = 0, v = G.length; ie < v; ie += 1) {
      const M = G[ie];
      e.maxTotalMergeKeys !== -1 && ++e.totalMergeKeys > e.maxTotalMergeKeys && A(e, "merge keys exceeded maxTotalMergeKeys (" + e.maxTotalMergeKeys + ")"), f.call(k, M) || (Y(k, M, W[M]), Q[M] = !0);
    }
  }
  function he(e, k, W, Q, G, ie, v, M, ne) {
    if (Array.isArray(G)) {
      G = Array.prototype.slice.call(G);
      for (let z = 0, J = G.length; z < J; z += 1)
        Array.isArray(G[z]) && A(e, "nested arrays are not supported inside keys"), typeof G == "object" && _(G[z]) === "[object Object]" && (G[z] = "[object Object]");
    }
    if (typeof G == "object" && _(G) === "[object Object]" && (G = "[object Object]"), G = String(G), k === null && (k = {}), Q === "tag:yaml.org,2002:merge")
      if (Array.isArray(ie))
        for (let z = 0, J = ie.length; z < J; z += 1)
          ue(e, k, ie[z], W);
      else
        ue(e, k, ie, W);
    else
      !e.json && !f.call(W, G) && f.call(k, G) && (e.line = v || e.line, e.lineStart = M || e.lineStart, e.position = ne || e.position, A(e, "duplicated mapping key")), Y(k, G, ie), delete W[G];
    return k;
  }
  function me(e) {
    const k = e.input.charCodeAt(e.position);
    k === 10 ? e.position++ : k === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : A(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
  }
  function pe(e, k, W) {
    let Q = 0, G = e.input.charCodeAt(e.position);
    for (; G !== 0; ) {
      for (; b(G); )
        G === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), G = e.input.charCodeAt(++e.position);
      if (k && G === 35)
        do
          G = e.input.charCodeAt(++e.position);
        while (G !== 10 && G !== 13 && G !== 0);
      if (R(G))
        for (me(e), G = e.input.charCodeAt(e.position), Q++, e.lineIndent = 0; G === 32; )
          e.lineIndent++, G = e.input.charCodeAt(++e.position);
      else
        break;
    }
    return W !== -1 && Q !== 0 && e.lineIndent < W && O(e, "deficient indentation"), Q;
  }
  function Ae(e) {
    let k = e.position, W = e.input.charCodeAt(k);
    return !!((W === 45 || W === 46) && W === e.input.charCodeAt(k + 1) && W === e.input.charCodeAt(k + 2) && (k += 3, W = e.input.charCodeAt(k), W === 0 || D(W)));
  }
  function we(e, k) {
    k === 1 ? e.result += " " : k > 1 && (e.result += r.repeat(`
`, k - 1));
  }
  function w(e, k, W) {
    let Q, G, ie, v, M, ne;
    const z = e.kind, J = e.result;
    let ee = e.input.charCodeAt(e.position);
    if (D(ee) || C(ee) || ee === 35 || ee === 38 || ee === 42 || ee === 33 || ee === 124 || ee === 62 || ee === 39 || ee === 34 || ee === 37 || ee === 64 || ee === 96)
      return !1;
    if (ee === 63 || ee === 45) {
      const re = e.input.charCodeAt(e.position + 1);
      if (D(re) || W && C(re))
        return !1;
    }
    for (e.kind = "scalar", e.result = "", Q = G = e.position, ie = !1; ee !== 0; ) {
      if (ee === 58) {
        const re = e.input.charCodeAt(e.position + 1);
        if (D(re) || W && C(re))
          break;
      } else if (ee === 35) {
        const re = e.input.charCodeAt(e.position - 1);
        if (D(re))
          break;
      } else {
        if (e.position === e.lineStart && Ae(e) || W && C(ee))
          break;
        if (R(ee))
          if (v = e.line, M = e.lineStart, ne = e.lineIndent, pe(e, !1, -1), e.lineIndent >= k) {
            ie = !0, ee = e.input.charCodeAt(e.position);
            continue;
          } else {
            e.position = G, e.line = v, e.lineStart = M, e.lineIndent = ne;
            break;
          }
      }
      ie && (K(e, Q, G, !1), we(e, e.line - v), Q = G = e.position, ie = !1), b(ee) || (G = e.position + 1), ee = e.input.charCodeAt(++e.position);
    }
    return K(e, Q, G, !1), e.result ? !0 : (e.kind = z, e.result = J, !1);
  }
  function E(e, k) {
    let W, Q, G = e.input.charCodeAt(e.position);
    if (G !== 39)
      return !1;
    for (e.kind = "scalar", e.result = "", e.position++, W = Q = e.position; (G = e.input.charCodeAt(e.position)) !== 0; )
      if (G === 39)
        if (K(e, W, e.position, !0), G = e.input.charCodeAt(++e.position), G === 39)
          W = e.position, e.position++, Q = e.position;
        else
          return !0;
      else R(G) ? (K(e, W, Q, !0), we(e, pe(e, !1, k)), W = Q = e.position) : e.position === e.lineStart && Ae(e) ? A(e, "unexpected end of the document within a single quoted scalar") : (e.position++, b(G) || (Q = e.position));
    A(e, "unexpected end of the stream within a single quoted scalar");
  }
  function q(e, k) {
    let W, Q, G, ie = e.input.charCodeAt(e.position);
    if (ie !== 34)
      return !1;
    for (e.kind = "scalar", e.result = "", e.position++, W = Q = e.position; (ie = e.input.charCodeAt(e.position)) !== 0; ) {
      if (ie === 34)
        return K(e, W, e.position, !0), e.position++, !0;
      if (ie === 92) {
        if (K(e, W, e.position, !0), ie = e.input.charCodeAt(++e.position), R(ie))
          pe(e, !1, k);
        else if (ie < 256 && H[ie])
          e.result += V[ie], e.position++;
        else if ((G = I(ie)) > 0) {
          let v = G, M = 0;
          for (; v > 0; v--)
            ie = e.input.charCodeAt(++e.position), (G = F(ie)) >= 0 ? M = (M << 4) + G : A(e, "expected hexadecimal character");
          e.result += S(M), e.position++;
        } else
          A(e, "unknown escape sequence");
        W = Q = e.position;
      } else R(ie) ? (K(e, W, Q, !0), we(e, pe(e, !1, k)), W = Q = e.position) : e.position === e.lineStart && Ae(e) ? A(e, "unexpected end of the document within a double quoted scalar") : (e.position++, b(ie) || (Q = e.position));
    }
    A(e, "unexpected end of the stream within a double quoted scalar");
  }
  function N(e, k) {
    let W = !0, Q, G, ie;
    const v = e.tag;
    let M;
    const ne = e.anchor;
    let z, J, ee, re;
    const ae = /* @__PURE__ */ Object.create(null);
    let se, ce, fe, ye = e.input.charCodeAt(e.position);
    if (ye === 91)
      z = 93, re = !1, M = [];
    else if (ye === 123)
      z = 125, re = !0, M = {};
    else
      return !1;
    for (e.anchor !== null && $(e, e.anchor, M), ye = e.input.charCodeAt(++e.position); ye !== 0; ) {
      if (pe(e, !0, k), ye = e.input.charCodeAt(e.position), ye === z)
        return e.position++, e.tag = v, e.anchor = ne, e.kind = re ? "mapping" : "sequence", e.result = M, !0;
      if (W ? ye === 44 && A(e, "expected the node content, but found ','") : A(e, "missed comma between flow collection entries"), ce = se = fe = null, J = ee = !1, ye === 63) {
        const Te = e.input.charCodeAt(e.position + 1);
        D(Te) && (J = ee = !0, e.position++, pe(e, !0, k));
      }
      Q = e.line, G = e.lineStart, ie = e.position, De(e, k, u, !1, !0), ce = e.tag, se = e.result, pe(e, !0, k), ye = e.input.charCodeAt(e.position), (ee || e.line === Q) && ye === 58 && (J = !0, ye = e.input.charCodeAt(++e.position), pe(e, !0, k), De(e, k, u, !1, !0), fe = e.result), re ? he(e, M, ae, ce, se, fe, Q, G, ie) : J ? M.push(he(e, null, ae, ce, se, fe, Q, G, ie)) : M.push(se), pe(e, !0, k), ye = e.input.charCodeAt(e.position), ye === 44 ? (W = !0, ye = e.input.charCodeAt(++e.position)) : W = !1;
    }
    A(e, "unexpected end of the stream within a flow collection");
  }
  function ve(e, k) {
    let W, Q = i, G = !1, ie = !1, v = k, M = 0, ne = !1, z, J = e.input.charCodeAt(e.position);
    if (J === 124)
      W = !1;
    else if (J === 62)
      W = !0;
    else
      return !1;
    for (e.kind = "scalar", e.result = ""; J !== 0; )
      if (J = e.input.charCodeAt(++e.position), J === 43 || J === 45)
        i === Q ? Q = J === 43 ? t : n : A(e, "repeat of a chomping mode identifier");
      else if ((z = x(J)) >= 0)
        z === 0 ? A(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : ie ? A(e, "repeat of an indentation width identifier") : (v = k + z - 1, ie = !0);
      else
        break;
    if (b(J)) {
      do
        J = e.input.charCodeAt(++e.position);
      while (b(J));
      if (J === 35)
        do
          J = e.input.charCodeAt(++e.position);
        while (!R(J) && J !== 0);
    }
    for (; J !== 0; ) {
      for (me(e), e.lineIndent = 0, J = e.input.charCodeAt(e.position); (!ie || e.lineIndent < v) && J === 32; )
        e.lineIndent++, J = e.input.charCodeAt(++e.position);
      if (!ie && e.lineIndent > v && (v = e.lineIndent), R(J)) {
        M++;
        continue;
      }
      if (!ie && v === 0 && A(e, "missing indentation for block scalar"), e.lineIndent < v) {
        Q === t ? e.result += r.repeat(`
`, G ? 1 + M : M) : Q === i && G && (e.result += `
`);
        break;
      }
      W ? b(J) ? (ne = !0, e.result += r.repeat(`
`, G ? 1 + M : M)) : ne ? (ne = !1, e.result += r.repeat(`
`, M + 1)) : M === 0 ? G && (e.result += " ") : e.result += r.repeat(`
`, M) : e.result += r.repeat(`
`, G ? 1 + M : M), G = !0, ie = !0, M = 0;
      const ee = e.position;
      for (; !R(J) && J !== 0; )
        J = e.input.charCodeAt(++e.position);
      K(e, ee, e.position, !1);
    }
    return !0;
  }
  function Re(e, k) {
    const W = e.tag, Q = e.anchor, G = [];
    let ie = !1;
    if (e.firstTabInLine !== -1) return !1;
    e.anchor !== null && $(e, e.anchor, G);
    let v = e.input.charCodeAt(e.position);
    for (; v !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, A(e, "tab characters must not be used in indentation")), v === 45); ) {
      const M = e.input.charCodeAt(e.position + 1);
      if (!D(M))
        break;
      if (ie = !0, e.position++, pe(e, !0, -1) && e.lineIndent <= k) {
        G.push(null), v = e.input.charCodeAt(e.position);
        continue;
      }
      const ne = e.line;
      if (De(e, k, a, !1, !0), G.push(e.result), pe(e, !0, -1), v = e.input.charCodeAt(e.position), (e.line === ne || e.lineIndent > k) && v !== 0)
        A(e, "bad indentation of a sequence entry");
      else if (e.lineIndent < k)
        break;
    }
    return ie ? (e.tag = W, e.anchor = Q, e.kind = "sequence", e.result = G, !0) : !1;
  }
  function Se(e, k, W) {
    let Q, G, ie, v;
    const M = e.tag, ne = e.anchor, z = {}, J = /* @__PURE__ */ Object.create(null);
    let ee = null, re = null, ae = null, se = !1, ce = !1;
    if (e.firstTabInLine !== -1) return !1;
    e.anchor !== null && $(e, e.anchor, z);
    let fe = e.input.charCodeAt(e.position);
    for (; fe !== 0; ) {
      !se && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, A(e, "tab characters must not be used in indentation"));
      const ye = e.input.charCodeAt(e.position + 1), Te = e.line;
      if ((fe === 63 || fe === 58) && D(ye))
        fe === 63 ? (se && (he(e, z, J, ee, re, null, G, ie, v), ee = re = ae = null), ce = !0, se = !0, Q = !0) : se ? (se = !1, Q = !0) : A(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, fe = ye;
      else {
        if (G = e.line, ie = e.lineStart, v = e.position, !De(e, W, o, !1, !0))
          break;
        if (e.line === Te) {
          for (fe = e.input.charCodeAt(e.position); b(fe); )
            fe = e.input.charCodeAt(++e.position);
          if (fe === 58)
            fe = e.input.charCodeAt(++e.position), D(fe) || A(e, "a whitespace character is expected after the key-value separator within a block mapping"), se && (he(e, z, J, ee, re, null, G, ie, v), ee = re = ae = null), ce = !0, se = !1, Q = !1, ee = e.tag, re = e.result;
          else if (ce)
            A(e, "can not read an implicit mapping pair; a colon is missed");
          else
            return e.tag = M, e.anchor = ne, !0;
        } else if (ce)
          A(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
        else
          return e.tag = M, e.anchor = ne, !0;
      }
      if ((e.line === Te || e.lineIndent > k) && (se && (G = e.line, ie = e.lineStart, v = e.position), De(e, k, l, !0, Q) && (se ? re = e.result : ae = e.result), se || (he(e, z, J, ee, re, ae, G, ie, v), ee = re = ae = null), pe(e, !0, -1), fe = e.input.charCodeAt(e.position)), (e.line === Te || e.lineIndent > k) && fe !== 0)
        A(e, "bad indentation of a mapping entry");
      else if (e.lineIndent < k)
        break;
    }
    return se && he(e, z, J, ee, re, null, G, ie, v), ce && (e.tag = M, e.anchor = ne, e.kind = "mapping", e.result = z), ce;
  }
  function Ne(e) {
    let k = !1, W = !1, Q, G, ie = e.input.charCodeAt(e.position);
    if (ie !== 33) return !1;
    e.tag !== null && A(e, "duplication of a tag property"), ie = e.input.charCodeAt(++e.position), ie === 60 ? (k = !0, ie = e.input.charCodeAt(++e.position)) : ie === 33 ? (W = !0, Q = "!!", ie = e.input.charCodeAt(++e.position)) : Q = "!";
    let v = e.position;
    if (k) {
      do
        ie = e.input.charCodeAt(++e.position);
      while (ie !== 0 && ie !== 62);
      e.position < e.length ? (G = e.input.slice(v, e.position), ie = e.input.charCodeAt(++e.position)) : A(e, "unexpected end of the stream within a verbatim tag");
    } else {
      for (; ie !== 0 && !D(ie); )
        ie === 33 && (W ? A(e, "tag suffix cannot contain exclamation marks") : (Q = e.input.slice(v - 1, e.position + 1), y.test(Q) || A(e, "named tag handle cannot contain such characters"), W = !0, v = e.position + 1)), ie = e.input.charCodeAt(++e.position);
      G = e.input.slice(v, e.position), g.test(G) && A(e, "tag suffix cannot contain flow indicator characters");
    }
    G && !m.test(G) && A(e, "tag name cannot contain such characters: " + G);
    try {
      G = decodeURIComponent(G);
    } catch {
      A(e, "tag name is malformed: " + G);
    }
    return k ? e.tag = G : f.call(e.tagMap, Q) ? e.tag = e.tagMap[Q] + G : Q === "!" ? e.tag = "!" + G : Q === "!!" ? e.tag = "tag:yaml.org,2002:" + G : A(e, 'undeclared tag handle "' + Q + '"'), !0;
  }
  function Ie(e) {
    let k = e.input.charCodeAt(e.position);
    if (k !== 38) return !1;
    e.anchor !== null && A(e, "duplication of an anchor property"), k = e.input.charCodeAt(++e.position);
    const W = e.position;
    for (; k !== 0 && !D(k) && !C(k); )
      k = e.input.charCodeAt(++e.position);
    return e.position === W && A(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(W, e.position), !0;
  }
  function $e(e) {
    let k = e.input.charCodeAt(e.position);
    if (k !== 42) return !1;
    k = e.input.charCodeAt(++e.position);
    const W = e.position;
    for (; k !== 0 && !D(k) && !C(k); )
      k = e.input.charCodeAt(++e.position);
    e.position === W && A(e, "name of an alias node must contain at least one character");
    const Q = e.input.slice(W, e.position);
    return f.call(e.anchorMap, Q) || A(e, 'unidentified alias "' + Q + '"'), e.result = e.anchorMap[Q], pe(e, !0, -1), !0;
  }
  function Ce(e, k, W, Q) {
    const G = Z(e);
    return j(e), de(e, k), e.tag = null, e.anchor = null, e.kind = null, e.result = null, Se(e, W, Q) && e.kind === "mapping" ? (X(e), !0) : (oe(e), de(e, G), !1);
  }
  function De(e, k, W, Q, G) {
    let ie, v, M = 1, ne = !1, z = !1, J = null, ee, re, ae;
    e.depth >= e.maxDepth && A(e, "nesting exceeded maxDepth (" + e.maxDepth + ")"), e.depth += 1, e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null;
    const se = ie = v = l === W || a === W;
    if (Q && pe(e, !0, -1) && (ne = !0, e.lineIndent > k ? M = 1 : e.lineIndent === k ? M = 0 : e.lineIndent < k && (M = -1)), M === 1)
      for (; ; ) {
        const ce = e.input.charCodeAt(e.position), fe = Z(e);
        if (ne && (ce === 33 && e.tag !== null || ce === 38 && e.anchor !== null) || !Ne(e) && !Ie(e))
          break;
        J === null && (J = fe), pe(e, !0, -1) ? (ne = !0, v = se, e.lineIndent > k ? M = 1 : e.lineIndent === k ? M = 0 : e.lineIndent < k && (M = -1)) : v = !1;
      }
    if (v && (v = ne || G), M === 1 || l === W)
      if (u === W || o === W ? re = k : re = k + 1, ae = e.position - e.lineStart, M === 1)
        if (v && (Re(e, ae) || Se(e, ae, re)) || N(e, re))
          z = !0;
        else {
          const ce = e.input.charCodeAt(e.position);
          J !== null && se && !v && ce !== 124 && ce !== 62 && Ce(
            e,
            J,
            J.position - J.lineStart,
            re
          ) || ie && ve(e, re) || E(e, re) || q(e, re) ? z = !0 : $e(e) ? (z = !0, (e.tag !== null || e.anchor !== null) && A(e, "alias node should not have any properties")) : w(e, re, u === W) && (z = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && $(e, e.anchor, e.result);
        }
      else M === 0 && (z = v && Re(e, ae));
    if (e.tag === null)
      e.anchor !== null && $(e, e.anchor, e.result);
    else if (e.tag === "?") {
      e.result !== null && e.kind !== "scalar" && A(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"');
      for (let ce = 0, fe = e.implicitTypes.length; ce < fe; ce += 1)
        if (ee = e.implicitTypes[ce], ee.resolve(e.result)) {
          e.result = ee.construct(e.result), e.tag = ee.tag, e.anchor !== null && $(e, e.anchor, e.result);
          break;
        }
    } else if (e.tag !== "!") {
      if (f.call(e.typeMap[e.kind || "fallback"], e.tag))
        ee = e.typeMap[e.kind || "fallback"][e.tag];
      else {
        ee = null;
        const ce = e.typeMap.multi[e.kind || "fallback"];
        for (let fe = 0, ye = ce.length; fe < ye; fe += 1)
          if (e.tag.slice(0, ce[fe].tag.length) === ce[fe].tag) {
            ee = ce[fe];
            break;
          }
      }
      ee || A(e, "unknown tag !<" + e.tag + ">"), e.result !== null && ee.kind !== e.kind && A(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + ee.kind + '", not "' + e.kind + '"'), ee.resolve(e.result, e.tag) ? (e.result = ee.construct(e.result, e.tag), e.anchor !== null && $(e, e.anchor, e.result)) : A(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
    }
    return e.listener !== null && e.listener("close", e), e.depth -= 1, e.tag !== null || e.anchor !== null || z;
  }
  function Et(e) {
    const k = e.position;
    let W = !1, Q;
    for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (Q = e.input.charCodeAt(e.position)) !== 0 && (pe(e, !0, -1), Q = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || Q !== 37)); ) {
      W = !0, Q = e.input.charCodeAt(++e.position);
      let G = e.position;
      for (; Q !== 0 && !D(Q); )
        Q = e.input.charCodeAt(++e.position);
      const ie = e.input.slice(G, e.position), v = [];
      for (ie.length < 1 && A(e, "directive name must not be less than one character in length"); Q !== 0; ) {
        for (; b(Q); )
          Q = e.input.charCodeAt(++e.position);
        if (Q === 35) {
          do
            Q = e.input.charCodeAt(++e.position);
          while (Q !== 0 && !R(Q));
          break;
        }
        if (R(Q)) break;
        for (G = e.position; Q !== 0 && !D(Q); )
          Q = e.input.charCodeAt(++e.position);
        v.push(e.input.slice(G, e.position));
      }
      Q !== 0 && me(e), f.call(Ee, ie) ? Ee[ie](e, ie, v) : O(e, 'unknown document directive "' + ie + '"');
    }
    if (pe(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, pe(e, !0, -1)) : W && A(e, "directives end mark is expected"), De(e, e.lineIndent - 1, l, !1, !0), pe(e, !0, -1), e.checkLineBreaks && h.test(e.input.slice(k, e.position)) && O(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && Ae(e)) {
      e.input.charCodeAt(e.position) === 46 && (e.position += 3, pe(e, !0, -1));
      return;
    }
    e.position < e.length - 1 && A(e, "end of the stream or a document separator is expected");
  }
  function it(e, k) {
    e = String(e), k = k || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
    const W = new L(e, k), Q = e.indexOf("\0");
    for (Q !== -1 && (W.position = Q, A(W, "null byte is not allowed in input")), W.input += "\0"; W.input.charCodeAt(W.position) === 32; )
      W.lineIndent += 1, W.position += 1;
    for (; W.position < W.length - 1; )
      Et(W);
    return W.documents;
  }
  function rt(e, k, W) {
    k !== null && typeof k == "object" && typeof W > "u" && (W = k, k = null);
    const Q = it(e, W);
    if (typeof k != "function")
      return Q;
    for (let G = 0, ie = Q.length; G < ie; G += 1)
      k(Q[G]);
  }
  function Ke(e, k) {
    const W = it(e, k);
    if (W.length !== 0) {
      if (W.length === 1)
        return W[0];
      throw new c("expected a single document in the stream, but found more");
    }
  }
  return kr.loadAll = rt, kr.load = Ke, kr;
}
var si = {}, ea;
function uf() {
  if (ea) return si;
  ea = 1;
  const r = wr(), c = vr(), p = so(), d = Object.prototype.toString, f = Object.prototype.hasOwnProperty, u = 65279, o = 9, a = 10, l = 13, i = 32, n = 33, t = 34, s = 35, h = 37, g = 38, y = 39, m = 42, _ = 44, R = 45, b = 58, D = 61, C = 62, F = 63, I = 64, x = 91, B = 93, S = 96, Y = 123, H = 124, V = 125, L = {};
  L[0] = "\\0", L[7] = "\\a", L[8] = "\\b", L[9] = "\\t", L[10] = "\\n", L[11] = "\\v", L[12] = "\\f", L[13] = "\\r", L[27] = "\\e", L[34] = '\\"', L[92] = "\\\\", L[133] = "\\N", L[160] = "\\_", L[8232] = "\\L", L[8233] = "\\P";
  const P = [
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
  ], A = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
  function O(v, M) {
    if (M === null) return {};
    const ne = {}, z = Object.keys(M);
    for (let J = 0, ee = z.length; J < ee; J += 1) {
      let re = z[J], ae = String(M[re]);
      re.slice(0, 2) === "!!" && (re = "tag:yaml.org,2002:" + re.slice(2));
      const se = v.compiledTypeMap.fallback[re];
      se && f.call(se.styleAliases, ae) && (ae = se.styleAliases[ae]), ne[re] = ae;
    }
    return ne;
  }
  function $(v) {
    let M, ne;
    const z = v.toString(16).toUpperCase();
    if (v <= 255)
      M = "x", ne = 2;
    else if (v <= 65535)
      M = "u", ne = 4;
    else if (v <= 4294967295)
      M = "U", ne = 8;
    else
      throw new c("code point within a string may not be greater than 0xFFFFFFFF");
    return "\\" + M + r.repeat("0", ne - z.length) + z;
  }
  const j = 1, X = 2;
  function oe(v) {
    this.schema = v.schema || p, this.indent = Math.max(1, v.indent || 2), this.noArrayIndent = v.noArrayIndent || !1, this.skipInvalid = v.skipInvalid || !1, this.flowLevel = r.isNothing(v.flowLevel) ? -1 : v.flowLevel, this.styleMap = O(this.schema, v.styles || null), this.sortKeys = v.sortKeys || !1, this.lineWidth = v.lineWidth || 80, this.noRefs = v.noRefs || !1, this.noCompatMode = v.noCompatMode || !1, this.condenseFlow = v.condenseFlow || !1, this.quotingType = v.quotingType === '"' ? X : j, this.forceQuotes = v.forceQuotes || !1, this.replacer = typeof v.replacer == "function" ? v.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
  }
  function Z(v, M) {
    const ne = r.repeat(" ", M);
    let z = 0, J = "";
    const ee = v.length;
    for (; z < ee; ) {
      let re;
      const ae = v.indexOf(`
`, z);
      ae === -1 ? (re = v.slice(z), z = ee) : (re = v.slice(z, ae + 1), z = ae + 1), re.length && re !== `
` && (J += ne), J += re;
    }
    return J;
  }
  function de(v, M) {
    return `
` + r.repeat(" ", v.indent * M);
  }
  function Ee(v, M) {
    for (let ne = 0, z = v.implicitTypes.length; ne < z; ne += 1)
      if (v.implicitTypes[ne].resolve(M))
        return !0;
    return !1;
  }
  function K(v) {
    return v === i || v === o;
  }
  function ue(v) {
    return v >= 32 && v <= 126 || v >= 161 && v <= 55295 && v !== 8232 && v !== 8233 || v >= 57344 && v <= 65533 && v !== u || v >= 65536 && v <= 1114111;
  }
  function he(v) {
    return ue(v) && v !== u && // - b-char
    v !== l && v !== a;
  }
  function me(v, M, ne) {
    const z = he(v), J = z && !K(v);
    return (
      // ns-plain-safe
      (ne ? z : z && // - c-flow-indicator
      v !== _ && v !== x && v !== B && v !== Y && v !== V) && // ns-plain-char
      v !== s && // false on '#'
      !(M === b && !J) || // false on ': '
      he(M) && !K(M) && v === s || // change to true on '[^ ]#'
      M === b && J
    );
  }
  function pe(v) {
    return ue(v) && v !== u && !K(v) && // - s-white
    // - (c-indicator ::=
    // “-” | “?” | “:” | “,” | “[” | “]” | “{” | “}”
    v !== R && v !== F && v !== b && v !== _ && v !== x && v !== B && v !== Y && v !== V && // | “#” | “&” | “*” | “!” | “|” | “=” | “>” | “'” | “"”
    v !== s && v !== g && v !== m && v !== n && v !== H && v !== D && v !== C && v !== y && v !== t && // | “%” | “@” | “`”)
    v !== h && v !== I && v !== S;
  }
  function Ae(v) {
    return !K(v) && v !== b;
  }
  function we(v, M) {
    const ne = v.charCodeAt(M);
    let z;
    return ne >= 55296 && ne <= 56319 && M + 1 < v.length && (z = v.charCodeAt(M + 1), z >= 56320 && z <= 57343) ? (ne - 55296) * 1024 + z - 56320 + 65536 : ne;
  }
  function w(v) {
    return /^\n* /.test(v);
  }
  const E = 1, q = 2, N = 3, ve = 4, Re = 5;
  function Se(v, M, ne, z, J, ee, re, ae) {
    let se, ce = 0, fe = null, ye = !1, Te = !1;
    const Dt = z !== -1;
    let Je = -1, yt = pe(we(v, 0)) && Ae(we(v, v.length - 1));
    if (M || re)
      for (se = 0; se < v.length; ce >= 65536 ? se += 2 : se++) {
        if (ce = we(v, se), !ue(ce))
          return Re;
        yt = yt && me(ce, fe, ae), fe = ce;
      }
    else {
      for (se = 0; se < v.length; ce >= 65536 ? se += 2 : se++) {
        if (ce = we(v, se), ce === a)
          ye = !0, Dt && (Te = Te || // Foldable line = too long, and not more-indented.
          se - Je - 1 > z && v[Je + 1] !== " ", Je = se);
        else if (!ue(ce))
          return Re;
        yt = yt && me(ce, fe, ae), fe = ce;
      }
      Te = Te || Dt && se - Je - 1 > z && v[Je + 1] !== " ";
    }
    return !ye && !Te ? yt && !re && !J(v) ? E : ee === X ? Re : q : ne > 9 && w(v) ? Re : re ? ee === X ? Re : q : Te ? ve : N;
  }
  function Ne(v, M, ne, z, J) {
    v.dump = (function() {
      if (M.length === 0)
        return v.quotingType === X ? '""' : "''";
      if (!v.noCompatMode && (P.indexOf(M) !== -1 || A.test(M)))
        return v.quotingType === X ? '"' + M + '"' : "'" + M + "'";
      const ee = v.indent * Math.max(1, ne), re = v.lineWidth === -1 ? -1 : Math.max(Math.min(v.lineWidth, 40), v.lineWidth - ee), ae = z || // No block styles in flow mode.
      v.flowLevel > -1 && ne >= v.flowLevel;
      function se(ce) {
        return Ee(v, ce);
      }
      switch (Se(
        M,
        ae,
        v.indent,
        re,
        se,
        v.quotingType,
        v.forceQuotes && !z,
        J
      )) {
        case E:
          return M;
        case q:
          return "'" + M.replace(/'/g, "''") + "'";
        case N:
          return "|" + Ie(M, v.indent) + $e(Z(M, ee));
        case ve:
          return ">" + Ie(M, v.indent) + $e(Z(Ce(M, re), ee));
        case Re:
          return '"' + Et(M) + '"';
        default:
          throw new c("impossible error: invalid scalar style");
      }
    })();
  }
  function Ie(v, M) {
    const ne = w(v) ? String(M) : "", z = v[v.length - 1] === `
`, ee = z && (v[v.length - 2] === `
` || v === `
`) ? "+" : z ? "" : "-";
    return ne + ee + `
`;
  }
  function $e(v) {
    return v[v.length - 1] === `
` ? v.slice(0, -1) : v;
  }
  function Ce(v, M) {
    const ne = /(\n+)([^\n]*)/g;
    let z = (function() {
      let ae = v.indexOf(`
`);
      return ae = ae !== -1 ? ae : v.length, ne.lastIndex = ae, De(v.slice(0, ae), M);
    })(), J = v[0] === `
` || v[0] === " ", ee, re;
    for (; re = ne.exec(v); ) {
      const ae = re[1], se = re[2];
      ee = se[0] === " ", z += ae + (!J && !ee && se !== "" ? `
` : "") + De(se, M), J = ee;
    }
    return z;
  }
  function De(v, M) {
    if (v === "" || v[0] === " ") return v;
    const ne = / [^ ]/g;
    let z, J = 0, ee, re = 0, ae = 0, se = "";
    for (; z = ne.exec(v); )
      ae = z.index, ae - J > M && (ee = re > J ? re : ae, se += `
` + v.slice(J, ee), J = ee + 1), re = ae;
    return se += `
`, v.length - J > M && re > J ? se += v.slice(J, re) + `
` + v.slice(re + 1) : se += v.slice(J), se.slice(1);
  }
  function Et(v) {
    let M = "", ne = 0;
    for (let z = 0; z < v.length; ne >= 65536 ? z += 2 : z++) {
      ne = we(v, z);
      const J = L[ne];
      !J && ue(ne) ? (M += v[z], ne >= 65536 && (M += v[z + 1])) : M += J || $(ne);
    }
    return M;
  }
  function it(v, M, ne) {
    let z = "";
    const J = v.tag;
    for (let ee = 0, re = ne.length; ee < re; ee += 1) {
      let ae = ne[ee];
      v.replacer && (ae = v.replacer.call(ne, String(ee), ae)), (W(v, M, ae, !1, !1) || typeof ae > "u" && W(v, M, null, !1, !1)) && (z !== "" && (z += "," + (v.condenseFlow ? "" : " ")), z += v.dump);
    }
    v.tag = J, v.dump = "[" + z + "]";
  }
  function rt(v, M, ne, z) {
    let J = "";
    const ee = v.tag;
    for (let re = 0, ae = ne.length; re < ae; re += 1) {
      let se = ne[re];
      v.replacer && (se = v.replacer.call(ne, String(re), se)), (W(v, M + 1, se, !0, !0, !1, !0) || typeof se > "u" && W(v, M + 1, null, !0, !0, !1, !0)) && ((!z || J !== "") && (J += de(v, M)), v.dump && a === v.dump.charCodeAt(0) ? J += "-" : J += "- ", J += v.dump);
    }
    v.tag = ee, v.dump = J || "[]";
  }
  function Ke(v, M, ne) {
    let z = "";
    const J = v.tag, ee = Object.keys(ne);
    for (let re = 0, ae = ee.length; re < ae; re += 1) {
      let se = "";
      z !== "" && (se += ", "), v.condenseFlow && (se += '"');
      const ce = ee[re];
      let fe = ne[ce];
      v.replacer && (fe = v.replacer.call(ne, ce, fe)), W(v, M, ce, !1, !1) && (v.dump.length > 1024 && (se += "? "), se += v.dump + (v.condenseFlow ? '"' : "") + ":" + (v.condenseFlow ? "" : " "), W(v, M, fe, !1, !1) && (se += v.dump, z += se));
    }
    v.tag = J, v.dump = "{" + z + "}";
  }
  function e(v, M, ne, z) {
    let J = "";
    const ee = v.tag, re = Object.keys(ne);
    if (v.sortKeys === !0)
      re.sort();
    else if (typeof v.sortKeys == "function")
      re.sort(v.sortKeys);
    else if (v.sortKeys)
      throw new c("sortKeys must be a boolean or a function");
    for (let ae = 0, se = re.length; ae < se; ae += 1) {
      let ce = "";
      (!z || J !== "") && (ce += de(v, M));
      const fe = re[ae];
      let ye = ne[fe];
      if (v.replacer && (ye = v.replacer.call(ne, fe, ye)), !W(v, M + 1, fe, !0, !0, !0))
        continue;
      const Te = v.tag !== null && v.tag !== "?" || v.dump && v.dump.length > 1024;
      Te && (v.dump && a === v.dump.charCodeAt(0) ? ce += "?" : ce += "? "), ce += v.dump, Te && (ce += de(v, M)), W(v, M + 1, ye, !0, Te) && (v.dump && a === v.dump.charCodeAt(0) ? ce += ":" : ce += ": ", ce += v.dump, J += ce);
    }
    v.tag = ee, v.dump = J || "{}";
  }
  function k(v, M, ne) {
    const z = ne ? v.explicitTypes : v.implicitTypes;
    for (let J = 0, ee = z.length; J < ee; J += 1) {
      const re = z[J];
      if ((re.instanceOf || re.predicate) && (!re.instanceOf || typeof M == "object" && M instanceof re.instanceOf) && (!re.predicate || re.predicate(M))) {
        if (ne ? re.multi && re.representName ? v.tag = re.representName(M) : v.tag = re.tag : v.tag = "?", re.represent) {
          const ae = v.styleMap[re.tag] || re.defaultStyle;
          let se;
          if (d.call(re.represent) === "[object Function]")
            se = re.represent(M, ae);
          else if (f.call(re.represent, ae))
            se = re.represent[ae](M, ae);
          else
            throw new c("!<" + re.tag + '> tag resolver accepts not "' + ae + '" style');
          v.dump = se;
        }
        return !0;
      }
    }
    return !1;
  }
  function W(v, M, ne, z, J, ee, re) {
    v.tag = null, v.dump = ne, k(v, ne, !1) || k(v, ne, !0);
    const ae = d.call(v.dump), se = z;
    z && (z = v.flowLevel < 0 || v.flowLevel > M);
    const ce = ae === "[object Object]" || ae === "[object Array]";
    let fe, ye;
    if (ce && (fe = v.duplicates.indexOf(ne), ye = fe !== -1), (v.tag !== null && v.tag !== "?" || ye || v.indent !== 2 && M > 0) && (J = !1), ye && v.usedDuplicates[fe])
      v.dump = "*ref_" + fe;
    else {
      if (ce && ye && !v.usedDuplicates[fe] && (v.usedDuplicates[fe] = !0), ae === "[object Object]")
        z && Object.keys(v.dump).length !== 0 ? (e(v, M, v.dump, J), ye && (v.dump = "&ref_" + fe + v.dump)) : (Ke(v, M, v.dump), ye && (v.dump = "&ref_" + fe + " " + v.dump));
      else if (ae === "[object Array]")
        z && v.dump.length !== 0 ? (v.noArrayIndent && !re && M > 0 ? rt(v, M - 1, v.dump, J) : rt(v, M, v.dump, J), ye && (v.dump = "&ref_" + fe + v.dump)) : (it(v, M, v.dump), ye && (v.dump = "&ref_" + fe + " " + v.dump));
      else if (ae === "[object String]")
        v.tag !== "?" && Ne(v, v.dump, M, ee, se);
      else {
        if (ae === "[object Undefined]")
          return !1;
        if (v.skipInvalid) return !1;
        throw new c("unacceptable kind of an object to dump " + ae);
      }
      if (v.tag !== null && v.tag !== "?") {
        let Te = encodeURI(
          v.tag[0] === "!" ? v.tag.slice(1) : v.tag
        ).replace(/!/g, "%21");
        v.tag[0] === "!" ? Te = "!" + Te : Te.slice(0, 18) === "tag:yaml.org,2002:" ? Te = "!!" + Te.slice(18) : Te = "!<" + Te + ">", v.dump = Te + " " + v.dump;
      }
    }
    return !0;
  }
  function Q(v, M) {
    const ne = [], z = [];
    G(v, ne, z);
    const J = z.length;
    for (let ee = 0; ee < J; ee += 1)
      M.duplicates.push(ne[z[ee]]);
    M.usedDuplicates = new Array(J);
  }
  function G(v, M, ne) {
    if (v !== null && typeof v == "object") {
      const z = M.indexOf(v);
      if (z !== -1)
        ne.indexOf(z) === -1 && ne.push(z);
      else if (M.push(v), Array.isArray(v))
        for (let J = 0, ee = v.length; J < ee; J += 1)
          G(v[J], M, ne);
      else {
        const J = Object.keys(v);
        for (let ee = 0, re = J.length; ee < re; ee += 1)
          G(v[J[ee]], M, ne);
      }
    }
  }
  function ie(v, M) {
    M = M || {};
    const ne = new oe(M);
    ne.noRefs || Q(v, ne);
    let z = v;
    return ne.replacer && (z = ne.replacer.call({ "": z }, "", z)), W(ne, 0, z, !0, !0) ? ne.dump + `
` : "";
  }
  return si.dump = ie, si;
}
var ta;
function ao() {
  if (ta) return qe;
  ta = 1;
  const r = lf(), c = uf();
  function p(d, f) {
    return function() {
      throw new Error("Function yaml." + d + " is removed in js-yaml 4. Use yaml." + f + " instead, which is now safe by default.");
    };
  }
  return qe.Type = Me(), qe.Schema = Hl(), qe.FAILSAFE_SCHEMA = Yl(), qe.JSON_SCHEMA = Ql(), qe.CORE_SCHEMA = Zl(), qe.DEFAULT_SCHEMA = so(), qe.load = r.load, qe.loadAll = r.loadAll, qe.dump = c.dump, qe.YAMLException = vr(), qe.types = {
    binary: ru(),
    float: Jl(),
    map: Wl(),
    null: zl(),
    pairs: iu(),
    set: ou(),
    timestamp: eu(),
    bool: Xl(),
    int: Kl(),
    merge: tu(),
    omap: nu(),
    seq: Vl(),
    str: Gl()
  }, qe.safeLoad = p("safeLoad", "load"), qe.safeLoadAll = p("safeLoadAll", "loadAll"), qe.safeDump = p("safeDump", "dump"), qe;
}
var zt = {}, ra;
function cf() {
  if (ra) return zt;
  ra = 1, Object.defineProperty(zt, "__esModule", { value: !0 }), zt.Lazy = void 0;
  class r {
    constructor(p) {
      this._value = null, this.creator = p;
    }
    get hasValue() {
      return this.creator == null;
    }
    get value() {
      if (this.creator == null)
        return this._value;
      const p = this.creator();
      return this.value = p, p;
    }
    set value(p) {
      this._value = p, this.creator = null;
    }
  }
  return zt.Lazy = r, zt;
}
var qr = { exports: {} }, ai, na;
function Wr() {
  if (na) return ai;
  na = 1;
  const r = "2.0.0", c = 256, p = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
  9007199254740991, d = 16, f = c - 6;
  return ai = {
    MAX_LENGTH: c,
    MAX_SAFE_COMPONENT_LENGTH: d,
    MAX_SAFE_BUILD_LENGTH: f,
    MAX_SAFE_INTEGER: p,
    RELEASE_TYPES: [
      "major",
      "premajor",
      "minor",
      "preminor",
      "patch",
      "prepatch",
      "prerelease"
    ],
    SEMVER_SPEC_VERSION: r,
    FLAG_INCLUDE_PRERELEASE: 1,
    FLAG_LOOSE: 2
  }, ai;
}
var li, ia;
function Yr() {
  return ia || (ia = 1, li = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...c) => console.error("SEMVER", ...c) : () => {
  }), li;
}
var oa;
function _r() {
  return oa || (oa = 1, (function(r, c) {
    const {
      MAX_SAFE_COMPONENT_LENGTH: p,
      MAX_SAFE_BUILD_LENGTH: d,
      MAX_LENGTH: f
    } = Wr(), u = Yr();
    c = r.exports = {};
    const o = c.re = [], a = c.safeRe = [], l = c.src = [], i = c.safeSrc = [], n = c.t = {};
    let t = 0;
    const s = "[a-zA-Z0-9-]", h = [
      ["\\s", 1],
      ["\\d", f],
      [s, d]
    ], g = (m) => {
      for (const [_, R] of h)
        m = m.split(`${_}*`).join(`${_}{0,${R}}`).split(`${_}+`).join(`${_}{1,${R}}`);
      return m;
    }, y = (m, _, R) => {
      const b = g(_), D = t++;
      u(m, D, _), n[m] = D, l[D] = _, i[D] = b, o[D] = new RegExp(_, R ? "g" : void 0), a[D] = new RegExp(b, R ? "g" : void 0);
    };
    y("NUMERICIDENTIFIER", "0|[1-9]\\d*"), y("NUMERICIDENTIFIERLOOSE", "\\d+"), y("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${s}*`), y("MAINVERSION", `(${l[n.NUMERICIDENTIFIER]})\\.(${l[n.NUMERICIDENTIFIER]})\\.(${l[n.NUMERICIDENTIFIER]})`), y("MAINVERSIONLOOSE", `(${l[n.NUMERICIDENTIFIERLOOSE]})\\.(${l[n.NUMERICIDENTIFIERLOOSE]})\\.(${l[n.NUMERICIDENTIFIERLOOSE]})`), y("PRERELEASEIDENTIFIER", `(?:${l[n.NONNUMERICIDENTIFIER]}|${l[n.NUMERICIDENTIFIER]})`), y("PRERELEASEIDENTIFIERLOOSE", `(?:${l[n.NONNUMERICIDENTIFIER]}|${l[n.NUMERICIDENTIFIERLOOSE]})`), y("PRERELEASE", `(?:-(${l[n.PRERELEASEIDENTIFIER]}(?:\\.${l[n.PRERELEASEIDENTIFIER]})*))`), y("PRERELEASELOOSE", `(?:-?(${l[n.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${l[n.PRERELEASEIDENTIFIERLOOSE]})*))`), y("BUILDIDENTIFIER", `${s}+`), y("BUILD", `(?:\\+(${l[n.BUILDIDENTIFIER]}(?:\\.${l[n.BUILDIDENTIFIER]})*))`), y("FULLPLAIN", `v?${l[n.MAINVERSION]}${l[n.PRERELEASE]}?${l[n.BUILD]}?`), y("FULL", `^${l[n.FULLPLAIN]}$`), y("LOOSEPLAIN", `[v=\\s]*${l[n.MAINVERSIONLOOSE]}${l[n.PRERELEASELOOSE]}?${l[n.BUILD]}?`), y("LOOSE", `^${l[n.LOOSEPLAIN]}$`), y("GTLT", "((?:<|>)?=?)"), y("XRANGEIDENTIFIERLOOSE", `${l[n.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), y("XRANGEIDENTIFIER", `${l[n.NUMERICIDENTIFIER]}|x|X|\\*`), y("XRANGEPLAIN", `[v=\\s]*(${l[n.XRANGEIDENTIFIER]})(?:\\.(${l[n.XRANGEIDENTIFIER]})(?:\\.(${l[n.XRANGEIDENTIFIER]})(?:${l[n.PRERELEASE]})?${l[n.BUILD]}?)?)?`), y("XRANGEPLAINLOOSE", `[v=\\s]*(${l[n.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[n.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[n.XRANGEIDENTIFIERLOOSE]})(?:${l[n.PRERELEASELOOSE]})?${l[n.BUILD]}?)?)?`), y("XRANGE", `^${l[n.GTLT]}\\s*${l[n.XRANGEPLAIN]}$`), y("XRANGELOOSE", `^${l[n.GTLT]}\\s*${l[n.XRANGEPLAINLOOSE]}$`), y("COERCEPLAIN", `(^|[^\\d])(\\d{1,${p}})(?:\\.(\\d{1,${p}}))?(?:\\.(\\d{1,${p}}))?`), y("COERCE", `${l[n.COERCEPLAIN]}(?:$|[^\\d])`), y("COERCEFULL", l[n.COERCEPLAIN] + `(?:${l[n.PRERELEASE]})?(?:${l[n.BUILD]})?(?:$|[^\\d])`), y("COERCERTL", l[n.COERCE], !0), y("COERCERTLFULL", l[n.COERCEFULL], !0), y("LONETILDE", "(?:~>?)"), y("TILDETRIM", `(\\s*)${l[n.LONETILDE]}\\s+`, !0), c.tildeTrimReplace = "$1~", y("TILDE", `^${l[n.LONETILDE]}${l[n.XRANGEPLAIN]}$`), y("TILDELOOSE", `^${l[n.LONETILDE]}${l[n.XRANGEPLAINLOOSE]}$`), y("LONECARET", "(?:\\^)"), y("CARETTRIM", `(\\s*)${l[n.LONECARET]}\\s+`, !0), c.caretTrimReplace = "$1^", y("CARET", `^${l[n.LONECARET]}${l[n.XRANGEPLAIN]}$`), y("CARETLOOSE", `^${l[n.LONECARET]}${l[n.XRANGEPLAINLOOSE]}$`), y("COMPARATORLOOSE", `^${l[n.GTLT]}\\s*(${l[n.LOOSEPLAIN]})$|^$`), y("COMPARATOR", `^${l[n.GTLT]}\\s*(${l[n.FULLPLAIN]})$|^$`), y("COMPARATORTRIM", `(\\s*)${l[n.GTLT]}\\s*(${l[n.LOOSEPLAIN]}|${l[n.XRANGEPLAIN]})`, !0), c.comparatorTrimReplace = "$1$2$3", y("HYPHENRANGE", `^\\s*(${l[n.XRANGEPLAIN]})\\s+-\\s+(${l[n.XRANGEPLAIN]})\\s*$`), y("HYPHENRANGELOOSE", `^\\s*(${l[n.XRANGEPLAINLOOSE]})\\s+-\\s+(${l[n.XRANGEPLAINLOOSE]})\\s*$`), y("STAR", "(<|>)?=?\\s*\\*"), y("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), y("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
  })(qr, qr.exports)), qr.exports;
}
var ui, sa;
function lo() {
  if (sa) return ui;
  sa = 1;
  const r = Object.freeze({ loose: !0 }), c = Object.freeze({});
  return ui = (d) => d ? typeof d != "object" ? r : d : c, ui;
}
var ci, aa;
function su() {
  if (aa) return ci;
  aa = 1;
  const r = /^[0-9]+$/, c = (d, f) => {
    if (typeof d == "number" && typeof f == "number")
      return d === f ? 0 : d < f ? -1 : 1;
    const u = r.test(d), o = r.test(f);
    return u && o && (d = +d, f = +f), d === f ? 0 : u && !o ? -1 : o && !u ? 1 : d < f ? -1 : 1;
  };
  return ci = {
    compareIdentifiers: c,
    rcompareIdentifiers: (d, f) => c(f, d)
  }, ci;
}
var fi, la;
function Be() {
  if (la) return fi;
  la = 1;
  const r = Yr(), { MAX_LENGTH: c, MAX_SAFE_INTEGER: p } = Wr(), { safeRe: d, t: f } = _r(), u = lo(), { compareIdentifiers: o } = su();
  class a {
    constructor(i, n) {
      if (n = u(n), i instanceof a) {
        if (i.loose === !!n.loose && i.includePrerelease === !!n.includePrerelease)
          return i;
        i = i.version;
      } else if (typeof i != "string")
        throw new TypeError(`Invalid version. Must be a string. Got type "${typeof i}".`);
      if (i.length > c)
        throw new TypeError(
          `version is longer than ${c} characters`
        );
      r("SemVer", i, n), this.options = n, this.loose = !!n.loose, this.includePrerelease = !!n.includePrerelease;
      const t = i.trim().match(n.loose ? d[f.LOOSE] : d[f.FULL]);
      if (!t)
        throw new TypeError(`Invalid Version: ${i}`);
      if (this.raw = i, this.major = +t[1], this.minor = +t[2], this.patch = +t[3], this.major > p || this.major < 0)
        throw new TypeError("Invalid major version");
      if (this.minor > p || this.minor < 0)
        throw new TypeError("Invalid minor version");
      if (this.patch > p || this.patch < 0)
        throw new TypeError("Invalid patch version");
      t[4] ? this.prerelease = t[4].split(".").map((s) => {
        if (/^[0-9]+$/.test(s)) {
          const h = +s;
          if (h >= 0 && h < p)
            return h;
        }
        return s;
      }) : this.prerelease = [], this.build = t[5] ? t[5].split(".") : [], this.format();
    }
    format() {
      return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
    }
    toString() {
      return this.version;
    }
    compare(i) {
      if (r("SemVer.compare", this.version, this.options, i), !(i instanceof a)) {
        if (typeof i == "string" && i === this.version)
          return 0;
        i = new a(i, this.options);
      }
      return i.version === this.version ? 0 : this.compareMain(i) || this.comparePre(i);
    }
    compareMain(i) {
      return i instanceof a || (i = new a(i, this.options)), this.major < i.major ? -1 : this.major > i.major ? 1 : this.minor < i.minor ? -1 : this.minor > i.minor ? 1 : this.patch < i.patch ? -1 : this.patch > i.patch ? 1 : 0;
    }
    comparePre(i) {
      if (i instanceof a || (i = new a(i, this.options)), this.prerelease.length && !i.prerelease.length)
        return -1;
      if (!this.prerelease.length && i.prerelease.length)
        return 1;
      if (!this.prerelease.length && !i.prerelease.length)
        return 0;
      let n = 0;
      do {
        const t = this.prerelease[n], s = i.prerelease[n];
        if (r("prerelease compare", n, t, s), t === void 0 && s === void 0)
          return 0;
        if (s === void 0)
          return 1;
        if (t === void 0)
          return -1;
        if (t === s)
          continue;
        return o(t, s);
      } while (++n);
    }
    compareBuild(i) {
      i instanceof a || (i = new a(i, this.options));
      let n = 0;
      do {
        const t = this.build[n], s = i.build[n];
        if (r("build compare", n, t, s), t === void 0 && s === void 0)
          return 0;
        if (s === void 0)
          return 1;
        if (t === void 0)
          return -1;
        if (t === s)
          continue;
        return o(t, s);
      } while (++n);
    }
    // preminor will bump the version up to the next minor release, and immediately
    // down to pre-release. premajor and prepatch work the same way.
    inc(i, n, t) {
      if (i.startsWith("pre")) {
        if (!n && t === !1)
          throw new Error("invalid increment argument: identifier is empty");
        if (n) {
          const s = `-${n}`.match(this.options.loose ? d[f.PRERELEASELOOSE] : d[f.PRERELEASE]);
          if (!s || s[1] !== n)
            throw new Error(`invalid identifier: ${n}`);
        }
      }
      switch (i) {
        case "premajor":
          this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", n, t);
          break;
        case "preminor":
          this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", n, t);
          break;
        case "prepatch":
          this.prerelease.length = 0, this.inc("patch", n, t), this.inc("pre", n, t);
          break;
        // If the input is a non-prerelease version, this acts the same as
        // prepatch.
        case "prerelease":
          this.prerelease.length === 0 && this.inc("patch", n, t), this.inc("pre", n, t);
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
          const s = Number(t) ? 1 : 0;
          if (this.prerelease.length === 0)
            this.prerelease = [s];
          else {
            let h = this.prerelease.length;
            for (; --h >= 0; )
              typeof this.prerelease[h] == "number" && (this.prerelease[h]++, h = -2);
            if (h === -1) {
              if (n === this.prerelease.join(".") && t === !1)
                throw new Error("invalid increment argument: identifier already exists");
              this.prerelease.push(s);
            }
          }
          if (n) {
            let h = [n, s];
            t === !1 && (h = [n]), o(this.prerelease[0], n) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = h) : this.prerelease = h;
          }
          break;
        }
        default:
          throw new Error(`invalid increment argument: ${i}`);
      }
      return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
    }
  }
  return fi = a, fi;
}
var di, ua;
function jt() {
  if (ua) return di;
  ua = 1;
  const r = Be();
  return di = (p, d, f = !1) => {
    if (p instanceof r)
      return p;
    try {
      return new r(p, d);
    } catch (u) {
      if (!f)
        return null;
      throw u;
    }
  }, di;
}
var hi, ca;
function ff() {
  if (ca) return hi;
  ca = 1;
  const r = jt();
  return hi = (p, d) => {
    const f = r(p, d);
    return f ? f.version : null;
  }, hi;
}
var pi, fa;
function df() {
  if (fa) return pi;
  fa = 1;
  const r = jt();
  return pi = (p, d) => {
    const f = r(p.trim().replace(/^[=v]+/, ""), d);
    return f ? f.version : null;
  }, pi;
}
var mi, da;
function hf() {
  if (da) return mi;
  da = 1;
  const r = Be();
  return mi = (p, d, f, u, o) => {
    typeof f == "string" && (o = u, u = f, f = void 0);
    try {
      return new r(
        p instanceof r ? p.version : p,
        f
      ).inc(d, u, o).version;
    } catch {
      return null;
    }
  }, mi;
}
var gi, ha;
function pf() {
  if (ha) return gi;
  ha = 1;
  const r = jt();
  return gi = (p, d) => {
    const f = r(p, null, !0), u = r(d, null, !0), o = f.compare(u);
    if (o === 0)
      return null;
    const a = o > 0, l = a ? f : u, i = a ? u : f, n = !!l.prerelease.length;
    if (!!i.prerelease.length && !n) {
      if (!i.patch && !i.minor)
        return "major";
      if (i.compareMain(l) === 0)
        return i.minor && !i.patch ? "minor" : "patch";
    }
    const s = n ? "pre" : "";
    return f.major !== u.major ? s + "major" : f.minor !== u.minor ? s + "minor" : f.patch !== u.patch ? s + "patch" : "prerelease";
  }, gi;
}
var Ei, pa;
function mf() {
  if (pa) return Ei;
  pa = 1;
  const r = Be();
  return Ei = (p, d) => new r(p, d).major, Ei;
}
var yi, ma;
function gf() {
  if (ma) return yi;
  ma = 1;
  const r = Be();
  return yi = (p, d) => new r(p, d).minor, yi;
}
var wi, ga;
function Ef() {
  if (ga) return wi;
  ga = 1;
  const r = Be();
  return wi = (p, d) => new r(p, d).patch, wi;
}
var vi, Ea;
function yf() {
  if (Ea) return vi;
  Ea = 1;
  const r = jt();
  return vi = (p, d) => {
    const f = r(p, d);
    return f && f.prerelease.length ? f.prerelease : null;
  }, vi;
}
var _i, ya;
function et() {
  if (ya) return _i;
  ya = 1;
  const r = Be();
  return _i = (p, d, f) => new r(p, f).compare(new r(d, f)), _i;
}
var Ai, wa;
function wf() {
  if (wa) return Ai;
  wa = 1;
  const r = et();
  return Ai = (p, d, f) => r(d, p, f), Ai;
}
var Ri, va;
function vf() {
  if (va) return Ri;
  va = 1;
  const r = et();
  return Ri = (p, d) => r(p, d, !0), Ri;
}
var Ti, _a;
function uo() {
  if (_a) return Ti;
  _a = 1;
  const r = Be();
  return Ti = (p, d, f) => {
    const u = new r(p, f), o = new r(d, f);
    return u.compare(o) || u.compareBuild(o);
  }, Ti;
}
var Si, Aa;
function _f() {
  if (Aa) return Si;
  Aa = 1;
  const r = uo();
  return Si = (p, d) => p.sort((f, u) => r(f, u, d)), Si;
}
var bi, Ra;
function Af() {
  if (Ra) return bi;
  Ra = 1;
  const r = uo();
  return bi = (p, d) => p.sort((f, u) => r(u, f, d)), bi;
}
var Ci, Ta;
function zr() {
  if (Ta) return Ci;
  Ta = 1;
  const r = et();
  return Ci = (p, d, f) => r(p, d, f) > 0, Ci;
}
var Pi, Sa;
function co() {
  if (Sa) return Pi;
  Sa = 1;
  const r = et();
  return Pi = (p, d, f) => r(p, d, f) < 0, Pi;
}
var Oi, ba;
function au() {
  if (ba) return Oi;
  ba = 1;
  const r = et();
  return Oi = (p, d, f) => r(p, d, f) === 0, Oi;
}
var Ii, Ca;
function lu() {
  if (Ca) return Ii;
  Ca = 1;
  const r = et();
  return Ii = (p, d, f) => r(p, d, f) !== 0, Ii;
}
var Di, Pa;
function fo() {
  if (Pa) return Di;
  Pa = 1;
  const r = et();
  return Di = (p, d, f) => r(p, d, f) >= 0, Di;
}
var Ni, Oa;
function ho() {
  if (Oa) return Ni;
  Oa = 1;
  const r = et();
  return Ni = (p, d, f) => r(p, d, f) <= 0, Ni;
}
var Fi, Ia;
function uu() {
  if (Ia) return Fi;
  Ia = 1;
  const r = au(), c = lu(), p = zr(), d = fo(), f = co(), u = ho();
  return Fi = (a, l, i, n) => {
    switch (l) {
      case "===":
        return typeof a == "object" && (a = a.version), typeof i == "object" && (i = i.version), a === i;
      case "!==":
        return typeof a == "object" && (a = a.version), typeof i == "object" && (i = i.version), a !== i;
      case "":
      case "=":
      case "==":
        return r(a, i, n);
      case "!=":
        return c(a, i, n);
      case ">":
        return p(a, i, n);
      case ">=":
        return d(a, i, n);
      case "<":
        return f(a, i, n);
      case "<=":
        return u(a, i, n);
      default:
        throw new TypeError(`Invalid operator: ${l}`);
    }
  }, Fi;
}
var xi, Da;
function Rf() {
  if (Da) return xi;
  Da = 1;
  const r = Be(), c = jt(), { safeRe: p, t: d } = _r();
  return xi = (u, o) => {
    if (u instanceof r)
      return u;
    if (typeof u == "number" && (u = String(u)), typeof u != "string")
      return null;
    o = o || {};
    let a = null;
    if (!o.rtl)
      a = u.match(o.includePrerelease ? p[d.COERCEFULL] : p[d.COERCE]);
    else {
      const h = o.includePrerelease ? p[d.COERCERTLFULL] : p[d.COERCERTL];
      let g;
      for (; (g = h.exec(u)) && (!a || a.index + a[0].length !== u.length); )
        (!a || g.index + g[0].length !== a.index + a[0].length) && (a = g), h.lastIndex = g.index + g[1].length + g[2].length;
      h.lastIndex = -1;
    }
    if (a === null)
      return null;
    const l = a[2], i = a[3] || "0", n = a[4] || "0", t = o.includePrerelease && a[5] ? `-${a[5]}` : "", s = o.includePrerelease && a[6] ? `+${a[6]}` : "";
    return c(`${l}.${i}.${n}${t}${s}`, o);
  }, xi;
}
var Li, Na;
function Tf() {
  if (Na) return Li;
  Na = 1;
  class r {
    constructor() {
      this.max = 1e3, this.map = /* @__PURE__ */ new Map();
    }
    get(p) {
      const d = this.map.get(p);
      if (d !== void 0)
        return this.map.delete(p), this.map.set(p, d), d;
    }
    delete(p) {
      return this.map.delete(p);
    }
    set(p, d) {
      if (!this.delete(p) && d !== void 0) {
        if (this.map.size >= this.max) {
          const u = this.map.keys().next().value;
          this.delete(u);
        }
        this.map.set(p, d);
      }
      return this;
    }
  }
  return Li = r, Li;
}
var Ui, Fa;
function tt() {
  if (Fa) return Ui;
  Fa = 1;
  const r = /\s+/g;
  class c {
    constructor(P, A) {
      if (A = f(A), P instanceof c)
        return P.loose === !!A.loose && P.includePrerelease === !!A.includePrerelease ? P : new c(P.raw, A);
      if (P instanceof u)
        return this.raw = P.value, this.set = [[P]], this.formatted = void 0, this;
      if (this.options = A, this.loose = !!A.loose, this.includePrerelease = !!A.includePrerelease, this.raw = P.trim().replace(r, " "), this.set = this.raw.split("||").map((O) => this.parseRange(O.trim())).filter((O) => O.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const O = this.set[0];
        if (this.set = this.set.filter(($) => !y($[0])), this.set.length === 0)
          this.set = [O];
        else if (this.set.length > 1) {
          for (const $ of this.set)
            if ($.length === 1 && m($[0])) {
              this.set = [$];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let P = 0; P < this.set.length; P++) {
          P > 0 && (this.formatted += "||");
          const A = this.set[P];
          for (let O = 0; O < A.length; O++)
            O > 0 && (this.formatted += " "), this.formatted += A[O].toString().trim();
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
    parseRange(P) {
      const O = ((this.options.includePrerelease && h) | (this.options.loose && g)) + ":" + P, $ = d.get(O);
      if ($)
        return $;
      const j = this.options.loose, X = j ? l[i.HYPHENRANGELOOSE] : l[i.HYPHENRANGE];
      P = P.replace(X, H(this.options.includePrerelease)), o("hyphen replace", P), P = P.replace(l[i.COMPARATORTRIM], n), o("comparator trim", P), P = P.replace(l[i.TILDETRIM], t), o("tilde trim", P), P = P.replace(l[i.CARETTRIM], s), o("caret trim", P);
      let oe = P.split(" ").map((K) => R(K, this.options)).join(" ").split(/\s+/).map((K) => Y(K, this.options));
      j && (oe = oe.filter((K) => (o("loose invalid filter", K, this.options), !!K.match(l[i.COMPARATORLOOSE])))), o("range list", oe);
      const Z = /* @__PURE__ */ new Map(), de = oe.map((K) => new u(K, this.options));
      for (const K of de) {
        if (y(K))
          return [K];
        Z.set(K.value, K);
      }
      Z.size > 1 && Z.has("") && Z.delete("");
      const Ee = [...Z.values()];
      return d.set(O, Ee), Ee;
    }
    intersects(P, A) {
      if (!(P instanceof c))
        throw new TypeError("a Range is required");
      return this.set.some((O) => _(O, A) && P.set.some(($) => _($, A) && O.every((j) => $.every((X) => j.intersects(X, A)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(P) {
      if (!P)
        return !1;
      if (typeof P == "string")
        try {
          P = new a(P, this.options);
        } catch {
          return !1;
        }
      for (let A = 0; A < this.set.length; A++)
        if (V(this.set[A], P, this.options))
          return !0;
      return !1;
    }
  }
  Ui = c;
  const p = Tf(), d = new p(), f = lo(), u = Xr(), o = Yr(), a = Be(), {
    safeRe: l,
    t: i,
    comparatorTrimReplace: n,
    tildeTrimReplace: t,
    caretTrimReplace: s
  } = _r(), { FLAG_INCLUDE_PRERELEASE: h, FLAG_LOOSE: g } = Wr(), y = (L) => L.value === "<0.0.0-0", m = (L) => L.value === "", _ = (L, P) => {
    let A = !0;
    const O = L.slice();
    let $ = O.pop();
    for (; A && O.length; )
      A = O.every((j) => $.intersects(j, P)), $ = O.pop();
    return A;
  }, R = (L, P) => (L = L.replace(l[i.BUILD], ""), o("comp", L, P), L = F(L, P), o("caret", L), L = D(L, P), o("tildes", L), L = x(L, P), o("xrange", L), L = S(L, P), o("stars", L), L), b = (L) => !L || L.toLowerCase() === "x" || L === "*", D = (L, P) => L.trim().split(/\s+/).map((A) => C(A, P)).join(" "), C = (L, P) => {
    const A = P.loose ? l[i.TILDELOOSE] : l[i.TILDE];
    return L.replace(A, (O, $, j, X, oe) => {
      o("tilde", L, O, $, j, X, oe);
      let Z;
      return b($) ? Z = "" : b(j) ? Z = `>=${$}.0.0 <${+$ + 1}.0.0-0` : b(X) ? Z = `>=${$}.${j}.0 <${$}.${+j + 1}.0-0` : oe ? (o("replaceTilde pr", oe), Z = `>=${$}.${j}.${X}-${oe} <${$}.${+j + 1}.0-0`) : Z = `>=${$}.${j}.${X} <${$}.${+j + 1}.0-0`, o("tilde return", Z), Z;
    });
  }, F = (L, P) => L.trim().split(/\s+/).map((A) => I(A, P)).join(" "), I = (L, P) => {
    o("caret", L, P);
    const A = P.loose ? l[i.CARETLOOSE] : l[i.CARET], O = P.includePrerelease ? "-0" : "";
    return L.replace(A, ($, j, X, oe, Z) => {
      o("caret", L, $, j, X, oe, Z);
      let de;
      return b(j) ? de = "" : b(X) ? de = `>=${j}.0.0${O} <${+j + 1}.0.0-0` : b(oe) ? j === "0" ? de = `>=${j}.${X}.0${O} <${j}.${+X + 1}.0-0` : de = `>=${j}.${X}.0${O} <${+j + 1}.0.0-0` : Z ? (o("replaceCaret pr", Z), j === "0" ? X === "0" ? de = `>=${j}.${X}.${oe}-${Z} <${j}.${X}.${+oe + 1}-0` : de = `>=${j}.${X}.${oe}-${Z} <${j}.${+X + 1}.0-0` : de = `>=${j}.${X}.${oe}-${Z} <${+j + 1}.0.0-0`) : (o("no pr"), j === "0" ? X === "0" ? de = `>=${j}.${X}.${oe}${O} <${j}.${X}.${+oe + 1}-0` : de = `>=${j}.${X}.${oe}${O} <${j}.${+X + 1}.0-0` : de = `>=${j}.${X}.${oe} <${+j + 1}.0.0-0`), o("caret return", de), de;
    });
  }, x = (L, P) => (o("replaceXRanges", L, P), L.split(/\s+/).map((A) => B(A, P)).join(" ")), B = (L, P) => {
    L = L.trim();
    const A = P.loose ? l[i.XRANGELOOSE] : l[i.XRANGE];
    return L.replace(A, (O, $, j, X, oe, Z) => {
      o("xRange", L, O, $, j, X, oe, Z);
      const de = b(j), Ee = de || b(X), K = Ee || b(oe), ue = K;
      return $ === "=" && ue && ($ = ""), Z = P.includePrerelease ? "-0" : "", de ? $ === ">" || $ === "<" ? O = "<0.0.0-0" : O = "*" : $ && ue ? (Ee && (X = 0), oe = 0, $ === ">" ? ($ = ">=", Ee ? (j = +j + 1, X = 0, oe = 0) : (X = +X + 1, oe = 0)) : $ === "<=" && ($ = "<", Ee ? j = +j + 1 : X = +X + 1), $ === "<" && (Z = "-0"), O = `${$ + j}.${X}.${oe}${Z}`) : Ee ? O = `>=${j}.0.0${Z} <${+j + 1}.0.0-0` : K && (O = `>=${j}.${X}.0${Z} <${j}.${+X + 1}.0-0`), o("xRange return", O), O;
    });
  }, S = (L, P) => (o("replaceStars", L, P), L.trim().replace(l[i.STAR], "")), Y = (L, P) => (o("replaceGTE0", L, P), L.trim().replace(l[P.includePrerelease ? i.GTE0PRE : i.GTE0], "")), H = (L) => (P, A, O, $, j, X, oe, Z, de, Ee, K, ue) => (b(O) ? A = "" : b($) ? A = `>=${O}.0.0${L ? "-0" : ""}` : b(j) ? A = `>=${O}.${$}.0${L ? "-0" : ""}` : X ? A = `>=${A}` : A = `>=${A}${L ? "-0" : ""}`, b(de) ? Z = "" : b(Ee) ? Z = `<${+de + 1}.0.0-0` : b(K) ? Z = `<${de}.${+Ee + 1}.0-0` : ue ? Z = `<=${de}.${Ee}.${K}-${ue}` : L ? Z = `<${de}.${Ee}.${+K + 1}-0` : Z = `<=${Z}`, `${A} ${Z}`.trim()), V = (L, P, A) => {
    for (let O = 0; O < L.length; O++)
      if (!L[O].test(P))
        return !1;
    if (P.prerelease.length && !A.includePrerelease) {
      for (let O = 0; O < L.length; O++)
        if (o(L[O].semver), L[O].semver !== u.ANY && L[O].semver.prerelease.length > 0) {
          const $ = L[O].semver;
          if ($.major === P.major && $.minor === P.minor && $.patch === P.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return Ui;
}
var $i, xa;
function Xr() {
  if (xa) return $i;
  xa = 1;
  const r = Symbol("SemVer ANY");
  class c {
    static get ANY() {
      return r;
    }
    constructor(n, t) {
      if (t = p(t), n instanceof c) {
        if (n.loose === !!t.loose)
          return n;
        n = n.value;
      }
      n = n.trim().split(/\s+/).join(" "), o("comparator", n, t), this.options = t, this.loose = !!t.loose, this.parse(n), this.semver === r ? this.value = "" : this.value = this.operator + this.semver.version, o("comp", this);
    }
    parse(n) {
      const t = this.options.loose ? d[f.COMPARATORLOOSE] : d[f.COMPARATOR], s = n.match(t);
      if (!s)
        throw new TypeError(`Invalid comparator: ${n}`);
      this.operator = s[1] !== void 0 ? s[1] : "", this.operator === "=" && (this.operator = ""), s[2] ? this.semver = new a(s[2], this.options.loose) : this.semver = r;
    }
    toString() {
      return this.value;
    }
    test(n) {
      if (o("Comparator.test", n, this.options.loose), this.semver === r || n === r)
        return !0;
      if (typeof n == "string")
        try {
          n = new a(n, this.options);
        } catch {
          return !1;
        }
      return u(n, this.operator, this.semver, this.options);
    }
    intersects(n, t) {
      if (!(n instanceof c))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new l(n.value, t).test(this.value) : n.operator === "" ? n.value === "" ? !0 : new l(this.value, t).test(n.semver) : (t = p(t), t.includePrerelease && (this.value === "<0.0.0-0" || n.value === "<0.0.0-0") || !t.includePrerelease && (this.value.startsWith("<0.0.0") || n.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && n.operator.startsWith(">") || this.operator.startsWith("<") && n.operator.startsWith("<") || this.semver.version === n.semver.version && this.operator.includes("=") && n.operator.includes("=") || u(this.semver, "<", n.semver, t) && this.operator.startsWith(">") && n.operator.startsWith("<") || u(this.semver, ">", n.semver, t) && this.operator.startsWith("<") && n.operator.startsWith(">")));
    }
  }
  $i = c;
  const p = lo(), { safeRe: d, t: f } = _r(), u = uu(), o = Yr(), a = Be(), l = tt();
  return $i;
}
var ki, La;
function Kr() {
  if (La) return ki;
  La = 1;
  const r = tt();
  return ki = (p, d, f) => {
    try {
      d = new r(d, f);
    } catch {
      return !1;
    }
    return d.test(p);
  }, ki;
}
var qi, Ua;
function Sf() {
  if (Ua) return qi;
  Ua = 1;
  const r = tt();
  return qi = (p, d) => new r(p, d).set.map((f) => f.map((u) => u.value).join(" ").trim().split(" ")), qi;
}
var Mi, $a;
function bf() {
  if ($a) return Mi;
  $a = 1;
  const r = Be(), c = tt();
  return Mi = (d, f, u) => {
    let o = null, a = null, l = null;
    try {
      l = new c(f, u);
    } catch {
      return null;
    }
    return d.forEach((i) => {
      l.test(i) && (!o || a.compare(i) === -1) && (o = i, a = new r(o, u));
    }), o;
  }, Mi;
}
var Bi, ka;
function Cf() {
  if (ka) return Bi;
  ka = 1;
  const r = Be(), c = tt();
  return Bi = (d, f, u) => {
    let o = null, a = null, l = null;
    try {
      l = new c(f, u);
    } catch {
      return null;
    }
    return d.forEach((i) => {
      l.test(i) && (!o || a.compare(i) === 1) && (o = i, a = new r(o, u));
    }), o;
  }, Bi;
}
var ji, qa;
function Pf() {
  if (qa) return ji;
  qa = 1;
  const r = Be(), c = tt(), p = zr();
  return ji = (f, u) => {
    f = new c(f, u);
    let o = new r("0.0.0");
    if (f.test(o) || (o = new r("0.0.0-0"), f.test(o)))
      return o;
    o = null;
    for (let a = 0; a < f.set.length; ++a) {
      const l = f.set[a];
      let i = null;
      l.forEach((n) => {
        const t = new r(n.semver.version);
        switch (n.operator) {
          case ">":
            t.prerelease.length === 0 ? t.patch++ : t.prerelease.push(0), t.raw = t.format();
          /* fallthrough */
          case "":
          case ">=":
            (!i || p(t, i)) && (i = t);
            break;
          case "<":
          case "<=":
            break;
          /* istanbul ignore next */
          default:
            throw new Error(`Unexpected operation: ${n.operator}`);
        }
      }), i && (!o || p(o, i)) && (o = i);
    }
    return o && f.test(o) ? o : null;
  }, ji;
}
var Hi, Ma;
function Of() {
  if (Ma) return Hi;
  Ma = 1;
  const r = tt();
  return Hi = (p, d) => {
    try {
      return new r(p, d).range || "*";
    } catch {
      return null;
    }
  }, Hi;
}
var Gi, Ba;
function po() {
  if (Ba) return Gi;
  Ba = 1;
  const r = Be(), c = Xr(), { ANY: p } = c, d = tt(), f = Kr(), u = zr(), o = co(), a = ho(), l = fo();
  return Gi = (n, t, s, h) => {
    n = new r(n, h), t = new d(t, h);
    let g, y, m, _, R;
    switch (s) {
      case ">":
        g = u, y = a, m = o, _ = ">", R = ">=";
        break;
      case "<":
        g = o, y = l, m = u, _ = "<", R = "<=";
        break;
      default:
        throw new TypeError('Must provide a hilo val of "<" or ">"');
    }
    if (f(n, t, h))
      return !1;
    for (let b = 0; b < t.set.length; ++b) {
      const D = t.set[b];
      let C = null, F = null;
      if (D.forEach((I) => {
        I.semver === p && (I = new c(">=0.0.0")), C = C || I, F = F || I, g(I.semver, C.semver, h) ? C = I : m(I.semver, F.semver, h) && (F = I);
      }), C.operator === _ || C.operator === R || (!F.operator || F.operator === _) && y(n, F.semver))
        return !1;
      if (F.operator === R && m(n, F.semver))
        return !1;
    }
    return !0;
  }, Gi;
}
var Vi, ja;
function If() {
  if (ja) return Vi;
  ja = 1;
  const r = po();
  return Vi = (p, d, f) => r(p, d, ">", f), Vi;
}
var Wi, Ha;
function Df() {
  if (Ha) return Wi;
  Ha = 1;
  const r = po();
  return Wi = (p, d, f) => r(p, d, "<", f), Wi;
}
var Yi, Ga;
function Nf() {
  if (Ga) return Yi;
  Ga = 1;
  const r = tt();
  return Yi = (p, d, f) => (p = new r(p, f), d = new r(d, f), p.intersects(d, f)), Yi;
}
var zi, Va;
function Ff() {
  if (Va) return zi;
  Va = 1;
  const r = Kr(), c = et();
  return zi = (p, d, f) => {
    const u = [];
    let o = null, a = null;
    const l = p.sort((s, h) => c(s, h, f));
    for (const s of l)
      r(s, d, f) ? (a = s, o || (o = s)) : (a && u.push([o, a]), a = null, o = null);
    o && u.push([o, null]);
    const i = [];
    for (const [s, h] of u)
      s === h ? i.push(s) : !h && s === l[0] ? i.push("*") : h ? s === l[0] ? i.push(`<=${h}`) : i.push(`${s} - ${h}`) : i.push(`>=${s}`);
    const n = i.join(" || "), t = typeof d.raw == "string" ? d.raw : String(d);
    return n.length < t.length ? n : d;
  }, zi;
}
var Xi, Wa;
function xf() {
  if (Wa) return Xi;
  Wa = 1;
  const r = tt(), c = Xr(), { ANY: p } = c, d = Kr(), f = et(), u = (t, s, h = {}) => {
    if (t === s)
      return !0;
    t = new r(t, h), s = new r(s, h);
    let g = !1;
    e: for (const y of t.set) {
      for (const m of s.set) {
        const _ = l(y, m, h);
        if (g = g || _ !== null, _)
          continue e;
      }
      if (g)
        return !1;
    }
    return !0;
  }, o = [new c(">=0.0.0-0")], a = [new c(">=0.0.0")], l = (t, s, h) => {
    if (t === s)
      return !0;
    if (t.length === 1 && t[0].semver === p) {
      if (s.length === 1 && s[0].semver === p)
        return !0;
      h.includePrerelease ? t = o : t = a;
    }
    if (s.length === 1 && s[0].semver === p) {
      if (h.includePrerelease)
        return !0;
      s = a;
    }
    const g = /* @__PURE__ */ new Set();
    let y, m;
    for (const x of t)
      x.operator === ">" || x.operator === ">=" ? y = i(y, x, h) : x.operator === "<" || x.operator === "<=" ? m = n(m, x, h) : g.add(x.semver);
    if (g.size > 1)
      return null;
    let _;
    if (y && m) {
      if (_ = f(y.semver, m.semver, h), _ > 0)
        return null;
      if (_ === 0 && (y.operator !== ">=" || m.operator !== "<="))
        return null;
    }
    for (const x of g) {
      if (y && !d(x, String(y), h) || m && !d(x, String(m), h))
        return null;
      for (const B of s)
        if (!d(x, String(B), h))
          return !1;
      return !0;
    }
    let R, b, D, C, F = m && !h.includePrerelease && m.semver.prerelease.length ? m.semver : !1, I = y && !h.includePrerelease && y.semver.prerelease.length ? y.semver : !1;
    F && F.prerelease.length === 1 && m.operator === "<" && F.prerelease[0] === 0 && (F = !1);
    for (const x of s) {
      if (C = C || x.operator === ">" || x.operator === ">=", D = D || x.operator === "<" || x.operator === "<=", y) {
        if (I && x.semver.prerelease && x.semver.prerelease.length && x.semver.major === I.major && x.semver.minor === I.minor && x.semver.patch === I.patch && (I = !1), x.operator === ">" || x.operator === ">=") {
          if (R = i(y, x, h), R === x && R !== y)
            return !1;
        } else if (y.operator === ">=" && !d(y.semver, String(x), h))
          return !1;
      }
      if (m) {
        if (F && x.semver.prerelease && x.semver.prerelease.length && x.semver.major === F.major && x.semver.minor === F.minor && x.semver.patch === F.patch && (F = !1), x.operator === "<" || x.operator === "<=") {
          if (b = n(m, x, h), b === x && b !== m)
            return !1;
        } else if (m.operator === "<=" && !d(m.semver, String(x), h))
          return !1;
      }
      if (!x.operator && (m || y) && _ !== 0)
        return !1;
    }
    return !(y && D && !m && _ !== 0 || m && C && !y && _ !== 0 || I || F);
  }, i = (t, s, h) => {
    if (!t)
      return s;
    const g = f(t.semver, s.semver, h);
    return g > 0 ? t : g < 0 || s.operator === ">" && t.operator === ">=" ? s : t;
  }, n = (t, s, h) => {
    if (!t)
      return s;
    const g = f(t.semver, s.semver, h);
    return g < 0 ? t : g > 0 || s.operator === "<" && t.operator === "<=" ? s : t;
  };
  return Xi = u, Xi;
}
var Ki, Ya;
function cu() {
  if (Ya) return Ki;
  Ya = 1;
  const r = _r(), c = Wr(), p = Be(), d = su(), f = jt(), u = ff(), o = df(), a = hf(), l = pf(), i = mf(), n = gf(), t = Ef(), s = yf(), h = et(), g = wf(), y = vf(), m = uo(), _ = _f(), R = Af(), b = zr(), D = co(), C = au(), F = lu(), I = fo(), x = ho(), B = uu(), S = Rf(), Y = Xr(), H = tt(), V = Kr(), L = Sf(), P = bf(), A = Cf(), O = Pf(), $ = Of(), j = po(), X = If(), oe = Df(), Z = Nf(), de = Ff(), Ee = xf();
  return Ki = {
    parse: f,
    valid: u,
    clean: o,
    inc: a,
    diff: l,
    major: i,
    minor: n,
    patch: t,
    prerelease: s,
    compare: h,
    rcompare: g,
    compareLoose: y,
    compareBuild: m,
    sort: _,
    rsort: R,
    gt: b,
    lt: D,
    eq: C,
    neq: F,
    gte: I,
    lte: x,
    cmp: B,
    coerce: S,
    Comparator: Y,
    Range: H,
    satisfies: V,
    toComparators: L,
    maxSatisfying: P,
    minSatisfying: A,
    minVersion: O,
    validRange: $,
    outside: j,
    gtr: X,
    ltr: oe,
    intersects: Z,
    simplifyRange: de,
    subset: Ee,
    SemVer: p,
    re: r.re,
    src: r.src,
    tokens: r.t,
    SEMVER_SPEC_VERSION: c.SEMVER_SPEC_VERSION,
    RELEASE_TYPES: c.RELEASE_TYPES,
    compareIdentifiers: d.compareIdentifiers,
    rcompareIdentifiers: d.rcompareIdentifiers
  }, Ki;
}
var Lt = {}, pr = { exports: {} };
pr.exports;
var za;
function Lf() {
  return za || (za = 1, (function(r, c) {
    var p = 200, d = "__lodash_hash_undefined__", f = 1, u = 2, o = 9007199254740991, a = "[object Arguments]", l = "[object Array]", i = "[object AsyncFunction]", n = "[object Boolean]", t = "[object Date]", s = "[object Error]", h = "[object Function]", g = "[object GeneratorFunction]", y = "[object Map]", m = "[object Number]", _ = "[object Null]", R = "[object Object]", b = "[object Promise]", D = "[object Proxy]", C = "[object RegExp]", F = "[object Set]", I = "[object String]", x = "[object Symbol]", B = "[object Undefined]", S = "[object WeakMap]", Y = "[object ArrayBuffer]", H = "[object DataView]", V = "[object Float32Array]", L = "[object Float64Array]", P = "[object Int8Array]", A = "[object Int16Array]", O = "[object Int32Array]", $ = "[object Uint8Array]", j = "[object Uint8ClampedArray]", X = "[object Uint16Array]", oe = "[object Uint32Array]", Z = /[\\^$.*+?()[\]{}|]/g, de = /^\[object .+?Constructor\]$/, Ee = /^(?:0|[1-9]\d*)$/, K = {};
    K[V] = K[L] = K[P] = K[A] = K[O] = K[$] = K[j] = K[X] = K[oe] = !0, K[a] = K[l] = K[Y] = K[n] = K[H] = K[t] = K[s] = K[h] = K[y] = K[m] = K[R] = K[C] = K[F] = K[I] = K[S] = !1;
    var ue = typeof Ze == "object" && Ze && Ze.Object === Object && Ze, he = typeof self == "object" && self && self.Object === Object && self, me = ue || he || Function("return this")(), pe = c && !c.nodeType && c, Ae = pe && !0 && r && !r.nodeType && r, we = Ae && Ae.exports === pe, w = we && ue.process, E = (function() {
      try {
        return w && w.binding && w.binding("util");
      } catch {
      }
    })(), q = E && E.isTypedArray;
    function N(T, U) {
      for (var te = -1, le = T == null ? 0 : T.length, be = 0, ge = []; ++te < le; ) {
        var Oe = T[te];
        U(Oe, te, T) && (ge[be++] = Oe);
      }
      return ge;
    }
    function ve(T, U) {
      for (var te = -1, le = U.length, be = T.length; ++te < le; )
        T[be + te] = U[te];
      return T;
    }
    function Re(T, U) {
      for (var te = -1, le = T == null ? 0 : T.length; ++te < le; )
        if (U(T[te], te, T))
          return !0;
      return !1;
    }
    function Se(T, U) {
      for (var te = -1, le = Array(T); ++te < T; )
        le[te] = U(te);
      return le;
    }
    function Ne(T) {
      return function(U) {
        return T(U);
      };
    }
    function Ie(T, U) {
      return T.has(U);
    }
    function $e(T, U) {
      return T == null ? void 0 : T[U];
    }
    function Ce(T) {
      var U = -1, te = Array(T.size);
      return T.forEach(function(le, be) {
        te[++U] = [be, le];
      }), te;
    }
    function De(T, U) {
      return function(te) {
        return T(U(te));
      };
    }
    function Et(T) {
      var U = -1, te = Array(T.size);
      return T.forEach(function(le) {
        te[++U] = le;
      }), te;
    }
    var it = Array.prototype, rt = Function.prototype, Ke = Object.prototype, e = me["__core-js_shared__"], k = rt.toString, W = Ke.hasOwnProperty, Q = (function() {
      var T = /[^.]+$/.exec(e && e.keys && e.keys.IE_PROTO || "");
      return T ? "Symbol(src)_1." + T : "";
    })(), G = Ke.toString, ie = RegExp(
      "^" + k.call(W).replace(Z, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    ), v = we ? me.Buffer : void 0, M = me.Symbol, ne = me.Uint8Array, z = Ke.propertyIsEnumerable, J = it.splice, ee = M ? M.toStringTag : void 0, re = Object.getOwnPropertySymbols, ae = v ? v.isBuffer : void 0, se = De(Object.keys, Object), ce = Nt(me, "DataView"), fe = Nt(me, "Map"), ye = Nt(me, "Promise"), Te = Nt(me, "Set"), Dt = Nt(me, "WeakMap"), Je = Nt(Object, "create"), yt = _t(ce), Ru = _t(fe), Tu = _t(ye), Su = _t(Te), bu = _t(Dt), wo = M ? M.prototype : void 0, Qr = wo ? wo.valueOf : void 0;
    function wt(T) {
      var U = -1, te = T == null ? 0 : T.length;
      for (this.clear(); ++U < te; ) {
        var le = T[U];
        this.set(le[0], le[1]);
      }
    }
    function Cu() {
      this.__data__ = Je ? Je(null) : {}, this.size = 0;
    }
    function Pu(T) {
      var U = this.has(T) && delete this.__data__[T];
      return this.size -= U ? 1 : 0, U;
    }
    function Ou(T) {
      var U = this.__data__;
      if (Je) {
        var te = U[T];
        return te === d ? void 0 : te;
      }
      return W.call(U, T) ? U[T] : void 0;
    }
    function Iu(T) {
      var U = this.__data__;
      return Je ? U[T] !== void 0 : W.call(U, T);
    }
    function Du(T, U) {
      var te = this.__data__;
      return this.size += this.has(T) ? 0 : 1, te[T] = Je && U === void 0 ? d : U, this;
    }
    wt.prototype.clear = Cu, wt.prototype.delete = Pu, wt.prototype.get = Ou, wt.prototype.has = Iu, wt.prototype.set = Du;
    function ot(T) {
      var U = -1, te = T == null ? 0 : T.length;
      for (this.clear(); ++U < te; ) {
        var le = T[U];
        this.set(le[0], le[1]);
      }
    }
    function Nu() {
      this.__data__ = [], this.size = 0;
    }
    function Fu(T) {
      var U = this.__data__, te = Tr(U, T);
      if (te < 0)
        return !1;
      var le = U.length - 1;
      return te == le ? U.pop() : J.call(U, te, 1), --this.size, !0;
    }
    function xu(T) {
      var U = this.__data__, te = Tr(U, T);
      return te < 0 ? void 0 : U[te][1];
    }
    function Lu(T) {
      return Tr(this.__data__, T) > -1;
    }
    function Uu(T, U) {
      var te = this.__data__, le = Tr(te, T);
      return le < 0 ? (++this.size, te.push([T, U])) : te[le][1] = U, this;
    }
    ot.prototype.clear = Nu, ot.prototype.delete = Fu, ot.prototype.get = xu, ot.prototype.has = Lu, ot.prototype.set = Uu;
    function vt(T) {
      var U = -1, te = T == null ? 0 : T.length;
      for (this.clear(); ++U < te; ) {
        var le = T[U];
        this.set(le[0], le[1]);
      }
    }
    function $u() {
      this.size = 0, this.__data__ = {
        hash: new wt(),
        map: new (fe || ot)(),
        string: new wt()
      };
    }
    function ku(T) {
      var U = Sr(this, T).delete(T);
      return this.size -= U ? 1 : 0, U;
    }
    function qu(T) {
      return Sr(this, T).get(T);
    }
    function Mu(T) {
      return Sr(this, T).has(T);
    }
    function Bu(T, U) {
      var te = Sr(this, T), le = te.size;
      return te.set(T, U), this.size += te.size == le ? 0 : 1, this;
    }
    vt.prototype.clear = $u, vt.prototype.delete = ku, vt.prototype.get = qu, vt.prototype.has = Mu, vt.prototype.set = Bu;
    function Rr(T) {
      var U = -1, te = T == null ? 0 : T.length;
      for (this.__data__ = new vt(); ++U < te; )
        this.add(T[U]);
    }
    function ju(T) {
      return this.__data__.set(T, d), this;
    }
    function Hu(T) {
      return this.__data__.has(T);
    }
    Rr.prototype.add = Rr.prototype.push = ju, Rr.prototype.has = Hu;
    function lt(T) {
      var U = this.__data__ = new ot(T);
      this.size = U.size;
    }
    function Gu() {
      this.__data__ = new ot(), this.size = 0;
    }
    function Vu(T) {
      var U = this.__data__, te = U.delete(T);
      return this.size = U.size, te;
    }
    function Wu(T) {
      return this.__data__.get(T);
    }
    function Yu(T) {
      return this.__data__.has(T);
    }
    function zu(T, U) {
      var te = this.__data__;
      if (te instanceof ot) {
        var le = te.__data__;
        if (!fe || le.length < p - 1)
          return le.push([T, U]), this.size = ++te.size, this;
        te = this.__data__ = new vt(le);
      }
      return te.set(T, U), this.size = te.size, this;
    }
    lt.prototype.clear = Gu, lt.prototype.delete = Vu, lt.prototype.get = Wu, lt.prototype.has = Yu, lt.prototype.set = zu;
    function Xu(T, U) {
      var te = br(T), le = !te && cc(T), be = !te && !le && Zr(T), ge = !te && !le && !be && Po(T), Oe = te || le || be || ge, xe = Oe ? Se(T.length, String) : [], Ue = xe.length;
      for (var Pe in T)
        W.call(T, Pe) && !(Oe && // Safari 9 has enumerable `arguments.length` in strict mode.
        (Pe == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
        be && (Pe == "offset" || Pe == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
        ge && (Pe == "buffer" || Pe == "byteLength" || Pe == "byteOffset") || // Skip index properties.
        oc(Pe, Ue))) && xe.push(Pe);
      return xe;
    }
    function Tr(T, U) {
      for (var te = T.length; te--; )
        if (To(T[te][0], U))
          return te;
      return -1;
    }
    function Ku(T, U, te) {
      var le = U(T);
      return br(T) ? le : ve(le, te(T));
    }
    function Ht(T) {
      return T == null ? T === void 0 ? B : _ : ee && ee in Object(T) ? nc(T) : uc(T);
    }
    function vo(T) {
      return Gt(T) && Ht(T) == a;
    }
    function _o(T, U, te, le, be) {
      return T === U ? !0 : T == null || U == null || !Gt(T) && !Gt(U) ? T !== T && U !== U : Ju(T, U, te, le, _o, be);
    }
    function Ju(T, U, te, le, be, ge) {
      var Oe = br(T), xe = br(U), Ue = Oe ? l : ut(T), Pe = xe ? l : ut(U);
      Ue = Ue == a ? R : Ue, Pe = Pe == a ? R : Pe;
      var Ge = Ue == R, Qe = Pe == R, ke = Ue == Pe;
      if (ke && Zr(T)) {
        if (!Zr(U))
          return !1;
        Oe = !0, Ge = !1;
      }
      if (ke && !Ge)
        return ge || (ge = new lt()), Oe || Po(T) ? Ao(T, U, te, le, be, ge) : tc(T, U, Ue, te, le, be, ge);
      if (!(te & f)) {
        var ze = Ge && W.call(T, "__wrapped__"), Xe = Qe && W.call(U, "__wrapped__");
        if (ze || Xe) {
          var ct = ze ? T.value() : T, st = Xe ? U.value() : U;
          return ge || (ge = new lt()), be(ct, st, te, le, ge);
        }
      }
      return ke ? (ge || (ge = new lt()), rc(T, U, te, le, be, ge)) : !1;
    }
    function Qu(T) {
      if (!Co(T) || ac(T))
        return !1;
      var U = So(T) ? ie : de;
      return U.test(_t(T));
    }
    function Zu(T) {
      return Gt(T) && bo(T.length) && !!K[Ht(T)];
    }
    function ec(T) {
      if (!lc(T))
        return se(T);
      var U = [];
      for (var te in Object(T))
        W.call(T, te) && te != "constructor" && U.push(te);
      return U;
    }
    function Ao(T, U, te, le, be, ge) {
      var Oe = te & f, xe = T.length, Ue = U.length;
      if (xe != Ue && !(Oe && Ue > xe))
        return !1;
      var Pe = ge.get(T);
      if (Pe && ge.get(U))
        return Pe == U;
      var Ge = -1, Qe = !0, ke = te & u ? new Rr() : void 0;
      for (ge.set(T, U), ge.set(U, T); ++Ge < xe; ) {
        var ze = T[Ge], Xe = U[Ge];
        if (le)
          var ct = Oe ? le(Xe, ze, Ge, U, T, ge) : le(ze, Xe, Ge, T, U, ge);
        if (ct !== void 0) {
          if (ct)
            continue;
          Qe = !1;
          break;
        }
        if (ke) {
          if (!Re(U, function(st, At) {
            if (!Ie(ke, At) && (ze === st || be(ze, st, te, le, ge)))
              return ke.push(At);
          })) {
            Qe = !1;
            break;
          }
        } else if (!(ze === Xe || be(ze, Xe, te, le, ge))) {
          Qe = !1;
          break;
        }
      }
      return ge.delete(T), ge.delete(U), Qe;
    }
    function tc(T, U, te, le, be, ge, Oe) {
      switch (te) {
        case H:
          if (T.byteLength != U.byteLength || T.byteOffset != U.byteOffset)
            return !1;
          T = T.buffer, U = U.buffer;
        case Y:
          return !(T.byteLength != U.byteLength || !ge(new ne(T), new ne(U)));
        case n:
        case t:
        case m:
          return To(+T, +U);
        case s:
          return T.name == U.name && T.message == U.message;
        case C:
        case I:
          return T == U + "";
        case y:
          var xe = Ce;
        case F:
          var Ue = le & f;
          if (xe || (xe = Et), T.size != U.size && !Ue)
            return !1;
          var Pe = Oe.get(T);
          if (Pe)
            return Pe == U;
          le |= u, Oe.set(T, U);
          var Ge = Ao(xe(T), xe(U), le, be, ge, Oe);
          return Oe.delete(T), Ge;
        case x:
          if (Qr)
            return Qr.call(T) == Qr.call(U);
      }
      return !1;
    }
    function rc(T, U, te, le, be, ge) {
      var Oe = te & f, xe = Ro(T), Ue = xe.length, Pe = Ro(U), Ge = Pe.length;
      if (Ue != Ge && !Oe)
        return !1;
      for (var Qe = Ue; Qe--; ) {
        var ke = xe[Qe];
        if (!(Oe ? ke in U : W.call(U, ke)))
          return !1;
      }
      var ze = ge.get(T);
      if (ze && ge.get(U))
        return ze == U;
      var Xe = !0;
      ge.set(T, U), ge.set(U, T);
      for (var ct = Oe; ++Qe < Ue; ) {
        ke = xe[Qe];
        var st = T[ke], At = U[ke];
        if (le)
          var Oo = Oe ? le(At, st, ke, U, T, ge) : le(st, At, ke, T, U, ge);
        if (!(Oo === void 0 ? st === At || be(st, At, te, le, ge) : Oo)) {
          Xe = !1;
          break;
        }
        ct || (ct = ke == "constructor");
      }
      if (Xe && !ct) {
        var Cr = T.constructor, Pr = U.constructor;
        Cr != Pr && "constructor" in T && "constructor" in U && !(typeof Cr == "function" && Cr instanceof Cr && typeof Pr == "function" && Pr instanceof Pr) && (Xe = !1);
      }
      return ge.delete(T), ge.delete(U), Xe;
    }
    function Ro(T) {
      return Ku(T, hc, ic);
    }
    function Sr(T, U) {
      var te = T.__data__;
      return sc(U) ? te[typeof U == "string" ? "string" : "hash"] : te.map;
    }
    function Nt(T, U) {
      var te = $e(T, U);
      return Qu(te) ? te : void 0;
    }
    function nc(T) {
      var U = W.call(T, ee), te = T[ee];
      try {
        T[ee] = void 0;
        var le = !0;
      } catch {
      }
      var be = G.call(T);
      return le && (U ? T[ee] = te : delete T[ee]), be;
    }
    var ic = re ? function(T) {
      return T == null ? [] : (T = Object(T), N(re(T), function(U) {
        return z.call(T, U);
      }));
    } : pc, ut = Ht;
    (ce && ut(new ce(new ArrayBuffer(1))) != H || fe && ut(new fe()) != y || ye && ut(ye.resolve()) != b || Te && ut(new Te()) != F || Dt && ut(new Dt()) != S) && (ut = function(T) {
      var U = Ht(T), te = U == R ? T.constructor : void 0, le = te ? _t(te) : "";
      if (le)
        switch (le) {
          case yt:
            return H;
          case Ru:
            return y;
          case Tu:
            return b;
          case Su:
            return F;
          case bu:
            return S;
        }
      return U;
    });
    function oc(T, U) {
      return U = U ?? o, !!U && (typeof T == "number" || Ee.test(T)) && T > -1 && T % 1 == 0 && T < U;
    }
    function sc(T) {
      var U = typeof T;
      return U == "string" || U == "number" || U == "symbol" || U == "boolean" ? T !== "__proto__" : T === null;
    }
    function ac(T) {
      return !!Q && Q in T;
    }
    function lc(T) {
      var U = T && T.constructor, te = typeof U == "function" && U.prototype || Ke;
      return T === te;
    }
    function uc(T) {
      return G.call(T);
    }
    function _t(T) {
      if (T != null) {
        try {
          return k.call(T);
        } catch {
        }
        try {
          return T + "";
        } catch {
        }
      }
      return "";
    }
    function To(T, U) {
      return T === U || T !== T && U !== U;
    }
    var cc = vo(/* @__PURE__ */ (function() {
      return arguments;
    })()) ? vo : function(T) {
      return Gt(T) && W.call(T, "callee") && !z.call(T, "callee");
    }, br = Array.isArray;
    function fc(T) {
      return T != null && bo(T.length) && !So(T);
    }
    var Zr = ae || mc;
    function dc(T, U) {
      return _o(T, U);
    }
    function So(T) {
      if (!Co(T))
        return !1;
      var U = Ht(T);
      return U == h || U == g || U == i || U == D;
    }
    function bo(T) {
      return typeof T == "number" && T > -1 && T % 1 == 0 && T <= o;
    }
    function Co(T) {
      var U = typeof T;
      return T != null && (U == "object" || U == "function");
    }
    function Gt(T) {
      return T != null && typeof T == "object";
    }
    var Po = q ? Ne(q) : Zu;
    function hc(T) {
      return fc(T) ? Xu(T) : ec(T);
    }
    function pc() {
      return [];
    }
    function mc() {
      return !1;
    }
    r.exports = dc;
  })(pr, pr.exports)), pr.exports;
}
var Xa;
function Uf() {
  if (Xa) return Lt;
  Xa = 1, Object.defineProperty(Lt, "__esModule", { value: !0 }), Lt.DownloadedUpdateHelper = void 0, Lt.createTempUpdateFile = a;
  const r = yr, c = je, p = Lf(), d = /* @__PURE__ */ gt(), f = _e;
  let u = class {
    constructor(i) {
      this.cacheDir = i, this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, this._downloadedFileInfo = null;
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
    async validateDownloadedPath(i, n, t, s) {
      if (this.versionInfo != null && this.file === i && this.fileInfo != null)
        return p(this.versionInfo, n) && p(this.fileInfo.info, t.info) && await (0, d.pathExists)(i) ? i : null;
      const h = await this.getValidCachedUpdateFile(t, s);
      return h === null ? null : (s.info(`Update has already been downloaded to ${i}).`), this._file = h, h);
    }
    async setDownloadedFile(i, n, t, s, h, g) {
      this._file = i, this._packageFile = n, this.versionInfo = t, this.fileInfo = s, this._downloadedFileInfo = {
        fileName: h,
        sha512: s.info.sha512,
        isAdminRightsRequired: s.info.isAdminRightsRequired === !0
      }, g && await (0, d.outputJson)(this.getUpdateInfoFile(), this._downloadedFileInfo);
    }
    async clear() {
      this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, await this.cleanCacheDirForPendingUpdate();
    }
    async cleanCacheDirForPendingUpdate() {
      try {
        await (0, d.emptyDir)(this.cacheDirForPendingUpdate);
      } catch {
      }
    }
    /**
     * Returns "update-info.json" which is created in the update cache directory's "pending" subfolder after the first update is downloaded.  If the update file does not exist then the cache is cleared and recreated.  If the update file exists then its properties are validated.
     * @param fileInfo
     * @param logger
     */
    async getValidCachedUpdateFile(i, n) {
      const t = this.getUpdateInfoFile();
      if (!await (0, d.pathExists)(t))
        return null;
      let h;
      try {
        h = await (0, d.readJson)(t);
      } catch (_) {
        let R = "No cached update info available";
        return _.code !== "ENOENT" && (await this.cleanCacheDirForPendingUpdate(), R += ` (error on read: ${_.message})`), n.info(R), null;
      }
      if (!((h == null ? void 0 : h.fileName) !== null))
        return n.warn("Cached update info is corrupted: no fileName, directory for cached update will be cleaned"), await this.cleanCacheDirForPendingUpdate(), null;
      if (i.info.sha512 !== h.sha512)
        return n.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${h.sha512}, expected: ${i.info.sha512}. Directory for cached update will be cleaned`), await this.cleanCacheDirForPendingUpdate(), null;
      const y = f.join(this.cacheDirForPendingUpdate, h.fileName);
      if (!await (0, d.pathExists)(y))
        return n.info("Cached update file doesn't exist"), null;
      const m = await o(y);
      return i.info.sha512 !== m ? (n.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${m}, expected: ${i.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null) : (this._downloadedFileInfo = h, y);
    }
    getUpdateInfoFile() {
      return f.join(this.cacheDirForPendingUpdate, "update-info.json");
    }
  };
  Lt.DownloadedUpdateHelper = u;
  function o(l, i = "sha512", n = "base64", t) {
    return new Promise((s, h) => {
      const g = (0, r.createHash)(i);
      g.on("error", h).setEncoding(n), (0, c.createReadStream)(l, {
        ...t,
        highWaterMark: 1024 * 1024
        /* better to use more memory but hash faster */
      }).on("error", h).on("end", () => {
        g.end(), s(g.read());
      }).pipe(g, { end: !1 });
    });
  }
  async function a(l, i, n) {
    let t = 0, s = f.join(i, l);
    for (let h = 0; h < 3; h++)
      try {
        return await (0, d.unlink)(s), s;
      } catch (g) {
        if (g.code === "ENOENT")
          return s;
        n.warn(`Error on remove temp update file: ${g}`), s = f.join(i, `${t++}-${l}`);
      }
    return s;
  }
  return Lt;
}
var Xt = {}, Mr = {}, Ka;
function $f() {
  if (Ka) return Mr;
  Ka = 1, Object.defineProperty(Mr, "__esModule", { value: !0 }), Mr.getAppCacheDir = p;
  const r = _e, c = Hr;
  function p() {
    const d = (0, c.homedir)();
    let f;
    return process.platform === "win32" ? f = process.env.LOCALAPPDATA || r.join(d, "AppData", "Local") : process.platform === "darwin" ? f = r.join(d, "Library", "Caches") : f = process.env.XDG_CACHE_HOME || r.join(d, ".cache"), f;
  }
  return Mr;
}
var Ja;
function kf() {
  if (Ja) return Xt;
  Ja = 1, Object.defineProperty(Xt, "__esModule", { value: !0 }), Xt.ElectronAppAdapter = void 0;
  const r = _e, c = $f();
  let p = class {
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
      return this.isPackaged ? r.join(process.resourcesPath, "app-update.yml") : r.join(this.app.getAppPath(), "dev-app-update.yml");
    }
    get userDataPath() {
      return this.app.getPath("userData");
    }
    get baseCachePath() {
      return (0, c.getAppCacheDir)();
    }
    quit() {
      this.app.quit();
    }
    relaunch() {
      this.app.relaunch();
    }
    onQuit(f) {
      this.app.once("quit", (u, o) => f(o));
    }
  };
  return Xt.ElectronAppAdapter = p, Xt;
}
var Ji = {}, Qa;
function qf() {
  return Qa || (Qa = 1, (function(r) {
    Object.defineProperty(r, "__esModule", { value: !0 }), r.ElectronHttpExecutor = r.NET_SESSION_NAME = void 0, r.getNetSession = p;
    const c = Le();
    r.NET_SESSION_NAME = "electron-updater";
    function p() {
      return Ct.session.fromPartition(r.NET_SESSION_NAME, {
        cache: !1
      });
    }
    class d extends c.HttpExecutor {
      constructor(u) {
        super(), this.proxyLoginCallback = u, this.cachedSession = null;
      }
      async download(u, o, a) {
        return await a.cancellationToken.createPromise((l, i, n) => {
          const t = {
            headers: a.headers || void 0,
            redirect: "manual"
          };
          (0, c.configureRequestUrl)(u, t), (0, c.configureRequestOptions)(t), this.doDownload(t, {
            destination: o,
            options: a,
            onCancel: n,
            callback: (s) => {
              s == null ? l(o) : i(s);
            },
            responseHandler: null
          }, 0);
        });
      }
      createRequest(u, o) {
        u.headers && u.headers.Host && (u.host = u.headers.Host, delete u.headers.Host), this.cachedSession == null && (this.cachedSession = p());
        const a = Ct.net.request({
          ...u,
          session: this.cachedSession
        });
        return a.on("response", o), this.proxyLoginCallback != null && a.on("login", this.proxyLoginCallback), a;
      }
      addRedirectHandlers(u, o, a, l, i) {
        u.on("redirect", (n, t, s) => {
          u.abort(), l > this.maxRedirects ? a(this.createMaxRedirectError()) : i(c.HttpExecutor.prepareRedirectUrlOptions(s, o));
        });
      }
    }
    r.ElectronHttpExecutor = d;
  })(Ji)), Ji;
}
var Kt = {}, Ut = {}, Za;
function Ot() {
  if (Za) return Ut;
  Za = 1, Object.defineProperty(Ut, "__esModule", { value: !0 }), Ut.newBaseUrl = c, Ut.newUrlFromBase = p, Ut.getChannelFilename = d;
  const r = mt;
  function c(f) {
    const u = new r.URL(f);
    return u.pathname.endsWith("/") || (u.pathname += "/"), u;
  }
  function p(f, u, o = !1) {
    const a = new r.URL(f, u), l = u.search;
    return l != null && l.length !== 0 ? a.search = l : o && (a.search = `noCache=${Date.now().toString(32)}`), a;
  }
  function d(f) {
    return `${f}.yml`;
  }
  return Ut;
}
var at = {}, Qi, el;
function fu() {
  if (el) return Qi;
  el = 1;
  var r = "[object Symbol]", c = /[\\^$.*+?()[\]{}|]/g, p = RegExp(c.source), d = typeof Ze == "object" && Ze && Ze.Object === Object && Ze, f = typeof self == "object" && self && self.Object === Object && self, u = d || f || Function("return this")(), o = Object.prototype, a = o.toString, l = u.Symbol, i = l ? l.prototype : void 0, n = i ? i.toString : void 0;
  function t(m) {
    if (typeof m == "string")
      return m;
    if (h(m))
      return n ? n.call(m) : "";
    var _ = m + "";
    return _ == "0" && 1 / m == -1 / 0 ? "-0" : _;
  }
  function s(m) {
    return !!m && typeof m == "object";
  }
  function h(m) {
    return typeof m == "symbol" || s(m) && a.call(m) == r;
  }
  function g(m) {
    return m == null ? "" : t(m);
  }
  function y(m) {
    return m = g(m), m && p.test(m) ? m.replace(c, "\\$&") : m;
  }
  return Qi = y, Qi;
}
var tl;
function Ye() {
  if (tl) return at;
  tl = 1, Object.defineProperty(at, "__esModule", { value: !0 }), at.Provider = void 0, at.findFile = o, at.parseUpdateInfo = a, at.getFileList = l, at.resolveFiles = i;
  const r = Le(), c = ao(), p = mt, d = Ot(), f = fu();
  let u = class {
    constructor(t) {
      this.runtimeOptions = t, this.requestHeaders = null, this.executor = t.executor;
    }
    // By default, the blockmap file is in the same directory as the main file
    // But some providers may have a different blockmap file, so we need to override this method
    getBlockMapFiles(t, s, h, g = null) {
      const y = (0, d.newUrlFromBase)(`${t.pathname}.blockmap`, t);
      return [(0, d.newUrlFromBase)(`${t.pathname.replace(new RegExp(f(h), "g"), s)}.blockmap`, g ? new p.URL(g) : t), y];
    }
    get isUseMultipleRangeRequest() {
      return this.runtimeOptions.isUseMultipleRangeRequest !== !1;
    }
    getChannelFilePrefix() {
      if (this.runtimeOptions.platform === "linux") {
        const t = process.env.TEST_UPDATER_ARCH || process.arch;
        return "-linux" + (t === "x64" ? "" : `-${t}`);
      } else
        return this.runtimeOptions.platform === "darwin" ? "-mac" : "";
    }
    // due to historical reasons for windows we use channel name without platform specifier
    getDefaultChannelName() {
      return this.getCustomChannelName("latest");
    }
    getCustomChannelName(t) {
      return `${t}${this.getChannelFilePrefix()}`;
    }
    get fileExtraDownloadHeaders() {
      return null;
    }
    setRequestHeaders(t) {
      this.requestHeaders = t;
    }
    /**
     * Method to perform API request only to resolve update info, but not to download update.
     */
    httpRequest(t, s, h) {
      return this.executor.request(this.createRequestOptions(t, s), h);
    }
    createRequestOptions(t, s) {
      const h = {};
      return this.requestHeaders == null ? s != null && (h.headers = s) : h.headers = s == null ? this.requestHeaders : { ...this.requestHeaders, ...s }, (0, r.configureRequestUrl)(t, h), h;
    }
  };
  at.Provider = u;
  function o(n, t, s) {
    var h;
    if (n.length === 0)
      throw (0, r.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
    const g = n.filter((m) => m.url.pathname.toLowerCase().endsWith(`.${t.toLowerCase()}`)), y = (h = g.find((m) => [m.url.pathname, m.info.url].some((_) => _.includes(process.arch)))) !== null && h !== void 0 ? h : g.shift();
    return y || (s == null ? n[0] : n.find((m) => !s.some((_) => m.url.pathname.toLowerCase().endsWith(`.${_.toLowerCase()}`))));
  }
  function a(n, t, s) {
    if (n == null)
      throw (0, r.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${s}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
    let h;
    try {
      h = (0, c.load)(n);
    } catch (g) {
      throw (0, r.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${s}): ${g.stack || g.message}, rawData: ${n}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
    }
    return h;
  }
  function l(n) {
    const t = n.files;
    if (t != null && t.length > 0)
      return t;
    if (n.path != null)
      return [
        {
          url: n.path,
          sha2: n.sha2,
          sha512: n.sha512
        }
      ];
    throw (0, r.newError)(`No files provided: ${(0, r.safeStringifyJson)(n)}`, "ERR_UPDATER_NO_FILES_PROVIDED");
  }
  function i(n, t, s = (h) => h) {
    const g = l(n).map((_) => {
      if (_.sha2 == null && _.sha512 == null)
        throw (0, r.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, r.safeStringifyJson)(_)}`, "ERR_UPDATER_NO_CHECKSUM");
      return {
        url: (0, d.newUrlFromBase)(s(_.url), t),
        info: _
      };
    }), y = n.packages, m = y == null ? null : y[process.arch] || y.ia32;
    return m != null && (g[0].packageInfo = {
      ...m,
      path: (0, d.newUrlFromBase)(s(m.path), t).href
    }), g;
  }
  return at;
}
var rl;
function du() {
  if (rl) return Kt;
  rl = 1, Object.defineProperty(Kt, "__esModule", { value: !0 }), Kt.GenericProvider = void 0;
  const r = Le(), c = Ot(), p = Ye();
  let d = class extends p.Provider {
    constructor(u, o, a) {
      super(a), this.configuration = u, this.updater = o, this.baseUrl = (0, c.newBaseUrl)(this.configuration.url);
    }
    get channel() {
      const u = this.updater.channel || this.configuration.channel;
      return u == null ? this.getDefaultChannelName() : this.getCustomChannelName(u);
    }
    async getLatestVersion() {
      const u = (0, c.getChannelFilename)(this.channel), o = (0, c.newUrlFromBase)(u, this.baseUrl, this.updater.isAddNoCacheQuery);
      for (let a = 0; ; a++)
        try {
          return (0, p.parseUpdateInfo)(await this.httpRequest(o), u, o);
        } catch (l) {
          if (l instanceof r.HttpError && l.statusCode === 404)
            throw (0, r.newError)(`Cannot find channel "${u}" update info: ${l.stack || l.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
          if (l.code === "ECONNREFUSED" && a < 3) {
            await new Promise((i, n) => {
              try {
                setTimeout(i, 1e3 * a);
              } catch (t) {
                n(t);
              }
            });
            continue;
          }
          throw l;
        }
    }
    resolveFiles(u) {
      return (0, p.resolveFiles)(u, this.baseUrl);
    }
  };
  return Kt.GenericProvider = d, Kt;
}
var Jt = {}, Qt = {}, nl;
function Mf() {
  if (nl) return Qt;
  nl = 1, Object.defineProperty(Qt, "__esModule", { value: !0 }), Qt.BitbucketProvider = void 0;
  const r = Le(), c = Ot(), p = Ye();
  let d = class extends p.Provider {
    constructor(u, o, a) {
      super({
        ...a,
        isUseMultipleRangeRequest: !1
      }), this.configuration = u, this.updater = o;
      const { owner: l, slug: i } = u;
      this.baseUrl = (0, c.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${l}/${i}/downloads`);
    }
    get channel() {
      return this.updater.channel || this.configuration.channel || "latest";
    }
    async getLatestVersion() {
      const u = new r.CancellationToken(), o = (0, c.getChannelFilename)(this.getCustomChannelName(this.channel)), a = (0, c.newUrlFromBase)(o, this.baseUrl, this.updater.isAddNoCacheQuery);
      try {
        const l = await this.httpRequest(a, void 0, u);
        return (0, p.parseUpdateInfo)(l, o, a);
      } catch (l) {
        throw (0, r.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${l.stack || l.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
      }
    }
    resolveFiles(u) {
      return (0, p.resolveFiles)(u, this.baseUrl);
    }
    toString() {
      const { owner: u, slug: o } = this.configuration;
      return `Bitbucket (owner: ${u}, slug: ${o}, channel: ${this.channel})`;
    }
  };
  return Qt.BitbucketProvider = d, Qt;
}
var ht = {}, il;
function hu() {
  if (il) return ht;
  il = 1, Object.defineProperty(ht, "__esModule", { value: !0 }), ht.GitHubProvider = ht.BaseGitHubProvider = void 0, ht.computeReleaseNotes = i;
  const r = Le(), c = cu(), p = mt, d = Ot(), f = Ye(), u = /\/tag\/(v?[^/]+)$/;
  class o extends f.Provider {
    constructor(t, s, h) {
      super({
        ...h,
        /* because GitHib uses S3 */
        isUseMultipleRangeRequest: !1
      }), this.options = t, this.baseUrl = (0, d.newBaseUrl)((0, r.githubUrl)(t, s));
      const g = s === "github.com" ? "api.github.com" : s;
      this.baseApiUrl = (0, d.newBaseUrl)((0, r.githubUrl)(t, g));
    }
    computeGithubBasePath(t) {
      const s = this.options.host;
      return s && !["github.com", "api.github.com"].includes(s) ? `/api/v3${t}` : t;
    }
  }
  ht.BaseGitHubProvider = o;
  let a = class extends o {
    constructor(t, s, h) {
      super(t, "github.com", h), this.options = t, this.updater = s;
    }
    get channel() {
      const t = this.updater.channel || this.options.channel;
      return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
    }
    async getLatestVersion() {
      var t, s, h, g, y;
      const m = new r.CancellationToken(), _ = await this.httpRequest((0, d.newUrlFromBase)(`${this.basePath}.atom`, this.baseUrl), {
        accept: "application/xml, application/atom+xml, text/xml, */*"
      }, m), R = (0, r.parseXml)(_);
      let b = R.element("entry", !1, "No published versions on GitHub"), D = null;
      try {
        if (this.updater.allowPrerelease) {
          const S = ((t = this.updater) === null || t === void 0 ? void 0 : t.channel) || ((s = c.prerelease(this.updater.currentVersion)) === null || s === void 0 ? void 0 : s[0]) || null;
          if (S === null)
            D = u.exec(b.element("link").attribute("href"))[1];
          else
            for (const Y of R.getElements("entry")) {
              const H = u.exec(Y.element("link").attribute("href"));
              if (H === null)
                continue;
              const V = H[1];
              if (!c.valid(V))
                continue;
              const L = ((h = c.prerelease(V)) === null || h === void 0 ? void 0 : h[0]) || null, P = !S || ["alpha", "beta"].includes(S), A = L !== null && !["alpha", "beta"].includes(String(L));
              if (P && !A && !(S === "beta" && L === "alpha")) {
                D = V, b = Y;
                break;
              }
              if (L && L === S) {
                D = V, b = Y;
                break;
              }
            }
        } else {
          D = await this.getLatestTagName(m);
          for (const S of R.getElements("entry")) {
            const Y = u.exec(S.element("link").attribute("href"));
            if (Y != null && Y[1] === D) {
              b = S;
              break;
            }
          }
        }
      } catch (S) {
        throw (0, r.newError)(`Cannot parse releases feed: ${S.stack || S.message},
XML:
${_}`, "ERR_UPDATER_INVALID_RELEASE_FEED");
      }
      if (D == null)
        throw (0, r.newError)("No published versions on GitHub", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
      let C, F = "", I = "";
      const x = async (S) => {
        F = (0, d.getChannelFilename)(S), I = (0, d.newUrlFromBase)(this.getBaseDownloadPath(String(D), F), this.baseUrl);
        const Y = this.createRequestOptions(I);
        try {
          return await this.executor.request(Y, m);
        } catch (H) {
          throw H instanceof r.HttpError && H.statusCode === 404 ? (0, r.newError)(`Cannot find ${F} in the latest release artifacts (${I}): ${H.stack || H.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : H;
        }
      };
      try {
        let S = this.channel;
        this.updater.allowPrerelease && (!((g = c.prerelease(D)) === null || g === void 0) && g[0]) && (S = this.getCustomChannelName(String((y = c.prerelease(D)) === null || y === void 0 ? void 0 : y[0]))), C = await x(S);
      } catch (S) {
        if (this.updater.allowPrerelease)
          C = await x(this.getDefaultChannelName());
        else
          throw S;
      }
      const B = (0, f.parseUpdateInfo)(C, F, I);
      return B.releaseName == null && (B.releaseName = b.elementValueOrEmpty("title")), B.releaseNotes == null && (B.releaseNotes = i(this.updater.currentVersion, this.updater.fullChangelog, R, b)), {
        tag: D,
        ...B
      };
    }
    async getLatestTagName(t) {
      const s = this.options, h = s.host == null || s.host === "github.com" ? (0, d.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new p.URL(`${this.computeGithubBasePath(`/repos/${s.owner}/${s.repo}/releases`)}/latest`, this.baseApiUrl);
      try {
        const g = await this.httpRequest(h, { Accept: "application/json" }, t);
        return g == null ? null : JSON.parse(g).tag_name;
      } catch (g) {
        throw (0, r.newError)(`Unable to find latest version on GitHub (${h}), please ensure a production release exists: ${g.stack || g.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
      }
    }
    get basePath() {
      return `/${this.options.owner}/${this.options.repo}/releases`;
    }
    resolveFiles(t) {
      return (0, f.resolveFiles)(t, this.baseUrl, (s) => this.getBaseDownloadPath(t.tag, s.replace(/ /g, "-")));
    }
    getBaseDownloadPath(t, s) {
      return `${this.basePath}/download/${t}/${s}`;
    }
  };
  ht.GitHubProvider = a;
  function l(n) {
    const t = n.elementValueOrEmpty("content");
    return t === "No content." ? "" : t;
  }
  function i(n, t, s, h) {
    if (!t)
      return l(h);
    const g = /\/tag\/v?([^/]+)$/;
    let y;
    try {
      y = g.exec(h.element("link").attribute("href"))[1], y = c.valid(y) ? y : void 0;
    } catch {
    }
    if (y == null)
      return null;
    const m = [];
    for (const _ of s.getElements("entry")) {
      let R;
      try {
        const C = g.exec(_.element("link").attribute("href"));
        if (!C)
          continue;
        R = C[1];
      } catch {
        continue;
      }
      if (!c.valid(R))
        continue;
      const b = c.gt(R, n.raw), D = c.lte(R, y);
      b && D && m.push({
        version: R,
        note: l(_)
      });
    }
    return m.sort((_, R) => c.rcompare(_.version, R.version));
  }
  return ht;
}
var Zt = {}, ol;
function Bf() {
  if (ol) return Zt;
  ol = 1, Object.defineProperty(Zt, "__esModule", { value: !0 }), Zt.GitLabProvider = void 0;
  const r = Le(), c = mt, p = fu(), d = Ot(), f = Ye();
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
    normalizeFilename(a) {
      return a.replace(/ |_/g, "-");
    }
    constructor(a, l, i) {
      super({
        ...i,
        // GitLab might not support multiple range requests efficiently
        isUseMultipleRangeRequest: !1
      }), this.options = a, this.updater = l, this.cachedLatestVersion = null;
      const t = a.host || "gitlab.com";
      this.baseApiUrl = (0, d.newBaseUrl)(`https://${t}/api/v4`);
    }
    createRequestOptions(a, l) {
      const i = super.createRequestOptions(a, l);
      return i.redirect = "manual", i;
    }
    get channel() {
      const a = this.updater.channel || this.options.channel;
      return a == null ? this.getDefaultChannelName() : this.getCustomChannelName(a);
    }
    async getLatestVersion() {
      const a = new r.CancellationToken(), l = (0, d.newUrlFromBase)(`projects/${this.options.projectId}/releases/permalink/latest`, this.baseApiUrl), i = { Accept: "application/json", ...this.setAuthHeaderForToken(this.options.token || null) };
      let n;
      try {
        n = await this.httpRequest(l, i, a);
      } catch (b) {
        throw (0, r.newError)(`Unable to find latest release on GitLab (${l}): ${b.stack || b.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
      }
      if (!n)
        throw (0, r.newError)("No published releases on GitLab", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
      let t;
      try {
        t = JSON.parse(n);
      } catch (b) {
        throw (0, r.newError)(`Unable to parse latest release response from GitLab (${l}): response was not valid JSON: ${b.stack || b.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
      }
      if (t.upcoming_release)
        throw (0, r.newError)("Latest GitLab release is scheduled but not yet published", "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
      const s = t.tag_name;
      let h = null, g = "", y = null;
      const m = async (b) => {
        g = (0, d.getChannelFilename)(b);
        const D = t.assets.links.find((I) => I.name === g);
        if (!D)
          throw (0, r.newError)(`Cannot find ${g} in the latest release assets`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        y = new c.URL(D.direct_asset_url);
        const C = this.setAuthHeaderForToken(this.options.token || null), F = Object.keys(C).length ? C : void 0;
        try {
          const I = await this.httpRequest(y, F, a);
          if (!I)
            throw (0, r.newError)(`Empty response from ${y}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
          return I;
        } catch (I) {
          throw I instanceof r.HttpError && I.statusCode === 404 ? (0, r.newError)(`Cannot find ${g} in the latest release artifacts (${y}): ${I.stack || I.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : I;
        }
      };
      try {
        h = await m(this.channel);
      } catch (b) {
        if (this.channel !== this.getDefaultChannelName())
          h = await m(this.getDefaultChannelName());
        else
          throw b;
      }
      if (!h)
        throw (0, r.newError)(`Unable to parse channel data from ${g}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
      const _ = (0, f.parseUpdateInfo)(h, g, y);
      _.releaseName == null && (_.releaseName = t.name), _.releaseNotes == null && (_.releaseNotes = t.description || null);
      const R = {
        tag: s,
        assets: this.convertAssetsToMap(t.assets),
        ..._
      };
      return this.cachedLatestVersion = R, R;
    }
    /**
     * Utility function to convert GitlabReleaseAsset to Map<string, string>
     * Maps asset names to their download URLs
     */
    convertAssetsToMap(a) {
      const l = /* @__PURE__ */ new Map();
      for (const i of a.links)
        l.set(this.normalizeFilename(i.name), i.direct_asset_url);
      return l;
    }
    /**
     * Find blockmap file URL in assets map for a specific filename
     */
    findBlockMapInAssets(a, l) {
      const i = [`${l}.blockmap`, `${this.normalizeFilename(l)}.blockmap`];
      for (const n of i) {
        const t = a.get(n);
        if (t)
          return new c.URL(t);
      }
      return null;
    }
    async fetchReleaseInfoByVersion(a) {
      const l = new r.CancellationToken(), i = [`v${a}`, a];
      for (const n of i) {
        const t = (0, d.newUrlFromBase)(`projects/${this.options.projectId}/releases/${encodeURIComponent(n)}`, this.baseApiUrl);
        try {
          const s = { Accept: "application/json", ...this.setAuthHeaderForToken(this.options.token || null) }, h = await this.httpRequest(t, s, l);
          if (h)
            return JSON.parse(h);
        } catch (s) {
          if (s instanceof r.HttpError && s.statusCode === 404)
            continue;
          throw (0, r.newError)(`Unable to find release ${n} on GitLab (${t}): ${s.stack || s.message}`, "ERR_UPDATER_RELEASE_NOT_FOUND");
        }
      }
      throw (0, r.newError)(`Unable to find release with version ${a} (tried: ${i.join(", ")}) on GitLab`, "ERR_UPDATER_RELEASE_NOT_FOUND");
    }
    setAuthHeaderForToken(a) {
      const l = {};
      return a != null && (a.startsWith("Bearer") ? l.authorization = a : l["PRIVATE-TOKEN"] = a), l;
    }
    /**
     * Get version info for blockmap files, using cache when possible
     */
    async getVersionInfoForBlockMap(a) {
      if (this.cachedLatestVersion && this.cachedLatestVersion.version === a)
        return this.cachedLatestVersion.assets;
      const l = await this.fetchReleaseInfoByVersion(a);
      return l && l.assets ? this.convertAssetsToMap(l.assets) : null;
    }
    /**
     * Find blockmap URLs from version assets
     */
    async findBlockMapUrlsFromAssets(a, l, i) {
      let n = null, t = null;
      const s = await this.getVersionInfoForBlockMap(l);
      s && (n = this.findBlockMapInAssets(s, i));
      const h = await this.getVersionInfoForBlockMap(a);
      if (h) {
        const g = i.replace(new RegExp(p(l), "g"), a);
        t = this.findBlockMapInAssets(h, g);
      }
      return [t, n];
    }
    async getBlockMapFiles(a, l, i, n = null) {
      if (this.options.uploadTarget === "project_upload") {
        const t = a.pathname.split("/").pop() || "", [s, h] = await this.findBlockMapUrlsFromAssets(l, i, t);
        if (!h)
          throw (0, r.newError)(`Cannot find blockmap file for ${i} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
        if (!s)
          throw (0, r.newError)(`Cannot find blockmap file for ${l} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
        return [s, h];
      } else
        return super.getBlockMapFiles(a, l, i, n);
    }
    resolveFiles(a) {
      return (0, f.getFileList)(a).map((l) => {
        const n = [
          l.url,
          // Original filename
          this.normalizeFilename(l.url)
          // Normalized filename (spaces/underscores → dashes)
        ].find((s) => a.assets.has(s)), t = n ? a.assets.get(n) : void 0;
        if (!t)
          throw (0, r.newError)(`Cannot find asset "${l.url}" in GitLab release assets. Available assets: ${Array.from(a.assets.keys()).join(", ")}`, "ERR_UPDATER_ASSET_NOT_FOUND");
        return {
          url: new c.URL(t),
          info: l
        };
      });
    }
    toString() {
      return `GitLab (projectId: ${this.options.projectId}, channel: ${this.channel})`;
    }
  };
  return Zt.GitLabProvider = u, Zt;
}
var er = {}, sl;
function jf() {
  if (sl) return er;
  sl = 1, Object.defineProperty(er, "__esModule", { value: !0 }), er.KeygenProvider = void 0;
  const r = Le(), c = Ot(), p = Ye();
  let d = class extends p.Provider {
    constructor(u, o, a) {
      super({
        ...a,
        isUseMultipleRangeRequest: !1
      }), this.configuration = u, this.updater = o, this.defaultHostname = "api.keygen.sh";
      const l = this.configuration.host || this.defaultHostname;
      this.baseUrl = (0, c.newBaseUrl)(`https://${l}/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
    }
    get channel() {
      return this.updater.channel || this.configuration.channel || "stable";
    }
    async getLatestVersion() {
      const u = new r.CancellationToken(), o = (0, c.getChannelFilename)(this.getCustomChannelName(this.channel)), a = (0, c.newUrlFromBase)(o, this.baseUrl, this.updater.isAddNoCacheQuery);
      try {
        const l = await this.httpRequest(a, {
          Accept: "application/vnd.api+json",
          "Keygen-Version": "1.1"
        }, u);
        return (0, p.parseUpdateInfo)(l, o, a);
      } catch (l) {
        throw (0, r.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${l.stack || l.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
      }
    }
    resolveFiles(u) {
      return (0, p.resolveFiles)(u, this.baseUrl);
    }
    toString() {
      const { account: u, product: o, platform: a } = this.configuration;
      return `Keygen (account: ${u}, product: ${o}, platform: ${a}, channel: ${this.channel})`;
    }
  };
  return er.KeygenProvider = d, er;
}
var tr = {}, al;
function Hf() {
  if (al) return tr;
  al = 1, Object.defineProperty(tr, "__esModule", { value: !0 }), tr.PrivateGitHubProvider = void 0;
  const r = Le(), c = ao(), p = _e, d = mt, f = Ot(), u = hu(), o = Ye();
  let a = class extends u.BaseGitHubProvider {
    constructor(i, n, t, s) {
      super(i, "api.github.com", s), this.updater = n, this.token = t;
    }
    createRequestOptions(i, n) {
      const t = super.createRequestOptions(i, n);
      return t.redirect = "manual", t;
    }
    async getLatestVersion() {
      const i = new r.CancellationToken(), n = (0, f.getChannelFilename)(this.getDefaultChannelName()), t = await this.getLatestVersionInfo(i), s = t.assets.find((y) => y.name === n);
      if (s == null)
        throw (0, r.newError)(`Cannot find ${n} in the release ${t.html_url || t.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
      const h = new d.URL(s.url);
      let g;
      try {
        g = (0, c.load)(await this.httpRequest(h, this.configureHeaders("application/octet-stream"), i));
      } catch (y) {
        throw y instanceof r.HttpError && y.statusCode === 404 ? (0, r.newError)(`Cannot find ${n} in the latest release artifacts (${h}): ${y.stack || y.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : y;
      }
      return g.assets = t.assets, g;
    }
    get fileExtraDownloadHeaders() {
      return this.configureHeaders("application/octet-stream");
    }
    configureHeaders(i) {
      return {
        accept: i,
        authorization: `token ${this.token}`
      };
    }
    async getLatestVersionInfo(i) {
      const n = this.updater.allowPrerelease;
      let t = this.basePath;
      n || (t = `${t}/latest`);
      const s = (0, f.newUrlFromBase)(t, this.baseUrl);
      try {
        const h = JSON.parse(await this.httpRequest(s, this.configureHeaders("application/vnd.github.v3+json"), i));
        if (n) {
          const g = h.filter((y) => !y.draft);
          return g.find((y) => y.prerelease) || g[0];
        } else
          return h;
      } catch (h) {
        throw (0, r.newError)(`Unable to find latest version on GitHub (${s}), please ensure a production release exists: ${h.stack || h.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
      }
    }
    get basePath() {
      return this.computeGithubBasePath(`/repos/${this.options.owner}/${this.options.repo}/releases`);
    }
    resolveFiles(i) {
      return (0, o.getFileList)(i).map((n) => {
        const t = p.posix.basename(n.url).replace(/ /g, "-"), s = i.assets.find((h) => h != null && h.name === t);
        if (s == null)
          throw (0, r.newError)(`Cannot find asset "${t}" in: ${JSON.stringify(i.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
        return {
          url: new d.URL(s.url),
          info: n
        };
      });
    }
  };
  return tr.PrivateGitHubProvider = a, tr;
}
var ll;
function Gf() {
  if (ll) return Jt;
  ll = 1, Object.defineProperty(Jt, "__esModule", { value: !0 }), Jt.isUrlProbablySupportMultiRangeRequests = a, Jt.createClient = l;
  const r = Le(), c = Mf(), p = du(), d = hu(), f = Bf(), u = jf(), o = Hf();
  function a(i) {
    return !i.includes("s3.amazonaws.com");
  }
  function l(i, n, t) {
    if (typeof i == "string")
      throw (0, r.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
    const s = i.provider;
    switch (s) {
      case "github": {
        const h = i, g = (h.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || h.token;
        return g == null ? new d.GitHubProvider(h, n, t) : new o.PrivateGitHubProvider(h, n, g, t);
      }
      case "bitbucket":
        return new c.BitbucketProvider(i, n, t);
      case "gitlab":
        return new f.GitLabProvider(i, n, t);
      case "keygen":
        return new u.KeygenProvider(i, n, t);
      case "s3":
      case "spaces":
        return new p.GenericProvider({
          provider: "generic",
          url: (0, r.getS3LikeProviderBaseUrl)(i),
          channel: i.channel || null
        }, n, {
          ...t,
          // https://github.com/minio/minio/issues/5285#issuecomment-350428955
          isUseMultipleRangeRequest: !1
        });
      case "generic": {
        const h = i;
        return new p.GenericProvider(h, n, {
          ...t,
          isUseMultipleRangeRequest: h.useMultipleRangeRequest !== !1 && a(h.url)
        });
      }
      case "custom": {
        const h = i, g = h.updateProvider;
        if (!g)
          throw (0, r.newError)("Custom provider not specified", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
        return new g(h, n, t);
      }
      default:
        throw (0, r.newError)(`Unsupported provider: ${s}`, "ERR_UPDATER_UNSUPPORTED_PROVIDER");
    }
  }
  return Jt;
}
var rr = {}, nr = {}, $t = {}, kt = {}, ul;
function mo() {
  if (ul) return kt;
  ul = 1, Object.defineProperty(kt, "__esModule", { value: !0 }), kt.OperationKind = void 0, kt.computeOperations = c;
  var r;
  (function(o) {
    o[o.COPY = 0] = "COPY", o[o.DOWNLOAD = 1] = "DOWNLOAD";
  })(r || (kt.OperationKind = r = {}));
  function c(o, a, l) {
    const i = u(o.files), n = u(a.files);
    let t = null;
    const s = a.files[0], h = [], g = s.name, y = i.get(g);
    if (y == null)
      throw new Error(`no file ${g} in old blockmap`);
    const m = n.get(g);
    let _ = 0;
    const { checksumToOffset: R, checksumToOldSize: b } = f(i.get(g), y.offset, l);
    let D = s.offset;
    for (let C = 0; C < m.checksums.length; D += m.sizes[C], C++) {
      const F = m.sizes[C], I = m.checksums[C];
      let x = R.get(I);
      x != null && b.get(I) !== F && (l.warn(`Checksum ("${I}") matches, but size differs (old: ${b.get(I)}, new: ${F})`), x = void 0), x === void 0 ? (_++, t != null && t.kind === r.DOWNLOAD && t.end === D ? t.end += F : (t = {
        kind: r.DOWNLOAD,
        start: D,
        end: D + F
        // oldBlocks: null,
      }, d(t, h, I, C))) : t != null && t.kind === r.COPY && t.end === x ? t.end += F : (t = {
        kind: r.COPY,
        start: x,
        end: x + F
        // oldBlocks: [checksum]
      }, d(t, h, I, C));
    }
    return _ > 0 && l.info(`File${s.name === "file" ? "" : " " + s.name} has ${_} changed blocks`), h;
  }
  const p = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
  function d(o, a, l, i) {
    if (p && a.length !== 0) {
      const n = a[a.length - 1];
      if (n.kind === o.kind && o.start < n.end && o.start > n.start) {
        const t = [n.start, n.end, o.start, o.end].reduce((s, h) => s < h ? s : h);
        throw new Error(`operation (block index: ${i}, checksum: ${l}, kind: ${r[o.kind]}) overlaps previous operation (checksum: ${l}):
abs: ${n.start} until ${n.end} and ${o.start} until ${o.end}
rel: ${n.start - t} until ${n.end - t} and ${o.start - t} until ${o.end - t}`);
      }
    }
    a.push(o);
  }
  function f(o, a, l) {
    const i = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
    let t = a;
    for (let s = 0; s < o.checksums.length; s++) {
      const h = o.checksums[s], g = o.sizes[s], y = n.get(h);
      if (y === void 0)
        i.set(h, t), n.set(h, g);
      else if (l.debug != null) {
        const m = y === g ? "(same size)" : `(size: ${y}, this size: ${g})`;
        l.debug(`${h} duplicated in blockmap ${m}, it doesn't lead to broken differential downloader, just corresponding block will be skipped)`);
      }
      t += g;
    }
    return { checksumToOffset: i, checksumToOldSize: n };
  }
  function u(o) {
    const a = /* @__PURE__ */ new Map();
    for (const l of o)
      a.set(l.name, l);
    return a;
  }
  return kt;
}
var cl;
function pu() {
  if (cl) return $t;
  cl = 1, Object.defineProperty($t, "__esModule", { value: !0 }), $t.DataSplitter = void 0, $t.copyData = o;
  const r = Le(), c = je, p = Er, d = mo(), f = Buffer.from(`\r
\r
`);
  var u;
  (function(l) {
    l[l.INIT = 0] = "INIT", l[l.HEADER = 1] = "HEADER", l[l.BODY = 2] = "BODY";
  })(u || (u = {}));
  function o(l, i, n, t, s) {
    const h = (0, c.createReadStream)("", {
      fd: n,
      autoClose: !1,
      start: l.start,
      // end is inclusive
      end: l.end - 1
    });
    h.on("error", t), h.once("end", s), h.pipe(i, {
      end: !1
    });
  }
  let a = class extends p.Writable {
    constructor(i, n, t, s, h, g, y, m) {
      super(), this.out = i, this.options = n, this.partIndexToTaskIndex = t, this.partIndexToLength = h, this.finishHandler = g, this.grandTotalBytes = y, this.onProgress = m, this.start = Date.now(), this.nextUpdate = this.start + 1e3, this.transferred = 0, this.delta = 0, this.partIndex = -1, this.headerListBuffer = null, this.readState = u.INIT, this.ignoreByteCount = 0, this.remainingPartDataCount = 0, this.actualPartLength = 0, this.boundaryLength = s.length + 4, this.ignoreByteCount = this.boundaryLength - 2;
    }
    get isFinished() {
      return this.partIndex === this.partIndexToLength.length;
    }
    // noinspection JSUnusedGlobalSymbols
    _write(i, n, t) {
      if (this.isFinished) {
        console.error(`Trailing ignored data: ${i.length} bytes`);
        return;
      }
      this.handleData(i).then(() => {
        if (this.onProgress) {
          const s = Date.now();
          (s >= this.nextUpdate || this.transferred === this.grandTotalBytes) && this.grandTotalBytes && (s - this.start) / 1e3 && (this.nextUpdate = s + 1e3, this.onProgress({
            total: this.grandTotalBytes,
            delta: this.delta,
            transferred: this.transferred,
            percent: this.transferred / this.grandTotalBytes * 100,
            bytesPerSecond: Math.round(this.transferred / ((s - this.start) / 1e3))
          }), this.delta = 0);
        }
        t();
      }).catch(t);
    }
    async handleData(i) {
      let n = 0;
      if (this.ignoreByteCount !== 0 && this.remainingPartDataCount !== 0)
        throw (0, r.newError)("Internal error", "ERR_DATA_SPLITTER_BYTE_COUNT_MISMATCH");
      if (this.ignoreByteCount > 0) {
        const t = Math.min(this.ignoreByteCount, i.length);
        this.ignoreByteCount -= t, n = t;
      } else if (this.remainingPartDataCount > 0) {
        const t = Math.min(this.remainingPartDataCount, i.length);
        this.remainingPartDataCount -= t, await this.processPartData(i, 0, t), n = t;
      }
      if (n !== i.length) {
        if (this.readState === u.HEADER) {
          const t = this.searchHeaderListEnd(i, n);
          if (t === -1)
            return;
          n = t, this.readState = u.BODY, this.headerListBuffer = null;
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
                throw (0, r.newError)("taskIndex is null", "ERR_DATA_SPLITTER_TASK_INDEX_IS_NULL");
            const y = this.partIndex === 0 ? this.options.start : this.partIndexToTaskIndex.get(this.partIndex - 1) + 1;
            if (y < g)
              await this.copyExistingData(y, g);
            else if (y > g)
              throw (0, r.newError)("prevTaskIndex must be < taskIndex", "ERR_DATA_SPLITTER_TASK_INDEX_ASSERT_FAILED");
            if (this.isFinished) {
              this.onPartEnd(), this.finishHandler();
              return;
            }
            if (n = this.searchHeaderListEnd(i, n), n === -1) {
              this.readState = u.HEADER;
              return;
            }
          }
          const t = this.partIndexToLength[this.partIndex], s = n + t, h = Math.min(s, i.length);
          if (await this.processPartStarted(i, n, h), this.remainingPartDataCount = t - (h - n), this.remainingPartDataCount > 0)
            return;
          if (n = s + this.boundaryLength, n >= i.length) {
            this.ignoreByteCount = this.boundaryLength - (i.length - s);
            return;
          }
        }
      }
    }
    copyExistingData(i, n) {
      return new Promise((t, s) => {
        const h = () => {
          if (i === n) {
            t();
            return;
          }
          const g = this.options.tasks[i];
          if (g.kind !== d.OperationKind.COPY) {
            s(new Error("Task kind must be COPY"));
            return;
          }
          o(g, this.out, this.options.oldFileFd, s, () => {
            i++, h();
          });
        };
        h();
      });
    }
    searchHeaderListEnd(i, n) {
      const t = i.indexOf(f, n);
      if (t !== -1)
        return t + f.length;
      const s = n === 0 ? i : i.slice(n);
      return this.headerListBuffer == null ? this.headerListBuffer = s : this.headerListBuffer = Buffer.concat([this.headerListBuffer, s]), -1;
    }
    onPartEnd() {
      const i = this.partIndexToLength[this.partIndex - 1];
      if (this.actualPartLength !== i)
        throw (0, r.newError)(`Expected length: ${i} differs from actual: ${this.actualPartLength}`, "ERR_DATA_SPLITTER_LENGTH_MISMATCH");
      this.actualPartLength = 0;
    }
    processPartStarted(i, n, t) {
      return this.partIndex !== 0 && this.onPartEnd(), this.processPartData(i, n, t);
    }
    processPartData(i, n, t) {
      this.actualPartLength += t - n, this.transferred += t - n, this.delta += t - n;
      const s = this.out;
      return s.write(n === 0 && i.length === t ? i : i.slice(n, t)) ? Promise.resolve() : new Promise((h, g) => {
        s.on("error", g), s.once("drain", () => {
          s.removeListener("error", g), h();
        });
      });
    }
  };
  return $t.DataSplitter = a, $t;
}
var ir = {}, fl;
function Vf() {
  if (fl) return ir;
  fl = 1, Object.defineProperty(ir, "__esModule", { value: !0 }), ir.executeTasksUsingMultipleRangeRequests = d, ir.checkIsRangesSupported = u;
  const r = Le(), c = pu(), p = mo();
  function d(o, a, l, i, n) {
    const t = (s) => {
      if (s >= a.length) {
        o.fileMetadataBuffer != null && l.write(o.fileMetadataBuffer), l.end();
        return;
      }
      const h = s + 1e3;
      f(o, {
        tasks: a,
        start: s,
        end: Math.min(a.length, h),
        oldFileFd: i
      }, l, () => t(h), n);
    };
    return t;
  }
  function f(o, a, l, i, n) {
    let t = "bytes=", s = 0, h = 0;
    const g = /* @__PURE__ */ new Map(), y = [];
    for (let R = a.start; R < a.end; R++) {
      const b = a.tasks[R];
      b.kind === p.OperationKind.DOWNLOAD && (t += `${b.start}-${b.end - 1}, `, g.set(s, R), s++, y.push(b.end - b.start), h += b.end - b.start);
    }
    if (s <= 1) {
      const R = (b) => {
        if (b >= a.end) {
          i();
          return;
        }
        const D = a.tasks[b++];
        if (D.kind === p.OperationKind.COPY)
          (0, c.copyData)(D, l, a.oldFileFd, n, () => R(b));
        else {
          const C = o.createRequestOptions();
          C.headers.Range = `bytes=${D.start}-${D.end - 1}`;
          const F = o.httpExecutor.createRequest(C, (I) => {
            I.on("error", n), u(I, n) && (I.pipe(l, {
              end: !1
            }), I.once("end", () => R(b)));
          });
          o.httpExecutor.addErrorAndTimeoutHandlers(F, n), F.end();
        }
      };
      R(a.start);
      return;
    }
    const m = o.createRequestOptions();
    m.headers.Range = t.substring(0, t.length - 2);
    const _ = o.httpExecutor.createRequest(m, (R) => {
      if (!u(R, n))
        return;
      const b = (0, r.safeGetHeader)(R, "content-type"), D = /^multipart\/.+?\s*;\s*boundary=(?:"([^"]+)"|([^\s";]+))\s*$/i.exec(b);
      if (D == null) {
        n(new Error(`Content-Type "multipart/byteranges" is expected, but got "${b}"`));
        return;
      }
      const C = new c.DataSplitter(l, a, g, D[1] || D[2], y, i, h, o.options.onProgress);
      C.on("error", n), R.pipe(C), R.on("end", () => {
        setTimeout(() => {
          _.abort(), n(new Error("Response ends without calling any handlers"));
        }, 1e4);
      });
    });
    o.httpExecutor.addErrorAndTimeoutHandlers(_, n), _.end();
  }
  function u(o, a) {
    if (o.statusCode >= 400)
      return a((0, r.createHttpError)(o)), !1;
    if (o.statusCode !== 206) {
      const l = (0, r.safeGetHeader)(o, "accept-ranges");
      if (l == null || l === "none")
        return a(new Error(`Server doesn't support Accept-Ranges (response code ${o.statusCode})`)), !1;
    }
    return !0;
  }
  return ir;
}
var or = {}, dl;
function Wf() {
  if (dl) return or;
  dl = 1, Object.defineProperty(or, "__esModule", { value: !0 }), or.ProgressDifferentialDownloadCallbackTransform = void 0;
  const r = Er;
  var c;
  (function(d) {
    d[d.COPY = 0] = "COPY", d[d.DOWNLOAD = 1] = "DOWNLOAD";
  })(c || (c = {}));
  let p = class extends r.Transform {
    constructor(f, u, o) {
      super(), this.progressDifferentialDownloadInfo = f, this.cancellationToken = u, this.onProgress = o, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.expectedBytes = 0, this.index = 0, this.operationType = c.COPY, this.nextUpdate = this.start + 1e3;
    }
    _transform(f, u, o) {
      if (this.cancellationToken.cancelled) {
        o(new Error("cancelled"), null);
        return;
      }
      if (this.operationType == c.COPY) {
        o(null, f);
        return;
      }
      this.transferred += f.length, this.delta += f.length;
      const a = Date.now();
      a >= this.nextUpdate && this.transferred !== this.expectedBytes && this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && (this.nextUpdate = a + 1e3, this.onProgress({
        total: this.progressDifferentialDownloadInfo.grandTotal,
        delta: this.delta,
        transferred: this.transferred,
        percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
        bytesPerSecond: Math.round(this.transferred / ((a - this.start) / 1e3))
      }), this.delta = 0), o(null, f);
    }
    beginFileCopy() {
      this.operationType = c.COPY;
    }
    beginRangeDownload() {
      this.operationType = c.DOWNLOAD, this.expectedBytes += this.progressDifferentialDownloadInfo.expectedByteCounts[this.index++];
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
  return or.ProgressDifferentialDownloadCallbackTransform = p, or;
}
var hl;
function mu() {
  if (hl) return nr;
  hl = 1, Object.defineProperty(nr, "__esModule", { value: !0 }), nr.DifferentialDownloader = void 0;
  const r = Le(), c = /* @__PURE__ */ gt(), p = je, d = pu(), f = mt, u = mo(), o = Vf(), a = Wf();
  let l = class {
    // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
    constructor(s, h, g) {
      this.blockAwareFileInfo = s, this.httpExecutor = h, this.options = g, this.fileMetadataBuffer = null, this.logger = g.logger;
    }
    createRequestOptions() {
      const s = {
        headers: {
          ...this.options.requestHeaders,
          accept: "*/*"
        }
      };
      return (0, r.configureRequestUrl)(this.options.newUrl, s), (0, r.configureRequestOptions)(s), s;
    }
    doDownload(s, h) {
      if (s.version !== h.version)
        throw new Error(`version is different (${s.version} - ${h.version}), full download is required`);
      const g = this.logger, y = (0, u.computeOperations)(s, h, g);
      g.debug != null && g.debug(JSON.stringify(y, null, 2));
      let m = 0, _ = 0;
      for (const b of y) {
        const D = b.end - b.start;
        b.kind === u.OperationKind.DOWNLOAD ? m += D : _ += D;
      }
      const R = this.blockAwareFileInfo.size;
      if (m + _ + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== R)
        throw new Error(`Internal error, size mismatch: downloadSize: ${m}, copySize: ${_}, newSize: ${R}`);
      return g.info(`Full: ${i(R)}, To download: ${i(m)} (${Math.round(m / (R / 100))}%)`), this.downloadFile(y);
    }
    downloadFile(s) {
      const h = [], g = () => Promise.all(h.map((y) => (0, c.close)(y.descriptor).catch((m) => {
        this.logger.error(`cannot close file "${y.path}": ${m}`);
      })));
      return this.doDownloadFile(s, h).then(g).catch((y) => g().catch((m) => {
        try {
          this.logger.error(`cannot close files: ${m}`);
        } catch (_) {
          try {
            console.error(_);
          } catch {
          }
        }
        throw y;
      }).then(() => {
        throw y;
      }));
    }
    async doDownloadFile(s, h) {
      const g = await (0, c.open)(this.options.oldFile, "r");
      h.push({ descriptor: g, path: this.options.oldFile });
      const y = await (0, c.open)(this.options.newFile, "w");
      h.push({ descriptor: y, path: this.options.newFile });
      const m = (0, p.createWriteStream)(this.options.newFile, { fd: y });
      await new Promise((_, R) => {
        const b = [];
        let D;
        if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
          const H = [];
          let V = 0;
          for (const P of s)
            P.kind === u.OperationKind.DOWNLOAD && (H.push(P.end - P.start), V += P.end - P.start);
          const L = {
            expectedByteCounts: H,
            grandTotal: V
          };
          D = new a.ProgressDifferentialDownloadCallbackTransform(L, this.options.cancellationToken, this.options.onProgress), b.push(D);
        }
        const C = new r.DigestTransform(this.blockAwareFileInfo.sha512);
        C.isValidateOnEnd = !1, b.push(C), m.on("finish", () => {
          m.close(() => {
            h.splice(1, 1);
            try {
              C.validate();
            } catch (H) {
              R(H);
              return;
            }
            _(void 0);
          });
        }), b.push(m);
        let F = null;
        for (const H of b)
          H.on("error", R), F == null ? F = H : F = F.pipe(H);
        const I = b[0];
        let x;
        if (this.options.isUseMultipleRangeRequest) {
          x = (0, o.executeTasksUsingMultipleRangeRequests)(this, s, I, g, R), x(0);
          return;
        }
        let B = 0, S = null;
        this.logger.info(`Differential download: ${this.options.newUrl}`);
        const Y = this.createRequestOptions();
        Y.redirect = "manual", x = (H) => {
          var V, L;
          if (H >= s.length) {
            this.fileMetadataBuffer != null && I.write(this.fileMetadataBuffer), I.end();
            return;
          }
          const P = s[H++];
          if (P.kind === u.OperationKind.COPY) {
            D && D.beginFileCopy(), (0, d.copyData)(P, I, g, R, () => x(H));
            return;
          }
          const A = `bytes=${P.start}-${P.end - 1}`;
          Y.headers.range = A, (L = (V = this.logger) === null || V === void 0 ? void 0 : V.debug) === null || L === void 0 || L.call(V, `download range: ${A}`), D && D.beginRangeDownload();
          const O = this.httpExecutor.createRequest(Y, ($) => {
            $.on("error", R), $.on("aborted", () => {
              R(new Error("response has been aborted by the server"));
            }), $.statusCode >= 400 && R((0, r.createHttpError)($)), $.pipe(I, {
              end: !1
            }), $.once("end", () => {
              D && D.endRangeDownload(), ++B === 100 ? (B = 0, setTimeout(() => x(H), 1e3)) : x(H);
            });
          });
          O.on("redirect", ($, j, X) => {
            this.logger.info(`Redirect to ${n(X)}`), S = X, (0, r.configureRequestUrl)(new f.URL(S), Y), O.followRedirect();
          }), this.httpExecutor.addErrorAndTimeoutHandlers(O, R), O.end();
        }, x(0);
      });
    }
    async readRemoteBytes(s, h) {
      const g = Buffer.allocUnsafe(h + 1 - s), y = this.createRequestOptions();
      y.headers.range = `bytes=${s}-${h}`;
      let m = 0;
      if (await this.request(y, (_) => {
        _.copy(g, m), m += _.length;
      }), m !== g.length)
        throw new Error(`Received data length ${m} is not equal to expected ${g.length}`);
      return g;
    }
    request(s, h) {
      return new Promise((g, y) => {
        const m = this.httpExecutor.createRequest(s, (_) => {
          (0, o.checkIsRangesSupported)(_, y) && (_.on("error", y), _.on("aborted", () => {
            y(new Error("response has been aborted by the server"));
          }), _.on("data", h), _.on("end", () => g()));
        });
        this.httpExecutor.addErrorAndTimeoutHandlers(m, y), m.end();
      });
    }
  };
  nr.DifferentialDownloader = l;
  function i(t, s = " KB") {
    return new Intl.NumberFormat("en").format((t / 1024).toFixed(2)) + s;
  }
  function n(t) {
    const s = t.indexOf("?");
    return s < 0 ? t : t.substring(0, s);
  }
  return nr;
}
var pl;
function Yf() {
  if (pl) return rr;
  pl = 1, Object.defineProperty(rr, "__esModule", { value: !0 }), rr.GenericDifferentialDownloader = void 0;
  const r = mu();
  let c = class extends r.DifferentialDownloader {
    download(d, f) {
      return this.doDownload(d, f);
    }
  };
  return rr.GenericDifferentialDownloader = c, rr;
}
var Zi = {}, ml;
function It() {
  return ml || (ml = 1, (function(r) {
    Object.defineProperty(r, "__esModule", { value: !0 }), r.UpdaterSignal = r.UPDATE_DOWNLOADED = r.DOWNLOAD_PROGRESS = r.CancellationToken = void 0, r.addHandler = d;
    const c = Le();
    Object.defineProperty(r, "CancellationToken", { enumerable: !0, get: function() {
      return c.CancellationToken;
    } }), r.DOWNLOAD_PROGRESS = "download-progress", r.UPDATE_DOWNLOADED = "update-downloaded";
    class p {
      constructor(u) {
        this.emitter = u;
      }
      /**
       * Emitted when an authenticating proxy is [asking for user credentials](https://github.com/electron/electron/blob/master/docs/api/client-request.md#event-login).
       */
      login(u) {
        d(this.emitter, "login", u);
      }
      progress(u) {
        d(this.emitter, r.DOWNLOAD_PROGRESS, u);
      }
      updateDownloaded(u) {
        d(this.emitter, r.UPDATE_DOWNLOADED, u);
      }
      updateCancelled(u) {
        d(this.emitter, "update-cancelled", u);
      }
    }
    r.UpdaterSignal = p;
    function d(f, u, o) {
      f.on(u, o);
    }
  })(Zi)), Zi;
}
var gl;
function go() {
  if (gl) return Tt;
  gl = 1, Object.defineProperty(Tt, "__esModule", { value: !0 }), Tt.NoOpLogger = Tt.AppUpdater = void 0;
  const r = Le(), c = yr, p = Hr, d = $l, f = /* @__PURE__ */ gt(), u = ao(), o = cf(), a = _e, l = cu(), i = Uf(), n = kf(), t = qf(), s = du(), h = Gf(), g = ql, y = Yf(), m = It();
  let _ = class gu extends d.EventEmitter {
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
    set channel(C) {
      if (this._channel != null) {
        if (typeof C != "string")
          throw (0, r.newError)(`Channel must be a string, but got: ${C}`, "ERR_UPDATER_INVALID_CHANNEL");
        if (C.length === 0)
          throw (0, r.newError)("Channel must be not an empty string", "ERR_UPDATER_INVALID_CHANNEL");
      }
      this._channel = C, this.allowDowngrade = !0;
    }
    /**
     *  Shortcut for explicitly adding auth tokens to request headers
     */
    addAuthHeader(C) {
      this.requestHeaders = Object.assign({}, this.requestHeaders, {
        authorization: C
      });
    }
    // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    get netSession() {
      return (0, t.getNetSession)();
    }
    /**
     * The logger. You can pass [electron-log](https://github.com/megahertz/electron-log), [winston](https://github.com/winstonjs/winston) or another logger with the following interface: `{ info(), warn(), error() }`.
     * Set it to `null` if you would like to disable a logging feature.
     */
    get logger() {
      return this._logger;
    }
    set logger(C) {
      this._logger = C ?? new b();
    }
    // noinspection JSUnusedGlobalSymbols
    /**
     * test only
     * @private
     */
    set updateConfigPath(C) {
      this.clientPromise = null, this._appUpdateConfigPath = C, this.configOnDisk = new o.Lazy(() => this.loadUpdateConfig());
    }
    /**
     * Allows developer to override default logic for determining if an update is supported.
     * The default logic compares the `UpdateInfo` minimum system version against the `os.release()` with `semver` package
     */
    get isUpdateSupported() {
      return this._isUpdateSupported;
    }
    set isUpdateSupported(C) {
      C && (this._isUpdateSupported = C);
    }
    /**
     * Allows developer to override default logic for determining if the user is below the rollout threshold.
     * The default logic compares the staging percentage with numerical representation of user ID.
     * An override can define custom logic, or bypass it if needed.
     */
    get isUserWithinRollout() {
      return this._isUserWithinRollout;
    }
    set isUserWithinRollout(C) {
      C && (this._isUserWithinRollout = C);
    }
    constructor(C, F) {
      super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this.previousBlockmapBaseUrlOverride = null, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new m.UpdaterSignal(this), this._appUpdateConfigPath = null, this._isUpdateSupported = (B) => this.checkIfUpdateSupported(B), this._isUserWithinRollout = (B) => this.isStagingMatch(B), this.clientPromise = null, this.stagingUserIdPromise = new o.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new o.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (B) => {
        this._logger.error(`Error: ${B.stack || B.message}`);
      }), F == null ? (this.app = new n.ElectronAppAdapter(), this.httpExecutor = new t.ElectronHttpExecutor((B, S) => this.emit("login", B, S))) : (this.app = F, this.httpExecutor = null);
      const I = this.app.version, x = (0, l.parse)(I);
      if (x == null)
        throw (0, r.newError)(`App version is not a valid semver version: "${I}"`, "ERR_UPDATER_INVALID_VERSION");
      this.currentVersion = x, this.allowPrerelease = R(x), C != null && (this.setFeedURL(C), typeof C != "string" && C.requestHeaders && (this.requestHeaders = C.requestHeaders));
    }
    //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    getFeedURL() {
      return "Deprecated. Do not use it.";
    }
    /**
     * Configure update provider. If value is `string`, [GenericServerOptions](https://www.electron.build/publish#genericserveroptions) will be set with value as `url`.
     * @param options If you want to override configuration in the `app-update.yml`.
     */
    setFeedURL(C) {
      const F = this.createProviderRuntimeOptions();
      let I;
      typeof C == "string" ? I = new s.GenericProvider({ provider: "generic", url: C }, this, {
        ...F,
        isUseMultipleRangeRequest: (0, h.isUrlProbablySupportMultiRangeRequests)(C)
      }) : I = (0, h.createClient)(C, this, F), this.clientPromise = Promise.resolve(I);
    }
    /**
     * Asks the server whether there is an update.
     * @returns null if the updater is disabled, otherwise info about the latest version
     */
    checkForUpdates() {
      if (!this.isUpdaterActive())
        return Promise.resolve(null);
      let C = this.checkForUpdatesPromise;
      if (C != null)
        return this._logger.info("Checking for update (already in progress)"), C;
      const F = () => this.checkForUpdatesPromise = null;
      return this._logger.info("Checking for update"), C = this.doCheckForUpdates().then((I) => (F(), I)).catch((I) => {
        throw F(), this.emit("error", I, `Cannot check for updates: ${(I.stack || I).toString()}`), I;
      }), this.checkForUpdatesPromise = C, C;
    }
    isUpdaterActive() {
      return this.app.isPackaged || this.forceDevUpdateConfig ? !0 : (this._logger.info("Skip checkForUpdates because application is not packed and dev update config is not forced"), !1);
    }
    // noinspection JSUnusedGlobalSymbols
    checkForUpdatesAndNotify(C) {
      return this.checkForUpdates().then((F) => F != null && F.downloadPromise ? (F.downloadPromise.then(() => {
        const I = gu.formatDownloadNotification(F.updateInfo.version, this.app.name, C);
        new Ct.Notification(I).show();
      }), F) : (this._logger.debug != null && this._logger.debug("checkForUpdatesAndNotify called, downloadPromise is null"), F));
    }
    static formatDownloadNotification(C, F, I) {
      return I == null && (I = {
        title: "A new update is ready to install",
        body: "{appName} version {version} has been downloaded and will be automatically installed on exit"
      }), I = {
        title: I.title.replace("{appName}", F).replace("{version}", C),
        body: I.body.replace("{appName}", F).replace("{version}", C)
      }, I;
    }
    async isStagingMatch(C) {
      const F = C.stagingPercentage;
      let I = F;
      if (I == null)
        return !0;
      if (I = parseInt(I, 10), isNaN(I))
        return this._logger.warn(`Staging percentage is NaN: ${F}`), !0;
      I = I / 100;
      const x = await this.stagingUserIdPromise.value, S = r.UUID.parse(x).readUInt32BE(12) / 4294967295;
      return this._logger.info(`Staging percentage: ${I}, percentage: ${S}, user id: ${x}`), S < I;
    }
    computeFinalHeaders(C) {
      return this.requestHeaders != null && Object.assign(C, this.requestHeaders), C;
    }
    async isUpdateAvailable(C) {
      const F = (0, l.parse)(C.version);
      if (F == null)
        throw (0, r.newError)(`This file could not be downloaded, or the latest version (from update server) does not have a valid semver version: "${C.version}"`, "ERR_UPDATER_INVALID_VERSION");
      const I = this.currentVersion;
      if ((0, l.eq)(F, I) || !await Promise.resolve(this.isUpdateSupported(C)) || !await Promise.resolve(this.isUserWithinRollout(C)))
        return !1;
      const B = (0, l.gt)(F, I), S = (0, l.lt)(F, I);
      return B ? !0 : this.allowDowngrade && S;
    }
    checkIfUpdateSupported(C) {
      const F = C == null ? void 0 : C.minimumSystemVersion, I = (0, p.release)();
      if (F)
        try {
          if ((0, l.lt)(I, F))
            return this._logger.info(`Current OS version ${I} is less than the minimum OS version required ${F} for version ${I}`), !1;
        } catch (x) {
          this._logger.warn(`Failed to compare current OS version(${I}) with minimum OS version(${F}): ${(x.message || x).toString()}`);
        }
      return !0;
    }
    async getUpdateInfoAndProvider() {
      await this.app.whenReady(), this.clientPromise == null && (this.clientPromise = this.configOnDisk.value.then((I) => (0, h.createClient)(I, this, this.createProviderRuntimeOptions())));
      const C = await this.clientPromise, F = await this.stagingUserIdPromise.value;
      return C.setRequestHeaders(this.computeFinalHeaders({ "x-user-staging-id": F })), {
        info: await C.getLatestVersion(),
        provider: C
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
      const C = await this.getUpdateInfoAndProvider(), F = C.info;
      if (!await this.isUpdateAvailable(F))
        return this._logger.info(`Update for version ${this.currentVersion.format()} is not available (latest version: ${F.version}, downgrade is ${this.allowDowngrade ? "allowed" : "disallowed"}).`), this.emit("update-not-available", F), {
          isUpdateAvailable: !1,
          versionInfo: F,
          updateInfo: F
        };
      this.updateInfoAndProvider = C, this.onUpdateAvailable(F);
      const I = new r.CancellationToken();
      return {
        isUpdateAvailable: !0,
        versionInfo: F,
        updateInfo: F,
        cancellationToken: I,
        downloadPromise: this.autoDownload ? this.downloadUpdate(I) : null
      };
    }
    onUpdateAvailable(C) {
      this._logger.info(`Found version ${C.version} (url: ${(0, r.asArray)(C.files).map((F) => F.url).join(", ")})`), this.emit("update-available", C);
    }
    /**
     * Start downloading update manually. You can use this method if `autoDownload` option is set to `false`.
     * @returns {Promise<Array<string>>} Paths to downloaded files.
     */
    downloadUpdate(C = new r.CancellationToken()) {
      const F = this.updateInfoAndProvider;
      if (F == null) {
        const x = new Error("Please check update first");
        return this.dispatchError(x), Promise.reject(x);
      }
      if (this.downloadPromise != null)
        return this._logger.info("Downloading update (already in progress)"), this.downloadPromise;
      this._logger.info(`Downloading update from ${(0, r.asArray)(F.info.files).map((x) => x.url).join(", ")}`);
      const I = (x) => {
        if (!(x instanceof r.CancellationError))
          try {
            this.dispatchError(x);
          } catch (B) {
            this._logger.warn(`Cannot dispatch error event: ${B.stack || B}`);
          }
        return x;
      };
      return this.downloadPromise = this.doDownloadUpdate({
        updateInfoAndProvider: F,
        requestHeaders: this.computeRequestHeaders(F.provider),
        cancellationToken: C,
        disableWebInstaller: this.disableWebInstaller,
        disableDifferentialDownload: this.disableDifferentialDownload
      }).catch((x) => {
        throw I(x);
      }).finally(() => {
        this.downloadPromise = null;
      }), this.downloadPromise;
    }
    dispatchError(C) {
      this.emit("error", C, (C.stack || C).toString());
    }
    dispatchUpdateDownloaded(C) {
      this.emit(m.UPDATE_DOWNLOADED, C);
    }
    async loadUpdateConfig() {
      return this._appUpdateConfigPath == null && (this._appUpdateConfigPath = this.app.appUpdateConfigPath), (0, u.load)(await (0, f.readFile)(this._appUpdateConfigPath, "utf-8"));
    }
    computeRequestHeaders(C) {
      const F = C.fileExtraDownloadHeaders;
      if (F != null) {
        const I = this.requestHeaders;
        return I == null ? F : {
          ...F,
          ...I
        };
      }
      return this.computeFinalHeaders({ accept: "*/*" });
    }
    async getOrCreateStagingUserId() {
      const C = a.join(this.app.userDataPath, ".updaterId");
      try {
        const I = await (0, f.readFile)(C, "utf-8");
        if (r.UUID.check(I))
          return I;
        this._logger.warn(`Staging user id file exists, but content was invalid: ${I}`);
      } catch (I) {
        I.code !== "ENOENT" && this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${I}`);
      }
      const F = r.UUID.v5((0, c.randomBytes)(4096), r.UUID.OID);
      this._logger.info(`Generated new staging user ID: ${F}`);
      try {
        await (0, f.outputFile)(C, F);
      } catch (I) {
        this._logger.warn(`Couldn't write out staging user ID: ${I}`);
      }
      return F;
    }
    /** @internal */
    get isAddNoCacheQuery() {
      const C = this.requestHeaders;
      if (C == null)
        return !0;
      for (const F of Object.keys(C)) {
        const I = F.toLowerCase();
        if (I === "authorization" || I === "private-token")
          return !1;
      }
      return !0;
    }
    async getOrCreateDownloadHelper() {
      let C = this.downloadedUpdateHelper;
      if (C == null) {
        const F = (await this.configOnDisk.value).updaterCacheDirName, I = this._logger;
        F == null && I.error("updaterCacheDirName is not specified in app-update.yml Was app build using at least electron-builder 20.34.0?");
        const x = a.join(this.app.baseCachePath, F || this.app.name);
        I.debug != null && I.debug(`updater cache dir: ${x}`), C = new i.DownloadedUpdateHelper(x), this.downloadedUpdateHelper = C;
      }
      return C;
    }
    async executeDownload(C) {
      const F = C.fileInfo, I = {
        headers: C.downloadUpdateOptions.requestHeaders,
        cancellationToken: C.downloadUpdateOptions.cancellationToken,
        sha2: F.info.sha2,
        sha512: F.info.sha512
      };
      this.listenerCount(m.DOWNLOAD_PROGRESS) > 0 && (I.onProgress = (Z) => this.emit(m.DOWNLOAD_PROGRESS, Z));
      const x = C.downloadUpdateOptions.updateInfoAndProvider.info, B = x.version, S = F.packageInfo;
      function Y() {
        const Z = decodeURIComponent(C.fileInfo.url.pathname);
        return Z.toLowerCase().endsWith(`.${C.fileExtension.toLowerCase()}`) ? a.basename(Z) : a.basename(C.fileInfo.info.url);
      }
      const H = await this.getOrCreateDownloadHelper(), V = H.cacheDirForPendingUpdate;
      await (0, f.mkdir)(V, { recursive: !0 });
      const L = Y();
      let P = a.join(V, L);
      const A = S == null ? null : a.join(V, `package-${B}${a.extname(S.path) || ".7z"}`), O = async (Z) => {
        await H.setDownloadedFile(P, A, x, F, L, Z), await C.done({
          ...x,
          downloadedFile: P
        });
        const de = a.join(V, "current.blockmap");
        return await (0, f.pathExists)(de) && await (0, f.copyFile)(de, a.join(H.cacheDir, "current.blockmap")), A == null ? [P] : [P, A];
      }, $ = this._logger, j = await H.validateDownloadedPath(P, x, F, $);
      if (j != null)
        return P = j, await O(!1);
      const X = async () => (await H.clear().catch(() => {
      }), await (0, f.unlink)(P).catch(() => {
      })), oe = await (0, i.createTempUpdateFile)(`temp-${L}`, V, $);
      try {
        await C.task(oe, I, A, X), await (0, r.retry)(() => (0, f.rename)(oe, P), {
          retries: 60,
          interval: 500,
          shouldRetry: (Z) => Z instanceof Error && /^EBUSY:/.test(Z.message) ? !0 : ($.warn(`Cannot rename temp file to final file: ${Z.message || Z.stack}`), !1)
        });
      } catch (Z) {
        throw await X(), Z instanceof r.CancellationError && ($.info("cancelled"), this.emit("update-cancelled", x)), Z;
      }
      return $.info(`New version ${B} has been downloaded to ${P}`), await O(!0);
    }
    async differentialDownloadInstaller(C, F, I, x, B) {
      try {
        if (this._testOnlyOptions != null && !this._testOnlyOptions.isUseDifferentialDownload)
          return !0;
        const S = F.updateInfoAndProvider.provider, Y = await S.getBlockMapFiles(C.url, this.app.version, F.updateInfoAndProvider.info.version, this.previousBlockmapBaseUrlOverride);
        this._logger.info(`Download block maps (old: "${Y[0]}", new: ${Y[1]})`);
        const H = async ($) => {
          const j = await this.httpExecutor.downloadToBuffer($, {
            headers: F.requestHeaders,
            cancellationToken: F.cancellationToken
          });
          if (j == null || j.length === 0)
            throw new Error(`Blockmap "${$.href}" is empty`);
          try {
            return JSON.parse((0, g.gunzipSync)(j).toString());
          } catch (X) {
            throw new Error(`Cannot parse blockmap "${$.href}", error: ${X}`);
          }
        }, V = {
          newUrl: C.url,
          oldFile: a.join(this.downloadedUpdateHelper.cacheDir, B),
          logger: this._logger,
          newFile: I,
          isUseMultipleRangeRequest: S.isUseMultipleRangeRequest,
          requestHeaders: F.requestHeaders,
          cancellationToken: F.cancellationToken
        };
        this.listenerCount(m.DOWNLOAD_PROGRESS) > 0 && (V.onProgress = ($) => this.emit(m.DOWNLOAD_PROGRESS, $));
        const L = async ($, j) => {
          const X = a.join(j, "current.blockmap");
          await (0, f.outputFile)(X, (0, g.gzipSync)(JSON.stringify($)));
        }, P = async ($) => {
          const j = a.join($, "current.blockmap");
          try {
            if (await (0, f.pathExists)(j))
              return JSON.parse((0, g.gunzipSync)(await (0, f.readFile)(j)).toString());
          } catch (X) {
            this._logger.warn(`Cannot parse blockmap "${j}", error: ${X}`);
          }
          return null;
        }, A = await H(Y[1]);
        await L(A, this.downloadedUpdateHelper.cacheDirForPendingUpdate);
        let O = await P(this.downloadedUpdateHelper.cacheDir);
        return O == null && (O = await H(Y[0])), await new y.GenericDifferentialDownloader(C.info, this.httpExecutor, V).download(O, A), !1;
      } catch (S) {
        if (this._logger.error(`Cannot download differentially, fallback to full download: ${S.stack || S}`), this._testOnlyOptions != null)
          throw S;
        return !0;
      }
    }
  };
  Tt.AppUpdater = _;
  function R(D) {
    const C = (0, l.prerelease)(D);
    return C != null && C.length > 0;
  }
  class b {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    info(C) {
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    warn(C) {
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    error(C) {
    }
  }
  return Tt.NoOpLogger = b, Tt;
}
var El;
function Jr() {
  if (El) return Vt;
  El = 1, Object.defineProperty(Vt, "__esModule", { value: !0 }), Vt.BaseUpdater = void 0;
  const r = jr, c = _e, p = go();
  let d = class extends p.AppUpdater {
    constructor(u, o) {
      super(u, o), this.quitAndInstallCalled = !1, this.quitHandlerAdded = !1;
    }
    quitAndInstall(u = !1, o = !1) {
      this._logger.info("Install on explicit quitAndInstall"), this.install(u, u ? o : this.autoRunAppAfterInstall) ? setImmediate(() => {
        Ct.autoUpdater.emit("before-quit-for-update"), this.app.quit();
      }) : this.quitAndInstallCalled = !1;
    }
    executeDownload(u) {
      return super.executeDownload({
        ...u,
        done: (o) => (this.dispatchUpdateDownloaded(o), this.addQuitHandler(), Promise.resolve())
      });
    }
    get installerPath() {
      return this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.file;
    }
    // must be sync (because quit even handler is not async)
    install(u = !1, o = !1) {
      if (this.quitAndInstallCalled)
        return this._logger.warn("install call ignored: quitAndInstallCalled is set to true"), !1;
      const a = this.downloadedUpdateHelper, l = this.installerPath, i = a == null ? null : a.downloadedFileInfo;
      if (l == null || i == null)
        return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
      this.quitAndInstallCalled = !0;
      try {
        return this._logger.info(`Install: isSilent: ${u}, isForceRunAfter: ${o}`), this.doInstall({
          isSilent: u,
          isForceRunAfter: o,
          isAdminRightsRequired: i.isAdminRightsRequired
        });
      } catch (n) {
        return this.dispatchError(n), !1;
      }
    }
    addQuitHandler() {
      this.quitHandlerAdded || !this.autoInstallOnAppQuit || (this.quitHandlerAdded = !0, this.app.onQuit((u) => {
        if (this.quitAndInstallCalled) {
          this._logger.info("Update installer has already been triggered. Quitting application.");
          return;
        }
        if (!this.autoInstallOnAppQuit) {
          this._logger.info("Update will not be installed on quit because autoInstallOnAppQuit is set to false.");
          return;
        }
        if (u !== 0) {
          this._logger.info(`Update will be not installed on quit because application is quitting with exit code ${u}`);
          return;
        }
        this._logger.info("Auto install update on quit"), this.install(!0, !1);
      }));
    }
    /**
     * Strips relative-path entries from a PATH string.
     * Prevents PATH-poisoning where a writable directory earlier in PATH shadows
     * a trusted package manager binary.
     */
    sanitizeEnvPath(u) {
      return u.split(c.delimiter).filter((o) => c.isAbsolute(o)).join(c.delimiter);
    }
    spawnSyncLog(u, o = [], a = {}) {
      var l;
      this._logger.info(`Executing: ${u} with args: ${o}`);
      const i = { ...process.env, ...a }, n = (0, r.spawnSync)(u, o, {
        env: { ...i, PATH: this.sanitizeEnvPath((l = i.PATH) !== null && l !== void 0 ? l : "") },
        encoding: "utf-8",
        shell: !0
      }), { error: t, status: s, stdout: h, stderr: g } = n;
      if (t != null)
        throw this._logger.error(g), t;
      if (s != null && s !== 0)
        throw this._logger.error(g), new Error(`Command ${u} exited with code ${s}`);
      return h.trim();
    }
    /**
     * This handles both node 8 and node 10 way of emitting error when spawning a process
     *   - node 8: Throws the error
     *   - node 10: Emit the error(Need to listen with on)
     */
    // https://github.com/electron-userland/electron-builder/issues/1129
    // Node 8 sends errors: https://nodejs.org/dist/latest-v8.x/docs/api/errors.html#errors_common_system_errors
    async spawnLog(u, o = [], a = void 0, l = "ignore") {
      return this._logger.info(`Executing: ${u} with args: ${o}`), new Promise((i, n) => {
        try {
          const t = { stdio: l, env: a, detached: !0 }, s = (0, r.spawn)(u, o, t);
          s.on("error", (h) => {
            n(h);
          }), s.unref(), s.pid !== void 0 && i(!0);
        } catch (t) {
          n(t);
        }
      });
    }
  };
  return Vt.BaseUpdater = d, Vt;
}
var sr = {}, ar = {}, yl;
function Eu() {
  if (yl) return ar;
  yl = 1, Object.defineProperty(ar, "__esModule", { value: !0 }), ar.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
  const r = /* @__PURE__ */ gt(), c = mu(), p = ql;
  let d = class extends c.DifferentialDownloader {
    async download() {
      const a = this.blockAwareFileInfo, l = a.size, i = l - (a.blockMapSize + 4);
      this.fileMetadataBuffer = await this.readRemoteBytes(i, l - 1);
      const n = f(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
      await this.doDownload(await u(this.options.oldFile), n);
    }
  };
  ar.FileWithEmbeddedBlockMapDifferentialDownloader = d;
  function f(o) {
    return JSON.parse((0, p.inflateRawSync)(o).toString());
  }
  async function u(o) {
    const a = await (0, r.open)(o, "r");
    try {
      const l = (await (0, r.fstat)(a)).size, i = Buffer.allocUnsafe(4);
      await (0, r.read)(a, i, 0, i.length, l - i.length);
      const n = Buffer.allocUnsafe(i.readUInt32BE(0));
      return await (0, r.read)(a, n, 0, n.length, l - i.length - n.length), await (0, r.close)(a), f(n);
    } catch (l) {
      throw await (0, r.close)(a), l;
    }
  }
  return ar;
}
var wl;
function vl() {
  if (wl) return sr;
  wl = 1, Object.defineProperty(sr, "__esModule", { value: !0 }), sr.AppImageUpdater = void 0;
  const r = Le(), c = jr, p = /* @__PURE__ */ gt(), d = je, f = _e, u = Jr(), o = Eu(), a = Ye(), l = It();
  let i = class extends u.BaseUpdater {
    constructor(t, s) {
      super(t, s);
    }
    isUpdaterActive() {
      return process.env.APPIMAGE == null && !this.forceDevUpdateConfig ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
    }
    /*** @private */
    doDownloadUpdate(t) {
      const s = t.updateInfoAndProvider.provider, h = (0, a.findFile)(s.resolveFiles(t.updateInfoAndProvider.info), "AppImage", ["rpm", "deb", "pacman"]);
      return this.executeDownload({
        fileExtension: "AppImage",
        fileInfo: h,
        downloadUpdateOptions: t,
        task: async (g, y) => {
          const m = process.env.APPIMAGE;
          if (m == null)
            throw (0, r.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
          (t.disableDifferentialDownload || await this.downloadDifferential(h, m, g, s, t)) && await this.httpExecutor.download(h.url, g, y), await (0, p.chmod)(g, 493);
        }
      });
    }
    async downloadDifferential(t, s, h, g, y) {
      try {
        const m = {
          newUrl: t.url,
          oldFile: s,
          logger: this._logger,
          newFile: h,
          isUseMultipleRangeRequest: g.isUseMultipleRangeRequest,
          requestHeaders: y.requestHeaders,
          cancellationToken: y.cancellationToken
        };
        return this.listenerCount(l.DOWNLOAD_PROGRESS) > 0 && (m.onProgress = (_) => this.emit(l.DOWNLOAD_PROGRESS, _)), await new o.FileWithEmbeddedBlockMapDifferentialDownloader(t.info, this.httpExecutor, m).download(), !1;
      } catch (m) {
        return this._logger.error(`Cannot download differentially, fallback to full download: ${m.stack || m}`), process.platform === "linux";
      }
    }
    doInstall(t) {
      const s = process.env.APPIMAGE;
      if (s == null)
        throw (0, r.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
      if (!f.isAbsolute(s) || s.includes("\0"))
        throw (0, r.newError)(`APPIMAGE env is not a valid absolute path: "${s}"`, "ERR_UPDATER_OLD_FILE_NOT_FOUND");
      (0, d.unlinkSync)(s);
      let h;
      const g = f.basename(s), y = this.installerPath;
      if (y == null)
        return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
      f.basename(y) === g || !/\d+\.\d+\.\d+/.test(g) ? h = s : h = f.join(f.dirname(s), f.basename(y)), (0, c.execFileSync)("mv", ["-f", y, h]), h !== s && this.emit("appimage-filename-updated", h);
      const m = {
        ...process.env,
        APPIMAGE_SILENT_INSTALL: "true"
      };
      return t.isForceRunAfter ? this.spawnLog(h, [], m) : (m.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, c.execFileSync)(h, [], { env: m })), !0;
    }
  };
  return sr.AppImageUpdater = i, sr;
}
var lr = {}, ur = {}, _l;
function Eo() {
  if (_l) return ur;
  _l = 1, Object.defineProperty(ur, "__esModule", { value: !0 }), ur.LinuxUpdater = void 0;
  const r = Jr(), c = /^[a-zA-Z0-9_-]+$/;
  let p = class extends r.BaseUpdater {
    constructor(f, u) {
      super(f, u);
    }
    /**
     * Returns true if the current process is running as root.
     */
    isRunningAsRoot() {
      var f;
      return ((f = process.getuid) === null || f === void 0 ? void 0 : f.call(process)) === 0;
    }
    /**
     * Sanitizes the installer path for use with shell:true spawn calls.
     * Backslash-escapes metacharacters that have special meaning in POSIX shell.
     * Note: paths containing single-quotes (') are not supported.
     */
    get installerPath() {
      const f = super.installerPath;
      return f == null ? null : f.replace(/\\/g, "\\\\").replace(/([`$!" ;|&()<>])/g, "\\$1").replace(/[\n\r]/g, "");
    }
    runCommandWithSudoIfNeeded(f) {
      if (this.isRunningAsRoot())
        return this._logger.info("Running as root, no need to use sudo"), this.spawnSyncLog(f[0], f.slice(1));
      const { name: u } = this.app, a = `"${u.replace(/["`$\\!\n\r;|&<>(){}*?[\]#~]/g, "")} would like to update"`, l = this.sudoWithArgs(a);
      this._logger.info(`Running as non-root user, using sudo to install: ${l}`);
      let i = '"';
      return (/pkexec/i.test(l[0]) || l[0] === "sudo") && (i = ""), this.spawnSyncLog(l[0], [...l.length > 1 ? l.slice(1) : [], `${i}/bin/bash`, "-c", `'${f.join(" ")}'${i}`]);
    }
    sudoWithArgs(f) {
      const u = this.determineSudoCommand(), o = [u];
      return /kdesudo/i.test(u) ? (o.push("--comment", f), o.push("-c")) : /gksudo/i.test(u) ? o.push("--message", f) : /pkexec/i.test(u) && o.push("--disable-internal-agent"), o;
    }
    hasCommand(f) {
      try {
        return this.spawnSyncLog("command", ["-v", f]), !0;
      } catch {
        return !1;
      }
    }
    determineSudoCommand() {
      const f = ["gksudo", "kdesudo", "pkexec", "beesu"];
      for (const u of f)
        if (this.hasCommand(u))
          return u;
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
    detectPackageManager(f) {
      var u;
      let o = f;
      const a = (u = process.env.ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER) === null || u === void 0 ? void 0 : u.trim();
      a && (c.test(a) ? o = [a] : this._logger.warn(`ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER "${a}" contains unsafe characters. Ignoring override.`));
      for (const n of o)
        if (this.hasCommand(n))
          return n;
      const l = a ? `ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER override "${a}", ` : "", i = f[0];
      return this._logger.warn(`No package manager found in the list: ${l}${f.join(", ")}. Utilizing default: ${i}`), i;
    }
  };
  return ur.LinuxUpdater = p, ur;
}
var Al;
function Rl() {
  if (Al) return lr;
  Al = 1, Object.defineProperty(lr, "__esModule", { value: !0 }), lr.DebUpdater = void 0;
  const r = Ye(), c = It(), p = Eo();
  let d = class yu extends p.LinuxUpdater {
    constructor(u, o) {
      super(u, o);
    }
    /*** @private */
    doDownloadUpdate(u) {
      const o = u.updateInfoAndProvider.provider, a = (0, r.findFile)(o.resolveFiles(u.updateInfoAndProvider.info), "deb", ["AppImage", "rpm", "pacman"]);
      return this.executeDownload({
        fileExtension: "deb",
        fileInfo: a,
        downloadUpdateOptions: u,
        task: async (l, i) => {
          this.listenerCount(c.DOWNLOAD_PROGRESS) > 0 && (i.onProgress = (n) => this.emit(c.DOWNLOAD_PROGRESS, n)), await this.httpExecutor.download(a.url, l, i);
        }
      });
    }
    doInstall(u) {
      const o = this.installerPath;
      if (o == null)
        return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
      if (!this.hasCommand("dpkg") && !this.hasCommand("apt"))
        return this.dispatchError(new Error("Neither dpkg nor apt command found. Cannot install .deb package.")), !1;
      const a = ["dpkg", "apt"], l = this.detectPackageManager(a);
      try {
        yu.installWithCommandRunner(l, o, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
      } catch (i) {
        return this.dispatchError(i), !1;
      }
      return u.isForceRunAfter && this.app.relaunch(), !0;
    }
    static installWithCommandRunner(u, o, a, l) {
      var i;
      if (u === "dpkg")
        try {
          a(["dpkg", "-i", o]);
        } catch (n) {
          l.warn((i = n.message) !== null && i !== void 0 ? i : n), l.warn("dpkg installation failed, trying to fix broken dependencies with apt-get"), a(["apt-get", "install", "-f", "-y"]);
        }
      else if (u === "apt")
        l.warn("Using apt to install a local .deb. This may fail for unsigned packages unless properly configured."), a([
          "apt",
          "install",
          "-y",
          "--allow-unauthenticated",
          // needed for unsigned .debs
          "--allow-downgrades",
          // allow lower version installs
          "--allow-change-held-packages",
          o
        ]);
      else
        throw new Error(`Package manager ${u} not supported`);
    }
  };
  return lr.DebUpdater = d, lr;
}
var cr = {}, Tl;
function Sl() {
  if (Tl) return cr;
  Tl = 1, Object.defineProperty(cr, "__esModule", { value: !0 }), cr.PacmanUpdater = void 0;
  const r = It(), c = Ye(), p = Eo();
  let d = class wu extends p.LinuxUpdater {
    constructor(u, o) {
      super(u, o);
    }
    /*** @private */
    doDownloadUpdate(u) {
      const o = u.updateInfoAndProvider.provider, a = (0, c.findFile)(o.resolveFiles(u.updateInfoAndProvider.info), "pacman", ["AppImage", "deb", "rpm"]);
      return this.executeDownload({
        fileExtension: "pacman",
        fileInfo: a,
        downloadUpdateOptions: u,
        task: async (l, i) => {
          this.listenerCount(r.DOWNLOAD_PROGRESS) > 0 && (i.onProgress = (n) => this.emit(r.DOWNLOAD_PROGRESS, n)), await this.httpExecutor.download(a.url, l, i);
        }
      });
    }
    doInstall(u) {
      const o = this.installerPath;
      if (o == null)
        return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
      try {
        wu.installWithCommandRunner(o, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
      } catch (a) {
        return this.dispatchError(a), !1;
      }
      return u.isForceRunAfter && this.app.relaunch(), !0;
    }
    static installWithCommandRunner(u, o, a) {
      var l;
      try {
        o(["pacman", "-U", "--noconfirm", u]);
      } catch (i) {
        a.warn((l = i.message) !== null && l !== void 0 ? l : i), a.warn("pacman installation failed, attempting to update package database and retry");
        try {
          o(["pacman", "-Sy", "--noconfirm"]), o(["pacman", "-U", "--noconfirm", u]);
        } catch (n) {
          throw a.error("Retry after pacman -Sy failed"), n;
        }
      }
    }
  };
  return cr.PacmanUpdater = d, cr;
}
var fr = {}, bl;
function Cl() {
  if (bl) return fr;
  bl = 1, Object.defineProperty(fr, "__esModule", { value: !0 }), fr.RpmUpdater = void 0;
  const r = It(), c = Ye(), p = Eo();
  let d = class vu extends p.LinuxUpdater {
    constructor(u, o) {
      super(u, o);
    }
    /*** @private */
    doDownloadUpdate(u) {
      const o = u.updateInfoAndProvider.provider, a = (0, c.findFile)(o.resolveFiles(u.updateInfoAndProvider.info), "rpm", ["AppImage", "deb", "pacman"]);
      return this.executeDownload({
        fileExtension: "rpm",
        fileInfo: a,
        downloadUpdateOptions: u,
        task: async (l, i) => {
          this.listenerCount(r.DOWNLOAD_PROGRESS) > 0 && (i.onProgress = (n) => this.emit(r.DOWNLOAD_PROGRESS, n)), await this.httpExecutor.download(a.url, l, i);
        }
      });
    }
    doInstall(u) {
      const o = this.installerPath;
      if (o == null)
        return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
      const a = ["zypper", "dnf", "yum", "rpm"], l = this.detectPackageManager(a);
      try {
        vu.installWithCommandRunner(l, o, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
      } catch (i) {
        return this.dispatchError(i), !1;
      }
      return u.isForceRunAfter && this.app.relaunch(), !0;
    }
    static installWithCommandRunner(u, o, a, l) {
      if (u === "zypper")
        return a(["zypper", "--non-interactive", "--no-refresh", "install", "--allow-unsigned-rpm", "-f", o]);
      if (u === "dnf")
        return a(["dnf", "install", "--nogpgcheck", "-y", o]);
      if (u === "yum")
        return a(["yum", "install", "--nogpgcheck", "-y", o]);
      if (u === "rpm")
        return l.warn("Installing with rpm only (no dependency resolution)."), a(["rpm", "-Uvh", "--replacepkgs", "--replacefiles", "--nodeps", o]);
      throw new Error(`Package manager ${u} not supported`);
    }
  };
  return fr.RpmUpdater = d, fr;
}
var dr = {}, Pl;
function Ol() {
  if (Pl) return dr;
  Pl = 1, Object.defineProperty(dr, "__esModule", { value: !0 }), dr.MacUpdater = void 0;
  const r = Le(), c = /* @__PURE__ */ gt(), p = je, d = _e, f = _c, u = go(), o = Ye(), a = jr, l = yr;
  let i = class _u extends u.AppUpdater {
    constructor(t, s) {
      super(t, s), this.nativeUpdater = Ct.autoUpdater, this.squirrelDownloadedUpdate = !1, this.nativeUpdater.on("error", (h) => {
        this._logger.warn(h), this.emit("error", h);
      }), this.nativeUpdater.on("update-downloaded", () => {
        this.squirrelDownloadedUpdate = !0, this.debug("nativeUpdater.update-downloaded");
      });
    }
    /** Filters update files to the appropriate architecture.
     * On arm64 Macs (including Rosetta), arm64 files are preferred when available.
     * On x64 Macs, arm64 files are excluded. */
    static filterFilesForArch(t, s) {
      const h = (g) => {
        var y;
        return g.url.pathname.includes("arm64") || ((y = g.info.url) === null || y === void 0 ? void 0 : y.includes("arm64"));
      };
      return s && t.some(h) ? t.filter((g) => s === h(g)) : t.filter((g) => !h(g));
    }
    debug(t) {
      this._logger.debug != null && this._logger.debug(t);
    }
    closeServerIfExists() {
      this.server && (this.debug("Closing proxy server"), this.server.close((t) => {
        t && this.debug("proxy server wasn't already open, probably attempted closing again as a safety check before quit");
      }));
    }
    async doDownloadUpdate(t) {
      let s = t.updateInfoAndProvider.provider.resolveFiles(t.updateInfoAndProvider.info);
      const h = this._logger, g = "sysctl.proc_translated";
      let y = !1;
      try {
        this.debug("Checking for macOS Rosetta environment"), y = (0, a.execFileSync)("sysctl", [g], { encoding: "utf8" }).includes(`${g}: 1`), h.info(`Checked for macOS Rosetta environment (isRosetta=${y})`);
      } catch (D) {
        h.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${D}`);
      }
      let m = !1;
      try {
        this.debug("Checking for arm64 in uname");
        const C = (0, a.execFileSync)("uname", ["-a"], { encoding: "utf8" }).includes("ARM");
        h.info(`Checked 'uname -a': arm64=${C}`), m = m || C;
      } catch (D) {
        h.warn(`uname shell command to check for arm64 failed: ${D}`);
      }
      m = m || process.arch === "arm64" || y, s = _u.filterFilesForArch(s, m);
      const _ = (0, o.findFile)(s, "zip", ["pkg", "dmg"]);
      if (_ == null)
        throw (0, r.newError)(`ZIP file not provided: ${(0, r.safeStringifyJson)(s)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
      const R = t.updateInfoAndProvider.provider, b = "update.zip";
      return this.executeDownload({
        fileExtension: "zip",
        fileInfo: _,
        downloadUpdateOptions: t,
        task: async (D, C) => {
          const F = d.join(this.downloadedUpdateHelper.cacheDir, b), I = () => (0, c.pathExistsSync)(F) ? !t.disableDifferentialDownload : (h.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1);
          let x = !0;
          I() && (x = await this.differentialDownloadInstaller(_, t, D, R, b)), x && await this.httpExecutor.download(_.url, D, C);
        },
        done: async (D) => {
          if (!t.disableDifferentialDownload)
            try {
              const C = d.join(this.downloadedUpdateHelper.cacheDir, b);
              await (0, c.copyFile)(D.downloadedFile, C);
            } catch (C) {
              this._logger.warn(`Unable to copy file for caching for future differential downloads: ${C.message}`);
            }
          return this.updateDownloaded(_, D);
        }
      });
    }
    async updateDownloaded(t, s) {
      var h;
      const g = s.downloadedFile, y = (h = t.info.size) !== null && h !== void 0 ? h : (await (0, c.stat)(g)).size, m = this._logger, _ = `fileToProxy=${t.url.href}`;
      this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${_})`), this.server = (0, f.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${_})`), this.server.on("close", () => {
        m.info(`Proxy server for native Squirrel.Mac is closed (${_})`);
      });
      const R = (b) => {
        const D = b.address();
        return typeof D == "string" ? D : `http://127.0.0.1:${D == null ? void 0 : D.port}`;
      };
      return await new Promise((b, D) => {
        const C = (0, l.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), F = Buffer.from(`autoupdater:${C}`, "ascii"), I = `/${(0, l.randomBytes)(64).toString("hex")}.zip`;
        this.server.on("request", (x, B) => {
          const S = x.url;
          if (m.info(`${S} requested`), S === "/") {
            if (!x.headers.authorization || x.headers.authorization.indexOf("Basic ") === -1) {
              B.statusCode = 401, B.statusMessage = "Invalid Authentication Credentials", B.end(), m.warn("No authenthication info");
              return;
            }
            const V = x.headers.authorization.split(" ")[1], L = Buffer.from(V, "base64").toString("ascii"), [P, A] = L.split(":");
            if (P !== "autoupdater" || A !== C) {
              B.statusCode = 401, B.statusMessage = "Invalid Authentication Credentials", B.end(), m.warn("Invalid authenthication credentials");
              return;
            }
            const O = Buffer.from(`{ "url": "${R(this.server)}${I}" }`);
            B.writeHead(200, { "Content-Type": "application/json", "Content-Length": O.length }), B.end(O);
            return;
          }
          if (!S.startsWith(I)) {
            m.warn(`${S} requested, but not supported`), B.writeHead(404), B.end();
            return;
          }
          m.info(`${I} requested by Squirrel.Mac, pipe ${g}`);
          let Y = !1;
          B.on("finish", () => {
            Y || (this.nativeUpdater.removeListener("error", D), b([]));
          });
          const H = (0, p.createReadStream)(g);
          H.on("error", (V) => {
            try {
              B.end();
            } catch (L) {
              m.warn(`cannot end response: ${L}`);
            }
            Y = !0, this.nativeUpdater.removeListener("error", D), D(new Error(`Cannot pipe "${g}": ${V}`));
          }), B.writeHead(200, {
            "Content-Type": "application/zip",
            "Content-Length": y
          }), H.pipe(B);
        }), this.debug(`Proxy server for native Squirrel.Mac is starting to listen (${_})`), this.server.listen(0, "127.0.0.1", () => {
          this.debug(`Proxy server for native Squirrel.Mac is listening (address=${R(this.server)}, ${_})`), this.nativeUpdater.setFeedURL({
            url: R(this.server),
            headers: {
              "Cache-Control": "no-cache",
              Authorization: `Basic ${F.toString("base64")}`
            }
          }), this.dispatchUpdateDownloaded(s), this.autoInstallOnAppQuit ? (this.nativeUpdater.once("error", D), this.nativeUpdater.checkForUpdates()) : b([]);
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
  return dr.MacUpdater = i, dr;
}
var hr = {}, Br = {}, Il;
function zf() {
  if (Il) return Br;
  Il = 1, Object.defineProperty(Br, "__esModule", { value: !0 }), Br.verifySignature = u;
  const r = Le(), c = jr, p = Hr, d = _e;
  function f(i, n) {
    return ['set "PSModulePath=" & chcp 65001 >NUL & powershell.exe', ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", i], {
      shell: !0,
      timeout: n
    }];
  }
  function u(i, n, t) {
    return new Promise((s, h) => {
      const g = n.replace(/'/g, "''");
      t.info(`Verifying signature ${g}`), (0, c.execFile)(...f(`"Get-AuthenticodeSignature -LiteralPath '${g}' | ConvertTo-Json -Compress"`, 20 * 1e3), (y, m, _) => {
        var R;
        try {
          if (y != null || _) {
            a(t, y, _, h), s(null);
            return;
          }
          const b = o(m);
          if (b.Status === 0) {
            try {
              const I = d.normalize(b.Path), x = d.normalize(n);
              if (t.info(`LiteralPath: ${I}. Update Path: ${x}`), I !== x) {
                a(t, new Error(`LiteralPath of ${I} is different than ${x}`), _, h), s(null);
                return;
              }
            } catch (I) {
              t.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${(R = I.message) !== null && R !== void 0 ? R : I.stack}`);
            }
            const C = (0, r.parseDn)(b.SignerCertificate.Subject);
            let F = !1;
            for (const I of i) {
              const x = (0, r.parseDn)(I);
              if (x.size ? F = Array.from(x.keys()).every((S) => x.get(S) === C.get(S)) : I === C.get("CN") && (t.warn(`Signature validated using only CN ${I}. Please add your full Distinguished Name (DN) to publisherNames configuration`), F = !0), F) {
                s(null);
                return;
              }
            }
          }
          const D = `publisherNames: ${i.join(" | ")}, raw info: ` + JSON.stringify(b, (C, F) => C === "RawData" ? void 0 : F, 2);
          t.warn(`Sign verification failed, installer signed with incorrect certificate: ${D}`), s(D);
        } catch (b) {
          a(t, b, null, h), s(null);
          return;
        }
      });
    });
  }
  function o(i) {
    const n = JSON.parse(i);
    delete n.PrivateKey, delete n.IsOSBinary, delete n.SignatureType;
    const t = n.SignerCertificate;
    return t != null && (delete t.Archived, delete t.Extensions, delete t.Handle, delete t.HasPrivateKey, delete t.SubjectName), n;
  }
  function a(i, n, t, s) {
    if (l()) {
      i.warn(`Cannot execute Get-AuthenticodeSignature: ${n || t}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
      return;
    }
    try {
      (0, c.execFileSync)(...f("ConvertTo-Json test", 10 * 1e3));
    } catch (h) {
      i.warn(`Cannot execute ConvertTo-Json: ${h.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
      return;
    }
    n != null && s(n), t && s(new Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${t}. Failing signature validation due to unknown stderr.`));
  }
  function l() {
    const i = p.release();
    return i.startsWith("6.") && !i.startsWith("6.3");
  }
  return Br;
}
var Dl;
function Nl() {
  if (Dl) return hr;
  Dl = 1, Object.defineProperty(hr, "__esModule", { value: !0 }), hr.NsisUpdater = void 0;
  const r = Le(), c = _e, p = Jr(), d = Eu(), f = It(), u = Ye(), o = /* @__PURE__ */ gt(), a = zf(), l = mt;
  let i = class extends p.BaseUpdater {
    constructor(t, s) {
      super(t, s), this._verifyUpdateCodeSignature = (h, g) => (0, a.verifySignature)(h, g, this._logger);
    }
    /**
     * The verifyUpdateCodeSignature. You can pass [win-verify-signature](https://github.com/beyondkmp/win-verify-trust) or another custom verify function: ` (publisherName: string[], path: string) => Promise<string | null>`.
     * The default verify function uses [windowsExecutableCodeSignatureVerifier](https://github.com/electron-userland/electron-builder/blob/master/packages/electron-updater/src/windowsExecutableCodeSignatureVerifier.ts)
     */
    get verifyUpdateCodeSignature() {
      return this._verifyUpdateCodeSignature;
    }
    set verifyUpdateCodeSignature(t) {
      t && (this._verifyUpdateCodeSignature = t);
    }
    /*** @private */
    doDownloadUpdate(t) {
      const s = t.updateInfoAndProvider.provider, h = (0, u.findFile)(s.resolveFiles(t.updateInfoAndProvider.info), "exe");
      return this.executeDownload({
        fileExtension: "exe",
        downloadUpdateOptions: t,
        fileInfo: h,
        task: async (g, y, m, _) => {
          const R = h.packageInfo, b = R != null && m != null;
          if (b && t.disableWebInstaller)
            throw (0, r.newError)(`Unable to download new version ${t.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
          !b && !t.disableWebInstaller && this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version."), (b || t.disableDifferentialDownload || await this.differentialDownloadInstaller(h, t, g, s, r.CURRENT_APP_INSTALLER_FILE_NAME)) && await this.httpExecutor.download(h.url, g, y);
          const D = await this.verifySignature(g);
          if (D != null)
            throw await _(), (0, r.newError)(`New version ${t.updateInfoAndProvider.info.version} is not signed by the application owner: ${D}`, "ERR_UPDATER_INVALID_SIGNATURE");
          if (b && await this.differentialDownloadWebPackage(t, R, m, s))
            try {
              await this.httpExecutor.download(new l.URL(R.path), m, {
                headers: t.requestHeaders,
                cancellationToken: t.cancellationToken,
                sha512: R.sha512
              });
            } catch (C) {
              try {
                await (0, o.unlink)(m);
              } catch {
              }
              throw C;
            }
        }
      });
    }
    // $certificateInfo = (Get-AuthenticodeSignature 'xxx\yyy.exe'
    // | where {$_.Status.Equals([System.Management.Automation.SignatureStatus]::Valid) -and $_.SignerCertificate.Subject.Contains("CN=siemens.com")})
    // | Out-String ; if ($certificateInfo) { exit 0 } else { exit 1 }
    async verifySignature(t) {
      let s;
      try {
        if (s = (await this.configOnDisk.value).publisherName, s == null)
          return null;
      } catch (h) {
        if (h.code === "ENOENT")
          return null;
        throw h;
      }
      return await this._verifyUpdateCodeSignature(Array.isArray(s) ? s : [s], t);
    }
    doInstall(t) {
      const s = this.installerPath;
      if (s == null)
        return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
      const h = ["--updated"];
      t.isSilent && h.push("/S"), t.isForceRunAfter && h.push("--force-run"), this.installDirectory && h.push(`/D=${this.installDirectory}`);
      const g = this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.packageFile;
      g != null && h.push(`--package-file=${g}`);
      const y = () => {
        this.spawnLog(c.join(process.resourcesPath, "elevate.exe"), [s].concat(h)).catch((m) => this.dispatchError(m));
      };
      return t.isAdminRightsRequired ? (this._logger.info("isAdminRightsRequired is set to true, run installer using elevate.exe"), y(), !0) : (this.spawnLog(s, h).catch((m) => {
        const _ = m.code;
        this._logger.info(`Cannot run installer: error code: ${_}, error message: "${m.message}", will be executed again using elevate if EACCES, and will try to use electron.shell.openItem if ENOENT`), _ === "UNKNOWN" || _ === "EACCES" ? y() : _ === "ENOENT" ? Ct.shell.openPath(s).catch((R) => this.dispatchError(R)) : this.dispatchError(m);
      }), !0);
    }
    async differentialDownloadWebPackage(t, s, h, g) {
      if (s.blockMapSize == null)
        return !0;
      try {
        const y = {
          newUrl: new l.URL(s.path),
          oldFile: c.join(this.downloadedUpdateHelper.cacheDir, r.CURRENT_APP_PACKAGE_FILE_NAME),
          logger: this._logger,
          newFile: h,
          requestHeaders: this.requestHeaders,
          isUseMultipleRangeRequest: g.isUseMultipleRangeRequest,
          cancellationToken: t.cancellationToken
        };
        this.listenerCount(f.DOWNLOAD_PROGRESS) > 0 && (y.onProgress = (m) => this.emit(f.DOWNLOAD_PROGRESS, m)), await new d.FileWithEmbeddedBlockMapDifferentialDownloader(s, this.httpExecutor, y).download();
      } catch (y) {
        return this._logger.error(`Cannot download differentially, fallback to full download: ${y.stack || y}`), process.platform === "win32";
      }
      return !1;
    }
  };
  return hr.NsisUpdater = i, hr;
}
var Fl;
function Xf() {
  return Fl || (Fl = 1, (function(r) {
    var c = Rt && Rt.__createBinding || (Object.create ? (function(m, _, R, b) {
      b === void 0 && (b = R);
      var D = Object.getOwnPropertyDescriptor(_, R);
      (!D || ("get" in D ? !_.__esModule : D.writable || D.configurable)) && (D = { enumerable: !0, get: function() {
        return _[R];
      } }), Object.defineProperty(m, b, D);
    }) : (function(m, _, R, b) {
      b === void 0 && (b = R), m[b] = _[R];
    })), p = Rt && Rt.__exportStar || function(m, _) {
      for (var R in m) R !== "default" && !Object.prototype.hasOwnProperty.call(_, R) && c(_, m, R);
    };
    Object.defineProperty(r, "__esModule", { value: !0 }), r.NsisUpdater = r.MacUpdater = r.RpmUpdater = r.PacmanUpdater = r.DebUpdater = r.AppImageUpdater = r.Provider = r.NoOpLogger = r.AppUpdater = r.BaseUpdater = void 0;
    const d = /* @__PURE__ */ gt(), f = _e;
    var u = Jr();
    Object.defineProperty(r, "BaseUpdater", { enumerable: !0, get: function() {
      return u.BaseUpdater;
    } });
    var o = go();
    Object.defineProperty(r, "AppUpdater", { enumerable: !0, get: function() {
      return o.AppUpdater;
    } }), Object.defineProperty(r, "NoOpLogger", { enumerable: !0, get: function() {
      return o.NoOpLogger;
    } });
    var a = Ye();
    Object.defineProperty(r, "Provider", { enumerable: !0, get: function() {
      return a.Provider;
    } });
    var l = vl();
    Object.defineProperty(r, "AppImageUpdater", { enumerable: !0, get: function() {
      return l.AppImageUpdater;
    } });
    var i = Rl();
    Object.defineProperty(r, "DebUpdater", { enumerable: !0, get: function() {
      return i.DebUpdater;
    } });
    var n = Sl();
    Object.defineProperty(r, "PacmanUpdater", { enumerable: !0, get: function() {
      return n.PacmanUpdater;
    } });
    var t = Cl();
    Object.defineProperty(r, "RpmUpdater", { enumerable: !0, get: function() {
      return t.RpmUpdater;
    } });
    var s = Ol();
    Object.defineProperty(r, "MacUpdater", { enumerable: !0, get: function() {
      return s.MacUpdater;
    } });
    var h = Nl();
    Object.defineProperty(r, "NsisUpdater", { enumerable: !0, get: function() {
      return h.NsisUpdater;
    } }), p(It(), r);
    let g;
    function y() {
      if (process.platform === "win32")
        g = new (Nl()).NsisUpdater();
      else if (process.platform === "darwin")
        g = new (Ol()).MacUpdater();
      else {
        g = new (vl()).AppImageUpdater();
        try {
          const m = f.join(process.resourcesPath, "package-type");
          if (!(0, d.existsSync)(m))
            return g;
          switch ((0, d.readFileSync)(m).toString().trim()) {
            case "deb":
              g = new (Rl()).DebUpdater();
              break;
            case "rpm":
              g = new (Cl()).RpmUpdater();
              break;
            case "pacman":
              g = new (Sl()).PacmanUpdater();
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
    Object.defineProperty(r, "autoUpdater", {
      enumerable: !0,
      get: () => g || y()
    });
  })(Rt)), Rt;
}
var Ar = Xf();
const Kf = vc(import.meta.url), mr = _e.dirname(Kf), Jf = _e.join(Ve.getPath("userData"), "app.log"), Au = je.createWriteStream(Jf, { flags: "a" }), yo = (r) => {
  const p = `[${(/* @__PURE__ */ new Date()).toISOString()}] ${r.toString().trim()}
`;
  Au.write(p), process.stdout.write(p);
}, Qf = (r) => {
  const p = `[${(/* @__PURE__ */ new Date()).toISOString()}] ERROR: ${r.toString().trim()}
`;
  Au.write(p), process.stderr.write(p);
};
console.log = yo;
console.error = Qf;
let pt = null, gr = null;
function xl() {
  const r = new Ll({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: _e.join(mr, "preload.js"),
      contextIsolation: !0,
      nodeIntegration: !1
    },
    autoHideMenuBar: !0,
    icon: Ve.isPackaged ? _e.join(mr, "../dist/icon.png") : _e.join(mr, "../public/icon.png")
  });
  r.maximize();
  const c = "http://localhost:5173/", p = _e.join(mr, "../dist/index.html");
  Ve.isPackaged ? r.loadFile(p) : r.loadURL(c);
}
eo.handle("get-backend-port", () => gr);
eo.handle("show-confirm-dialog", async (r, c) => {
  const { response: p } = await qt.showMessageBox({
    type: "question",
    buttons: ["Yes", "No"],
    defaultId: 1,
    cancelId: 1,
    title: c.title || "Confirm",
    message: c.message,
    detail: c.detail || ""
  });
  return p === 0;
});
eo.on("console-log", (r, c) => {
  console.log(`[Renderer] ${c}`);
});
const Zf = () => new Promise((r, c) => {
  let p, d, f;
  if (Ve.isPackaged) {
    const a = process.platform === "win32" ? "sAIve-backend.exe" : "sAIve-backend";
    if (p = _e.join(process.resourcesPath, "backend", a), d = [], f = _e.join(process.resourcesPath, "backend"), !je.existsSync(p)) {
      const l = `Backend binary not found at: ${p}`;
      console.error(l), qt.showErrorBox("Backend Error", l), c(new Error(l));
      return;
    }
  } else {
    f = _e.join(mr, "..", "..", "Server");
    const a = _e.join(f, "..", ".venv", "Scripts", "python.exe"), l = _e.join(f, "..", ".venv", "bin", "python"), i = _e.join(f, "venv", "Scripts", "python.exe"), n = _e.join(f, "venv", "bin", "python");
    process.platform === "win32" && je.existsSync(a) ? p = a : process.platform === "win32" && je.existsSync(i) ? p = i : je.existsSync(l) ? p = l : je.existsSync(n) ? p = n : p = "python", d = ["main.py"];
  }
  console.log(`Starting backend: ${p} ${d.join(" ")} in ${f}`);
  const u = { ...process.env };
  Ve.isPackaged && (u.SAIVE_USER_DATA = Ve.getPath("userData")), pt = wc(p, d, {
    cwd: f,
    stdio: "pipe",
    env: u
  });
  let o = !1;
  pt.stdout.on("data", (a) => {
    const l = a.toString();
    if (console.log(`Backend: ${l}`), !o) {
      const i = l.match(/PORT:(\d+)/);
      i && (gr = parseInt(i[1], 10), o = !0, console.log(`Backend port discovered: ${gr}`), r(gr));
    }
  }), pt.stderr.on("data", (a) => {
    console.error(`Backend: ${a}`);
  }), pt.on("error", (a) => {
    console.error(`Failed to start backend process: ${a}`), qt.showErrorBox("Backend Error", `Failed to start backend process: ${a.message}`), c(a);
  }), pt.on("close", (a) => {
    a !== 0 && console.error(`Backend process exited with code ${a}`), o || c(new Error(`Backend exited with code ${a} before reporting a port.`));
  }), setTimeout(() => {
    o || (console.error("Backend did not report a port within 30 seconds."), c(new Error("Backend startup timeout.")));
  }, 3e4);
}), ed = (r) => {
  const c = Ec.request({
    method: "GET",
    protocol: "http:",
    hostname: "127.0.0.1",
    port: gr,
    path: "/"
  });
  c.on("response", (p) => {
    r(p.statusCode === 200);
  }), c.on("error", () => {
    r(!1);
  }), c.end();
}, td = (r) => {
  let c = 0;
  const p = 30, d = 1e3, f = () => {
    ed((u) => {
      if (u)
        console.log("Backend is ready. Proceeding to create window."), r();
      else if (c++, c < p)
        console.log(`Backend not ready, retrying in ${d / 1e3}s... (attempt ${c})`), setTimeout(f, d);
      else {
        const o = "Backend did not start within the expected time.";
        console.error(o), qt.showErrorBox("Backend Startup Error", o), Ve.quit();
      }
    });
  };
  f();
};
Ve.whenReady().then(async () => {
  console.log("App is ready. Starting backend...");
  try {
    await Zf(), td(() => {
      xl();
    });
  } catch (r) {
    console.error(`Fatal: ${r.message}`), qt.showErrorBox("Backend Startup Error", r.message), Ve.quit();
  }
  Ve.on("activate", function() {
    Ll.getAllWindows().length === 0 && xl();
  }), setTimeout(() => {
    Ar.autoUpdater.checkForUpdates();
  }, 3e3);
});
Ar.autoUpdater.autoDownload = !1;
Ar.autoUpdater.allowPrerelease = !0;
Ar.autoUpdater.on("update-available", (r) => {
  yo(`Update available: ${r.version}`), qt.showMessageBox({
    type: "info",
    title: "Update Available",
    message: `A new version (${r.version}) of sAIve is available.`,
    detail: 'Click "Download" to view the release on GitHub.',
    buttons: ["Download", "Later"],
    defaultId: 0,
    cancelId: 1
  }).then(({ response: c }) => {
    c === 0 && gc.openExternal("https://github.com/DIIZZYFPS/sAIve/releases/latest");
  });
});
Ar.autoUpdater.on("error", (r) => {
  yo(`Updater error: ${r}`);
});
Ve.on("will-quit", () => {
  pt && (console.log("Killing backend process..."), pt.kill(), pt = null);
});
Ve.on("window-all-closed", () => {
  process.platform !== "darwin" && Ve.quit();
});

import { app as n, ipcMain as B, dialog as g, BrowserWindow as u, net as $ } from "electron";
import a from "path";
import { fileURLToPath as b } from "url";
import { spawn as y } from "child_process";
import f from "fs";
const S = b(import.meta.url), m = a.dirname(S), x = a.join(n.getPath("userData"), "app.log"), k = f.createWriteStream(x, { flags: "a" }), P = (o) => {
  const e = `[${(/* @__PURE__ */ new Date()).toISOString()}] ${o.toString().trim()}
`;
  k.write(e), process.stdout.write(e);
}, E = (o) => {
  const e = `[${(/* @__PURE__ */ new Date()).toISOString()}] ERROR: ${o.toString().trim()}
`;
  k.write(e), process.stderr.write(e);
};
console.log = P;
console.error = E;
let s = null, p = null;
function h() {
  const o = new u({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: a.join(m, "preload.js"),
      contextIsolation: !0,
      nodeIntegration: !1
    },
    autoHideMenuBar: !0,
    icon: a.join(m, "../dist/vite.svg")
  });
  o.maximize();
  const t = "http://localhost:5173/", e = a.join(m, "../dist/index.html");
  n.isPackaged ? o.loadFile(e) : o.loadURL(t);
}
B.handle("get-backend-port", () => p);
const v = () => new Promise((o, t) => {
  let e, i, c;
  if (n.isPackaged) {
    const r = process.platform === "win32" ? "sAIve-backend.exe" : "sAIve-backend";
    if (e = a.join(process.resourcesPath, "backend", r), i = [], c = a.join(process.resourcesPath, "backend"), !f.existsSync(e)) {
      const l = `Backend binary not found at: ${e}`;
      console.error(l), g.showErrorBox("Backend Error", l), t(new Error(l));
      return;
    }
  } else
    e = "python", i = ["main.py"], c = a.join(m, "..", "..", "Server");
  console.log(`Starting backend: ${e} ${i.join(" ")} in ${c}`), s = y(e, i, {
    cwd: c,
    stdio: "pipe"
  });
  let d = !1;
  s.stdout.on("data", (r) => {
    const l = r.toString();
    if (console.log(`Backend: ${l}`), !d) {
      const w = l.match(/PORT:(\d+)/);
      w && (p = parseInt(w[1], 10), d = !0, console.log(`Backend port discovered: ${p}`), o(p));
    }
  }), s.stderr.on("data", (r) => {
    console.error(`Backend: ${r}`);
  }), s.on("error", (r) => {
    console.error(`Failed to start backend process: ${r}`), g.showErrorBox("Backend Error", `Failed to start backend process: ${r.message}`), t(r);
  }), s.on("close", (r) => {
    r !== 0 && console.error(`Backend process exited with code ${r}`), d || t(new Error(`Backend exited with code ${r} before reporting a port.`));
  }), setTimeout(() => {
    d || (console.error("Backend did not report a port within 30 seconds."), t(new Error("Backend startup timeout.")));
  }, 3e4);
}), R = (o) => {
  const t = $.request({
    method: "GET",
    protocol: "http:",
    hostname: "127.0.0.1",
    port: p,
    path: "/"
  });
  t.on("response", (e) => {
    o(e.statusCode === 200);
  }), t.on("error", () => {
    o(!1);
  }), t.end();
}, F = (o) => {
  let t = 0;
  const e = 30, i = 1e3, c = () => {
    R((d) => {
      if (d)
        console.log("Backend is ready. Proceeding to create window."), o();
      else if (t++, t < e)
        console.log(`Backend not ready, retrying in ${i / 1e3}s... (attempt ${t})`), setTimeout(c, i);
      else {
        const r = "Backend did not start within the expected time.";
        console.error(r), g.showErrorBox("Backend Startup Error", r), n.quit();
      }
    });
  };
  c();
};
n.whenReady().then(async () => {
  console.log("App is ready. Starting backend...");
  try {
    await v(), F(() => {
      h();
    });
  } catch (o) {
    console.error(`Fatal: ${o.message}`), g.showErrorBox("Backend Startup Error", o.message), n.quit();
  }
  n.on("activate", function() {
    u.getAllWindows().length === 0 && h();
  });
});
n.on("will-quit", () => {
  s && (console.log("Killing backend process..."), s.kill(), s = null);
});
n.on("window-all-closed", () => {
  process.platform !== "darwin" && n.quit();
});

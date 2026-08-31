const SPRITES = {
  idle: [
    "      .----.      ",
    "     / o  o \\     ",
    "     |  __  |     ",
    "      '--+-'      ",
    "     .---+---.    ",
    "     |  BOI  |    ",
    "     '-------'    ",
    "       |  |       ",
    "      /    \\      ",
  ],
  blink: [
    "      .----.      ",
    "     / -  - \\     ",
    "     |  __  |     ",
    "      '--+-'      ",
    "     .---+---.    ",
    "     |  BOI  |    ",
    "     '-------'    ",
    "       |  |       ",
    "      /    \\      ",
  ],
  happy: [
    "      .----.      ",
    "     / ^  ^ \\     ",
    "     |  \\/  |     ",
    "      '--+-'      ",
    "     .---+---.    ",
    "     |  BOI  |    ",
    "     '-------'    ",
    "       |  |       ",
    "      /    \\      ",
  ],
  wave: [
    "      .----.   *  ",
    "     / o  o \\ /   ",
    "     |  __  |<    ",
    "      '--+-'      ",
    "     .---+---.    ",
    "     |  BOI  |    ",
    "     '-------'    ",
    "       |  |       ",
    "      /    \\      ",
  ],
  dance: [
    "     \\\\ .----. // ",
    "       / ^  ^ \\   ",
    "       |  \\/  |   ",
    "        '--+-'    ",
    "       .---+---.  ",
    "       |  BOI  |  ",
    "       '-------'  ",
    "        /    \\    ",
    "       *      *   ",
  ],
  sleep: [
    "                   z",
    "      .----.     z  ",
    "     / -  - \\       ",
    "     |  __  |       ",
    "      '--+-'        ",
    "     .---+---.      ",
    "     |  nap  |      ",
    "     '-------'      ",
    "       |  |         ",
  ],
};

const LINES = {
  hello: [
    "i used to live in a directory listing.",
    "then someone put me on the true internet.",
    "if you can read this, packets found me.",
  ],
  poke: [
    "hey!! careful, i'm publicly routed.",
    "boop acknowledged.",
    "that tickled a tcp window.",
    "status: still here. still a boi.",
  ],
  pet: [
    "purr but in ascii",
    "ok that's nice keep going",
    "morale buffer overflow (affection)",
  ],
  dance: [
    "INITIATING WIGGLE PROTOCOL",
    "dancing on a public cdn edge somewhere",
    "the internet is a dance floor now",
  ],
  sleep: ["entering idle... do not unplug the internet"],
  wake: ["i'm up. did anyone visit?"],
  internet: [
    "this is not localhost.",
    "this is a url with a passport.",
    "hello from a globally reachable document.",
  ],
};

const boot = document.getElementById("boot");
const bootLog = document.getElementById("boot-log");
const habitat = document.getElementById("habitat");
const spriteEl = document.getElementById("sprite");
const speechEl = document.getElementById("speech");
const live = document.querySelector(".live");
const liveLabel = document.getElementById("live-label");
const publicUrl = document.getElementById("public-url");
const moodEl = document.getElementById("mood");
const uptimeEl = document.getElementById("uptime");
const petsEl = document.getElementById("pets");
const term = document.getElementById("term");
const termLog = document.getElementById("term-log");
const cmd = document.getElementById("cmd");
const boiHit = document.getElementById("boi-hit");
const shareBtn = document.getElementById("share");
const sky = document.getElementById("sky");

const started = Date.now();
let pose = "idle";
let walk = 0;
let walkDir = 1;
let pets = Number(localStorage.getItem("asciiboi-pets") || 0);
let sleeping = false;
let reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

petsEl.textContent = String(pets);

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function draw(name) {
  pose = name;
  spriteEl.textContent = (SPRITES[name] || SPRITES.idle).join("\n");
}

function say(text) {
  speechEl.textContent = text;
}

function setMood(text) {
  moodEl.textContent = text;
}

function isPublic() {
  const host = location.hostname;
  return host !== "localhost" && host !== "127.0.0.1" && host !== "";
}

function hostLabel() {
  if (isPublic()) return location.host;
  return "localhost (still private)";
}

function logLine(kind, text) {
  const p = document.createElement("p");
  p.className = kind;
  p.textContent = text;
  termLog.appendChild(p);
  termLog.scrollTop = termLog.scrollHeight;
}

async function bootSequence() {
  const lines = [
    "ASCIIBOI BIOS 1.0",
    "checking habitat… ok",
    "requesting a public address…",
    `host: ${hostLabel()}`,
    `scheme: ${location.protocol.replace(":", "")}`,
    "binding ports to the true internet…",
    "creature process: running",
    "",
  ];
  let skipped = false;
  const skip = () => { skipped = true; };
  window.addEventListener("keydown", skip, { once: true });
  window.addEventListener("pointerdown", skip, { once: true });

  for (const line of lines) {
    if (skipped) break;
    bootLog.textContent += line + "\n";
    await new Promise((r) => setTimeout(r, reduced ? 0 : 220));
  }
  boot.hidden = true;
  habitat.hidden = false;
  cmd.focus();
}

function tickUptime() {
  const s = Math.floor((Date.now() - started) / 1000);
  const hh = String(Math.floor(s / 3600)).padStart(2, "0");
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  uptimeEl.textContent = `${hh}:${mm}:${ss}`;
}

function wander() {
  if (reduced || sleeping) return;
  walk += walkDir * (8 + Math.random() * 10);
  if (walk > 90) walkDir = -1;
  if (walk < -90) walkDir = 1;
  spriteEl.style.setProperty("--walk", `${walk}px`);
  if (pose === "idle" && Math.random() < 0.2) {
    draw("blink");
    setTimeout(() => { if (!sleeping) draw("idle"); }, 180);
  }
}

function poke() {
  if (sleeping) {
    sleeping = false;
    draw("happy");
    say(pick(LINES.wake));
    setMood("just woke up");
    return;
  }
  draw("wave");
  say(pick(LINES.poke));
  setMood("booped");
  setTimeout(() => { if (!sleeping) draw("idle"); }, 700);
}

function petBoi() {
  pets += 1;
  localStorage.setItem("asciiboi-pets", String(pets));
  petsEl.textContent = String(pets);
  draw("happy");
  say(pick(LINES.pet));
  setMood("loved");
  setTimeout(() => { if (!sleeping) draw("idle"); }, 800);
}

function dance() {
  sleeping = false;
  draw("dance");
  say(pick(LINES.dance));
  setMood("dancing on the internet");
  setTimeout(() => { if (!sleeping) draw("happy"); }, 1400);
}

function nap() {
  sleeping = true;
  draw("sleep");
  say(pick(LINES.sleep));
  setMood("asleep, still public");
}

const commands = {
  help() {
    logLine("boi", "commands: help, pet, dance, poke, say <words>, status, ping, whoami, internet, sleep, wake, clear");
  },
  pet: petBoi,
  dance,
  poke,
  boop: poke,
  sleep: nap,
  nap,
  wake() {
    sleeping = false;
    draw("idle");
    say(pick(LINES.wake));
    setMood("awake");
  },
  status() {
    logLine("boi", `live=${isPublic()} host=${hostLabel()} pets=${pets} mood=${moodEl.textContent}`);
  },
  ping() {
    logLine("sys", "64 bytes from asciiboi: icmp_seq=1 ttl=64 time=too-fast-to-measure");
    logLine("boi", "pong. i am reachable.");
  },
  whoami() {
    logLine("boi", "asciiboi — small public creature. formerly a file.");
  },
  internet() {
    logLine("boi", pick(LINES.internet));
    say(pick(LINES.internet));
    setMood("existentially online");
  },
  about() {
    commands.whoami();
    commands.internet();
  },
  clear() {
    termLog.replaceChildren();
  },
};

term.addEventListener("submit", (event) => {
  event.preventDefault();
  const raw = cmd.value.trim();
  cmd.value = "";
  if (!raw) return;
  logLine("me", `you@internet:~$ ${raw}`);
  const [name, ...rest] = raw.split(/\s+/);
  const arg = rest.join(" ");
  if (name === "say") {
    const text = arg || "…";
    draw("wave");
    say(text);
    logLine("boi", text);
    setMood("speaking");
    return;
  }
  if (raw.toLowerCase().includes("true internet")) {
    dance();
    logLine("boi", "YES. this is the stuff. globally routed, baby.");
    return;
  }
  const fn = commands[name.toLowerCase()];
  if (fn) fn();
  else logLine("sys", `command not found: ${name}. try help`);
});

boiHit.addEventListener("click", poke);

shareBtn.addEventListener("click", async () => {
  const url = location.href;
  try {
    await navigator.clipboard.writeText(url);
    shareBtn.textContent = "copied";
    setTimeout(() => { shareBtn.textContent = "copy public url"; }, 1400);
  } catch {
    shareBtn.textContent = url;
  }
});

function stampNetwork() {
  publicUrl.textContent = location.href;
  if (isPublic()) {
    live.classList.add("public");
    liveLabel.textContent = "live on the internet";
    sky.textContent = "the true internet · " + location.host;
  } else {
    live.classList.add("local");
    liveLabel.textContent = "local preview";
    sky.textContent = "private loopback · deploy me to get a real url";
  }
}

function fireflies() {
  const canvas = document.getElementById("fireflies");
  const ctx = canvas.getContext("2d");
  if (!ctx || reduced) return;
  const dots = Array.from({ length: 28 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: 0.6 + Math.random() * 1.4,
    s: 0.15 + Math.random() * 0.35,
    a: Math.random(),
  }));
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);
  function frame(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const d of dots) {
      d.y -= d.s / 1000;
      if (d.y < -0.02) d.y = 1.02;
      const alpha = 0.12 + Math.abs(Math.sin((t / 900) + d.a * 8)) * 0.35;
      ctx.fillStyle = `rgba(231, 255, 115, ${alpha})`;
      ctx.beginPath();
      ctx.arc(d.x * canvas.width, d.y * canvas.height, d.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

draw("idle");
stampNetwork();
petsEl.textContent = String(pets);
logLine("sys", "asciiboi habitat online. type help.");
logLine("boi", pick(LINES.hello));
say(pick(LINES.hello));
setMood(isPublic() ? "publicly alive" : "waiting for a real url");
tickUptime();
setInterval(tickUptime, 1000);
setInterval(wander, 2400);
fireflies();
bootSequence();

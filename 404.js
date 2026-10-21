(function () {
  "use strict";

  // The 404 page: an auditor mascot that can't find the requested page in the books.
  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (e) { return null; }
  }
  var theme = store("bz.theme");
  if (theme === "light" || theme === "dark") document.documentElement.setAttribute("data-theme", theme);

  var T = {
    bn: {
      stamp: "পাওয়া যায়নি", stampSub: "NOT FOUND", title: "এই পাতাটি আমাদের হিসাবের খাতায় নেই",
      lede: "লিংকটি পুরনো বা ভুল হতে পারে। চিন্তা নেই, বাকি সব হিসাব একদম ঠিক আছে।",
      slip: "অডিট স্লিপ", asked: "খোঁজা ঠিকানা", status: "অবস্থা", statusV: "খাতায় পাওয়া যায়নি", remark: "নিরীক্ষকের মন্তব্য",
      home: "হোম পেজে ফিরুন", services: "সেবাসমূহ দেখুন", contact: "আমাদের জানান", hint: "মাসকটে চাপ দিন, ও কিছু বলতে চায়।",
      digits: "৪০৪", langBtn: "EN", langLabel: "Switch to English",
      remarks: ["হিসাব মিলছে না।", "ডেবিট আছে, ক্রেডিট নেই।", "ভাউচার পাওয়া যায়নি।", "পুনরায় যাচাই প্রয়োজন।"],
      lines: [
        ["dizzy", "হিসাব মিলছে না! এই পাতাটা খাতার কোথাও নেই।"],
        ["wow", "আমি সব ফাইল খুঁজেছি… তিনবার!"],
        ["look-ur", "হয়তো পাতাটা ভ্যাট রিটার্ন জমা দিতে গেছে।"],
        ["laugh", "সুখবর: এই ভুলের জন্য কোনো ফি লাগবে না!"],
        ["blush", "লজ্জার কথা, ড্রয়ারটা খোলাই ছিল।"],
        ["sleep", "…খুঁজতে খুঁজতে ঘুম পেয়ে গেল।"],
        ["starstruck", "নিচের বোতামে চাপুন, আসল সেবাগুলো ওখানে!"]
      ]
    },
    en: {
      stamp: "NOT FOUND", stampSub: "পাওয়া যায়নি", title: "This page isn't in our ledger",
      lede: "The link may be old or mistyped. Don't worry, the rest of the books are in perfect order.",
      slip: "Audit slip", asked: "Requested address", status: "Status", statusV: "Not found in the books", remark: "Auditor's remark",
      home: "Back to home", services: "See our services", contact: "Tell us", hint: "Tap the mascot, it has something to say.",
      digits: "404", langBtn: "বাং", langLabel: "বাংলায় দেখুন",
      remarks: ["The books don't balance.", "Debit found, credit missing.", "Voucher not found.", "Needs re-verification."],
      lines: [
        ["dizzy", "The books don't balance! This page isn't anywhere in the ledger."],
        ["wow", "I searched every file… three times!"],
        ["look-ur", "Maybe the page went out to file its VAT return."],
        ["laugh", "Good news: there's no fee for this mistake!"],
        ["blush", "Embarrassing. The drawer was open the whole time."],
        ["sleep", "…all this searching made me sleepy."],
        ["starstruck", "Tap a button below, the real services are there!"]
      ]
    }
  };

  var lang = store("bz.lang") === "en" ? "en" : "bn";
  var face = document.getElementById("nfFace");
  var bubble = document.getElementById("nfBubble");
  var mascot = document.getElementById("nfMascot");
  var line = 0, mood = true, moodTimer = null;
  var remark = Math.floor(Math.random() * 4);

  function src(name) { return "/assets/mascot/" + name + ".webp"; }
  ["dizzy", "wow", "look-ur", "laugh", "blush", "sleep", "starstruck", "look-c", "look-l", "look-r", "look-u", "look-d", "look-ul", "look-dl", "look-dr"]
    .forEach(function (n) { var i = new Image(); i.src = src(n); });

  function say(i) {
    var l = T[lang].lines[i];
    face.src = src(l[0]);
    bubble.textContent = l[1];
    bubble.classList.add("again");
    void bubble.offsetWidth;
    bubble.classList.remove("again");
    mood = true;
    clearTimeout(moodTimer);
    moodTimer = setTimeout(function () { mood = false; }, 2600);
  }

  function apply() {
    var t = T[lang];
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-t]").forEach(function (n) { n.textContent = t[n.getAttribute("data-t")]; });
    document.getElementById("nfDigits").textContent = t.digits;
    var btn = document.getElementById("nfLang");
    btn.textContent = t.langBtn;
    btn.setAttribute("aria-label", t.langLabel);
    document.getElementById("nfRemark").textContent = t.remarks[remark];
    say(line);
  }

  // What the visitor asked for, shown as plain text
  var path = location.pathname || "/";
  try { path = decodeURIComponent(location.pathname); } catch (e) { path = location.pathname; }
  document.getElementById("nfPath").textContent = path.length > 60 ? path.slice(0, 57) + "…" : path;
  var d = new Date();
  document.getElementById("nfRef").textContent = "REF 404-" + d.getFullYear() + String(d.getMonth() + 1).padStart(2, "0") + String(d.getDate()).padStart(2, "0");

  mascot.addEventListener("click", function () {
    line = (line + 1) % T[lang].lines.length;
    say(line);
  });
  document.getElementById("nfLang").addEventListener("click", function () {
    lang = lang === "bn" ? "en" : "bn";
    store("bz.lang", lang);
    apply();
  });

  // Between jokes, the mascot follows the pointer
  var pending = null;
  document.addEventListener("pointermove", function (e) {
    if (mood || pending || (e.pointerType && e.pointerType !== "mouse")) return;
    pending = requestAnimationFrame(function () {
      pending = null;
      var r = face.getBoundingClientRect();
      var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      var dist = Math.sqrt(dx * dx + dy * dy), name = "look-c";
      if (dist > r.width * 0.6) {
        var h = dx / dist, v = dy / dist;
        name = "look-" + (((v < -0.38 ? "u" : v > 0.38 ? "d" : "") + (h < -0.38 ? "l" : h > 0.38 ? "r" : "")) || "c");
      }
      face.src = src(name);
    });
  }, { passive: true });

  // The stamp lands with a little shake
  setTimeout(function () { document.querySelector(".nf-code").classList.add("shake"); }, 900);

  apply();
})();

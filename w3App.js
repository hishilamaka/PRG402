let people = [];

/******** ADD PEOPLE ********/
$("#addBtn").click(function () {
  let name = $("#name").val().trim();
  let amount = Number($("#amount").val());

  if (name === "" || amount <= 0) return;

  people.push({ name, amount });
  $("#peopleList").append(`<li>${name} paid Rs ${amount}</li>`);

  $("#name").val("");
  $("#amount").val("");
});

/******** CALCULATE SPLIT ********/
$("#calculateBtn").click(function () {
  if (people.length === 0) return;

  let total = people.reduce((sum, p) => sum + p.amount, 0);
  let share = total / people.length;

  let settlement = [];
  let owers = people.filter(p => p.amount < share);
  let receivers = people.filter(p => p.amount > share);

  let html = `<p>Total: Rs ${total}<br>Each should pay: Rs ${share.toFixed(2)}</p><hr>`;

  receivers.forEach(r => {
    let extra = r.amount - share;
    owers.forEach(o => {
      if (extra > 0 && share - o.amount > 0) {
        let pay = Math.min(extra, share - o.amount);
        settlement.push(`${o.name} ➜ Rs ${pay.toFixed(2)} ➜ ${r.name}`);
        extra -= pay;
        o.amount += pay;
      }
    });
  });

  html += settlement.length ? settlement.join("<br>") : "Everyone is settled.";
  $("#resultsBox").html(html);

  launchConfetti();
});

/******** SIDEBAR NAVIGATION ********/
function toggleMenu() {
  const nav = document.querySelector(".nav-links");
  nav.classList.toggle("show");
  document.getElementById("overlay").style.display = nav.classList.contains("show")
    ? "block"
    : "none";
}

/******** CONFETTI ANIMATION ********/
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
let confettiPieces = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

function launchConfetti() {
  confettiPieces = Array.from({ length: 120 }).map(() => ({
    x: Math.random() * canvas.width,
    y: -10,
    r: Math.random() * 6 + 4,
    d: Math.random() * 3 + 2
  }));
  animate();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confettiPieces.forEach(c => {
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, 2 * Math.PI);
    ctx.fillStyle = `hsl(${Math.random()*360}, 85%, 70%)`;
    ctx.fill();
    c.y += c.d;
  });
  requestAnimationFrame(animate);
}

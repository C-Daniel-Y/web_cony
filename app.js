const clock = document.querySelector("#clock");
function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  clock.textContent = hours + ":" + minutes;
  clock.dateTime = clock.textContent;
  clock.setAttribute("aria-label", "Hora local, " + clock.textContent);
  setTimeout(updateClock, 60000 - (now.getSeconds() * 1000 + now.getMilliseconds()));
}
updateClock();

const viewer = document.querySelector("#photo-viewer");
const frame = viewer.querySelector(".photo-tile");
for (const tile of document.querySelectorAll(".photos .photo-tile")) {
  tile.addEventListener("click", () => {
    const photo = tile.querySelector(".photo-screen");
    frame.className = tile.className;
    frame.replaceChildren(photo.cloneNode(true));
    viewer.querySelector("figcaption").textContent = tile.nextElementSibling.textContent;
    viewer.showModal();
  });
}
viewer.querySelector("button").addEventListener("click", () => viewer.close());
viewer.addEventListener("click", event => {
  if (event.target === viewer || frame.contains(event.target)) viewer.close();
});

const nav = document.querySelector("nav");
const panel = document.querySelector("#info");
const title = document.querySelector("#info-title");
const copy = document.querySelector("#copy");
const symbols = ["bag", "star", "mail"];
let active = null;

function showSection(index) {
  active = index;
  Array.from(nav.children).forEach((button, i) => {
    button.setAttribute("aria-expanded", String(i === index));
  });
  panel.hidden = index === null;
  if (panel.hidden) return;

  const section = sections[index];
  title.textContent = section.label;
  copy.replaceChildren(...section.paragraphs.map(text => {
    const p = document.createElement("p");
    p.textContent = text;
    return p;
  }));
  if (panel.getBoundingClientRect().top > innerHeight * .75) {
    panel.scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
}

sections.forEach((section, index) => {
  const button = document.createElement("button");
  button.setAttribute("aria-controls", "info");
  button.setAttribute("aria-expanded", "false");
  button.innerHTML = '<svg aria-hidden="true"><use href="#' + symbols[index] + '"/></svg>';
  button.append(section.label);
  button.onclick = () => showSection(active === index ? null : index);
  nav.append(button);
});

document.querySelector("#close").onclick = () => {
  const opener = nav.children[active];
  showSection(null);
  opener.focus();
};
const socialGrid = document.querySelector(".social-grid");
for (const [name, id, url] of [
  ["WhatsApp", "whatsapp", whatsappUrl],
  ["Instagram", "instagram", instagramUrl],
  ["Facebook", "facebook", facebookUrl]
]) {
  const tile = document.createElement(url ? "a" : "button");
  tile.id = id;
  tile.setAttribute("aria-label", name);
  tile.title = name;
  if (url) tile.href = url;
  else tile.disabled = true;
  tile.innerHTML = '<svg aria-hidden="true"><use href="#' + id + '-icon"/></svg>';
  socialGrid.append(tile);
}


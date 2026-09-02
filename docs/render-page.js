(function () {
  window.addEventListener("storage", function (event) {
    if (event.key === "hastings-page-content") location.reload();
  });
  var key = document.body.dataset.page;
  var saved;
  try { saved = JSON.parse(localStorage.getItem("hastings-page-content") || "null"); } catch (error) { saved = null; }
  var allPages = saved || window.HASTINGS_PAGES;
  var data = allPages && allPages[key];
  if (!data) return;
  var prefix = key === "00" ? "" : "../";
  var image = document.querySelector(".hero-image");
  var title = document.querySelector(".hero h1");
  var label = document.querySelector(".hero .label");
  var intro = document.querySelector(".intro");
  var values = document.querySelectorAll(".fact-value");
  image.src = /^(?:https?:|data:|\/)/.test(data.image) ? data.image : prefix + data.image;
  image.alt = "Artwork by " + data.name;
  title.textContent = data.name;
  label.textContent = data.label || "Competition winner";
  intro.textContent = data.description;
  if (values[0]) values[0].textContent = data.name;
  if (values[1]) values[1].textContent = data.age;
  if (values[2]) values[2].textContent = data.group;
  document.title = data.name + " | Hastings Heritage";
  var meta = document.querySelector('meta[name="description"]');
  if (meta) meta.content = data.description.replace(/\s+/g, " ").slice(0, 155);
})();

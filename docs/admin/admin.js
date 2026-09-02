(function () {
  var storageKey = "hastings-page-content";
  var base = window.HASTINGS_PAGES;
  var pages;
  try { pages = JSON.parse(localStorage.getItem(storageKey) || "null") || structuredClone(base); }
  catch (error) { pages = JSON.parse(JSON.stringify(base)); }

  var form = document.querySelector("#editor");
  var pageSelect = document.querySelector("#page");
  var status = document.querySelector("#status");
  var preview = document.querySelector("#preview");
  var livePreview = document.querySelector("#livePreview");
  var imagePreview = document.querySelector("#imagePreview");
  var fields = ["image", "name", "label", "description", "age", "group"];

  Object.keys(pages).sort().forEach(function (key) {
    var option = document.createElement("option");
    option.value = key;
    option.textContent = key === "00" ? "Original page — " + pages[key].name : "Artwork " + key + " — " + pages[key].name;
    pageSelect.appendChild(option);
  });

  var imageList = document.querySelector("#image");
  [
    "images/f1d51651-f0a1-45c9-a690-2cc3b39c4b28.png",
    "images/image004.png", "images/image005.png", "images/image006.png", "images/image007.png",
    "images/image008.png", "images/image009.png", "images/image010.png", "images/image011.png",
    "images/image012.png", "images/image013.png", "images/image014.png", "images/image015.png", "images/image016.png",
    "images/Kids club/image017.png", "images/Kids club/image018.png", "images/Kids club/image019.png", "images/Kids club/image020.png",
    "images/net-shops/hero.jpg", "images/net-shops/historic.jpg"
  ].forEach(function (path) {
    var option = document.createElement("option");
    option.value = path;
    option.textContent = path.replace("images/", "");
    imageList.appendChild(option);
  });

  function imageUrl(value) {
    return /^(?:https?:|data:|\/)/.test(value) ? value : "../" + value;
  }

  function loadPage() {
    var key = pageSelect.value;
    var data = pages[key];
    fields.forEach(function (field) { document.querySelector("#" + field).value = data[field] || ""; });
    imagePreview.src = imageUrl(data.image);
    preview.href = key === "00" ? "../" : "../artwork-" + key + "/";
    livePreview.src = preview.href;
    status.textContent = "";
  }

  pageSelect.addEventListener("change", loadPage);
  document.querySelector("#image").addEventListener("change", function (event) {
    imagePreview.src = imageUrl(event.target.value);
  });

  var previewTimer;
  form.addEventListener("input", function () {
    clearTimeout(previewTimer);
    previewTimer = setTimeout(function () {
      var key = pageSelect.value;
      fields.forEach(function (field) { pages[key][field] = document.querySelector("#" + field).value.trim(); });
      localStorage.setItem(storageKey, JSON.stringify(pages));
      imagePreview.src = imageUrl(pages[key].image);
      livePreview.src = preview.href + "?preview=" + Date.now();
    }, 300);
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var key = pageSelect.value;
    fields.forEach(function (field) { pages[key][field] = document.querySelector("#" + field).value.trim(); });
    localStorage.setItem(storageKey, JSON.stringify(pages));
    pageSelect.options[pageSelect.selectedIndex].textContent = key === "00" ? "Original page — " + pages[key].name : "Artwork " + key + " — " + pages[key].name;
    status.textContent = "Page " + key + " saved in this browser.";
  });

  document.querySelector("#download").addEventListener("click", function () {
    var source = "window.HASTINGS_PAGES = " + JSON.stringify(pages, null, 2).replace(/</g, "\\u003c") + ";\n";
    var url = URL.createObjectURL(new Blob([source], { type: "text/javascript" }));
    var link = document.createElement("a");
    link.href = url;
    link.download = "content.js";
    link.click();
    URL.revokeObjectURL(url);
    status.textContent = "content.js downloaded. Replace the existing file in docs to publish.";
  });

  document.querySelector("#reset").addEventListener("click", function () {
    if (!confirm("Discard all edits saved in this browser?")) return;
    localStorage.removeItem(storageKey);
    pages = JSON.parse(JSON.stringify(base));
    loadPage();
    status.textContent = "Browser edits discarded.";
  });

  loadPage();
})();

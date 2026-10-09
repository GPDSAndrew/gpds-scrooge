/* GPDS Research v2.2 — minimal catalogue renderer */
(function () {
  const root = document.getElementById("research-catalogue");
  const status = document.getElementById("catalogue-status");
  if (!root) return;
  function card(p) {
    const article = document.createElement("article");
    article.className = "card research-card";
    const kicker = document.createElement("p");
    kicker.className = "section-kicker";
    kicker.textContent = [p.type, p.published].filter(Boolean).join(" · ");
    article.appendChild(kicker);
    const title = document.createElement("h3");
    title.textContent = p.title;
    article.appendChild(title);
    if (p.subtitle) {
      const sub = document.createElement("p");
      sub.className = "research-subtitle"; sub.textContent = p.subtitle;
      article.appendChild(sub);
    }
    const desc = document.createElement("p");
    desc.textContent = p.summary;
    article.appendChild(desc);
    const links = document.createElement("div");
    links.className = "research-links";
    function add(label, url) {
      if (!url) return;
      const a = document.createElement("a");
      a.href = url; a.textContent = label;
      a.target = "_blank"; a.rel = "noopener noreferrer";
      links.appendChild(a);
    }
    add(p.doi ? "Open DOI / research record" : "Open research record", p.url);
    add("Read on Substack", p.substack);
    article.appendChild(links);
    if (p.doi) {
      const id = document.createElement("p");
      id.className = "meta research-doi"; id.textContent = "DOI: " + p.doi;
      article.appendChild(id);
    }
    return article;
  }
  fetch("/data/publications.json")
    .then(function (r) { if (!r.ok) throw new Error("catalogue unavailable"); return r.json(); })
    .then(function (data) {
      const publications = data.publications || [];
      const independent = publications.filter(function (p) { return p.collection === "Independent research"; });
      const scrooge = publications.filter(function (p) { return p.collection === "The Scrooge Dilemma"; });
      function section(label, entries) {
        const section = document.createElement("section");
        section.className = "research-group";
        const h2 = document.createElement("h2"); h2.textContent = label; section.appendChild(h2);
        const grid = document.createElement("div"); grid.className = "research-grid";
        entries.forEach(function (p) { grid.appendChild(card(p)); });
        section.appendChild(grid); root.appendChild(section);
      }
      section("Independent research", independent);
      section("The Scrooge Dilemma · paper sequence", scrooge);
      if (status) status.hidden = true;
    })
    .catch(function () {
      if (status) status.textContent = "The publication catalogue could not load. You can still access the featured papers using the links above.";
    });
})();

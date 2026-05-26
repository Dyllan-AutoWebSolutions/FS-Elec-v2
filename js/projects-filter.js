/* ============================================================
   FS Energy Projects — projects-filter.js
   Filter logic for the projects grid — used on homepage
   and the full projects gallery page
   ============================================================ */

(function () {
  const filters = document.querySelectorAll(".proj-filter");
  const items = document.querySelectorAll(".proj-item, .proj-page-item");

  if (!filters.length || !items.length) return;

  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filters.forEach(function (b) {
        b.classList.remove("active");
      });
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      items.forEach(function (item) {
        if (filter === "all" || item.dataset.cat === filter) {
          item.classList.remove("hidden");
        } else {
          item.classList.add("hidden");
        }
      });
    });
  });
})();

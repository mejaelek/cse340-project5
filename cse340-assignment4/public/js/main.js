/* ===================================================
   public/js/main.js — Global JavaScript
   =================================================== */

/* ── Auto-dismiss flash messages after 6s ──────── */
(function () {
    const zone = document.querySelector(".flash-zone");
    if (!zone) return;
    const items = zone.querySelectorAll("li, p, div[class]");
    if (items.length === 0) return;

    setTimeout(() => {
        zone.style.transition = "opacity .5s ease, transform .5s ease";
        zone.style.opacity = "0";
        zone.style.transform = "translateY(-8px)";
        setTimeout(() => zone.remove(), 500);
    }, 6000);
})();

/* ── Highlight active nav item ──────────────────── */
(function () {
    const links = document.querySelectorAll("#site-nav a");
    const path = window.location.pathname;
    links.forEach((link) => {
        if (link.getAttribute("href") === path) {
            link.style.color = "var(--color-accent)";
            link.style.borderBottomColor = "var(--color-accent)";
        }
    });
})(); 
// main.js

document.addEventListener("DOMContentLoaded", () => {
    const savedName = localStorage.getItem("userName");
    if (savedName) {
        const welcomeBanner = document.createElement("div");
        welcomeBanner.textContent = `Welcome back, ${savedName}!`;
        welcomeBanner.style.backgroundColor = "#2e8b57";
        welcomeBanner.style.color = "white";
        welcomeBanner.style.padding = "1rem";
        welcomeBanner.style.textAlign = "center";
        document.body.prepend(welcomeBanner);
    }
}); 
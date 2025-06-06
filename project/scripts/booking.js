// booking.js

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const trail = document.getElementById("trail").value;

        if (!name || !email || !trail) {
            alert("Please fill in all required fields.");
            return;
        }

        localStorage.setItem("userName", name);
        alert("Booking submitted successfully!");
        form.reset();
    });
});

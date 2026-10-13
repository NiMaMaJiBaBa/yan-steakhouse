const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const dateInput = document.querySelector("#date");
const reserveForm = document.querySelector("#reserve-form");
const toast = document.querySelector(".toast");
const menuButtons = document.querySelectorAll(".menu-tabs button");
const menuPanels = document.querySelectorAll(".menu-panel");
const faqButtons = document.querySelectorAll(".faq-item button");

navToggle?.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

function isMonday(dateValue) {
  return new Date(`${dateValue}T00:00:00`).getDay() === 1;
}

if (dateInput) {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  dateInput.min = `${yyyy}-${mm}-${dd}`;
  dateInput.addEventListener("change", () => {
    if (isMonday(dateInput.value)) {
      dateInput.setCustomValidity("週一公休，請改選其他日期。");
      dateInput.reportValidity();
      dateInput.value = "";
    } else {
      dateInput.setCustomValidity("");
    }
  });
}

reserveForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(reserveForm).entries());
  if (isMonday(data.date)) {
    dateInput.setCustomValidity("週一公休，請改選其他日期。");
    dateInput.reportValidity();
    return;
  }

  const bookings = JSON.parse(localStorage.getItem("yan-bookings") || "[]");
  bookings.push({ ...data, createdAt: new Date().toISOString() });
  localStorage.setItem("yan-bookings", JSON.stringify(bookings));

  reserveForm.reset();
  toast.textContent = `已為 ${data.name} 預約 ${data.date} ${data.time}，共 ${data.guests} 位。我們會再以電話確認。`;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 5200);
});

menuButtons.forEach((button) => {
  button.addEventListener("click", () => {
    menuButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const target = button.dataset.menu;
    menuPanels.forEach((panel) => {
      panel.hidden = panel.id !== target;
    });
  });
});

faqButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.parentElement;
    const open = item.classList.contains("open");
    document.querySelectorAll(".faq-item").forEach((faq) => {
      faq.classList.remove("open");
      faq.querySelector("p").hidden = true;
    });
    if (!open) {
      item.classList.add("open");
      item.querySelector("p").hidden = false;
    }
  });
});

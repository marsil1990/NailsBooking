const humber = document.querySelector(".humber");
const menu = document.querySelector(".menu");

humber.addEventListener("click", () => {
  humber.classList.toggle("active");
  menu.classList.toggle("active");
});

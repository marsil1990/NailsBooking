const form = document.getElementById("updateFormUser");
form.addEventListener("change", function () {
  const updateBtn = document.querySelector("#buttonEdit");
  updateBtn.removeAttribute("disabled");
});

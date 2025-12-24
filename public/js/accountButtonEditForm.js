const form = document.getElementById("acountEditForm");
form.addEventListener("change", function () {
  const updateBtn = document.querySelector("#accountEditButton");
  updateBtn.removeAttribute("disabled");
});

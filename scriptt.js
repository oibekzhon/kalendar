const cleanBtn   = document.getElementById("cclean");
const saveBtn    = document.getElementById("csave");
const commentInput = document.getElementById("comment");

const params = new URLSearchParams(window.location.search);
const date   = params.get("date") || "no-date";
    
const saved = localStorage.getItem("comment_" + date);
if (saved) {
    commentInput.value = saved;
}

saveBtn.addEventListener("click", () => {
    const text = commentInput.value.trim();
    localStorage.setItem("comment_" + date, text);
    alert("Saqlandi!");
});

cleanBtn.addEventListener("click", () => {
    commentInput.value = "";
    localStorage.removeItem("comment_" + date);
});
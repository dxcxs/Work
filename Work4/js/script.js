document.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
        document.body.style.backgroundColor = btn.textContent
    })
})
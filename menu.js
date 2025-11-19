let selectedLevel = null;

const levelButtons = document.querySelectorAll(".level-btn");
const startButton = document.getElementById("startGameBtn");

// EVENT: Klik tombol level
levelButtons.forEach(btn => {
    btn.addEventListener("click", () => {

        // Hilangkan status terpilih sebelumnya
        levelButtons.forEach(b => b.classList.remove("selected"));

        // Tambahkan kelas terpilih
        btn.classList.add("selected");

        // Simpan level terpilih
        selectedLevel = btn.dataset.level;

        // Aktifkan tombol Start Game
        startButton.disabled = false;
    });
});

// EVENT: Klik tombol Start Game
startButton.addEventListener("click", () => {
    if (selectedLevel) {
        window.location.href = "game.html?level=" + selectedLevel;
    }
});

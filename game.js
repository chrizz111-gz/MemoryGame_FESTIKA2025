const board = document.getElementById("gameBoard");

// ambil level dari URL
const params = new URLSearchParams(window.location.search);
const level = params.get("level");

// jumlah kartu per level
let totalCards =
    level === "easy" ? 16 :
    level === "medium" ? 24 :
    32;

// jumlah pasangan
const pairCount = totalCards / 2;

// buat daftar gambar = img1.png, img2.png, ...
let images = [];
for (let i = 1; i <= pairCount; i++) {
    images.push(`assets/img${i}.png`);
}

// duplikasi pasangan → jadi totalCards
let cards = [...images, ...images];

// acak Fisher-Yates
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
shuffle(cards);

// game state
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedCount = 0;
let moves = 0;

// TIMER
let seconds = 0;
let timerInterval = setInterval(() => {
    seconds++;
    document.getElementById("timer").textContent =
        new Date(seconds * 1000).toISOString().substr(14, 5);
}, 1000);

// tampilkan kartu
cards.forEach((imgSrc) => {
    const card = document.createElement("div");
    card.classList.add("card");

    // belakang kartu (tanda ?)
    const back = document.createElement("div");
    back.classList.add("card-back");
    back.textContent = "?";

    // depan kartu (gambar)
    const front = document.createElement("div");
    front.classList.add("card-content");
    front.style.backgroundImage = `url('${imgSrc}')`;

    card.appendChild(back);
    card.appendChild(front);

    card.addEventListener("click", () => flipCard(card, imgSrc));

    board.appendChild(card);
});

// fungsi buka kartu
function flipCard(card, imgSrc) {
    if (lockBoard || card.classList.contains("flipped")) return;

    card.classList.add("flipped");

    if (!firstCard) {
        firstCard = { card, imgSrc };
    } else {
        secondCard = { card, imgSrc };
        lockBoard = true;
        moves++;
        document.getElementById("moveCount").textContent = moves;

        if (firstCard.imgSrc === secondCard.imgSrc) {
            // cocok
            setTimeout(() => {
                firstCard.card.classList.add("matched");
                secondCard.card.classList.add("matched");

                matchedCount++;
                if (matchedCount === pairCount) {
                    setTimeout(showWinPopup, 400);
                }

                resetPick();
            }, 400);

        } else {
            // salah → tutup lagi
            setTimeout(() => {
                firstCard.card.classList.remove("flipped");
                secondCard.card.classList.remove("flipped");
                resetPick();
            }, 800);
        }
    }
}

function resetPick() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

// POPUP MENANG
function showWinPopup() {
    clearInterval(timerInterval);

    const time = document.getElementById("timer").textContent;

    const popup = document.createElement("div");
    popup.style.position = "fixed";
    popup.style.inset = "0";
    popup.style.background = "rgba(0,0,0,0.6)";
    popup.style.display = "flex";
    popup.style.justifyContent = "center";
    popup.style.alignItems = "center";
    popup.innerHTML = `
        <div style="
            background: white;
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            max-width: 300px;
        ">
            <h2>🎉 Kamu Menang!</h2>
            <p>Langkah: ${moves}</p>
            <p>Waktu: ${time}</p>
            <button onclick="location.href='index.html'" 
                style="padding:10px 20px;font-size:16px;border:none;border-radius:10px;background:#516B30;color:white;cursor:pointer;">
                Kembali ke Menu
            </button>
        </div>
    `;
    document.body.appendChild(popup);
}

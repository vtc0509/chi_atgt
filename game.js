const topics = [
  {
    id: "rules",
    name: "Quy tắc Giao thông",
    icon: "📋",
    questions: [
      {
        question:
          "Người tham gia giao thông phải đi bên nào theo chiều đi của mình?",
        answers: ["Đi bên phải", "Đi bên trái", "Đi ở giữa đường", "Tùy ý"],
        correct: 0,
      },
      {
        question: "Khi qua đường không có vạch kẻ, người đi bộ phải làm gì?",
        answers: [
          "Chạy nhanh qua",
          "Quan sát và nhường đường, chỉ qua khi an toàn",
          "Ưu tiên đi trước",
          "Không cần quan sát",
        ],
        correct: 1,
      },
    ],
  },
  {
    id: "signs",
    name: "Biển báo",
    icon: "🚸",
    questions: [
      {
        question:
          "Biển báo hình tròn, viền đỏ, nền trắng thuộc nhóm biển báo gì?",
        answers: [
          "Biển hiệu lệnh",
          "Biển nguy hiểm",
          "Biển cấm",
          "Biển chỉ dẫn",
        ],
        correct: 2,
      },
      {
        question:
          "Biển báo hình tam giác đều, viền đỏ, nền trắng là biển báo gì?",
        answers: ["Biển cấm", "Biển nguy hiểm", "Biển hiệu lệnh", "Biển phụ"],
        correct: 1,
      },
    ],
  },
  {
    id: "safety",
    name: "An toàn",
    icon: "🛡️",
    questions: [
      {
        question: "Người điều khiển xe đạp điện phải làm gì?",
        answers: [
          "Không cần mũ",
          "Đội mũ bảo hiểm và cài quai đúng quy cách",
          "Chỉ cần đội mũ",
          "Chỉ đội khi trời mưa",
        ],
        correct: 1,
      },
      {
        question: "Điều nào KHÔNG được phép khi đi xe đạp?",
        answers: [
          "Đi đúng làn đường",
          "Đội mũ bảo hiểm",
          "Sử dụng điện thoại",
          "Quan sát xung quanh",
        ],
        correct: 2,
      },
    ],
  },
  {
    id: "age",
    name: "Độ tuổi",
    icon: "👶",
    questions: [
      {
        question: "Người đủ bao nhiêu tuổi được lái xe gắn máy dưới 50cc?",
        answers: ["14 tuổi", "16 tuổi", "18 tuổi", "20 tuổi"],
        correct: 1,
      },
      {
        question: "Người đủ bao nhiêu tuổi được lái xe mô tô từ 50cc trở lên?",
        answers: ["16 tuổi", "17 tuổi", "18 tuổi", "20 tuổi"],
        correct: 2,
      },
    ],
  },
  {
    id: "priority",
    name: "Ưu tiên",
    icon: "🚑",
    questions: [
      {
        question:
          "Loại xe nào được quyền ưu tiên đi trước khi qua đường giao nhau?",
        answers: [
          "Xe buýt",
          "Xe máy",
          "Xe cứu thương đang cấp cứu",
          "Xe ô tô con",
        ],
        correct: 2,
      },
      {
        question:
          "Tại vạch kẻ đường cho người đi bộ, người điều khiển xe phải làm gì?",
        answers: [
          "Tăng tốc",
          "Bấm còi",
          "Giảm tốc và nhường đường",
          "Giữ nguyên tốc độ",
        ],
        correct: 2,
      },
    ],
  },
  {
    id: "water",
    name: "Đường thủy",
    icon: "⛵",
    questions: [
      {
        question:
          "Khi tham gia giao thông đường thủy, điều quan trọng nhất là gì?",
        answers: ["Biết bơi", "Luôn mặc áo phao", "Ngồi yên", "Cả ba đều đúng"],
        correct: 3,
      },
      {
        question: "Điều nào KHÔNG nên làm khi đi tàu thuyền?",
        answers: [
          "Mặc áo phao",
          "Ngồi ngay ngắn",
          "Đùa nghịch, chen lấn",
          "Nghe lời hướng dẫn",
        ],
        correct: 2,
      },
    ],
  },
];

let score = 0;
let lives = 3;
let obstaclesCleared = 0;
let currentObstacle = null;
let selectedTopic = null;
let usedTopics = [];
let ownedSkins = [];
let lastReward = null;
let isChoosingReward = false;
let obstacleApproachRAF = null;
let currentCharacterSprite = "images/nhan_vat_1.png";

// Danh sách sprite chướng ngại vật (các PNG đã được tách nền trong thư mục images)
// LƯU Ý: chỉ gồm các vật cản trên đường, KHÔNG gồm box/bbox/blindbox (dùng cho phần thưởng)
const obstacleSprites = [
  "images/barrier.png",
  "images/cong.png",
  "images/non_giao_thong.png",
  "images/vet_nut.png",
];

// Sprite cho các hộp blind box phần thưởng
const blindBoxSprites = [
  "images/blindbox.png",
  "images/blindbox.png",
  "images/blindbox.png",
];

const rewardPool = [
  {
    id: "skin-red",
    type: "skin",
    name: "Skin Xe Đỏ Năng Động",
    description: "Thay đổi màu xe đạp điện sang tông đỏ nổi bật.",
    apply() {
      setCharacterSkin("skin-red");
    },
  },
  {
    id: "skin-blue",
    type: "skin",
    name: "Skin Xanh An Toàn",
    description: "Trang phục xanh lam nhẹ nhàng, nổi bật trên đường phố.",
    apply() {
      setCharacterSkin("skin-blue");
    },
  },
  {
    id: "extra-score",
    type: "score",
    name: "+20 điểm thưởng",
    description: "Nhận ngay 20 điểm thưởng cho hành trình an toàn.",
    apply() {
      score += 20;
      updateUI();
    },
  },
  {
    id: "extra-life",
    type: "life",
    name: "+1 mạng",
    description: "Nhận thêm một mạng (tối đa 5 mạng).",
    apply() {
      if (lives < 5) {
        lives += 1;
        updateUI();
      }
    },
  },
];

function setCharacterSkin(skinId) {
  const character = document.getElementById("character");
  if (!character) return;

  // Xóa các class skin cũ
  character.classList.remove("skin-red", "skin-blue");

  // Thêm skin mới
  character.classList.add(skinId);

  if (!ownedSkins.includes(skinId)) {
    ownedSkins.push(skinId);
  }
}

function startGame() {
  // Hàm bắt đầu game thực sự, chỉ được gọi sau khi đã chọn nhân vật
  document.getElementById("startScreen").style.display = "none";

  // Áp dụng sprite nhân vật đã chọn cho nhân vật trong game
  const spriteEl = document.getElementById("characterSprite");
  if (spriteEl) {
    spriteEl.src = currentCharacterSprite;
  }

  spawnObstacle();
}

function spawnObstacle() {
  if (obstaclesCleared >= 5) {
    endGame(true);
    return;
  }

  // Random hình chướng ngại vật
  const sprite =
    obstacleSprites[Math.floor(Math.random() * obstacleSprites.length)];

  const obstacle = document.createElement("div");
  obstacle.className = "obstacle";
  obstacle.innerHTML = `
                <div class="obstacle-icon">
                  <img src="${sprite}" alt="Chướng ngại vật" />
                </div>
                <div class="obstacle-label">Chướng ngại vật</div>
            `;

  document.getElementById("gameWorld").appendChild(obstacle);
  currentObstacle = obstacle;

  watchObstacleApproach(obstacle);
}

function showTopicSelection() {
  // Get 3 random topics
  const availableTopics = topics.filter((t) => !usedTopics.includes(t.id));
  if (availableTopics.length === 0) {
    usedTopics = [];
  }

  const randomTopics = [];
  const tempTopics = [
    ...(availableTopics.length > 0 ? availableTopics : topics),
  ];

  for (let i = 0; i < 3 && tempTopics.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * tempTopics.length);
    randomTopics.push(tempTopics[randomIndex]);
    tempTopics.splice(randomIndex, 1);
  }

  const topicBoxes = document.getElementById("topicBoxes");
  topicBoxes.innerHTML = "";

  randomTopics.forEach((topic) => {
    const box = document.createElement("div");
    box.className = "topic-box";
    box.innerHTML = `
                    <div class="topic-icon">${topic.icon}</div>
                    <div class="topic-name">${topic.name}</div>
                `;
    box.addEventListener("click", () => {
      document
        .querySelectorAll(".topic-box")
        .forEach((b) => b.classList.remove("selected"));
      box.classList.add("selected");
      selectedTopic = topic;

      setTimeout(() => {
        document.getElementById("topicModal").classList.remove("show");
        showQuestion();
      }, 500);
    });
    topicBoxes.appendChild(box);
  });

  document.getElementById("topicModal").classList.add("show");
}

function showQuestion() {
  if (!selectedTopic) return;

  usedTopics.push(selectedTopic.id);

  const question =
    selectedTopic.questions[
      Math.floor(Math.random() * selectedTopic.questions.length)
    ];

  document.getElementById(
    "topicTitle"
  ).textContent = `${selectedTopic.icon} ${selectedTopic.name}`;
  document.getElementById("questionText").textContent = question.question;

  const answersContainer = document.getElementById("answersContainer");
  answersContainer.innerHTML = "";

  question.answers.forEach((answer, index) => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.textContent = `${String.fromCharCode(65 + index)}. ${answer}`;
    btn.addEventListener("click", () =>
      checkAnswer(index, question.correct, btn)
    );
    answersContainer.appendChild(btn);
  });

  document.getElementById("questionModal").classList.add("show");
}

function checkAnswer(selected, correct, btn) {
  const buttons = document.querySelectorAll(".answer-btn");
  buttons.forEach((b) => (b.style.pointerEvents = "none"));

  if (selected === correct) {
    btn.classList.add("correct");
    score += 10;
    obstaclesCleared++;

    setTimeout(() => {
      document.getElementById("questionModal").classList.remove("show");
      updateUI();
      // Hiệu ứng nhân vật vượt qua chướng ngại vật rồi mới hiện blind box
      passObstacleEffect(showRewardSelection);
    }, 1500);
  } else {
    btn.classList.add("wrong");
    buttons[correct].classList.add("correct");

    lives--;
    score -= 10;

    setTimeout(() => {
      // Hiệu ứng chướng ngại vật đụng trúng nhân vật
      if (currentObstacle) {
        currentObstacle.classList.add("collide");
      }

      setTimeout(() => {
        document.getElementById("questionModal").classList.remove("show");
        updateUI();
        showPenalty("Trả lời sai! -10 điểm, -1 mạng");

        if (lives <= 0) {
          if (currentObstacle) currentObstacle.remove();
          endGame(false);
        } else {
          if (currentObstacle) {
            passObstacleEffect(() => {
              if (obstaclesCleared < 5) {
                setTimeout(spawnObstacle, 1000);
              }
            });
          }
          buttons.forEach((b) => {
            b.style.pointerEvents = "auto";
            b.classList.remove("correct", "wrong");
          });
        }
      }, 1000); // Thời gian hiệu ứng đụng
    }, 2000);
  }
}

function showPenalty(message) {
  const penalty = document.getElementById("penaltyDisplay");
  penalty.textContent = message;
  penalty.style.display = "block";

  setTimeout(() => {
    penalty.style.display = "none";
  }, 2000);
}

function updateUI() {
  document.getElementById("score").textContent = score;
  document.getElementById("lives").textContent = lives;
  document.getElementById("obstacleCount").textContent = obstaclesCleared;
}

function endGame(won) {
  const gameWorld = document.getElementById("gameWorld");
  const endScreen = document.createElement("div");
  endScreen.className = "start-screen";
  endScreen.style.background = won
    ? "rgba(76, 175, 80, 0.95)"
    : "rgba(244, 67, 54, 0.95)";
  endScreen.style.color = "white";

  endScreen.innerHTML = `
                <h2>${
                  won ? "🎉 Chúc mừng! Bạn đã hoàn thành!" : "💔 Game Over!"
                }</h2>
                <p style="color: white;">
                    ${
                      won
                        ? "Bạn đã vượt qua tất cả chướng ngại vật!"
                        : "Bạn đã hết mạng!"
                    }
                    <br><br>
                    <strong>Điểm cuối cùng: ${score}</strong><br>
                    <strong>Chướng ngại vật vượt qua: ${obstaclesCleared}/5</strong>
                </p>
                <button class="btn-start" onclick="location.reload()">🔄 Chơi lại</button>
            `;

  gameWorld.appendChild(endScreen);
}

function resetCharacterPosition() {
  const character = document.getElementById("character");
  if (!character) return;
  character.style.transition = "none";
  character.style.left = "5%";
  // Force reflow để transition tiếp theo hoạt động mượt
  void character.offsetWidth;
  character.style.transition = "left 1.5s linear";
}

function passObstacleEffect(next) {
  const obstacle = currentObstacle;

  if (obstacle) {
    obstacle.classList.add("breaking");
  }

  setTimeout(() => {
    // Sau khi hiệu ứng vỡ kết thúc, bỏ chướng ngại vật
    if (currentObstacle === obstacle) {
      obstacle.remove();
      currentObstacle = null;
    }
    if (typeof next === "function") next();
  }, 600);
}

function watchObstacleApproach(obstacle) {
  const character = document.getElementById("character");
  if (!character || !obstacle) return;

  if (obstacleApproachRAF) {
    cancelAnimationFrame(obstacleApproachRAF);
    obstacleApproachRAF = null;
  }

  let triggered = false;

  const check = () => {
    if (triggered || lives <= 0 || !document.body.contains(obstacle)) return;

    const obRect = obstacle.getBoundingClientRect();
    const chRect = character.getBoundingClientRect();

    // Khi chướng ngại vật đến rất gần phía trước người đi đường
    if (obRect.left <= chRect.right + 30) {
      triggered = true;
      obstacle.classList.add("obstacle-question");
      showTopicSelection();
      return;
    }

    obstacleApproachRAF = requestAnimationFrame(check);
  };

  obstacleApproachRAF = requestAnimationFrame(check);
}

function showRewardSelection() {
  if (isChoosingReward) return;
  isChoosingReward = true;

  const rewardModal = document.getElementById("rewardModal");
  const blindBoxesContainer = document.getElementById("blindBoxes");
  const rewardResult = document.getElementById("rewardResult");

  blindBoxesContainer.innerHTML = "";
  rewardResult.textContent = "";

  // Tạo 3 blind box lựa chọn
  for (let i = 0; i < 3; i++) {
    const box = document.createElement("div");
    box.className = "blind-box";

    // Gắn hình blind box tương ứng (xoay vòng trong danh sách blindBoxSprites)
    const sprite = blindBoxSprites[i % blindBoxSprites.length];
    box.innerHTML = `<img src="${sprite}" alt="Blind box" />`;

    box.addEventListener("click", () => openBlindBox(box));
    blindBoxesContainer.appendChild(box);
  }

  rewardModal.classList.add("show");
}

function openBlindBox(selectedBox) {
  if (lastReward) return;

  const boxes = document.querySelectorAll(".blind-box");
  boxes.forEach((box) => {
    box.classList.add("disabled");
    box.style.pointerEvents = "none";
  });

  selectedBox.classList.remove("disabled");
  selectedBox.classList.add("opened");

  // Bốc ngẫu nhiên một phần thưởng từ pool
  const randomIndex = Math.floor(Math.random() * rewardPool.length);
  lastReward = rewardPool[randomIndex];

  if (lastReward && typeof lastReward.apply === "function") {
    lastReward.apply();
  }

  const rewardResult = document.getElementById("rewardResult");
  rewardResult.textContent = `${lastReward.name}: ${lastReward.description}`;
}

function continueAfterReward() {
  const rewardModal = document.getElementById("rewardModal");
  rewardModal.classList.remove("show");

  lastReward = null;
  isChoosingReward = false;

  if (obstaclesCleared >= 5) {
    endGame(true);
  } else {
    setTimeout(spawnObstacle, 1000);
  }
}

// Khởi tạo lựa chọn nhân vật ở màn hình bắt đầu
function initCharacterSelection() {
  const options = document.querySelectorAll(".character-option");
  const preview = document.getElementById("characterSprite");

  options.forEach((opt) => {
    opt.addEventListener("click", () => {
      options.forEach((o) => o.classList.remove("selected"));
      opt.classList.add("selected");

      const sprite = opt.getAttribute("data-sprite");
      if (sprite) {
        currentCharacterSprite = sprite;
        if (preview) preview.src = sprite;
      }
    });
  });
}

function openCharacterSelect() {
  const modal = document.getElementById("characterSelectModal");
  if (modal) {
    modal.classList.add("show");
  }
}

function confirmCharacterSelection() {
  const modal = document.getElementById("characterSelectModal");
  if (modal) {
    modal.classList.remove("show");
  }
  // Nếu người chơi không chọn gì, vẫn dùng nhân vật default (nhan_vat_1)
  startGame();
}

// Gọi sau khi DOM đã có (script được đặt cuối body)
initCharacterSelection();

// Mở cửa sổ Edit người chơi
function DisplayEdit() {
  // Lấy dữ liệu từ vòng quay (nếu có)
  const sectors = document.querySelectorAll("#inner-wheel .sec span");
  const players = [];
  sectors.forEach(function(span) {
      players.push(span.textContent.trim());
  });
  
  // Nếu có dữ liệu (không rỗng), mới cập nhật textarea
  if (players.length > 0) {
      const namesText = players.join("\n");
      document.querySelector(".edit-area").value = namesText;
  }
  
  // Hiển thị popup edit
  document.querySelector('.edit-popup').style.display = "flex";
}


// Đóng cửa sổ Edit người chơi
function CloseEdit() {
  document.querySelector('.edit-popup').style.display = 'none';
}

document.querySelector(".edit-popup").addEventListener("click", function(event) {
    // Kiểm tra nếu click ngoài box
    const box = document.querySelector(".box");
    if (!box.contains(event.target)) {
        this.style.display = "none";  // Ẩn box
    }
});

// Quay vòng quay
function RandomColor() {
    r = Math.floor(Math.random() * 255);
    g = Math.floor(Math.random() * 255);
    b = Math.floor(Math.random() * 255);
    return {r, g, b};
}

function ToRad(deg) {
  return deg * (Math.PI / 180);
}

function RandomRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function EaseOutSine(x) {
  return Math.sin((x * Math.PI) / 2);
}

// get percent between 2 number
function getPercent(input, min, max) {
  return (((input - min) * 100) / (max - min)) / 100;
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const width = document.getElementById("canvas").width;
const height = document.getElementById("canvas").height;

const centerX = width / 2;
const centerY = height / 2;
const radius = width / 2;

let items = document.getElementsByTagName("textarea")[0].value.split("\n");

let currentDeg = 0;
let step = 360 / items.length;
let colors = [];
for (let i = 0; i <items.length + 1; i++) {
  colors.push(RandomColor());
}

// Tạo vòng quay
let playersNames = "";
function CreateWheel() {
  // Lấy giá trị từ textarea có class .edit-area
  let playersNames = document.querySelector('.edit-area').value;
  
  // Tách từng dòng, loại bỏ khoảng trắng đầu/cuối và loại bỏ các dòng rỗng
  items = playersNames
    .split('\n')
    .map(name => name.trim())
    .filter(name => name !== '');
  
  // Tính góc cho từng sector dựa trên số lượng người chơi
  step = 360 / items.length;
  
  // Tạo mảng màu cho các sector
  colors = [];
  for (let i = 0; i < items.length + 1; i++) {
      colors.push(RandomColor());
  }
  
  // Vẽ vòng quay
  Draw();
  
  // Đóng bảng Edit sau khi tạo vòng quay
  CloseEdit();
}

Draw();

// Vẽ vòng quay
function Draw() {
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, ToRad(0), ToRad(360));
  ctx.fillStyle = `rgb(${33}, ${33}, ${33})`;
  ctx.lineTo(centerX, centerY);
  ctx.fill();

  let startDeg = currentDeg;
  for (let i = 0; i < items.length; i++, startDeg += step) {
      let endDeg = startDeg + step;

      const color = colors[i];
      let colorStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;

      ctx.beginPath();
      rad = ToRad(360 / step);
      ctx.arc(centerX, centerY, radius - 2, ToRad(startDeg), ToRad(endDeg));
      let colorStyle2 = `rgb(${color.r - 10}, ${color.g - 10}, ${color.b - 10})`;
      ctx.fillStyle = colorStyle2;
      ctx.lineTo(centerX, centerY);
      ctx.fill();

      ctx.beginPath();
      rad = ToRad(360 / step);
      ctx.arc(centerX, centerY, radius - 30, ToRad(startDeg), ToRad(endDeg));
      ctx.fillStyle = colorStyle;
      ctx.lineTo(centerX, centerY);
      ctx.fill();

      // Draw text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(ToRad((startDeg + endDeg) / 2));
      ctx.textAlign = "center";
      if (color.r > 150 || color.g > 150 || color.b > 150){
          ctx.fillStyle = "#000";
      } else {
          ctx.fillStyle = "#fff";
      }
      ctx.font = "20px Quicksand";
      ctx.fillText(items[i], 130 + 20, 10);
      ctx.restore();

      // Check winner
      if (startDeg % 360 && startDeg % 360 > 270 && endDeg % 360 > 0 && endDeg % 360 < 90) {
          document.getElementById("winner").innerHTML = items[i];
      }
  }

}

let speed = 0;
let maxRotation = RandomRange(360 * 5, 360 * 10);
let pause = false;
let announceShown = false; // đảm bảo chỉ hiện thông báo 1 lần sau khi dừng quay

function fadeOutAudio(audioElement, duration) {
  // duration: thời gian giảm âm lượng (ms)
  const fadeInterval = 50; // khoảng thời gian giữa các bước giảm
  const steps = duration / fadeInterval;
  const volumeStep = audioElement.volume / steps;

  const fadeAudio = setInterval(() => {
    if (audioElement.volume - volumeStep > 0) {
      audioElement.volume = Math.max(0, audioElement.volume - volumeStep);
    } else {
      audioElement.volume = 0;
      audioElement.pause();
      audioElement.currentTime = 0;
      clearInterval(fadeAudio);
    }
  }, fadeInterval);
}


function Animate() {
  const announceSound = document.getElementById("announce-sound");
  
  if (pause) {
    // Nếu vòng quay đã dừng và thông báo chưa được hiển thị, gọi hàm hiển thị thông báo
    if (!announceShown) {
      // const jsConfetti = new JSConfetti();
      const spinMusic = document.getElementById("spin-music");
      
      // jsConfetti.addConfetti();
      // announceSound.play();
      fadeOutAudio(spinMusic, 2000);
      // spinMusic.currentTime = 0;

      // Sau 2 giây, kích hoạt pháo giấy lần thứ hai
      setTimeout(() => {
        jsConfetti.addConfetti();
      }, 2000);

      showAnnounce();
      announceShown = true;
    }
    return;
  }
  // Tính tốc độ quay giảm dần theo hàm EaseOutSine
  speed = EaseOutSine(getPercent(currentDeg, maxRotation, 0)) * 20;
  if (speed < 0.01) {
    speed = 0;
    pause = true;
  }
  currentDeg += speed;
  Draw();
  window.requestAnimationFrame(Animate);
}

function Spin() {
  // Reset trạng thái thông báo
  const spinMusic = document.getElementById("spin-music");
  const spinSound = document.getElementById("spin-sound");

  announceShown = false;
  document.querySelector('.announce-container').style.display = 'none';
  
  spinMusic.play();
  spinMusic.volume = 1;
  spinSound.play();

  if (speed != 0) {
      return
  }
  currentDeg = 0;
  maxRotation = RandomRange(360 * 5, 360 * 10);
  pause = false;
  window.requestAnimationFrame(Animate);
}

// Show announce winner
function showAnnounce() {
  const winnerName = document.getElementById("winner").textContent;
  
  document.querySelector(".announce-content-winner").textContent = winnerName;
  document.querySelector(".announce-container").style.display = "flex";
}

// Close announce winner
function CloseAnnounceWinner() {
  document.querySelector('.announce-container').style.display = 'none';
  
}

// Kiểm tra nếu click ngoài announce-container
document.querySelector(".announce-container").addEventListener("click", function(event) {
    const leaderboard = document.querySelector(".announce-popup");
    if (!leaderboard.contains(event.target)) {
        this.style.display = "none";
    }
});

// Mở cửa sổ Edit người chơi
function DisplayEdit() {
    // Lấy danh sách tất cả các phần tử <span> chứa tên trong #inner-wheel
    const sectors = document.querySelectorAll("#inner-wheel .sec span");
    const players = [];
  
    sectors.forEach(function(span) {
      players.push(span.textContent.trim());
    });
  
    // Nối tên các người chơi, mỗi tên một dòng
    const namesText = players.join("\n");
  
    // Đưa chuỗi tên vào textarea
    const editArea = document.querySelector(".edit-area");
    editArea.value = namesText;
  
    // Hiển thị popup chỉnh sửa (giả sử bạn dùng display: flex để hiển thị)
    document.querySelector(".edit-popup").style.display = "flex";
}  

// Đóng cửa sổ Edit người chơi
function CloseEdit() {
    const editPopup = document.querySelector(".edit-popup");
    editPopup.style.display = "none";
}

document.querySelector(".edit-popup").addEventListener("click", function(event) {
    // Kiểm tra nếu click ngoài box
    const box = document.querySelector(".box");
    if (!box.contains(event.target)) {
        this.style.display = "none";  // Ẩn box
    }
});

function UpdateNames() {
    // Lấy danh sách tên từ textarea, tách theo dòng, loại bỏ khoảng trắng thừa và dòng rỗng
    const editArea = document.querySelector('.edit-area');
    const names = editArea.value.split('\n').map(name => name.trim()).filter(name => name !== '');
    const total = names.length;
  
    // Lấy phần tử chứa các sector
    const innerWheel = document.getElementById('inner-wheel');
  
    // Kích thước của vòng quay (giá trị này phải trùng với CSS của #wheel)
    const wheelSize = 550; // ví dụ: 550px x 550px
    const r = wheelSize / 2; // bán kính của vòng quay, ở đây là 275px
    const center = r; // tâm vòng quay: (275, 275)
  
    // Tính góc của mỗi sector (đơn vị: độ)
    const sectorAngle = 360 / total;
  
    // Để tạo sector bằng CSS border, ta vẽ một tam giác có đỉnh tại tâm vòng quay
    // Ta đặt chiều cao của tam giác (h) bằng bán kính, và chiều rộng (w) bằng: r * tan(theta/2)
    const theta = sectorAngle * Math.PI / 180; // chuyển đổi sectorAngle sang radian
    const h = r; // chiều cao của tam giác
    const w = r * Math.tan(theta / 2); // chiều rộng tương ứng
  
    // Tính vị trí left và top để đảm bảo điểm xoay (transform-origin) của sector trùng với tâm vòng quay
    // Với mỗi sector, ta muốn: left + w = center và top + h = center
    const leftPos = center - w;
    const topPos = center - h;
  
    // Mảng màu cho các sector (nếu số người chơi vượt quá số phần tử, dùng vòng lặp màu)
    const sectorColors = ["#16a085", "#2980b9", "#34495e", "#f39c12", "#d35400", "#c0392b", "#8e44ad", "#2ecc71"];
    // Mảng icon (nếu bạn muốn luân phiên các icon cho từng sector)
    const iconClasses = ["fa-bell-o", "fa-comment-o", "fa-smile-o", "fa-heart-o", "fa-star-o", "fa-lightbulb-o"];
  
    let sectorsHTML = '';
  
    // Duyệt qua từng tên để tạo sector
    for (let i = 0; i < total; i++) {
      // Tính góc xoay của sector thứ i
      const angle = sectorAngle * i;
      // Lấy màu và icon theo thứ tự (nếu có)
      const color = sectorColors[i % sectorColors.length];
      const iconClass = "fa " + iconClasses[i % iconClasses.length];
  
      // Tạo HTML cho mỗi sector với các giá trị được tính toán
      sectorsHTML += `<div class="sec" style="
        transform: rotate(${angle}deg);
        border-width: ${h}px ${w}px 0;
        transform-origin: ${w}px ${h}px;
        left: ${leftPos}px;
        top: ${topPos}px;
        border-color: ${color} transparent;
      ">
        <span class="${iconClass}">${names[i]}</span>
      </div>`;
    }
  
    // Cập nhật nội dung của inner-wheel với các sector mới
    innerWheel.innerHTML = sectorsHTML;
  
    // Ẩn hộp popup chỉnh sửa sau khi cập nhật
    document.querySelector('.edit-popup').style.display = 'none';
}

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

function CreateWheel() {
  items = document.getElementsByTagName("textarea")[0].value.split("\n");
  step = 360 / items.length;
  colors = [];
  for (let i = 0; i < items.length + 1; i++) {
      colors.push(RandomColor());
  }
  Draw();
}

Draw();

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
      ctx.textAlign = "left";
      if (color.r > 150 || color.g > 150 || color.b > 150){
          ctx.fillStyle = "#000";
      } else {
          ctx.fillStyle = "#fff";
      }
      ctx.font = "20px Quicksand";
      ctx.fillText(items[i], 130, 10);
      ctx.restore();

      // Check winner
      if (startDeg % 360 && startDeg % 360 > 270 && endDeg % 360 > 0 && endDeg % 360 < 90) {
          document.getElementById("winner").innerHTML = items[i];
      }
  }

}

let speed = 0;
let maxRotation = RandomRange(360 * 3, 360 * 6);
let pause = false;
let announceShown = false; // đảm bảo chỉ hiện thông báo 1 lần sau khi dừng quay

function Animate() {
  if (pause) {
    // Nếu vòng quay đã dừng và thông báo chưa được hiển thị, gọi hàm hiển thị thông báo
    if (!announceShown) {
      const jsConfetti = new JSConfetti();
      jsConfetti.addConfetti();

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
  announceShown = false;
  document.querySelector('.announce-container').style.display = 'none';

  if (speed != 0) {
      return
  }
  currentDeg = 0;
  maxRotation = RandomRange(360 * 3, 360 * 6);
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

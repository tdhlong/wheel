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

function UpdateNamesAndScores() {
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
// Biến lưu trữ góc quay tích lũy (đã có từ trước)
let currentRotation = 0;

// Hàm quay vòng quay ngẫu nhiên
function spinWheel() {
  // Tạo góc quay ngẫu nhiên từ 0 đến 360 cộng thêm 720 để đảm bảo quay đủ nhiều vòng
  const randomAngle = Math.floor(Math.random() * 360) + 3600;
  
  // Cộng dồn góc quay
  currentRotation += randomAngle;
  
  // Áp dụng chuyển động quay
  document.getElementById('inner-wheel').style.transform = `rotate(${currentRotation}deg)`;
}

// Hàm thông báo người chiến thắng
function announceWinner() {
    const sectors = document.querySelectorAll('#inner-wheel .sec');
    const total = sectors.length;
    
    // Lấy góc quay cuối cùng (trong khoảng 0-360)
    const degrees = currentRotation % 360;
    // Giả sử vị trí trúng là ở phía trên (0°)
    const winningAngle = (360 - degrees) % 360;
    
    // Mỗi sector có góc bằng 360 / total
    const sectorAngle = 360 / total;
    
    // Nếu sử dụng mặc định 6 người chơi, có thể cần điều chỉnh offset (ví dụ, 30°)
    let offsetAdjustment = 0;
    if (total === 6) {
      offsetAdjustment = 30; // điều chỉnh này tùy thuộc vào cách bố trí của sector mặc định
    }
    
    // Tính index của sector trúng, cộng thêm offset để lấy trung tâm của sector
    const winningIndex = Math.floor(((winningAngle - offsetAdjustment) + sectorAngle / 2) / sectorAngle) % total;
    
    const winningName = sectors[winningIndex].querySelector('span').textContent.trim();
    
    alert("Chúc mừng, người được chọn là: " + winningName);
}

// Gắn sự kiện click cho nút "Quay"
document.querySelector('.luckywheel-btn').addEventListener('click', spinWheel);

// Sau khi vòng quay kết thúc (transition kết thúc), gọi announceWinner
document.getElementById('inner-wheel').addEventListener('transitionend', announceWinner);

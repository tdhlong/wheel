// Xoay vòng quay
var degree = 1800;
var clicks = 0;

$(document).ready(function() {
  $('#spin').click(function() {
    
    clicks ++;
    var newDegree = degree * clicks;
    var extraDegree = Math.floor(Math.random() * (360 - 1 + 1)) + 1;
    totalDegree = newDegree + extraDegree;
    
    $('#wheel .sec').each(function() {
      var t = $(this);
      var noY = 0;
      
      var c = 0;
      var n = 700;
      var interval =  setInterval(function () {
        c++;
        if (c === n) {
          clearInterval(interval);
        }
        
        var aoY = t.offset().top;
        $('#txt').html(aoY);
        
        if(aoY < 23.89) {
          $('#spin').addClass('spin');
          setTimeout(function () {
            $("#spin").removeClass('spin');
          }, 100);
        }
      }, 10);
      
      $('#inner-wheel').css({'transform' : 'rotate(' + totalDegree + 'deg)'});
      
      noY = t.offset().top;
    });
  });
});

// Mở cửa sổ Edit người chơi
function DisplayEdit() {
    const placeholderLine = "Nhập tên người chơi";
    const editPopup = document.querySelector(".edit-popup");
    const editArea = document.querySelector(".edit-area");
    editPopup.style.display = "flex";

    // Lấy danh sách tên và điểm của người chơi, hiển thị trong textarea
    const players = document.querySelectorAll(".person"); // Lấy tất cả các phần tử người chơi
    const namesAndScores = Array.from(players).map(player => {
        const name = player.querySelector(".nickname").textContent.trim(); // Lấy tên
        const score = player.querySelector(".score").textContent.trim(); // Lấy điểm
        return `${name}: ${score}`; // Ghép tên và điểm cách nhau bởi khoảng trắng
    }).join("\n"); // Ghép tất cả các dòng lại với dấu ngắt dòng

    editArea.value = namesAndScores;
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

// Cập nhật tên và điểm của người chơi từ textarea khi nhấn OK
function UpdateNamesAndScores() {
    const editArea = document.querySelector(".edit-area");
    // Tách từng dòng và loại bỏ dòng trống
    const newEntries = editArea.value.split("\n").filter(line => line.trim() !== "");
    const playerListElement = document.querySelector(".person-list");

    // Xóa sạch danh sách hiện tại
    playerListElement.innerHTML = "";

    newEntries.forEach(entry => {
        let formattedEntry = entry.trim();
        // Nếu không có dấu ":" trong chuỗi, thêm vào ": 0"
        if (!formattedEntry.includes(":")) {
            formattedEntry = formattedEntry + ": 0";
        }
        const parts = formattedEntry.split(":");
        if (parts.length >= 2) {
            const name = parts[0].trim();
            const scoreStr = parts.slice(1).join(":").trim();
            const score = parseInt(scoreStr) || 0;
            
            // Kiểm tra xem trong mảng players có người chơi với tên này chưa
            const existingPlayer = players.find(p => p.nickname === name);
            const avatar = existingPlayer ? existingPlayer.avatar : defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];
            
            // Nếu người chơi chưa tồn tại, tạo mới và thêm vào mảng players
            if (!existingPlayer) {
                players.push({
                    avatar: avatar,
                    nickname: name,
                    score: score
                });
            } else {
                // Nếu đã tồn tại, cập nhật điểm (và avatar nếu cần, nhưng avatar đã được giữ lại)
                existingPlayer.score = score;
            }
            
            // Tạo đối tượng người chơi mới dựa trên dữ liệu trong mảng players (dùng dữ liệu mới nhất)
            const playerData = players.find(p => p.nickname === name);
            const playerItem = createPlayerItem(playerData);
            playerListElement.appendChild(playerItem);
        }
    });

    CloseEdit(); // Đóng cửa sổ edit
    sortPlayers(); // Sắp xếp lại nếu cần
}

// Endgame
function EndGame() {
    const endPopup = document.querySelector(".end-popup");
    const celebrateSound = document.getElementById("celebrate-sound");
    const jsConfetti = new JSConfetti();

    endPopup.style.display = "flex";
    jsConfetti.addConfetti();

    // Sau 2 giây, kích hoạt pháo giấy lần thứ hai
    setTimeout(() => {
        jsConfetti.addConfetti();
    }, 2000);
    
    // Phát âm thanh
    celebrateSound.play();

    // Dừng âm thanh sau 4 giây
    setTimeout(() => {
        celebrateSound.pause(); // Dừng âm thanh
        celebrateSound.currentTime = 0; // Đặt lại thời gian phát về 0
    }, 4000);

    setTimeout(() => {
        endPopup.style.backgroundImage = "none";
    }, 7500);

    updateLeaderboardImages();
}

document.querySelector(".end-popup").addEventListener("click", function(event) {
    // Kiểm tra nếu click ngoài leaderboard
    const leaderboard = document.querySelector(".leaderboard");
    if (!leaderboard.contains(event.target)) {
        this.style.display = "none"; // Ẩn end-popup
    }
});

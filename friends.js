import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyB3z-AB7b70rJlPfE3n3QjSjPtKEZv8HS4",
  authDomain: "codequest-db-2d2bf.firebaseapp.com",
  databaseURL: "https://codequest-db-2d2bf-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "codequest-db-2d2bf",
  storageBucket: "codequest-db-2d2bf.firebasestorage.app",
  messagingSenderId: "333551784075",
  appId: "1:333551784075:web:933dea04a85e887d7e848e",
  measurementId: "G-6LQ7TXW8TK"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ID User dari localStorage atau default
const currentUserId = localStorage.getItem("cq_user_id") || "CQ-USER1";
document.getElementById("my-id-display").textContent = currentUserId;

// Registrasi user awal ke DB
const userRef = ref(db, `users/${currentUserId}`);
get(userRef).then((snapshot) => {
  if (!snapshot.exists()) {
    set(userRef, {
      username: currentUserId,
      xp: 100,
      level: 1
    });
  }
});

const friendInput = document.getElementById("friend-id-input");
const btnAdd = document.getElementById("btn-add-friend");
const statusMsg = document.getElementById("status-msg");
const pendingList = document.getElementById("pending-list");
const friendsList = document.getElementById("friends-list");
const pendingCount = document.getElementById("pending-count");

// Kirim Request
btnAdd.addEventListener("click", async () => {
  const targetId = friendInput.value.trim();
  if (!targetId) return;
  if (targetId === currentUserId) {
    statusMsg.textContent = "Nggak bisa nambahin diri sendiri!";
    return;
  }

  const targetSnap = await get(ref(db, `users/${targetId}`));
  if (!targetSnap.exists()) {
    statusMsg.textContent = "ID User tidak ditemukan!";
    return;
  }

  await set(ref(db, `requests/${targetId}/${currentUserId}`), {
    from: currentUserId,
    timestamp: Date.now()
  });

  statusMsg.textContent = `Permintaan dikirim ke ${targetId}!`;
  friendInput.value = "";
});

// Real-time Request Masuk
onValue(ref(db, `requests/${currentUserId}`), (snapshot) => {
  pendingList.innerHTML = "";
  const data = snapshot.val();
  if (!data) {
    pendingCount.textContent = "0";
    return;
  }

  const keys = Object.keys(data);
  pendingCount.textContent = keys.length;

  keys.forEach((senderId) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span><strong>${senderId}</strong> pengen berteman</span>
      <button onclick="acceptFriend('${senderId}')">Terima</button>
    `;
    pendingList.appendChild(li);
  });
});

// Terima Request
window.acceptFriend = async (senderId) => {
  await set(ref(db, `friends/${currentUserId}/${senderId}`), true);
  await set(ref(db, `friends/${senderId}/${currentUserId}`), true);
  await set(ref(db, `requests/${currentUserId}/${senderId}`), null);
};

// Real-time Daftar Teman
onValue(ref(db, `friends/${currentUserId}`), async (snapshot) => {
  friendsList.innerHTML = "";
  const data = snapshot.val();
  if (!data) {
    friendsList.innerHTML = "<li>Belum ada teman.</li>";
    return;
  }

  const friendIds = Object.keys(data);
  for (let fId of friendIds) {
    const fSnap = await get(ref(db, `users/${fId}`));
    const fData = fSnap.val() || { xp: 0, level: 1 };

    const li = document.createElement("li");
    li.innerHTML = `
      <div>
        <strong>${fId}</strong><br>
        <small style="color: #94a3b8">Lvl. ${fData.level} | ${fData.xp} XP</small>
      </div>
    `;
    friendsList.appendChild(li);
  }
});

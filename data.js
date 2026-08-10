/* =========================================================
   CodeQuest — Data & Content Generator
   100 level, 10 world, 13 materi per level.
   Struktur ini sengaja dipisah biar gampang kamu edit/tambah
   materi sendiri nanti. Semua teks & soal di-generate dari
   TOPICS + BANK biar nggak perlu nulis 1300 materi manual.
   ========================================================= */

const WORLDS = [
  { id: 1, name: "Pengantar & HTML Dasar", color: "#f2a65a", emoji: "🌱" },
  { id: 2, name: "HTML Lanjutan",          color: "#f2a65a", emoji: "🧱" },
  { id: 3, name: "CSS Dasar",              color: "#6dcfff", emoji: "🎨" },
  { id: 4, name: "CSS Layout",             color: "#6dcfff", emoji: "📐" },
  { id: 5, name: "JavaScript Dasar",       color: "#f7d060", emoji: "⚡" },
  { id: 6, name: "Kontrol Alur JS",        color: "#f7d060", emoji: "🔀" },
  { id: 7, name: "Fungsi & Array",         color: "#c792ea", emoji: "🧩" },
  { id: 8, name: "DOM & Event",            color: "#c792ea", emoji: "🖱️" },
  { id: 9, name: "Konsep Lanjutan",        color: "#89ca78", emoji: "🚀" },
  { id: 10, name: "Proyek Akhir",          color: "#89ca78", emoji: "🏁" },
];

/* [id, world, category('general'|'html'|'css'|'js'), title, concept, term, term2(optional), example] */
const RAW_TOPICS = [
[1,1,"general","Apa itu Pemrograman?","Pemrograman adalah cara memberi instruksi ke komputer, langkah demi langkah, supaya komputer melakukan apa yang kita mau.","algoritma","",""],
[2,1,"general","Cara Kerja Web","Saat kamu buka website, browser mengirim permintaan ke server, lalu server mengirim balik file HTML, CSS, dan JS untuk ditampilkan.","browser","server",""],
[3,1,"html","Struktur Dasar HTML","Setiap halaman HTML dibungkus tag <html>, berisi <head> untuk info halaman dan <body> untuk isi yang tampil.","html","body","<!DOCTYPE html>\n<html>\n  <head><title>Halamanku</title></head>\n  <body>\n    <p>Halo dunia!</p>\n  </body>\n</html>"],
[4,1,"html","Heading & Paragraf","Tag <h1> sampai <h6> dipakai untuk judul dengan tingkat kepentingan berbeda, sedangkan <p> dipakai untuk paragraf teks.","h1","p","<h1>Judul Utama</h1>\n<p>Ini paragraf penjelasan.</p>"],
[5,1,"html","List: ul, ol, li","Gunakan <ul> untuk daftar tanpa urutan dan <ol> untuk daftar berurutan, isi tiap item dibungkus <li>.","ul","li","<ul>\n  <li>Nasi</li>\n  <li>Ayam</li>\n</ul>"],
[6,1,"html","Link & Anchor","Tag <a> membuat tautan ke halaman lain, alamat tujuannya ditulis lewat atribut href.","a","href",'<a href="https://example.com">Kunjungi</a>'],
[7,1,"html","Gambar & Atribut","Tag <img> menampilkan gambar. Atribut src menunjuk lokasi file, alt berisi teks pengganti kalau gambar gagal tampil.","img","alt",'<img src="kucing.jpg" alt="Foto kucing">'],
[8,1,"html","Tabel Dasar","Tabel dibuat dengan <table>, baris dengan <tr>, dan sel data dengan <td>.","table","tr","<table>\n  <tr><td>Nama</td><td>Umur</td></tr>\n</table>"],
[9,1,"html","Form Dasar","Tag <form> membungkus input pengguna, seperti <input> untuk kolom teks yang bisa diisi.","form","input",'<form>\n  <input type="text" placeholder="Nama kamu">\n</form>'],
[10,1,"html","Semantic HTML","Tag semantik seperti <header>, <main>, dan <footer> membuat struktur halaman lebih jelas maknanya, bukan cuma <div> semua.","header","footer","<header>Judul Situs</header>\n<main>Konten utama</main>\n<footer>Hak cipta 2026</footer>"],

[11,2,"html","Div & Span","<div> adalah kontainer blok serbaguna, <span> adalah kontainer inline untuk membungkus sebagian teks.","div","span",'<div>\n  Ini blok, <span>ini inline</span>.\n</div>'],
[12,2,"html","Class & ID","Atribut class dipakai untuk menandai banyak elemen sekaligus, id dipakai untuk satu elemen unik.","class","id",'<div class="kartu" id="kartu-1">Konten</div>'],
[13,2,"html","Comment di HTML","Komentar HTML ditulis di antara <!-- dan -->, tidak akan tampil di browser, cuma catatan untuk developer.","<!--","-->",'<!-- Ini komentar, tidak muncul di layar -->\n<p>Ini muncul</p>'],
[14,2,"html","Nested Elements","Elemen HTML bisa disarangkan (nested) di dalam elemen lain, membentuk struktur pohon.","nested","child",'<div>\n  <p>Elemen anak di dalam div</p>\n</div>'],
[15,2,"html","Tabel Lanjutan","Atribut colspan menggabungkan beberapa kolom, rowspan menggabungkan beberapa baris dalam tabel.","colspan","rowspan",'<td colspan="2">Gabung 2 kolom</td>'],
[16,2,"html","Form Lanjutan","Selain input teks, form bisa punya <select> untuk dropdown, <textarea> untuk teks panjang, dan checkbox.","select","textarea",'<select>\n  <option>Pilihan A</option>\n</select>'],
[17,2,"html","Multimedia","Tag <audio> dan <video> menambahkan pemutar media, atribut controls menampilkan tombol play/pause.","video","controls",'<video src="film.mp4" controls></video>'],
[18,2,"html","Meta Tag & SEO Dasar","Tag <meta> di dalam <head> memberi info tambahan ke browser dan mesin pencari, misalnya deskripsi halaman.","meta","description",'<meta name="description" content="Belajar coding seru">'],
[19,2,"html","Validasi HTML","Kode HTML yang valid berarti semua tag ditutup dengan benar dan disarangkan sesuai aturan, ini bikin halaman lebih stabil.","valid","tag",'<p>Paragraf ditutup dengan benar</p>'],
[20,2,"html","Proyek Landing Page","Menggabungkan heading, gambar, list, dan form jadi satu halaman landing page sederhana yang utuh.","landing","proyek",'<header><h1>Produkku</h1></header>\n<main><p>Deskripsi produk</p></main>'],

[21,3,"css","Apa itu CSS?","CSS mengatur tampilan HTML: warna, ukuran, jarak. Cara menghubungkannya lewat tag <link> di <head>.","css","link",'<link rel="stylesheet" href="style.css">'],
[22,3,"css","Selector Dasar","Selector CSS menentukan elemen mana yang mau distyle, misalnya p memilih semua paragraf.","selector","p","p {\n  color: blue;\n}"],
[23,3,"css","Warna & Background","Properti color mengatur warna teks, background-color mengatur warna latar elemen.","color","background-color","div {\n  color: white;\n  background-color: black;\n}"],
[24,3,"css","Text Styling","font-size mengatur ukuran huruf, font-weight mengatur ketebalan seperti bold.","font-size","font-weight","p {\n  font-size: 18px;\n  font-weight: bold;\n}"],
[25,3,"css","Box Model","Setiap elemen HTML adalah kotak yang terdiri dari content, padding, border, dan margin dari dalam ke luar.","box-model","padding","div {\n  padding: 10px;\n  border: 1px solid black;\n}"],
[26,3,"css","Margin & Padding","margin adalah jarak di luar elemen, padding adalah jarak di dalam elemen sebelum kontennya.","margin","padding","div {\n  margin: 20px;\n  padding: 10px;\n}"],
[27,3,"css","Border & Radius","Properti border menambah garis tepi, border-radius membuat sudutnya melengkung.","border","border-radius","div {\n  border: 2px solid gray;\n  border-radius: 8px;\n}"],
[28,3,"css","Unit CSS","px adalah ukuran tetap dalam pixel, % relatif terhadap induk, rem relatif terhadap ukuran huruf root.","px","rem","p {\n  font-size: 1.2rem;\n  width: 80%;\n}"],
[29,3,"css","Class vs ID Selector","Selector class ditulis dengan titik (.kelas), selector id ditulis dengan pagar (#idnya).","." ,"#",".kartu {\n  color: red;\n}\n#header {\n  color: blue;\n}"],
[30,3,"css","Proyek Styling","Menggabungkan warna, box model, dan border untuk mempercantik landing page yang sudah dibuat.","styling","proyek","body {\n  background-color: #f4f4f4;\n}"],

[31,4,"css","Display Property","Properti display mengatur bagaimana elemen ditampilkan: block, inline, atau none untuk menyembunyikan.","display","none","div {\n  display: none;\n}"],
[32,4,"css","Flexbox Dasar","display: flex mengubah elemen jadi kontainer flex, anak-anaknya otomatis tersusun sejajar.","flex","display","div {\n  display: flex;\n}"],
[33,4,"css","Flexbox Lanjutan","justify-content mengatur posisi horizontal, align-items mengatur posisi vertikal di dalam flex container.","justify-content","align-items","div {\n  display: flex;\n  justify-content: center;\n}"],
[34,4,"css","Grid Dasar","display: grid membuat kontainer grid, grid-template-columns menentukan jumlah dan lebar kolom.","grid","grid-template-columns","div {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n}"],
[35,4,"css","Positioning","position: relative menggeser elemen dari posisi normalnya, position: absolute melepaskannya dari alur dokumen.","position","absolute","div {\n  position: absolute;\n  top: 0;\n}"],
[36,4,"css","Responsive & Media Query","@media memungkinkan CSS berbeda diterapkan tergantung lebar layar, dasar dari desain responsif.","@media","responsive","@media (max-width: 600px) {\n  body { font-size: 14px; }\n}"],
[37,4,"css","Pseudo-class",":hover menerapkan style saat elemen disentuh kursor, :focus saat elemen sedang aktif dipilih.","hover","focus","button:hover {\n  background-color: orange;\n}"],
[38,4,"css","Transisi & Animasi","Properti transition membuat perubahan style terjadi secara halus, bukan langsung berpindah.","transition","animation","button {\n  transition: all 0.3s;\n}"],
[39,4,"css","CSS Variables","Variabel CSS ditulis dengan --nama dan dipanggil dengan var(--nama), memudahkan konsistensi warna.","var","--","root {\n  --warna-utama: teal;\n}"],
[40,4,"css","Proyek Layout Responsif","Menggabungkan flexbox atau grid dengan media query untuk membuat layout yang rapi di semua ukuran layar.","layout","responsif","div {\n  display: flex;\n  flex-wrap: wrap;\n}"],

[41,5,"js","Apa itu JavaScript?","JavaScript adalah bahasa pemrograman yang membuat halaman web jadi interaktif, bukan cuma tampilan statis.","javascript","interaktif","console.log('Halo JS');"],
[42,5,"js","Variabel","let dan const dipakai untuk menyimpan data, bedanya let bisa diubah lagi, const tidak bisa diubah.","let","const","let nama = 'Alex';\nconst umur = 17;"],
[43,5,"js","Tipe Data","JavaScript punya beberapa tipe data dasar: string (teks), number (angka), boolean (benar/salah).","string","number","let teks = 'halo';\nlet angka = 10;\nlet benar = true;"],
[44,5,"js","Operator","Operator seperti +, -, *, / dipakai untuk operasi matematika, == dan === untuk membandingkan nilai.","operator","===","let hasil = 5 + 3;\nconsole.log(hasil === 8);"],
[45,5,"js","String & Template Literal","Template literal pakai backtick (`) dan ${} untuk menyisipkan variabel langsung ke dalam teks.","template literal","${","let nama = 'Alex';\nconsole.log(`Halo, ${nama}!`);"],
[46,5,"js","Array Dasar","Array menyimpan banyak nilai dalam satu variabel, ditulis dengan tanda kurung siku [].","array","[]","let buah = ['apel', 'jeruk', 'mangga'];\nconsole.log(buah[0]);"],
[47,5,"js","Object Dasar","Object menyimpan data dalam pasangan key: value, cocok untuk merepresentasikan satu entitas.","object","key","let siswa = { nama: 'Alex', kelas: 10 };\nconsole.log(siswa.nama);"],
[48,5,"js","Console & Debugging","console.log() menampilkan nilai ke console browser, alat utama untuk mengecek apa yang terjadi dalam kode.","console.log","debugging","console.log('Nilai x adalah:', x);"],
[49,5,"js","Komentar & Best Practice","Komentar satu baris pakai //, komentar banyak baris pakai /* */, dipakai untuk menjelaskan maksud kode.","//","/* */","// Ini komentar satu baris\n/* Ini komentar\n banyak baris */"],
[50,5,"js","Proyek Kalkulator","Menggabungkan variabel dan operator untuk membuat kalkulator sederhana yang menjumlahkan dua angka.","kalkulator","proyek","function tambah(a, b) {\n  return a + b;\n}"],

[51,6,"js","If-Else","if menjalankan kode kalau kondisi benar, else menjalankan kode alternatif kalau kondisi salah.","if","else","if (nilai >= 75) {\n  console.log('Lulus');\n} else {\n  console.log('Belum lulus');\n}"],
[52,6,"js","Switch Case","switch memilih satu dari banyak kemungkinan berdasarkan nilai variabel, alternatif dari if-else bertingkat.","switch","case","switch (hari) {\n  case 1: console.log('Senin'); break;\n}"],
[53,6,"js","Logika && dan ||","&& berarti DAN (semua syarat harus benar), || berarti ATAU (salah satu syarat cukup benar).","&&","||","if (umur >= 17 && punyaKTP) {\n  console.log('Boleh daftar');\n}"],
[54,6,"js","Looping For","Perulangan for menjalankan kode berulang kali sebanyak jumlah yang ditentukan lewat counter.","for","loop","for (let i = 0; i < 5; i++) {\n  console.log(i);\n}"],
[55,6,"js","Looping While","while mengulang kode selama kondisinya masih benar, cocok kalau jumlah pengulangan belum pasti.","while","kondisi","let i = 0;\nwhile (i < 3) {\n  console.log(i);\n  i++;\n}"],
[56,6,"js","Break & Continue","break menghentikan loop sepenuhnya, continue melompati satu putaran dan lanjut ke berikutnya.","break","continue","for (let i = 0; i < 5; i++) {\n  if (i === 3) break;\n  console.log(i);\n}"],
[57,6,"js","Nested Loop","Loop di dalam loop dipakai untuk memproses data dua dimensi, seperti tabel atau grid.","nested loop","for","for (let i = 0; i < 2; i++) {\n  for (let j = 0; j < 2; j++) {\n    console.log(i, j);\n  }\n}"],
[58,6,"js","Ternary Operator","Operator ternary adalah versi singkat if-else: kondisi ? nilaiJikaBenar : nilaiJikaSalah.","ternary","?",'let status = umur >= 17 ? "dewasa" : "anak";'],
[59,6,"js","Error Handling","try mencoba menjalankan kode, catch menangkap error kalau terjadi, supaya program tidak langsung berhenti.","try","catch","try {\n  console.log(x);\n} catch (e) {\n  console.log('Ada error:', e.message);\n}"],
[60,6,"js","Proyek Tebak Angka","Menggabungkan kondisi dan loop untuk membuat logika permainan tebak angka sederhana.","tebak angka","proyek","let target = 7;\nlet tebakan = 7;\nif (tebakan === target) console.log('Benar!');"],

[61,7,"js","Fungsi Dasar","Fungsi adalah blok kode yang bisa dipanggil berulang kali, dibuat dengan kata kunci function.","function","fungsi","function sapa() {\n  console.log('Halo!');\n}\nsapa();"],
[62,7,"js","Parameter & Return","Parameter adalah input fungsi, return mengembalikan hasil keluar dari fungsi ke pemanggilnya.","parameter","return","function kali(a, b) {\n  return a * b;\n}"],
[63,7,"js","Arrow Function","Arrow function adalah cara singkat menulis fungsi memakai tanda =>.","=>","arrow","const kali = (a, b) => a * b;"],
[64,7,"js","Array Method push/pop/slice","push menambah elemen di akhir array, pop menghapus elemen terakhir, slice mengambil sebagian array.","push","pop","let arr = [1, 2, 3];\narr.push(4);\narr.pop();"],
[65,7,"js","Array map & filter","map membuat array baru dengan mengubah tiap elemen, filter membuat array baru berisi elemen yang lolos syarat.","map","filter","let genap = [1,2,3,4].filter(n => n % 2 === 0);"],
[66,7,"js","Array reduce","reduce menggabungkan semua elemen array jadi satu nilai, misalnya menjumlahkan semua angka.","reduce","akumulator","let total = [1,2,3].reduce((a, b) => a + b, 0);"],
[67,7,"js","Object Method","Fungsi yang disimpan sebagai properti object disebut method, dipanggil lewat objek.namaMethod().","method","this","let siswa = {\n  nama: 'Alex',\n  sapa() { console.log('Halo ' + this.nama); }\n};"],
[68,7,"js","Scope Variabel","Scope menentukan di mana sebuah variabel bisa diakses, variabel di dalam fungsi tidak bisa diakses dari luar.","scope","local","function tes() {\n  let x = 5;\n}\n// x tidak bisa diakses di sini"],
[69,7,"js","Recursion Dasar","Fungsi rekursif adalah fungsi yang memanggil dirinya sendiri, biasanya punya syarat berhenti (base case).","recursion","base case","function faktorial(n) {\n  if (n <= 1) return 1;\n  return n * faktorial(n - 1);\n}"],
[70,7,"js","Proyek To-Do Logic","Menggabungkan array dan fungsi untuk mengelola daftar tugas: menambah, menghapus, menandai selesai.","to-do","proyek","let tugas = [];\ntugas.push('Belajar JS');"],

[81,9,"js","LocalStorage Dasar","localStorage menyimpan data di browser pengguna supaya tidak hilang walau halaman di-refresh.","localStorage","setItem","localStorage.setItem('nama', 'Alex');\nconsole.log(localStorage.getItem('nama'));"],
[82,9,"js","JSON Dasar","JSON.stringify mengubah object jadi teks untuk disimpan, JSON.parse mengubahnya kembali jadi object.","JSON.stringify","JSON.parse","let teks = JSON.stringify({nama: 'Alex'});\nlet obj = JSON.parse(teks);"],
[83,9,"js","Fetch API Dasar","fetch() dipakai untuk mengambil data dari server lewat internet, hasilnya berupa Promise.","fetch","promise","fetch('https://api.contoh.com')\n  .then(res => res.json());"],
[84,9,"js","Async & Callback","Callback adalah fungsi yang dijalankan setelah proses lain selesai, dasar dari kode asynchronous di JS.","callback","async","function proses(cb) {\n  cb();\n}"],
[85,9,"js","Debugging dengan Console","console.error menampilkan pesan error, console.table menampilkan data dalam bentuk tabel di console.","console.error","console.table","console.table([{nama:'Alex', umur:17}]);"],
[86,9,"js","Class & OOP Dasar","class adalah cetak biru untuk membuat object dengan struktur yang sama, dasar dari OOP di JavaScript.","class","new","class Siswa {\n  constructor(nama) {\n    this.nama = nama;\n  }\n}"],
[87,9,"js","Constructor & Method","constructor adalah method khusus yang dijalankan otomatis saat object baru dibuat dari sebuah class.","constructor","this","class Siswa {\n  constructor(nama) { this.nama = nama; }\n  sapa() { console.log(this.nama); }\n}"],
[88,9,"js","Inheritance Dasar","extends membuat sebuah class mewarisi properti dan method dari class lain, menghindari kode berulang.","extends","super","class Anak extends Siswa {\n  constructor(nama) { super(nama); }\n}"],
[89,9,"js","Modul JS Dasar","export mengeluarkan kode dari satu file, import memasukkannya ke file lain, membuat kode lebih rapi.","export","import","export function tambah(a,b) { return a+b; }"],
[90,9,"js","Proyek Notes App","Menggabungkan localStorage, array, dan fungsi untuk membuat aplikasi catatan yang datanya tersimpan.","notes app","proyek","let catatan = JSON.parse(localStorage.getItem('catatan')) || [];"],

[91,10,"general","Clean Code Dasar","Kode yang bersih itu mudah dibaca orang lain (termasuk kamu sendiri nanti), bukan cuma sekadar jalan.","clean code","readable",""],
[92,10,"general","Naming Convention","Nama variabel dan fungsi sebaiknya jelas maksudnya, misalnya totalHarga lebih baik daripada th atau x.","naming","camelCase","let totalHarga = 15000;"],
[93,10,"general","Git & Version Control","Git mencatat setiap perubahan kodemu lewat commit, jadi kamu bisa kembali ke versi sebelumnya kalau ada yang salah.","git","commit","git add .\ngit commit -m 'Tambah fitur login'"],
[94,10,"general","Debugging & Error Umum","Error paling umum pemula: salah ketik nama variabel, lupa tanda kurung tutup, atau salah tipe data.","debugging","syntax error",""],
[95,10,"general","Responsive Testing","Selalu cek tampilan website di berbagai ukuran layar (HP, tablet, laptop) sebelum menganggap selesai.","responsive","testing",""],
[96,10,"general","Optimasi Performa Dasar","Mengecilkan ukuran gambar dan menghindari kode yang berulang bikin website kamu lebih cepat diakses.","optimasi","performa",""],
[97,10,"general","Aksesibilitas Web Dasar","Menambahkan atribut alt pada gambar dan label pada form membantu pengguna dengan keterbatasan mengakses website kamu.","aksesibilitas","alt",'<img src="logo.png" alt="Logo perusahaan">'],
[98,10,"general","Deploy Website Dasar","Deploy artinya mengunggah website supaya bisa diakses publik lewat internet, misalnya lewat GitHub Pages.","deploy","hosting",""],
[99,10,"general","Portofolio & Studi Kasus","Menyusun proyek-proyek yang sudah kamu buat jadi portofolio membantu menunjukkan kemampuanmu ke orang lain.","portofolio","showcase",""],
[100,10,"general","Proyek Akhir","Saatnya menggabungkan semua yang sudah dipelajari, HTML, CSS, dan JavaScript, jadi satu website utuh.","proyek akhir","showcase",""],
];

// Isi otomatis level 71-80 (DOM & Event) dan lubang lain supaya genap 100,
// supaya kamu bisa gampang menambah topik baru di sini.
const EXTRA_TOPICS = [
[71,8,"js","Apa itu DOM?","DOM (Document Object Model) adalah representasi halaman HTML dalam bentuk yang bisa diakses dan diubah lewat JavaScript.","DOM","document","console.log(document.title);"],
[72,8,"js","Selecting Element","document.querySelector mengambil satu elemen HTML berdasarkan selector CSS, seperti '#id' atau '.class'.","querySelector","document",'let el = document.querySelector("#judul");'],
[73,8,"js","Mengubah Konten","innerText mengganti teks di dalam elemen, innerHTML mengganti isi elemen termasuk tag HTML di dalamnya.","innerText","innerHTML",'el.innerText = "Teks baru";'],
[74,8,"js","Mengubah Style via JS","Properti .style pada elemen memungkinkan kamu mengubah CSS elemen langsung lewat JavaScript.","style","backgroundColor",'el.style.backgroundColor = "yellow";'],
[75,8,"js","Event Listener Dasar","addEventListener mendaftarkan sebuah fungsi supaya dijalankan otomatis saat event tertentu terjadi.","addEventListener","event",'el.addEventListener("click", () => console.log("Diklik!"));'],
[76,8,"js","Event Click & Input","Event 'click' terjadi saat elemen diklik, event 'input' terjadi setiap kali nilai input berubah.","click","input",'input.addEventListener("input", () => console.log(input.value));'],
[77,8,"js","Membuat Element Baru","document.createElement membuat elemen HTML baru, appendChild menambahkannya ke dalam halaman.","createElement","appendChild",'let li = document.createElement("li");\nlist.appendChild(li);'],
[78,8,"js","Menghapus Element","Method .remove() menghapus sebuah elemen dari halaman HTML sepenuhnya.","remove","element",'el.remove();'],
[79,8,"js","Form Handling dengan JS","event.preventDefault() mencegah form melakukan reload halaman saat disubmit, supaya bisa diproses lewat JS dulu.","preventDefault","submit",'form.addEventListener("submit", (e) => {\n  e.preventDefault();\n});'],
[80,8,"js","Proyek To-Do Interaktif","Menggabungkan DOM dan event untuk membuat daftar tugas yang bisa ditambah dan dihapus langsung di halaman.","to-do interaktif","proyek",'button.addEventListener("click", () => {\n  list.appendChild(document.createElement("li"));\n});'],
];

const ALL_TOPICS = RAW_TOPICS.concat(EXTRA_TOPICS).sort((a, b) => a[0] - b[0]);

function topicToObject(row) {
  const [id, world, category, title, concept, term, term2, example] = row;
  return { id, world, category, title, concept, term, term2: term2 || term, example: example || "" };
}

const TOPICS = ALL_TOPICS.map(topicToObject);

/* ---------------- Bank soal & template per kategori ---------------- */

const QUIZ_BANK = {
  general: [
    { q: "Apa tujuan utama belajar konsep ini sebelum lanjut ke level berikutnya?", opts: ["Supaya hafal semua istilah bahasa Inggris", "Supaya paham dasar sebelum bikin sesuatu yang lebih kompleks", "Supaya bisa langsung jadi developer profesional", "Supaya bisa melewati level tanpa belajar"], ans: 1 },
    { q: "Kenapa penting membaca dokumentasi atau contoh kode saat belajar?", opts: ["Karena wajib dihafal semua", "Karena membantu memahami cara pemakaian yang benar", "Karena tidak ada gunanya", "Karena hanya untuk pemula"], ans: 1 },
    { q: "Sikap paling tepat saat kode kamu error?", opts: ["Langsung menyerah", "Membaca pesan errornya dan mencari letak masalahnya", "Menghapus semua kode dan mulai dari nol", "Mengabaikan errornya"], ans: 1 },
    { q: "Kenapa latihan berulang penting dalam belajar coding?", opts: ["Supaya cepat bosan", "Supaya konsep makin nempel lewat praktik langsung", "Tidak ada alasan khusus", "Supaya menghabiskan waktu saja"], ans: 1 },
  ],
  html: [
    { q: "HTML pada dasarnya digunakan untuk apa dalam sebuah website?", opts: ["Mengatur logika program", "Membentuk struktur dan konten halaman", "Mengatur warna dan animasi", "Menyimpan data di server"], ans: 1 },
    { q: "Apa yang terjadi kalau sebuah tag HTML tidak ditutup dengan benar?", opts: ["Tidak berpengaruh sama sekali", "Struktur halaman bisa jadi kacau atau tidak sesuai rencana", "Halaman otomatis lebih cepat", "Browser akan error total dan halaman kosong"], ans: 1 },
    { q: "Atribut dalam tag HTML ditulis di bagian mana?", opts: ["Di luar tag pembuka", "Di dalam tag pembuka, setelah nama tag", "Di dalam tag penutup", "Di file CSS terpisah"], ans: 1 },
    { q: "Kenapa struktur HTML yang rapi dan bersarang dengan benar itu penting?", opts: ["Supaya file lebih besar", "Supaya halaman lebih mudah dipahami browser dan developer lain", "Tidak penting sama sekali", "Supaya loading lebih lambat"], ans: 1 },
  ],
  css: [
    { q: "CSS pada dasarnya digunakan untuk apa?", opts: ["Menyimpan data pengguna", "Mengatur tampilan visual dari elemen HTML", "Membuat logika program", "Mengatur koneksi ke server"], ans: 1 },
    { q: "Kalau ada dua aturan CSS yang bentrok untuk elemen yang sama, apa yang menentukan mana yang dipakai?", opts: ["Urutan huruf abjad", "Spesifisitas dan urutan penulisan selector", "Warna latar belakang", "Panjang nama filenya"], ans: 1 },
    { q: "Kenapa penting memahami box model saat mengatur ukuran elemen?", opts: ["Supaya elemen makin susah diatur", "Supaya ukuran total elemen (konten+padding+border) sesuai perkiraan", "Tidak berpengaruh ke ukuran akhir", "Supaya warnanya berubah"], ans: 1 },
    { q: "Apa manfaat utama pendekatan responsive design?", opts: ["Website hanya bisa dibuka di komputer", "Tampilan menyesuaikan baik di HP, tablet, maupun layar besar", "Membuat kode CSS jadi lebih pendek otomatis", "Tidak ada manfaatnya"], ans: 1 },
  ],
  js: [
    { q: "JavaScript di halaman web biasanya dipakai untuk apa?", opts: ["Mengatur struktur konten", "Menambahkan interaktivitas dan logika di halaman", "Mengatur warna secara langsung tanpa CSS", "Menyimpan file gambar"], ans: 1 },
    { q: "Kenapa penting memberi nama variabel yang jelas dalam kode JavaScript?", opts: ["Supaya kode terlihat lebih panjang", "Supaya kode lebih mudah dibaca dan dipahami maksudnya", "Tidak ada pengaruhnya sama sekali", "Supaya program berjalan lebih cepat"], ans: 1 },
    { q: "Apa yang biasanya terjadi kalau kamu salah menulis nama variabel yang belum pernah dibuat?", opts: ["Program tetap jalan normal", "JavaScript akan melempar error karena variabel tidak dikenali", "Nilainya otomatis jadi nol", "Tidak akan pernah terjadi error"], ans: 1 },
    { q: "Kenapa mencoba (test) kode sedikit demi sedikit itu praktik yang baik?", opts: ["Supaya lebih lama selesainya", "Supaya lebih mudah menemukan letak kesalahan", "Tidak ada gunanya", "Supaya kode makin rumit"], ans: 1 },
  ],
};

const MISTAKE_BANK = {
  general: "Kesalahan umum pemula adalah terburu-buru lompat ke topik lanjutan sebelum dasar-dasarnya benar-benar dipahami.",
  html: "Kesalahan umum: lupa menutup tag, atau salah menyarangkan tag (misalnya menutup tag luar sebelum tag dalam).",
  css: "Kesalahan umum: lupa titik koma di akhir baris, atau salah memilih selector sehingga style tidak muncul.",
  js: "Kesalahan umum: salah ketik nama variabel, lupa tanda kurung tutup, atau tertukar antara = (assignment) dan === (perbandingan).",
};

const CASE_BANK = {
  general: (t) => `Bayangkan kamu sedang membangun proyek kecil dan perlu menerapkan "${t.title}". Coba pikirkan, di bagian mana dari proyekmu konsep ini paling relevan dipakai?`,
  html: (t) => `Bayangkan kamu sedang membuat halaman profil sederhana. Bagaimana kamu akan memakai ${t.term} untuk kebutuhan itu?`,
  css: (t) => `Bayangkan desainer memintamu supaya tampilan halaman lebih rapi memakai ${t.term}. Langkah apa yang akan kamu ambil?`,
  js: (t) => `Bayangkan kamu sedang membuat fitur kecil di aplikasimu yang butuh ${t.term}. Bagaimana kamu akan mulai menulis kodenya?`,
};

function pick(bank, i) { return bank[i % bank.length]; }

function codeBlockOrNote(topic) {
  return topic.example && topic.example.trim().length > 0
    ? topic.example
    : "// Materi ini lebih ke konsep, belum ada contoh kode spesifik.";
}

function cleanToken(s) {
  return (s || "").replace(/[<>]/g, "").trim().toLowerCase();
}

/* Bangun 13 materi untuk satu topic/level */
function buildMateri(topic, worldIndexInLevel) {
  const cat = topic.category;
  const quizBank = QUIZ_BANK[cat] || QUIZ_BANK.general;
  const base = (topic.id * 3) % quizBank.length;

  const t1 = cleanToken(topic.term);
  const t2 = cleanToken(topic.term2);

  const materi = [];

  materi.push({
    type: "reading",
    title: "Pengantar",
    body: `${topic.concept}\n\nDi materi ini kamu akan mengenal "${topic.title}" — salah satu konsep dasar di ${WORLDS[topic.world - 1].name}.`,
  });

  materi.push({
    type: "reading",
    title: "Konsep Kunci",
    body: `Istilah penting di materi ini: **${topic.term}**.\n\n${topic.concept}\n\nCoba ingat-ingat istilah ini, karena akan sering muncul lagi di materi berikutnya.`,
  });

  materi.push({
    type: "reading",
    title: "Contoh Kode",
    body: `Berikut contoh penerapan "${topic.title}":`,
    code: codeBlockOrNote(topic),
  });

  materi.push({ type: "quiz", title: "Kuis Pemahaman 1", ...pick(quizBank, base) });
  materi.push({ type: "quiz", title: "Kuis Pemahaman 2", ...pick(quizBank, base + 1) });

  materi.push({
    type: "quiz",
    title: "Tebak Konsep",
    q: `Manakah istilah yang paling berkaitan langsung dengan materi "${topic.title}"?`,
    opts: shuffleFixed([topic.term, "database server", "kabel jaringan", "hardware komputer"], topic.id),
    ans: 0,
    _needsReindex: true,
  });

  materi.push({
    type: "challenge",
    title: "Tantangan Kode 1",
    level: "easy",
    prompt: `Tulis potongan kode sederhana yang menggunakan "${topic.term}", sesuai konsep "${topic.title}" yang baru kamu pelajari.`,
    starter: cat === "js" ? "// tulis kodemu di sini\n" : cat === "css" ? "/* tulis kodemu di sini */\n" : "<!-- tulis kodemu di sini -->\n",
    requiredTokens: [t1],
    hint: `Pastikan kodemu memuat "${topic.term}".`,
  });

  materi.push({
    type: "reading",
    title: "Kesalahan Umum",
    body: MISTAKE_BANK[cat] || MISTAKE_BANK.general,
  });

  materi.push({ type: "quiz", title: "Kuis Pemahaman 3", ...pick(quizBank, base + 2) });

  materi.push({
    type: "challenge",
    title: "Tantangan Kode 2",
    level: "medium",
    prompt: `Sekarang gabungkan "${topic.term}" dan "${topic.term2}" dalam satu potongan kode untuk melatih "${topic.title}".`,
    starter: cat === "js" ? "// tulis kodemu di sini\n" : cat === "css" ? "/* tulis kodemu di sini */\n" : "<!-- tulis kodemu di sini -->\n",
    requiredTokens: [t1, t2].filter((v, i, a) => v && a.indexOf(v) === i),
    hint: `Kodemu perlu memuat "${topic.term}" dan "${topic.term2}".`,
  });

  materi.push({
    type: "reading",
    title: "Studi Kasus",
    body: (CASE_BANK[cat] || CASE_BANK.general)(topic),
  });

  materi.push({ type: "quiz", title: "Kuis Akhir", ...pick(quizBank, base + 3) });

  materi.push({
    type: "challenge",
    title: "Proyek Mini",
    level: "project",
    prompt: `Terapkan "${topic.title}" dalam potongan kode yang lebih lengkap, seolah-olah ini bagian nyata dari proyekmu.`,
    starter: cat === "js" ? "// proyek mini kamu\n" : cat === "css" ? "/* proyek mini kamu */\n" : "<!-- proyek mini kamu -->\n",
    requiredTokens: [t1],
    hint: `Minimal kodemu memuat "${topic.term}" dan sedikit lebih panjang dari tantangan sebelumnya.`,
    minLength: 20,
  });

  // reindex opsi acak biar jawaban benar nggak selalu index 0
  materi.forEach((m) => {
    if (m._needsReindex) {
      const correct = m.opts[m.ans];
      const shuffled = shuffleFixed(m.opts, topic.id + 7);
      m.opts = shuffled;
      m.ans = shuffled.indexOf(correct);
      delete m._needsReindex;
    }
  });

  return materi;
}

// shuffle deterministik (biar konsisten tiap kali di-generate, tapi kelihatan acak)
function shuffleFixed(arr, seed) {
  const a = arr.slice();
  let s = seed || 1;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildLevels() {
  return TOPICS.map((topic) => ({
    id: topic.id,
    world: topic.world,
    title: topic.title,
    category: topic.category,
    concept: topic.concept,
    materi: buildMateri(topic),
  }));
}

const LEVELS = buildLevels();

if (typeof module !== "undefined") {
  module.exports = { WORLDS, TOPICS, LEVELS };
}
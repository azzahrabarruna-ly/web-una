// =========================================================
// PRAKTIKUM PERTEMUAN 7
// Dashboard Penjadwalan Hemodialisis
// Seluruh data di bawah ini bersifat SINTETIS.
// =========================================================

// 1) DATA MESIN HD
const machines = [
  { id: "HD-01", status: "Aktif", catatan: "Siap digunakan" },
  { id: "HD-02", status: "Aktif", catatan: "Siap digunakan" },
  { id: "HD-03", status: "Maintenance", catatan: "Kalibrasi sampai 13.00" },
  { id: "HD-04", status: "Aktif", catatan: "Siap digunakan" },
  { id: "HD-05", status: "Aktif", catatan: "Siap digunakan" },
  { id: "HD-06", status: "Aktif", catatan: "Siap digunakan" }
];

// 2) DATA JADWAL PASIEN SINTETIS
// Mahasiswa boleh menambah/mengubah data ini.
const schedules = [
  { patient: "P001", session: "Pagi",  machine: "HD-01", start: "07:00", end: "11:00", status: "Selesai",     note: "-" },
  { patient: "P002", session: "Pagi",  machine: "HD-02", start: "07:00", end: "11:00", status: "Berlangsung", note: "Monitoring rutin" },
  { patient: "P003", session: "Pagi",  machine: "HD-04", start: "07:00", end: "11:00", status: "Terlambat",  note: "Datang 25 menit terlambat" },
  { patient: "P004", session: "Pagi",  machine: "HD-05", start: "07:00", end: "11:00", status: "Selesai",     note: "-" },
  { patient: "P005", session: "Pagi",  machine: "HD-06", start: "07:00", end: "11:00", status: "Menunggu",    note: "Menunggu asesmen pra-HD" },
  { patient: "P006", session: "Pagi",  machine: "HD-03", start: "07:00", end: "11:00", status: "Batal",       note: "Mesin maintenance" },
  { patient: "P007", session: "Pagi",  machine: "HD-01", start: "07:00", end: "11:00", status: "Terjadwal",   note: "Contoh konflik jadwal mesin" },
  { patient: "P008", session: "Pagi",  machine: "HD-02", start: "07:00", end: "11:00", status: "Terjadwal",   note: "Contoh konflik jadwal mesin" },

  { patient: "P009", session: "Siang", machine: "HD-01", start: "12:00", end: "16:00", status: "Terjadwal",   note: "-" },
  { patient: "P010", session: "Siang", machine: "HD-02", start: "12:00", end: "16:00", status: "Terjadwal",   note: "-" },
  { patient: "P011", session: "Siang", machine: "HD-03", start: "13:00", end: "17:00", status: "Terjadwal",   note: "Setelah maintenance selesai" },
  { patient: "P012", session: "Siang", machine: "HD-04", start: "12:00", end: "16:00", status: "Menunggu",    note: "-" },
  { patient: "P013", session: "Siang", machine: "HD-05", start: "12:00", end: "16:00", status: "Terjadwal",   note: "-" },
  { patient: "P014", session: "Siang", machine: "HD-06", start: "12:00", end: "16:00", status: "Terjadwal",   note: "-" },
  { patient: "P015", session: "Siang", machine: "HD-01", start: "12:00", end: "16:00", status: "Batal",       note: "Konfirmasi pembatalan pasien" },
  { patient: "P016", session: "Siang", machine: "HD-05", start: "12:00", end: "16:00", status: "Terlambat",  note: "Belum hadir sesuai jadwal" }
];

// Kapasitas contoh per sesi.
// Silakan kelompok memodifikasi sesuai skenario masing-masing.
const SESSION_CAPACITY = 8;

// DOM
const scheduleBody = document.getElementById("scheduleBody");
const filterSession = document.getElementById("filterSession");
const filterStatus = document.getElementById("filterStatus");
const filterMachine = document.getElementById("filterMachine");
const searchPatient = document.getElementById("searchPatient");
const warningArea = document.getElementById("warningArea");
const machineGrid = document.getElementById("machineGrid");
const resetBtn = document.getElementById("resetBtn");

// 3) TANGGAL OTOMATIS
document.getElementById("currentDate").textContent =
  new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date());

// 4) ISI DROPDOWN MESIN
machines.forEach(machine => {
  const option = document.createElement("option");
  option.value = machine.id;
  option.textContent = machine.id;
  filterMachine.appendChild(option);
});

// 5) FUNGSI BADGE STATUS
function badgeClass(status) {
  return "badge-" + status.toLowerCase().replaceAll(" ", "-");
}

// 6) RENDER TABEL BERDASARKAN FILTER
function renderSchedule() {
  const sessionValue = filterSession.value;
  const statusValue = filterStatus.value;
  const machineValue = filterMachine.value;
  const keyword = searchPatient.value.trim().toUpperCase();

  const filtered = schedules.filter(item => {
    const sessionMatch = sessionValue === "Semua" || item.session === sessionValue;
    const statusMatch = statusValue === "Semua" || item.status === statusValue;
    const machineMatch = machineValue === "Semua" || item.machine === machineValue;
    const patientMatch = item.patient.includes(keyword);

    return sessionMatch && statusMatch && machineMatch && patientMatch;
  });

  document.getElementById("visibleCount").textContent = filtered.length;

  if (filtered.length === 0) {
    scheduleBody.innerHTML = `
      <tr>
        <td colspan="8" class="empty-row">Tidak ada data yang sesuai filter.</td>
      </tr>
    `;
    return;
  }

  scheduleBody.innerHTML = filtered.map((item, index) => `
    <tr>
      <td>${index + 1}</td>
      <td><strong>${item.patient}</strong></td>
      <td>${item.session}</td>
      <td>${item.machine}</td>
      <td>${item.start}</td>
      <td>${item.end}</td>
      <td><span class="badge ${badgeClass(item.status)}">${item.status}</span></td>
      <td>${item.note}</td>
    </tr>
  `).join("");
}

// 7) RINGKASAN JUMLAH STATUS
function renderSummary() {
  const count = status => schedules.filter(item => item.status === status).length;

  document.getElementById("countTotal").textContent = schedules.length;
  document.getElementById("countSelesai").textContent = count("Selesai");
  document.getElementById("countBerlangsung").textContent = count("Berlangsung");
  document.getElementById("countMenunggu").textContent = count("Menunggu");
  document.getElementById("countTerlambat").textContent = count("Terlambat");
  document.getElementById("countBatal").textContent = count("Batal");
}

// 8) STATUS MESIN
function renderMachines() {
  machineGrid.innerHTML = machines.map(machine => {
    const className = machine.status === "Maintenance" ? "maintenance" : "available";
    return `
      <div class="machine-card ${className}">
        <strong>${machine.id}</strong>
        <div>${machine.status}</div>
        <small>${machine.catatan}</small>
      </div>
    `;
  }).join("");
}

// 9) DETEKSI KONFLIK SEDERHANA
function findConflicts() {
  const conflicts = [];

  for (let i = 0; i < schedules.length; i++) {
    for (let j = i + 1; j < schedules.length; j++) {
      const a = schedules[i];
      const b = schedules[j];

      const sameMachine = a.machine === b.machine;
      const sameSession = a.session === b.session;
      const sameTime = a.start === b.start && a.end === b.end;
      const bothActive = a.status !== "Batal" && b.status !== "Batal";

      if (sameMachine && sameSession && sameTime && bothActive) {
        conflicts.push(`${a.machine}: ${a.patient} dan ${b.patient} pada sesi ${a.session}`);
      }
    }
  }

  return conflicts;
}

// 10) PERINGATAN OTOMATIS
function renderWarnings() {
  const warnings = [];

  const maintenance = machines.filter(m => m.status === "Maintenance");
  if (maintenance.length > 0) {
    warnings.push({
      type: "danger",
      title: "Mesin Maintenance",
      text: `${maintenance.map(m => m.id).join(", ")} tidak dapat digunakan sesuai catatan mesin.`
    });
  }

  const conflicts = findConflicts();
  if (conflicts.length > 0) {
    warnings.push({
      type: "danger",
      title: "Jadwal Bentrok",
      text: conflicts.join(" • ")
    });
  }

  ["Pagi", "Siang"].forEach(session => {
    const totalSession = schedules.filter(
      item => item.session === session && item.status !== "Batal"
    ).length;

    if (totalSession >= SESSION_CAPACITY) {
      warnings.push({
        type: "warning",
        title: `Kapasitas Sesi ${session}`,
        text: `${totalSession}/${SESSION_CAPACITY} slot terisi. Periksa kembali kapasitas dan ketersediaan mesin.`
      });
    }
  });

  const late = schedules.filter(item => item.status === "Terlambat");
  if (late.length > 0) {
    warnings.push({
      type: "warning",
      title: "Pasien Terlambat",
      text: `${late.length} pasien berstatus terlambat: ${late.map(x => x.patient).join(", ")}.`
    });
  }

  if (warnings.length === 0) {
    warnings.push({
      type: "success",
      title: "Tidak Ada Peringatan",
      text: "Tidak ditemukan konflik, maintenance, atau kapasitas penuh."
    });
  }

  warningArea.innerHTML = warnings.map(item => `
    <div class="warning-card ${item.type}">
      <strong>${item.title}</strong>
      <span>${item.text}</span>
    </div>
  `).join("");
}

// 11) INDIKATOR PEMANFAATAN SESI
function renderSessionIndicators() {
  ["Pagi", "Siang"].forEach(session => {
    const total = schedules.filter(
      item => item.session === session && item.status !== "Batal"
    ).length;

    const percentage = Math.min((total / SESSION_CAPACITY) * 100, 100);
    const key = session.toLowerCase();

    document.getElementById(`${key}Text`).textContent =
      `${total} pasien / kapasitas ${SESSION_CAPACITY}`;
    document.getElementById(`${key}Bar`).style.width = `${percentage}%`;
  });
}

// 12) EVENT FILTER
[filterSession, filterStatus, filterMachine].forEach(element => {
  element.addEventListener("change", renderSchedule);
});

searchPatient.addEventListener("input", renderSchedule);

resetBtn.addEventListener("click", () => {
  filterSession.value = "Semua";
  filterStatus.value = "Semua";
  filterMachine.value = "Semua";
  searchPatient.value = "";
  renderSchedule();
});

// 13) JALANKAN SAAT HALAMAN DIBUKA
renderSummary();
renderSchedule();
renderMachines();
renderWarnings();
renderSessionIndicators();

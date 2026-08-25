// =========================================================
// DASHBOARD PENJADWALAN HEMODIALISIS
// DATA 100% SINTETIS
// =========================================================

// DATA MESIN HD
const machines = [
  {
    id: "HD-01",
    status: "Aktif",
    catatan: "Siap digunakan"
  },
  {
    id: "HD-02",
    status: "Aktif",
    catatan: "Siap digunakan"
  },
  {
    id: "HD-03",
    status: "Maintenance",
    catatan: "Kalibrasi sampai 13.00"
  },
  {
    id: "HD-04",
    status: "Aktif",
    catatan: "Siap digunakan"
  },
  {
    id: "HD-05",
    status: "Aktif",
    catatan: "Siap digunakan"
  },
  {
    id: "HD-06",
    status: "Aktif",
    catatan: "Siap digunakan"
  }
];


// DATA PASIEN SINTETIS
const schedules = [
  {
    patient: "P001",
    name: "Andi Pratama",
    session: "Pagi",
    machine: "HD-01",
    start: "07:00",
    end: "11:00",
    status: "Selesai",
    note: "-"
  },
  {
    patient: "P002",
    name: "Bima Saputra",
    session: "Pagi",
    machine: "HD-02",
    start: "07:00",
    end: "11:00",
    status: "Berlangsung",
    note: "Monitoring rutin"
  },
  {
    patient: "P003",
    name: "Citra Lestari",
    session: "Pagi",
    machine: "HD-04",
    start: "07:00",
    end: "11:00",
    status: "Terlambat",
    note: "Datang 25 menit terlambat"
  },
  {
    patient: "P004",
    name: "Dimas Ramadhan",
    session: "Pagi",
    machine: "HD-05",
    start: "07:00",
    end: "11:00",
    status: "Selesai",
    note: "-"
  },
  {
    patient: "P005",
    name: "Eka Wulandari",
    session: "Pagi",
    machine: "HD-06",
    start: "07:00",
    end: "11:00",
    status: "Menunggu",
    note: "Menunggu asesmen pra-HD"
  },
  {
    patient: "P006",
    name: "Fajar Nugroho",
    session: "Pagi",
    machine: "HD-03",
    start: "07:00",
    end: "11:00",
    status: "Batal",
    note: "Mesin maintenance"
  },
  {
    patient: "P007",
    name: "Galih Permana",
    session: "Pagi",
    machine: "HD-01",
    start: "07:00",
    end: "11:00",
    status: "Terjadwal",
    note: "Contoh konflik jadwal mesin"
  },
  {
    patient: "P008",
    name: "Hana Putri",
    session: "Pagi",
    machine: "HD-02",
    start: "07:00",
    end: "11:00",
    status: "Terjadwal",
    note: "Contoh konflik jadwal mesin"
  },
  {
    patient: "P009",
    name: "Intan Maharani",
    session: "Siang",
    machine: "HD-01",
    start: "12:00",
    end: "16:00",
    status: "Terjadwal",
    note: "-"
  },
  {
    patient: "P010",
    name: "Joko Setiawan",
    session: "Siang",
    machine: "HD-02",
    start: "12:00",
    end: "16:00",
    status: "Terjadwal",
    note: "-"
  },
  {
    patient: "P011",
    name: "Karin Amelia",
    session: "Siang",
    machine: "HD-03",
    start: "13:00",
    end: "17:00",
    status: "Terjadwal",
    note: "Setelah maintenance selesai"
  },
  {
    patient: "P012",
    name: "Lukman Hakim",
    session: "Siang",
    machine: "HD-04",
    start: "12:00",
    end: "16:00",
    status: "Menunggu",
    note: "-"
  },
  {
    patient: "P013",
    name: "Maya Sari",
    session: "Siang",
    machine: "HD-05",
    start: "12:00",
    end: "16:00",
    status: "Terjadwal",
    note: "-"
  },
  {
    patient: "P014",
    name: "Nanda Kurniawan",
    session: "Siang",
    machine: "HD-06",
    start: "12:00",
    end: "16:00",
    status: "Terjadwal",
    note: "-"
  },
  {
    patient: "P015",
    name: "Olivia Rahma",
    session: "Siang",
    machine: "HD-01",
    start: "12:00",
    end: "16:00",
    status: "Batal",
    note: "Konfirmasi pembatalan pasien"
  },
  {
    patient: "P016",
    name: "Reza Firmansyah",
    session: "Siang",
    machine: "HD-05",
    start: "12:00",
    end: "16:00",
    status: "Terlambat",
    note: "Belum hadir sesuai jadwal"
  }
];


// KAPASITAS MAKSIMAL SETIAP SESI
const SESSION_CAPACITY = 8;


// ELEMENT HTML
const scheduleBody = document.getElementById("scheduleBody");
const filterSession = document.getElementById("filterSession");
const filterStatus = document.getElementById("filterStatus");
const filterMachine = document.getElementById("filterMachine");
const searchPatient = document.getElementById("searchPatient");
const warningArea = document.getElementById("warningArea");
const machineGrid = document.getElementById("machineGrid");
const resetBtn = document.getElementById("resetBtn");


// TANGGAL OTOMATIS
document.getElementById("currentDate").textContent =
  new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date());


// DROPDOWN MESIN
machines.forEach(machine => {
  const option = document.createElement("option");

  option.value = machine.id;
  option.textContent = machine.id;

  filterMachine.appendChild(option);
});


// CLASS BADGE STATUS
function badgeClass(status) {
  return "badge-" + status
    .toLowerCase()
    .replace(/\s+/g, "-");
}


// MENAMPILKAN DATA KE TABEL
function renderSchedule() {

  const sessionValue = filterSession.value;
  const statusValue = filterStatus.value;
  const machineValue = filterMachine.value;
  const keyword = searchPatient.value.trim().toUpperCase();


  const filtered = schedules.filter(item => {

    const sessionMatch =
      sessionValue === "Semua" ||
      item.session === sessionValue;

    const statusMatch =
      statusValue === "Semua" ||
      item.status === statusValue;

    const machineMatch =
      machineValue === "Semua" ||
      item.machine === machineValue;

    const patientMatch =
      item.patient.includes(keyword) ||
      item.name.toUpperCase().includes(keyword);


    return (
      sessionMatch &&
      statusMatch &&
      machineMatch &&
      patientMatch
    );
  });


  document.getElementById("visibleCount").textContent =
    filtered.length;


  if (filtered.length === 0) {

    scheduleBody.innerHTML = `
      <tr>
        <td colspan="8" class="empty-row">
          Tidak ada data yang sesuai filter.
        </td>
      </tr>
    `;

    return;
  }


  scheduleBody.innerHTML = filtered.map((item, index) => {

    return `
      <tr>

        <td>${index + 1}</td>

        <td>
          <strong>${item.name}</strong>
        </td>

        <td>${item.session}</td>

        <td>${item.machine}</td>

        <td>${item.start}</td>

        <td>${item.end}</td>

        <td>
          <span class="badge ${badgeClass(item.status)}">
            ${item.status}
          </span>
        </td>

        <td>${item.note}</td>

      </tr>
    `;

  }).join("");
}


// RINGKASAN JUMLAH PASIEN
function renderSummary() {

  const count = status => {

    return schedules.filter(
      item => item.status === status
    ).length;

  };


  document.getElementById("countTotal").textContent =
    schedules.length;

  document.getElementById("countSelesai").textContent =
    count("Selesai");

  document.getElementById("countBerlangsung").textContent =
    count("Berlangsung");

  document.getElementById("countMenunggu").textContent =
    count("Menunggu");

  document.getElementById("countTerlambat").textContent =
    count("Terlambat");

  document.getElementById("countBatal").textContent =
    count("Batal");
}


// STATUS MESIN
function renderMachines() {

  machineGrid.innerHTML = machines.map(machine => {

    const className =
      machine.status === "Maintenance"
        ? "maintenance"
        : "available";


    return `
      <div class="machine-card ${className}">

        <strong>${machine.id}</strong>

        <div>${machine.status}</div>

        <small>${machine.catatan}</small>

      </div>
    `;

  }).join("");
}


// CEK JADWAL BENTROK
function findConflicts() {

  const conflicts = [];


  for (let i = 0; i < schedules.length; i++) {

    for (let j = i + 1; j < schedules.length; j++) {

      const a = schedules[i];
      const b = schedules[j];


      const sameMachine =
        a.machine === b.machine;

      const sameSession =
        a.session === b.session;

      const sameTime =
        a.start === b.start &&
        a.end === b.end;

      const bothActive =
        a.status !== "Batal" &&
        b.status !== "Batal";


      if (
        sameMachine &&
        sameSession &&
        sameTime &&
        bothActive
      ) {

        conflicts.push(
          `${a.machine}: ${a.name} dan ${b.name} pada sesi ${a.session}`
        );

      }
    }
  }


  return conflicts;
}


// PERINGATAN OTOMATIS
function renderWarnings() {

  const warnings = [];


  // MESIN MAINTENANCE
  const maintenance =
    machines.filter(
      machine => machine.status === "Maintenance"
    );


  if (maintenance.length > 0) {

    warnings.push({

      type: "danger",

      title: "Mesin Maintenance",

      text:
        `${maintenance
          .map(m => m.id)
          .join(", ")} tidak dapat digunakan sesuai catatan mesin.`

    });

  }


  // JADWAL BENTROK
  const conflicts = findConflicts();


  if (conflicts.length > 0) {

    warnings.push({

      type: "danger",

      title: "Jadwal Bentrok",

      text: conflicts.join(" • ")

    });

  }


  // KAPASITAS SESI
  ["Pagi", "Siang"].forEach(session => {

    const totalSession =
      schedules.filter(
        item =>
          item.session === session &&
          item.status !== "Batal"
      ).length;


    if (totalSession >= SESSION_CAPACITY) {

      warnings.push({

        type: "warning",

        title: `Kapasitas Sesi ${session}`,

        text:
          `${totalSession}/${SESSION_CAPACITY} slot terisi. Periksa kembali kapasitas dan ketersediaan mesin.`

      });

    }

  });


  // PASIEN TERLAMBAT
  const late =
    schedules.filter(
      item => item.status === "Terlambat"
    );


  if (late.length > 0) {

    warnings.push({

      type: "warning",

      title: "Pasien Terlambat",

      text:
        `${late.length} pasien berstatus terlambat: ${
          late.map(x => x.name).join(", ")
        }.`

    });

  }


  // JIKA TIDAK ADA WARNING
  if (warnings.length === 0) {

    warnings.push({

      type: "success",

      title: "Tidak Ada Peringatan",

      text:
        "Tidak ditemukan konflik, maintenance, atau kapasitas penuh."

    });

  }


  warningArea.innerHTML =
    warnings.map(item => {

      return `
        <div class="warning-card ${item.type}">

          <strong>${item.title}</strong>

          <span>${item.text}</span>

        </div>
      `;

    }).join("");
}


// INDIKATOR SESI PAGI DAN SIANG
function renderSessionIndicators() {

  ["Pagi", "Siang"].forEach(session => {

    const total =
      schedules.filter(
        item =>
          item.session === session &&
          item.status !== "Batal"
      ).length;


    const percentage =
      Math.min(
        (total / SESSION_CAPACITY) * 100,
        100
      );


    const key =
      session.toLowerCase();


    document.getElementById(
      `${key}Text`
    ).textContent =
      `${total} pasien / kapasitas ${SESSION_CAPACITY}`;


    document.getElementById(
      `${key}Bar`
    ).style.width =
      `${percentage}%`;

  });
}


// FILTER
filterSession.addEventListener(
  "change",
  renderSchedule
);

filterStatus.addEventListener(
  "change",
  renderSchedule
);

filterMachine.addEventListener(
  "change",
  renderSchedule
);

searchPatient.addEventListener(
  "input",
  renderSchedule
);


// RESET FILTER
resetBtn.addEventListener(
  "click",
  () => {

    filterSession.value = "Semua";

    filterStatus.value = "Semua";

    filterMachine.value = "Semua";

    searchPatient.value = "";

    renderSchedule();

  }
);


// JALANKAN SAAT WEBSITE DIBUKA
renderSummary();

renderSchedule();

renderMachines();

renderWarnings();

renderSessionIndicators();

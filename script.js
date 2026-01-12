/* ===================== ELEMENTS ===================== */
const studentBox     = document.getElementById("studentBox");
const advisorBox     = document.getElementById("advisorBox");
const officeBox      = document.getElementById("officeBox");
const studentListBox = document.getElementById("studentListBox");

const APP_URL = "https://script.google.com/macros/s/AKfycbwAeSRyZz3Hwa7bkjpYKeRLoqeVbOZTjwlSkc2UWnKs1MmhPE14PLIBVvpthumrdK1Dxw/exec";

/* ===================== ROLE SWITCH ===================== */
function showSection(role) {
  // hide all
  studentBox.style.display = "none";
  advisorBox.style.display = "none";
  officeBox.style.display  = "none";
  studentListBox.style.display = "none";

  if (role === "student") {
    studentBox.style.display = "block";
    return;
  }

  if (role === "advisor") {
    advisorBox.style.display = "block";
    studentListBox.style.display = "block";
    loadStudentListForStaff();
    return;
  }

  if (role === "office") {
    officeBox.style.display = "block";
    studentListBox.style.display = "block";
    loadStudentListForStaff();
  }
}

/* ===================== STUDENT SUBMIT ===================== */
function submitStudent() {
  const data = {
    role: "student",
    sid: s_sid.value,
    name: s_name.value,
    email: s_email.value,
    phone: s_phone.value,
    dept: s_dept.value,
    decision: s_decision.value,
    reason: s_reason.value
  };

  fetch(APP_URL, {
    method: "POST",
    body: JSON.stringify(data)
  })
    .then(r => r.text())
    .then(msg => {
      alert(msg);
      studentForm.reset();
    })
    .catch(err => alert(err));
}

/* ===================== ADVISOR SUBMIT ===================== */
function submitAdvisor() {
  const data = {
    role: "advisor",
    sid: a_sid.value,
    name: a_name.value,
    email: a_email.value,
    phone: a_phone.value,
    gphone: a_gphone.value,
    dept: a_dept.value,
    credit: a_credit.value,
    cgpa: a_cgpa.value,
    status: a_status.value
  };

  fetch(APP_URL, {
    method: "POST",
    body: JSON.stringify(data)
  })
    .then(r => r.text())
    .then(msg => {
      alert(msg);
      loadStudentListForStaff(true); // refresh
    })
    .catch(err => alert(err));
}

/* ===================== OFFICE SUBMIT ===================== */
function submitOffice() {
  const data = {
    role: "office",
    sid: o_sid.value,
    name: o_name.value,
    by: o_by.value,
    action: o_action.value,
    remark: o_remark.value
  };

  fetch(APP_URL, {
    method: "POST",
    body: JSON.stringify(data)
  })
    .then(r => r.text())
    .then(msg => {
      alert(msg);
      officeForm.reset();
      loadStudentListForStaff(true); // refresh
    })
    .catch(err => alert(err));
}

/* ===================== DASHBOARD ===================== */
function loadDashboard() {
  fetch(APP_URL + "?action=dashboard")
    .then(res => res.json())
    .then(d => {
      d_total.innerText = d.total;
      d_continue.innerText = d.continue;
      d_drop.innerText = d.drop;
      d_undecided.innerText = d.undecided;
      d_advisor.innerText = d.advisor;
      d_office.innerText = d.office;
    });
}
loadDashboard();

/* ===================== STUDENT LIST ===================== */
let studentListCache = null;

function loadStudentListForStaff(force = false) {
  if (studentListCache && !force) {
    renderStudentTable(studentListCache);
    return;
  }

  fetch(APP_URL + "?action=studentList")
    .then(res => res.json())
    .then(data => {
      studentListCache = data;
      renderStudentTable(data);
    })
    .catch(err => {
      console.error(err);
      alert("Failed to load student feedback list");
    });
}

function renderStudentTable(data) {
  if (!data || data.length < 2) return;

  const headers = data[0];
  const rows = data.slice(1);

  const thead = document.querySelector("#studentTable thead");
  const tbody = document.querySelector("#studentTable tbody");

  thead.innerHTML = "";
  tbody.innerHTML = "";

  const idx = {
    id: headers.indexOf("Student ID"),
    name: headers.indexOf("Student Name"),
    decision: headers.indexOf("Decision"),
    dept: headers.indexOf("Department"),
    reason: headers.indexOf("Reason")
  };

  thead.innerHTML = `
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Decision</th>
      <th>Department</th>
      <th>Reason</th>
    </tr>
  `;
  const frag = document.createDocumentFragment();

  rows.forEach(row => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row[idx.id] || ""}</td>
      <td>${row[idx.name] || ""}</td>
      <td>${row[idx.decision] || ""}</td>
      <td>${row[idx.dept] || ""}</td>
      <td>${row[idx.reason] || ""}</td>
    `;
    frag.appendChild(tr);
  });

  tbody.appendChild(frag);
}

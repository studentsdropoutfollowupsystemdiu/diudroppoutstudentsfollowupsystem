/* ===================== ELEMENTS ===================== */
const studentBox     = document.getElementById("studentBox");
const advisorBox     = document.getElementById("advisorBox");
const officeBox      = document.getElementById("officeBox");
const studentListBox = document.getElementById("studentListBox");

const APP_URL = "https://script.google.com/macros/s/AKfycbyE4Z7fC340BGZ_31WPGLVQoAQMEVMwCsBe0hUi-3ezASdar6wUJ0L5jpyLzZ-rMUBw/exec";

/* ===================== ROLE SWITCH ===================== */
function showSection(role) {

  studentBox.style.display = "none";
  advisorBox.style.display = "none";
  officeBox.style.display  = "none";
  studentListBox.style.display = "none";

  if (role === "student") {
    studentBox.style.display = "block";
    return;
  }

  if (role === "advisor") {
    loginAndVerify("advisor");
    return;
  }

  if (role === "office") {
    loginAndVerify("office");
    return;
  }
}

/* ===================== LOGIN + VERIFY ===================== */
async function loginAndVerify(role) {

  let email = prompt("Enter your official DIU email:");

  if (!email) {
    alert("Email is required.");
    return;
  }

  email = email.toLowerCase().trim();

  try {

    const res = await fetch(
      `${APP_URL}?action=verifyAccess&role=${role}&email=${encodeURIComponent(email)}`
    );

    const data = await res.json();

    if (data.authorized) {

      localStorage.setItem("loggedEmail", email);

      if (role === "advisor") {
        advisorBox.style.display = "block";
      }

      if (role === "office") {
        officeBox.style.display = "block";
      }

      studentListBox.style.display = "block";
      loadStudentListForStaff(true);

    } else {
      alert("You are not authorized for this role.");
    }

  } catch (err) {
    console.error(err);
    alert("Server error. Please try again.");
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
  .then(res => res.text())
  .then(msg => {
    alert(msg);
    studentForm.reset();
  })
  .catch(() => alert("Submission failed"));
}

/* ===================== ADVISOR SUBMIT ===================== */
function submitAdvisor() {

  const loggedEmail = localStorage.getItem("loggedEmail");

  if (!loggedEmail) {
    alert("Session expired. Please login again.");
    return;
  }

  const data = {
    role: "advisor",
    advisorEmail: loggedEmail,
    studentEmail: a_email.value,
    sid: a_sid.value,
    name: a_name.value,
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
  .then(res => res.text())
  .then(msg => {
    alert(msg);
    loadStudentListForStaff(true);
  })
  .catch(() => alert("Advisor submission failed"));
}

/* ===================== OFFICE SUBMIT ===================== */
function submitOffice() {

  const data = {
    role: "office",
    email: localStorage.getItem("loggedEmail"), // important
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
  .then(res => res.text())
  .then(msg => {
    alert(msg);
    officeForm.reset();
    loadStudentListForStaff(true);
  })
  .catch(() => alert("Office submission failed"));
}

/* ===================== DASHBOARD ===================== */
function loadDashboard() {

  fetch(APP_URL + "?action=dashboard")
  .then(res => res.json())
  .then(d => {
    if (!d) return;

    d_total.innerText     = d.total || 0;
    d_continue.innerText  = d.continue || 0;
    d_drop.innerText      = d.drop || 0;
    d_undecided.innerText = d.undecided || 0;
    d_advisor.innerText   = d.advisor || 0;
    d_office.innerText    = d.office || 0;
  })
  .catch(err => console.error("Dashboard load error:", err));
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
  .catch(() => alert("Failed to load student list"));
}

function renderStudentTable(data) {

  if (!data || data.length < 2) return;

  const headers = data[0];
  const rows = data.slice(1);

  const thead = document.querySelector("#studentTable thead");
  const tbody = document.querySelector("#studentTable tbody");

  thead.innerHTML = `
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Decision</th>
      <th>Department</th>
      <th>Reason</th>
    </tr>
  `;

  tbody.innerHTML = "";

  const idx = {
    id: headers.indexOf("Student ID"),
    name: headers.indexOf("Student Name"),
    decision: headers.indexOf("Decision"),
    dept: headers.indexOf("Department"),
    reason: headers.indexOf("Reason")
  };

  rows.forEach(row => {

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${row[idx.id] || ""}</td>
      <td>${row[idx.name] || ""}</td>
      <td>${row[idx.decision] || ""}</td>
      <td>${row[idx.dept] || ""}</td>
      <td>${row[idx.reason] || ""}</td>
    `;

    tbody.appendChild(tr);
  });
}

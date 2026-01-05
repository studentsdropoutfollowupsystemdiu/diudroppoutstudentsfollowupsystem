const APP_URL = "https://script.google.com/macros/s/AKfycbwAo0qWQvekI8-aLRDZyH2R0mANoPkjp3by_x7xRq83UMi0GMCwerJGFSdf7p7N6t-6uA/exec";

/* ---------- SHOW SECTION ---------- */
function showSection(role) {
  studentBox.style.display = "none";
  advisorBox.style.display = "none";
  officeBox.style.display = "none";

  if (role === "student") studentBox.style.display = "block";
  if (role === "advisor") advisorBox.style.display = "block";
  if (role === "office") officeBox.style.display = "block";
}

/* ---------- STUDENT SUBMIT ---------- */
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

/* ---------- ADVISOR SUBMIT ---------- */
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
    .then(alert)
    .catch(err => alert(err));
}

/* ---------- OFFICE SUBMIT ---------- */
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
    })
    .catch(err => alert(err));
}

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
/************ EMAIL ************/
function sendStudentEmail(email, name) {
  if (!email) return;

  const subject = "DIU Academic Follow-up Notification";
  const body =
    "Dear " + name + ",\n\n" +
    "Your academic status has been reviewed by your advisor.\n" +
    "Please stay in contact with the university for further instructions.\n\n" +
    "Regards,\n" +
    "DIU Academic Office";

  MailApp.sendEmail(email, subject, body);
}

/************ SMS ************/
function sendGuardianSMS(phone, studentName) {
  if (!phone) return;

  const message =
    "DIU Notice: Guardian of " + studentName +
    ", your student’s academic case has been reviewed. Please stay in contact with DIU.";

  UrlFetchApp.fetch(SMS_API_URL, {
    method: "post",
    payload: {
      user: SMS_USER,
      api_key: SMS_API_KEY,
      senderid: SMS_SENDER,
      contacts: phone,
      msg: message
    },
    muteHttpExceptions: true
  });
}
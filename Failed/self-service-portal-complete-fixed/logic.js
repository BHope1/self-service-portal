let categories = {
  "Microsoft 365": {
    steps: [
      "Check your internet connection.",
      "Try restarting Outlook or Teams.",
      "Clear cache: File → Options → Advanced → Clear.",
      "If issue persists, log out and log back in."
    ],
    pdf: ""
  },
  "Citrix": {
    steps: [
      "Ensure Citrix Workspace is installed.",
      "Reboot your machine and try reconnecting.",
      "Clear local Citrix cache (AppData\\Local\\Citrix\\ICAClient).",
      "If needed, uninstall and reinstall Citrix Workspace."
    ],
    pdf: ""
  },
  "VPN": {
    steps: [
      "Verify Cisco VPN is connected.",
      "Check your home/office internet connection.",
      "Re-enter your VPN credentials.",
      "Restart your machine and try again."
    ],
    pdf: ""
  },
  "Account Access": {
    steps: [
      "Check if CAPS LOCK is on when typing your password.",
      "Use the Self-Service Password Reset tool if available.",
      "Ensure your account isn’t locked from too many failed logins.",
      "Call the Help Desk at ext. 1234 if you still can’t log in."
    ],
    pdf: ""
  }
};

let isAdmin = false;

const toggleTheme = () => {
  const body = document.body;
  const currentTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  body.classList.remove(`${currentTheme}-mode`);
  body.classList.add(`${newTheme}-mode`);
  localStorage.setItem('theme', newTheme);
};

function loadCategoryContent(category) {
  const guideSection = document.getElementById("troubleshootingSteps");

  if (category === "🔐 Admin Login") {
    const password = prompt("Enter admin password:");
    if (password === "admin123") {
      isAdmin = true;
      alert("Admin mode enabled.");
    } else {
      alert("Incorrect password.");
    }
    return;
  }

  const data = categories[category];
  if (!data) return;

  const stepsHtml = data.steps.map(step => `<li>${step}</li>`).join("");
  const pdfHtml = data.pdf ? `<p><a href="\${data.pdf}" target="_blank">Download Full PDF Guide</a></p>` : "";
  let editBtn = isAdmin ? `<button class="edit-btn" onclick="editCategory('\${category}')">Edit</button>` : "";

  guideSection.innerHTML = `
    <h2>\${category} Troubleshooting</h2>
    <ol>\${stepsHtml}</ol>
    \${pdfHtml}
    \${editBtn}
  `;
}

function editCategory(category) {
  const data = categories[category];
  const stepsJoined = data.steps.join("\n");
  const guideSection = document.getElementById("troubleshootingSteps");

  guideSection.innerHTML = \`
    <h2>Edit: \${category}</h2>
    <label>Steps (one per line):</label><br>
    <textarea id="editSteps" rows="8" style="width:100%">\${stepsJoined}</textarea><br><br>
    <label>PDF Link:</label><br>
    <input id="editPDF" type="text" style="width:100%" value="\${data.pdf || ''}"><br><br>
    <button onclick="saveCategory('\${category}')">Save</button>
    <button onclick="loadCategoryContent('\${category}')">Cancel</button>
  \`;
}

function saveCategory(category) {
  const newSteps = document.getElementById("editSteps").value.split("\n").filter(line => line.trim() !== "");
  const newPDF = document.getElementById("editPDF").value.trim();
  categories[category] = {
    steps: newSteps,
    pdf: newPDF
  };
  alert("Changes saved (not persisted after restart).");
  loadCategoryContent(category);
}

window.onload = () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.classList.add(`${savedTheme}-mode`);

  document.getElementById('themeToggle').addEventListener('click', toggleTheme);

  document.querySelectorAll('.category').forEach(btn => {
    btn.addEventListener('click', () => {
      loadCategoryContent(btn.textContent);
    });
  });

  document.getElementById('escalateBtn').addEventListener('click', () => {
    alert("Redirecting to ServiceNow...");
  });

  document.getElementById('searchInput').addEventListener('input', (e) => {
    const value = e.target.value.toLowerCase();
    const guideSection = document.getElementById("troubleshootingSteps");

    if (!value) {
      guideSection.innerHTML = "<p>Select a category to get started.</p>";
      return;
    }

    const match = Object.entries(categories).find(([key, val]) => {
      return key.toLowerCase().includes(value) ||
             val.steps.some(step => step.toLowerCase().includes(value));
    });

    if (match) {
      const [matchedCategory, data] = match;
      const stepsHtml = data.steps.map(step => `<li>${step}</li>`).join("");
      const pdfHtml = data.pdf ? `<p><a href="\${data.pdf}" target="_blank">Download Full PDF Guide</a></p>` : "";
      let editBtn = isAdmin ? `<button class="edit-btn" onclick="editCategory('\${matchedCategory}')">Edit</button>` : "";

      guideSection.innerHTML = \`
        <h2>\${matchedCategory} Troubleshooting</h2>
        <ol>\${stepsHtml}</ol>
        \${pdfHtml}
        \${editBtn}
      \`;
    } else {
      guideSection.innerHTML = "<p>No matches found.</p>";
    }
  });
};
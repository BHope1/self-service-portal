const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');
const dataFile = path.join(__dirname, 'data.json');
let categories = {};
let isAdmin = false;
let currentCategory = null;

function loadCategoriesFromFile() {
    if (fs.existsSync(dataFile)) {
        const raw = fs.readFileSync(dataFile);
        categories = JSON.parse(raw);
    } else {
        categories = {
            "Microsoft 365": {
                steps: ["Check internet connection", "Restart Outlook", "Clear credential cache"],
                pdf: ""
            },
            "Citrix": {
                steps: ["Ensure Citrix Workspace is installed", "Clear Citrix cache", "Reconnect to session"],
                pdf: ""
            },
            "VPN": {
                steps: ["Open Cisco VPN", "Use hospital login", "Verify Duo push"],
                pdf: ""
            },
            "Account Access": {
                steps: ["Unlock account", "Reset password via self-service", "Call Service Desk if locked out"],
                pdf: ""
            }
        };
        fs.writeFileSync(dataFile, JSON.stringify(categories, null, 2));
    }
}

function saveCategoriesToFile() {
    fs.writeFileSync(dataFile, JSON.stringify(categories, null, 2));
}

function updateAdminUI() {
    const logoutBtn = document.getElementById("logoutBtn");
    if (isAdmin && !logoutBtn) {
        const button = document.createElement("button");
        button.id = "logoutBtn";
        button.textContent = "Log Out";
        button.style.marginLeft = "10px";
        button.addEventListener("click", () => {
            isAdmin = false;
            alert("Admin logged out.");
            document.getElementById("logoutBtn").remove();
            document.getElementById("troubleshootingSteps").innerHTML =
                "<h2>Troubleshooting Guide</h2><p>Select a category to get started.</p>";
        });
        document.getElementById("adminControls").appendChild(button);
    }
}

function loadCategoryContent(category) {
    currentCategory = category;
    const guideSection = document.getElementById("troubleshootingSteps");
    const data = categories[category];
    if (!data) return;

    const stepsHtml = data.steps.map(step => `<li>${step}</li>`).join("");
    const pdfHtml = data.pdf ? `<p><a href="${data.pdf}" target="_blank">Download Full PDF Guide</a></p>` : "";
    const editBtn = isAdmin ? `<button onclick="editCategory('${category}')">Edit</button>` : "";

    guideSection.innerHTML = `
        <h2>${category}</h2>
        <ol>${stepsHtml}</ol>
        ${pdfHtml}
        ${editBtn}
    `;
}

function editCategory(category) {
    const guideSection = document.getElementById("troubleshootingSteps");
    const data = categories[category];
    const textareaValue = data.steps.join("\n");
    const pdfValue = data.pdf;

    guideSection.innerHTML = `
        <h2>Edit: ${category}</h2>
        <label for="editSteps">Steps (one per line):</label><br>
        <textarea id="editSteps" rows="8" style="width:100%">${textareaValue}</textarea><br><br>
        <label for="editPdf">PDF Link (optional):</label><br>
        <input type="text" id="editPdf" style="width:100%" value="${pdfValue}"/><br><br>
        <button onclick="saveCategory('${category}')">Save</button>
        <button onclick="cancelEdit()">Cancel</button>
    `;
}

function cancelEdit() {
    if (currentCategory) loadCategoryContent(currentCategory);
}

function saveCategory(category) {
    const newSteps = document.getElementById("editSteps").value.split("\n").map(s => s.trim()).filter(Boolean);
    const newPdf = document.getElementById("editPdf").value.trim();
    categories[category].steps = newSteps;
    categories[category].pdf = newPdf;
    saveCategoriesToFile();
    alert("Steps updated and saved.");
    loadCategoryContent(category);
}

function initApp() {
    loadCategoriesFromFile();

    document.querySelectorAll(".category").forEach(btn => {
        btn.addEventListener("click", () => loadCategoryContent(btn.textContent));
    });

    document.getElementById("adminLoginBtn").addEventListener("click", () => {
        document.getElementById("adminModal").style.display = "flex";
    });

    document.getElementById("submitAdminLogin").addEventListener("click", () => {
        const passwordInput = document.getElementById("adminPassword").value;
        isAdmin = (passwordInput === "admin123");
        alert(isAdmin ? "Admin mode enabled." : "Incorrect password.");
        document.getElementById("adminModal").style.display = "none";
        updateAdminUI();
    });

    document.getElementById("closeAdminModal").addEventListener("click", () => {
        document.getElementById("adminModal").style.display = "none";
    });

    document.getElementById("themeToggle").addEventListener("click", () => {
        const body = document.body;
        if (body.classList.contains("dark-mode")) {
            body.classList.remove("dark-mode");
            body.classList.add("light-mode");
        } else {
            body.classList.remove("light-mode");
            body.classList.add("dark-mode");
        }
    });

    document.getElementById("searchInput").addEventListener("input", (e) => {
        const value = e.target.value.toLowerCase().trim();
        const guideSection = document.getElementById("troubleshootingSteps");

        let matchFound = false;

        Object.entries(categories).forEach(([category, data]) => {
            if (
                category.toLowerCase().includes(value) ||
                data.steps.some(step => step.toLowerCase().includes(value))
            ) {
                currentCategory = category;
                const stepsHtml = data.steps.map(step => `<li>${step}</li>`).join("");
                const pdfHtml = data.pdf ? `<p><a href="${data.pdf}" target="_blank">Download Full PDF Guide</a></p>` : "";
                const editBtn = isAdmin ? `<button onclick="editCategory('${category}')">Edit</button>` : "";

                guideSection.innerHTML = `
                    <h2>${category}</h2>
                    <ol>${stepsHtml}</ol>
                    ${pdfHtml}
                    ${editBtn}
                `;
                matchFound = true;
            }
        });

        if (!matchFound && value !== "") {
            guideSection.innerHTML = "<p>No results found.</p>";
        }
    });

    document.getElementById("escalateBtn").addEventListener("click", () => {
        alert("Redirecting to ServiceNow...");
    });

    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.classList.add(`${savedTheme}-mode`);
}

document.addEventListener("DOMContentLoaded", initApp);
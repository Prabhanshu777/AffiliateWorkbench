// ==========================================================
// AFFILIATE DEAL WORKBENCH - SETTINGS & STORAGE MANAGEMENT
// ==========================================================

var STORAGE_KEY = "affiliateDeals";

/**
 * Calculates storage metrics and updates the UI counters.
 */
function updateStorageMetrics() {
    var rawData = localStorage.getItem(STORAGE_KEY) || "[]";
    var deals = [];

    try {
        deals = JSON.parse(rawData);
    } catch (e) {
        deals = [];
    }

    // 1. Total deals count
    var totalEl = document.getElementById("metricTotalDeals");
    if (totalEl) {
        totalEl.textContent = deals.length;
    }

    // 2. LocalStorage footprint in KB
    var bytes = new Blob([rawData]).size;
    var kbUsed = (bytes / 1024).toFixed(2);
    var storageEl = document.getElementById("metricStorageUsed");
    if (storageEl) {
        storageEl.textContent = kbUsed + " KB";
    }
}

/**
 * Exports stored deals as a downloadable JSON file.
 */
function exportDealsJSON() {
    var rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData || rawData === "[]") {
        alert("No saved deals to export.");
        return;
    }

    var blob = new Blob([rawData], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var timestamp = new Date().toISOString().slice(0, 10);

    var link = document.createElement("a");
    link.href = url;
    link.download = "workbench-deals-backup-" + timestamp + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(function() {
        URL.revokeObjectURL(url);
    }, 2000);
}

/**
 * Triggers the hidden file selector for JSON import.
 */
function triggerImportDialog() {
    var fileInput = document.getElementById("importFileInput");
    if (fileInput) {
        fileInput.value = "";
        fileInput.click();
    }
}

/**
 * Reads, validates, and merges an uploaded JSON backup.
 */
function handleFileImport(event) {
    var file = event.target.files && event.target.files[0];
    var statusEl = document.getElementById("importStatus");
    if (!file) return;

    var reader = new FileReader();
    reader.onload = function(e) {
        try {
            var importedDeals = JSON.parse(e.target.result);

            if (!Array.isArray(importedDeals)) {
                throw new Error("Invalid format. Backup file must contain a JSON list of deals.");
            }

            // Existing records
            var currentRaw = localStorage.getItem(STORAGE_KEY) || "[]";
            var currentDeals = JSON.parse(currentRaw);

            // Merge deals by matching ID or appending new ones
            var merged = importedDeals.concat(currentDeals.filter(function(curr) {
                return !importedDeals.some(function(imp) { return imp.id === curr.id; });
            }));

            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));

            if (statusEl) {
                statusEl.className = "status-msg status-success";
                statusEl.textContent = "✅ Successfully imported " + importedDeals.length + " deal(s).";
            }

            updateStorageMetrics();
        } catch (err) {
            if (statusEl) {
                statusEl.className = "status-msg status-error";
                statusEl.textContent = "❌ Import failed: " + err.message;
            }
        }
    };

    reader.readAsText(file);
}

/**
 * Purges all deals without removing user theme preferences.
 */
function resetAllDeals() {
    localStorage.removeItem(STORAGE_KEY);
    updateStorageMetrics();

    var statusEl = document.getElementById("importStatus");
    if (statusEl) {
        statusEl.className = "status-msg status-success";
        statusEl.textContent = "🗑️ All saved deals cleared.";
    }
}

// ==========================================================
// INITIALIZATION
// ==========================================================

function initSettings() {
    updateStorageMetrics();

    var exportBtn = document.getElementById("btnExportDeals");
    if (exportBtn) exportBtn.addEventListener("click", exportDealsJSON);

    var triggerBtn = document.getElementById("btnTriggerImport");
    if (triggerBtn) triggerBtn.addEventListener("click", triggerImportDialog);

    var fileInput = document.getElementById("importFileInput");
    if (fileInput) fileInput.addEventListener("change", handleFileImport);

    var clearBtn = document.getElementById("btnClearAllData");
    if (clearBtn) clearBtn.addEventListener("click", resetAllDeals);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSettings);
} else {
    initSettings();
}

// ==========================================================
// AFFILIATE DEAL WORKBENCH - SHARED APP UTILITIES & PWA
// ==========================================================

/**
 * Automatically detects the current page file and applies the 'active' highlight.
 */
function highlightActiveNavLink() {
    var currentPath = window.location.pathname;
    var currentPage = currentPath.substring(currentPath.lastIndexOf("/") + 1);

    if (!currentPage || currentPage === "") {
        currentPage = "index.html";
    }

    var navLinks = document.querySelectorAll(".nav-links .nav-link");
    navLinks.forEach(function(link) {
        var linkHref = link.getAttribute("href");
        link.classList.remove("active");

        if (linkHref === currentPage || (currentPage === "index.html" && linkHref.endsWith("index.html"))) {
            link.classList.add("active");
        }
    });
}

/**
 * Initializes and applies the theme from LocalStorage.
 */
function initTheme() {
    var savedTheme = localStorage.getItem("workbench_theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    updateThemeToggleButton(savedTheme);
}

/**
 * Toggles between light and dark themes.
 */
window.toggleTheme = function() {
    var currentTheme = document.documentElement.getAttribute("data-theme") || "light";
    var newTheme = (currentTheme === "dark") ? "light" : "dark";
    
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("workbench_theme", newTheme);
    updateThemeToggleButton(newTheme);
};

/**
 * Updates the icon of the toggle button.
 */
function updateThemeToggleButton(theme) {
    var btn = document.getElementById("themeToggleBtn");
    if (btn) {
        btn.textContent = (theme === "dark") ? "☀️" : "🌙";
        btn.setAttribute("title", (theme === "dark") ? "Switch to Light Mode" : "Switch to Dark Mode");
    }
}

/**
 * Restores and persists horizontal navigation scroll position across page loads.
 */
function initNavScrollPersistence() {
    var navContainer = document.querySelector(".nav-links");
    if (!navContainer) return;

    var savedScroll = sessionStorage.getItem("nav_scroll_left");
    if (savedScroll !== null) {
        navContainer.scrollLeft = parseInt(savedScroll, 10);
    } else {
        var activeLink = navContainer.querySelector(".active");
        if (activeLink) {
            var activeOffset = activeLink.offsetLeft - (navContainer.clientWidth / 2) + (activeLink.clientWidth / 2);
            navContainer.scrollLeft = Math.max(0, activeOffset);
        }
    }

    navContainer.addEventListener("scroll", function() {
        sessionStorage.setItem("nav_scroll_left", navContainer.scrollLeft);
    }, { passive: true });

    var links = navContainer.querySelectorAll(".nav-link");
    links.forEach(function(link) {
        link.addEventListener("click", function() {
            sessionStorage.setItem("nav_scroll_left", navContainer.scrollLeft);
        });
    });
}

/**
 * Registers the Service Worker reliably without scope violations.
 */
function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
        window.addEventListener("load", function() {
            // Locate sw.js relative to project origin
            var swUrl = new URL("../sw.js", window.location.href).href;
            
            navigator.serviceWorker
                .register(swUrl)
                .then(function(registration) {
                    console.log("[PWA] Service Worker registered successfully:", registration.scope);
                })
                .catch(function(err) {
                    console.warn("[PWA] Service Worker registration failed:", err);
                });
        });
    }
}

/**
 * Escapes unsafe characters in plain text to prevent XSS attacks.
 */
function escapeHTML(text) {
    var div = document.createElement("div");
    div.textContent = String(text != null ? text : "");
    return div.innerHTML;
}

/**
 * Escapes unsafe characters for HTML attribute insertion.
 */
function escapeAttribute(value) {
    return String(value != null ? value : "")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/**
 * Creates a promise-based delay.
 */
function delay(ms) {
    return new Promise(function(resolve) {
        setTimeout(resolve, ms);
    });
}

// Start application helpers on DOM ready
function startApp() {
    initTheme();
    highlightActiveNavLink();
    initNavScrollPersistence();
    registerServiceWorker();

    var toggleBtn = document.getElementById("themeToggleBtn");
    if (toggleBtn) {
        toggleBtn.onclick = window.toggleTheme;
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startApp);
} else {
    startApp();
}

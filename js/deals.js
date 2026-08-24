// ==========================================================
// AFFILIATE DEAL WORKBENCH - DEAL MANAGER
// ==========================================================

var deals = [];
var editingDealId = null;

// ==========================================================
// STORAGE & RENDER OPERATIONS
// ==========================================================

function calculateDiscount(originalPrice, price) {
    var original = Number(originalPrice);
    var current = Number(price);

    if (original <= 0 || current < 0) return 0;
    return Math.round(((original - current) / original) * 100);
}

function loadDealsFromStorage() {
    try {
        var stored = localStorage.getItem("affiliateDeals");
        deals = stored ? JSON.parse(stored) : [];
    } catch (error) {
        deals = [];
    }
}

function saveDealsToStorage() {
    try {
        localStorage.setItem("affiliateDeals", JSON.stringify(deals));
    } catch (error) {
        alert("Failed to save to local storage.");
    }
}

function displayDeals(filteredDeals) {
    if (!filteredDeals) filteredDeals = deals;
    var dealList = document.getElementById("dealList");
    if (!dealList) return;

    dealList.innerHTML = "";

    if (!filteredDeals || filteredDeals.length === 0) {
        dealList.innerHTML = '<p class="no-deals">No deals found.</p>';
        return;
    }

    filteredDeals.forEach(function(deal) {
        var card = document.createElement("div");
        card.className = "deal-card";

        var couponHtml = deal.coupon ? '<p><strong>Coupon:</strong> ' + escapeHTML(deal.coupon) + '</p>' : '';
        var openHtml = deal.productUrl 
            ? '<a href="' + escapeAttribute(deal.productUrl) + '" target="_blank" rel="noopener noreferrer" class="open-button">Open Product</a>' 
            : '';

        card.innerHTML = 
            '<div class="deal-header">' +
                '<span class="deal-id">#' + escapeHTML(deal.id) + '</span>' +
                '<span class="discount-badge">' + deal.discount + '% OFF</span>' +
            '</div>' +
            '<h3>' + escapeHTML(deal.productName) + '</h3>' +
            '<p><strong>Store:</strong> ' + escapeHTML(deal.store) + '</p>' +
            '<p><strong>Deal Price:</strong> ₹' + deal.price + '</p>' +
            '<p><strong>Original Price:</strong> <span class="old-price">₹' + deal.originalPrice + '</span></p>' +
            couponHtml +
            '<div class="deal-actions">' +
                openHtml +
                '<button type="button" class="edit-button" data-id="' + escapeAttribute(deal.id) + '">Edit</button>' +
                '<button type="button" class="delete-button" data-id="' + escapeAttribute(deal.id) + '">Delete</button>' +
            '</div>';

        dealList.appendChild(card);
    });
}

function clearForm() {
    var fields = ["productName", "store", "productUrl", "price", "originalPrice", "coupon"];
    fields.forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.value = "";
    });

    editingDealId = null;
    var saveButton = document.getElementById("saveDeal");
    if (saveButton) saveButton.textContent = "Save Deal";
}

function saveDeal() {
    var productName = document.getElementById("productName").value.trim();
    var store = document.getElementById("store").value.trim();
    var productUrl = document.getElementById("productUrl").value.trim();
    var price = document.getElementById("price").value.trim();
    var originalPrice = document.getElementById("originalPrice").value.trim();
    var coupon = document.getElementById("coupon").value.trim();

    if (!productName || !store || !price || !originalPrice) {
        alert("Please fill in Product Name, Store, Deal Price, and Original Price.");
        return;
    }

    var newDeal = {
        id: editingDealId || Date.now().toString(),
        productName: productName,
        store: store,
        productUrl: productUrl,
        price: Number(price),
        originalPrice: Number(originalPrice),
        discount: calculateDiscount(originalPrice, price),
        coupon: coupon,
        updatedAt: new Date().toISOString()
    };

    if (editingDealId) {
        deals = deals.map(function(d) { return d.id === editingDealId ? newDeal : d; });
    } else {
        deals.unshift(newDeal);
    }

    saveDealsToStorage();
    displayDeals();
    clearForm();
}

function editDeal(id) {
    var deal = deals.find(function(d) { return d.id === id; });
    if (!deal) return;

    document.getElementById("productName").value = deal.productName || "";
    document.getElementById("store").value = deal.store || "";
    document.getElementById("productUrl").value = deal.productUrl || "";
    document.getElementById("price").value = deal.price != null ? deal.price : "";
    document.getElementById("originalPrice").value = deal.originalPrice != null ? deal.originalPrice : "";
    document.getElementById("coupon").value = deal.coupon || "";

    editingDealId = deal.id;
    var saveButton = document.getElementById("saveDeal");
    if (saveButton) saveButton.textContent = "Update Deal";

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteDeal(id) {
    deals = deals.filter(function(d) { return d.id !== id; });
    saveDealsToStorage();
    displayDeals();

    if (editingDealId === id) clearForm();
}

function searchDealList() {
    var searchInput = document.getElementById("searchDeals");
    if (!searchInput) return;

    var query = searchInput.value.toLowerCase().trim();
    if (!query) {
        displayDeals();
        return;
    }

    var filtered = deals.filter(function(deal) {
        return (deal.productName && deal.productName.toLowerCase().includes(query)) ||
               (deal.store && deal.store.toLowerCase().includes(query)) ||
               (deal.coupon && deal.coupon.toLowerCase().includes(query));
    });

    displayDeals(filtered);
}

// ==========================================================
// INITIALIZATION
// ==========================================================

function initDealManager() {
    loadDealsFromStorage();
    displayDeals();

    var saveButton = document.getElementById("saveDeal");
    if (saveButton) saveButton.addEventListener("click", saveDeal);

    var searchInput = document.getElementById("searchDeals");
    if (searchInput) searchInput.addEventListener("input", searchDealList);

    var dealList = document.getElementById("dealList");
    if (dealList) {
        dealList.addEventListener("click", function(event) {
            var target = event.target;
            var id = target.getAttribute("data-id");

            if (target.classList.contains("edit-button") && id) {
                editDeal(id);
            } else if (target.classList.contains("delete-button") && id) {
                deleteDeal(id);
            }
        });
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDealManager);
} else {
    initDealManager();
}

// ==========================================================
// AFFILIATE DEAL WORKBENCH - SOCIAL POST BUILDER
// ==========================================================

var deals = [];
var attachedImageUrl = null;
var attachedImageFileObject = null;

// Platform Styles & Templates
var BUILDER_TEMPLATES = {
    telegram: [
        { name: "1. 🔥 Telegram Markdown Loot", fn: function(d) {
            return "🔥 **MEGA DEAL ALERT** 🔥\n\n" +
                   "📦 **" + d.product + "**\n\n" +
                   "💥 **Offer Price:** ₹" + d.price + "\n" +
                   "❌ **MRP:** ~~₹" + d.origPrice + "~~\n" +
                   "📉 **Discount:** " + d.discount + "% OFF\n" +
                   "🏬 **Store:** " + d.store + "\n" +
                   (d.coupon ? "🎟 **Code:** `" + d.coupon + "`\n" : "") +
                   "\n🛒 **Buy Link:** " + d.url;
        }}
    ],
    instagram: [
        { name: "1. 📸 IG Link in Bio Caption", fn: function(d) {
            return "🔥 MASSIVE PRICE DROP on " + d.product + "!\n\n" +
                   "Get it at ₹" + d.price + " (MRP ₹" + d.origPrice + ") with a flat " + d.discount + "% discount on " + d.store + ".\n\n" +
                   (d.coupon ? "🎟 Apply coupon code: " + d.coupon + "\n\n" : "") +
                   "👉 Tap the link in bio to shop now before prices rise!\n\n" +
                   "#Deals #SaleAlert #SmartShopping #" + d.store.replace(/\s+/g, '');
        }}
    ],
    whatsapp: [
        { name: "1. 💬 WhatsApp Broadcast", fn: function(d) {
            return "*🔥 SPECIAL OFFER ALERT! 🔥*\n\n" +
                   "*Product:* " + d.product + "\n" +
                   "*Price:* ₹" + d.price + " (~₹" + d.origPrice + "~ - " + d.discount + "% OFF)\n" +
                   "*Store:* " + d.store + "\n" +
                   (d.coupon ? "*Coupon:* " + d.coupon + "\n" : "") +
                   "\n*Direct Order Link:* 👇\n" + d.url;
        }}
    ],
    facebook: [
        { name: "1. 📘 Facebook Community Share", fn: function(d) {
            return "📢 Huge Discount Alert!\n\n" +
                   d.product + " is currently on sale for ₹" + d.price + " (Original price ₹" + d.origPrice + " - " + d.discount + "% OFF) on " + d.store + ".\n\n" +
                   (d.coupon ? "Use Coupon: " + d.coupon + "\n\n" : "") +
                   "Order directly here 👉 " + d.url;
        }}
    ],
    twitter: [
        { name: "1. 🐦 Twitter Punchy Tweet", fn: function(d) {
            return "🔥 PRICE DROP: " + d.product + " at ₹" + d.price + " (" + d.discount + "% OFF from ₹" + d.origPrice + ") on #" + d.store.replace(/\s+/g, '') + "!\n\n" +
                   (d.coupon ? "Code: " + d.coupon + "\n" : "") +
                   "Get it here 👇\n" + d.url;
        }}
    ],
    reddit: [
        { name: "1. 🤖 Reddit Markdown Post", fn: function(d) {
            return "**[" + d.store + "] " + d.product + " - ₹" + d.price + " (" + d.discount + "% OFF)**\n\n" +
                   "* **MRP:** ₹" + d.origPrice + "\n" +
                   "* **Deal Price:** ₹" + d.price + "\n" +
                   (d.coupon ? "* **Coupon:** `" + d.coupon + "`\n" : "") +
                   "\n[Direct Link](" + d.url + ")";
        }}
    ]
};

// ==========================================================
// DATA LOADING
// ==========================================================

function loadDealsIntoDropdown() {
    var selector = document.getElementById("postDealSelector");
    if (!selector) return;

    try {
        var raw = localStorage.getItem("affiliateDeals");
        deals = raw ? JSON.parse(raw) : [];
    } catch (e) {
        deals = [];
    }

    selector.innerHTML = '<option value="">-- Choose from saved deals --</option>';

    if (deals.length === 0) {
        var opt = document.createElement("option");
        opt.value = "";
        opt.textContent = "No deals found. Add some in Deal Manager!";
        opt.disabled = true;
        selector.appendChild(opt);
        return;
    }

    deals.forEach(function(d) {
        var opt = document.createElement("option");
        opt.value = d.id;
        opt.textContent = d.productName + " (₹" + d.price + " - " + d.store + ")";
        selector.appendChild(opt);
    });
}

function updateTemplateDropdown() {
    var platform = document.getElementById("postPlatformSelect").value;
    var templateSelect = document.getElementById("postTemplateSelect");
    if (!templateSelect) return;

    var list = BUILDER_TEMPLATES[platform] || [];
    templateSelect.innerHTML = "";

    list.forEach(function(item, index) {
        var opt = document.createElement("option");
        opt.value = index;
        opt.textContent = item.name;
        templateSelect.appendChild(opt);
    });
}

// ==========================================================
// MOCKUP RENDER LOGIC
// ==========================================================

function buildPostMockup() {
    var dealId = document.getElementById("postDealSelector").value;
    var platform = document.getElementById("postPlatformSelect").value;
    var templateIdx = Number(document.getElementById("postTemplateSelect").value) || 0;

    var deal = deals.find(function(item) {
        return item.id === dealId;
    });

    if (!deal) {
        alert("Please select a valid deal from the dropdown first.");
        return;
    }

    // Update Header and Badges
    document.getElementById("mockupStoreTag").textContent = deal.store || "Online Store";
    document.getElementById("mockupPlatformBadge").textContent = platform.toUpperCase();
    document.getElementById("mockupDiscountBadge").textContent = (deal.discount || 0) + "% OFF";

    // Update Pricing
    document.getElementById("mockupDealPrice").textContent = "₹" + (deal.price != null ? deal.price : 0);
    document.getElementById("mockupOrigPrice").textContent = "₹" + (deal.originalPrice != null ? deal.originalPrice : 0);

    // Update Coupon
    var couponBox = document.getElementById("mockupCouponBox");
    if (deal.coupon && deal.coupon.trim() !== "") {
        couponBox.style.display = "block";
        document.getElementById("mockupCouponCode").textContent = deal.coupon;
    } else {
        couponBox.style.display = "none";
    }

    // Render Caption
    var dData = {
        product: deal.productName || "Product",
        store: deal.store || "Store",
        price: deal.price || 0,
        origPrice: deal.originalPrice || deal.price || 0,
        discount: deal.discount || 0,
        coupon: deal.coupon || "",
        url: deal.productUrl || "https://example.com"
    };

    var templateObj = (BUILDER_TEMPLATES[platform] && BUILDER_TEMPLATES[platform][templateIdx])
        ? BUILDER_TEMPLATES[platform][templateIdx]
        : BUILDER_TEMPLATES[platform][0];

    document.getElementById("postCaptionOutput").value = templateObj.fn(dData);
}

// ==========================================================
// IMAGE ATTACHMENT HANDLER
// ==========================================================

function handleImageUpload(e) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;

    attachedImageFileObject = file;

    if (attachedImageUrl) {
        URL.revokeObjectURL(attachedImageUrl);
    }

    attachedImageUrl = URL.createObjectURL(file);

    var img = document.getElementById("mockupImage");
    var placeholder = document.getElementById("mockupImagePlaceholder");

    img.src = attachedImageUrl;
    img.style.display = "block";
    placeholder.style.display = "none";
}

// ==========================================================
// ACTION BUTTONS
// ==========================================================

/**
 * Triggers the device's native sharing sheet with text and image.
 */
async function shareViaNativeApp() {
    var caption = document.getElementById("postCaptionOutput").value;
    if (!caption || caption.trim() === "") {
        alert("Build a preview card first!");
        return;
    }

    if (!navigator.share) {
        alert("Web Share is not supported on this browser. You can use 'Copy Caption' instead.");
        return;
    }

    var sharePayload = {
        title: "Deal Alert",
        text: caption
    };

    // Attach file if supported by device
    if (attachedImageFileObject && navigator.canShare && navigator.canShare({ files: [attachedImageFileObject] })) {
        sharePayload.files = [attachedImageFileObject];
    }

    try {
        await navigator.share(sharePayload);
    } catch (err) {
        if (err.name !== "AbortError") {
            console.error("Native share error:", err);
        }
    }
}

async function copyCaptionText() {
    var caption = document.getElementById("postCaptionOutput").value;
    var btn = document.getElementById("btnCopyCaption");

    if (!caption || caption.trim() === "") {
        alert("Build a preview card first!");
        return;
    }

    try {
        await navigator.clipboard.writeText(caption);
        btn.textContent = "✅ Copied!";
        setTimeout(function() {
            btn.textContent = "📋 Copy Caption";
        }, 2000);
    } catch (err) {
        var textarea = document.getElementById("postCaptionOutput");
        textarea.select();
        document.execCommand("copy");
        alert("Caption copied to clipboard!");
    }
}

function openTargetProductUrl() {
    var dealId = document.getElementById("postDealSelector").value;
    var deal = deals.find(function(item) {
        return item.id === dealId;
    });

    if (deal && deal.productUrl) {
        window.open(deal.productUrl, "_blank", "noopener,noreferrer");
    } else {
        alert("No product URL is saved for this deal.");
    }
}

// ==========================================================
// INITIALIZATION
// ==========================================================

function initPostBuilder() {
    loadDealsIntoDropdown();
    updateTemplateDropdown();

    document.getElementById("btnRefreshDeals").addEventListener("click", loadDealsIntoDropdown);
    document.getElementById("postPlatformSelect").addEventListener("change", updateTemplateDropdown);
    document.getElementById("postDealSelector").addEventListener("change", buildPostMockup);
    document.getElementById("postImageInput").addEventListener("change", handleImageUpload);
    document.getElementById("btnBuildPost").addEventListener("click", buildPostMockup);

    document.getElementById("btnNativeShare").addEventListener("click", shareViaNativeApp);
    document.getElementById("btnCopyCaption").addEventListener("click", copyCaptionText);
    document.getElementById("btnOpenStore").addEventListener("click", openTargetProductUrl);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPostBuilder);
} else {
    initPostBuilder();
}

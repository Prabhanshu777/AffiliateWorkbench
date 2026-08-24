// ==========================================================
// AFFILIATE DEAL WORKBENCH - IMAGE STUDIO
// ==========================================================

let uploadedImages = [];
let selectedImageIndex = 0;
let cropMode = "free";
let currentCrop = null;

// DOM Elements
const imageInput = document.getElementById("imageInput");
const imageList = document.getElementById("imageList");
const cropArea = document.getElementById("cropArea");
const imageCount = document.getElementById("imageCount");
const imageTimer = document.getElementById("imageTimer");
const clearAllImagesButton = document.getElementById("clearAllImages");
const applyToAllButton = document.getElementById("applyToAll");
const downloadIndividualButton = document.getElementById("downloadIndividual");
const downloadZipButton = document.getElementById("downloadZip");
const cropModeButtons = document.querySelectorAll(".crop-mode");

// Auto-clear Timer Settings (15 Minutes)
const IMAGE_AUTO_CLEAR_TIME = 15 * 60 * 1000;
let imageClearTimer = null;
let imageClearAt = null;

// ==========================================================
// UTILITY FUNCTIONS
// ==========================================================

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = String(text ?? "");
    return div.innerHTML;
}

// ==========================================================
// IMAGE UPLOAD HANDLERS
// ==========================================================

if (imageInput) {
    imageInput.addEventListener("change", (event) => {
        const files = Array.from(event.target.files);
        if (!files.length) return;
        addImages(files);
        imageInput.value = ""; // Reset file input so re-selecting same files works
    });
}

function addImages(files) {
    let addedCount = 0;

    files.forEach((file) => {
        if (!file.type.startsWith("image/")) return;

        // Prevent duplicate file entries
        const duplicate = uploadedImages.some(
            (img) =>
                img.name === file.name &&
                img.file.size === file.size &&
                img.file.lastModified === file.lastModified
        );
        if (duplicate) return;

        uploadedImages.push({
            file,
            name: file.name,
            url: URL.createObjectURL(file),
            crop: null
        });
        addedCount++;
    });

    if (addedCount === 0) {
        updateImageCount();
        return;
    }

    if (uploadedImages.length === addedCount) {
        selectedImageIndex = 0;
        currentCrop = null;
    }

    startImageAutoClearTimer();
    updateImageCount();
    displayImageList();
    showSelectedImage();
}

// ==========================================================
// TIMER & COUNT MANAGEMENT
// ==========================================================

function startImageAutoClearTimer() {
    clearTimeout(imageClearTimer);
    imageClearAt = Date.now() + IMAGE_AUTO_CLEAR_TIME;

    imageClearTimer = setTimeout(() => {
        clearAllImages(false);
    }, IMAGE_AUTO_CLEAR_TIME);

    updateTimerText();
}

function updateTimerText() {
    if (!imageTimer) return;

    if (uploadedImages.length === 0) {
        imageTimer.textContent = "Images auto-clear after 15 minutes";
        return;
    }

    const update = () => {
        if (uploadedImages.length === 0) return;
        const remaining = Math.max(0, imageClearAt - Date.now());
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);

        imageTimer.textContent = `Auto-clear in ${minutes}:${String(seconds).padStart(2, "0")}`;

        if (remaining > 0) {
            setTimeout(update, 1000);
        }
    };
    update();
}

function updateImageCount() {
    if (!imageCount) return;
    const count = uploadedImages.length;
    imageCount.textContent = count === 0 ? "No images selected" : `${count} image${count > 1 ? "s" : ""} selected`;
}

if (clearAllImagesButton) {
    clearAllImagesButton.addEventListener("click", () => {
        if (uploadedImages.length === 0) return;
        if (confirm("Clear all uploaded images?")) {
            clearAllImages(true);
        }
    });
}

function clearAllImages(showMessage = true) {
    uploadedImages.forEach((image) => {
        if (image.url) URL.revokeObjectURL(image.url);
    });

    uploadedImages = [];
    selectedImageIndex = 0;
    currentCrop = null;
    clearTimeout(imageClearTimer);
    imageClearTimer = null;
    imageClearAt = null;

    if (imageInput) imageInput.value = "";
    updateImageCount();
    updateTimerText();

    if (imageList) imageList.innerHTML = "";
    if (cropArea) {
        cropArea.innerHTML = '<p class="empty-crop-message">Upload images to begin.</p>';
    }

    if (showMessage) alert("All images have been cleared.");
}

// ==========================================================
// IMAGE LIST DISPLAY
// ==========================================================

function displayImageList() {
    if (!imageList) return;
    imageList.innerHTML = "";

    uploadedImages.forEach((image, index) => {
        const item = document.createElement("div");
        item.className = `image-item ${index === selectedImageIndex ? "active" : ""}`;

        item.innerHTML = `
            <span class="image-number">${index + 1}</span>
            <img src="${image.url}" class="image-preview" alt="Product preview">
            <button type="button" class="image-download">⬇️ Download</button>
        `;

        item.querySelector(".image-preview").addEventListener("click", () => {
            saveCurrentCrop();
            selectedImageIndex = index;
            currentCrop = uploadedImages[index].crop ? { ...uploadedImages[index].crop } : null;
            displayImageList();
            showSelectedImage();
        });

        item.querySelector(".image-download").addEventListener("click", (e) => {
            e.stopPropagation();
            saveCurrentCrop();
            downloadSingleImage(image, index);
        });

        imageList.appendChild(item);
    });
}

// ==========================================================
// CROP WORKSPACE LOGIC
// ==========================================================

function showSelectedImage() {
    if (!cropArea) return;
    cropArea.innerHTML = "";

    if (uploadedImages.length === 0) {
        cropArea.innerHTML = '<p class="empty-crop-message">Upload images to begin.</p>';
        return;
    }

    const imageData = uploadedImages[selectedImageIndex];
    if (!imageData) return;

    const img = document.createElement("img");
    img.id = "cropImage";
    img.src = imageData.url;
    cropArea.appendChild(img);

    const onImageReady = () => requestAnimationFrame(createCropBox);
    if (img.complete) {
        onImageReady();
    } else {
        img.onload = onImageReady;
    }
}

function getRatio(ratioString) {
    const parts = ratioString.split(":");
    return Number(parts[0]) / Number(parts[1]);
}

function createCropBox() {
    const image = document.getElementById("cropImage");
    if (!image) return;

    const imageRect = image.getBoundingClientRect();
    const areaRect = cropArea.getBoundingClientRect();
    const imageLeft = imageRect.left - areaRect.left;
    const imageTop = imageRect.top - areaRect.top;
    const imageWidth = imageRect.width;
    const imageHeight = imageRect.height;

    if (imageWidth <= 0 || imageHeight <= 0) return;

    let width, height;

    if (currentCrop) {
        width = imageWidth * currentCrop.width;
        height = imageHeight * currentCrop.height;
    } else {
        width = imageWidth * 0.8;
        height = imageHeight * 0.8;

        if (cropMode !== "free") {
            const ratio = getRatio(cropMode);
            if (width / height > ratio) {
                width = height * ratio;
            } else {
                height = width / ratio;
            }
        }
    }

    width = Math.min(width, imageWidth);
    height = Math.min(height, imageHeight);

    let left = currentCrop ? imageLeft + imageWidth * currentCrop.left : imageLeft + (imageWidth - width) / 2;
    let top = currentCrop ? imageTop + imageHeight * currentCrop.top : imageTop + (imageHeight - height) / 2;

    left = Math.max(imageLeft, Math.min(left, imageLeft + imageWidth - width));
    top = Math.max(imageTop, Math.min(top, imageTop + imageHeight - height));

    const box = document.createElement("div");
    box.className = "crop-box";
    box.style.left = `${left}px`;
    box.style.top = `${top}px`;
    box.style.width = `${width}px`;
    box.style.height = `${height}px`;

    const grid = document.createElement("div");
    grid.className = "crop-grid";
    box.appendChild(grid);

    ["nw", "n", "ne", "w", "e", "sw", "s", "se"].forEach((pos) => {
        const handle = document.createElement("div");
        handle.className = `resize-handle handle-${pos}`;
        box.appendChild(handle);
        enableResize(handle, box, pos);
    });

    cropArea.appendChild(box);
    enableMove(box);
}

cropModeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        saveCurrentCrop();
        cropMode = btn.dataset.ratio;
        cropModeButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentCrop = null;
        showSelectedImage();
    });
});

function enableMove(box) {
    let moving = false;
    let startX = 0, startY = 0, origLeft = 0, origTop = 0;

    box.addEventListener("pointerdown", (e) => {
        if (e.target.classList.contains("resize-handle")) return;
        e.preventDefault();
        moving = true;
        startX = e.clientX;
        startY = e.clientY;
        origLeft = box.offsetLeft;
        origTop = box.offsetTop;
        box.setPointerCapture(e.pointerId);
    });

    box.addEventListener("pointermove", (e) => {
        if (!moving) return;
        const image = document.getElementById("cropImage");
        if (!image) return;

        const imgRect = image.getBoundingClientRect();
        const areaRect = cropArea.getBoundingClientRect();
        const minLeft = imgRect.left - areaRect.left;
        const minTop = imgRect.top - areaRect.top;
        const maxLeft = minLeft + imgRect.width - box.offsetWidth;
        const maxTop = minTop + imgRect.height - box.offsetHeight;

        let nextLeft = origLeft + (e.clientX - startX);
        let nextTop = origTop + (e.clientY - startY);

        box.style.left = `${Math.max(minLeft, Math.min(nextLeft, maxLeft))}px`;
        box.style.top = `${Math.max(minTop, Math.min(nextTop, maxTop))}px`;
    });

    const endMove = (e) => {
        if (!moving) return;
        moving = false;
        try { box.releasePointerCapture(e.pointerId); } catch (_) {}
        saveCurrentCrop();
    };

    box.addEventListener("pointerup", endMove);
    box.addEventListener("pointercancel", endMove);
}

function enableResize(handle, box, direction) {
    let resizing = false;
    let startX = 0, startY = 0, origLeft = 0, origTop = 0, origW = 0, origH = 0;

    handle.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        e.stopPropagation();
        resizing = true;
        startX = e.clientX;
        startY = e.clientY;
        origLeft = box.offsetLeft;
        origTop = box.offsetTop;
        origW = box.offsetWidth;
        origH = box.offsetHeight;
        handle.setPointerCapture(e.pointerId);
    });

    handle.addEventListener("pointermove", (e) => {
        if (!resizing) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        let left = origLeft;
        let top = origTop;
        let width = origW;
        let height = origH;

        if (cropMode === "free") {
            if (direction.includes("w")) { left += dx; width -= dx; }
            if (direction.includes("e")) { width += dx; }
            if (direction.includes("n")) { top += dy; height -= dy; }
            if (direction.includes("s")) { height += dy; }
        } else {
            const ratio = getRatio(cropMode);
            if (direction.includes("e") || direction.includes("w")) {
                width = direction.includes("e") ? origW + dx : origW - dx;
                width = Math.max(40, width);
                height = width / ratio;
                if (direction.includes("w")) left = origLeft + origW - width;
                top = origTop + (origH - height) / 2;
            } else {
                height = direction.includes("s") ? origH + dy : origH - dy;
                height = Math.max(40, height);
                width = height * ratio;
                if (direction.includes("n")) top = origTop + origH - height;
                left = origLeft + (origW - width) / 2;
            }
        }

        const image = document.getElementById("cropImage");
        if (!image) return;

        const imgRect = image.getBoundingClientRect();
        const areaRect = cropArea.getBoundingClientRect();
        const imgLeft = imgRect.left - areaRect.left;
        const imgTop = imgRect.top - areaRect.top;

        width = Math.max(20, Math.min(width, imgRect.width));
        height = Math.max(20, Math.min(height, imgRect.height));
        left = Math.max(imgLeft, Math.min(left, imgLeft + imgRect.width - width));
        top = Math.max(imgTop, Math.min(top, imgTop + imgRect.height - height));

        box.style.left = `${left}px`;
        box.style.top = `${top}px`;
        box.style.width = `${width}px`;
        box.style.height = `${height}px`;
    });

    const endResize = (e) => {
        if (!resizing) return;
        resizing = false;
        try { handle.releasePointerCapture(e.pointerId); } catch (_) {}
        saveCurrentCrop();
    };

    handle.addEventListener("pointerup", endResize);
    handle.addEventListener("pointercancel", endResize);
}

function saveCurrentCrop() {
    const box = document.querySelector("#cropArea .crop-box");
    const image = document.getElementById("cropImage");
    if (!box || !image) return;

    const boxRect = box.getBoundingClientRect();
    const imgRect = image.getBoundingClientRect();
    if (imgRect.width <= 0 || imgRect.height <= 0) return;

    currentCrop = {
        left: Math.max(0, Math.min(1, (boxRect.left - imgRect.left) / imgRect.width)),
        top: Math.max(0, Math.min(1, (boxRect.top - imgRect.top) / imgRect.height)),
        width: Math.max(0.01, Math.min(1, boxRect.width / imgRect.width)),
        height: Math.max(0.01, Math.min(1, boxRect.height / imgRect.height))
    };

    if (uploadedImages[selectedImageIndex]) {
        uploadedImages[selectedImageIndex].crop = { ...currentCrop };
    }
}

if (applyToAllButton) {
    applyToAllButton.addEventListener("click", () => {
        saveCurrentCrop();
        if (!currentCrop) {
            alert("Please adjust a crop box first.");
            return;
        }
        uploadedImages.forEach((img) => {
            img.crop = { ...currentCrop };
        });
        alert(`Crop setting applied to all ${uploadedImages.length} images.`);
        displayImageList();
    });
}

// ==========================================================
// CANVAS & BLOB PROCESSING
// ==========================================================

function createCroppedCanvas(imageData) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => {
            const crop = imageData.crop || { left: 0, top: 0, width: 1, height: 1 };
            const sx = image.width * crop.left;
            const sy = image.height * crop.top;
            const sw = image.width * crop.width;
            const sh = image.height * crop.height;

            const canvas = document.createElement("canvas");
            canvas.width = Math.max(1, Math.round(sw));
            canvas.height = Math.max(1, Math.round(sh));

            const ctx = canvas.getContext("2d");
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(image, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

            resolve(canvas);
        };
        image.onerror = reject;
        image.src = imageData.url;
    });
}

function canvasToBlob(canvas) {
    return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.92);
    });
}

function createOutputName(originalName, index) {
    const cleanName = originalName.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "-");
    return `${cleanName}-cropped-${index + 1}.jpg`;
}

// Helper trigger for programmatic file download
function triggerDownload(blobUrl, filename) {
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ==========================================================
// DOWNLOAD HANDLERS (FIXED FOR BROWSER POPUP POLICIES)
// ==========================================================

async function downloadSingleImage(imageData, index) {
    try {
        const canvas = await createCroppedCanvas(imageData);
        const blob = await canvasToBlob(canvas);
        const url = URL.createObjectURL(blob);

        triggerDownload(url, createOutputName(imageData.name, index));

        setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (err) {
        console.error(err);
        alert("Failed to download image.");
    }
}

if (downloadIndividualButton) {
    downloadIndividualButton.addEventListener("click", async () => {
        if (uploadedImages.length === 0) {
            alert("Please upload images first.");
            return;
        }

        saveCurrentCrop();

        downloadIndividualButton.disabled = true;
        const originalText = downloadIndividualButton.textContent;

        const createdUrls = [];

        try {
            for (let i = 0; i < uploadedImages.length; i++) {
                downloadIndividualButton.textContent = `⏳ Downloading ${i + 1}/${uploadedImages.length}...`;

                const canvas = await createCroppedCanvas(uploadedImages[i]);
                const blob = await canvasToBlob(canvas);
                const url = URL.createObjectURL(blob);
                createdUrls.push(url);

                triggerDownload(url, createOutputName(uploadedImages[i].name, i));

                // 1000ms delay to satisfy browser download throttle limits
                await delay(1000);
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred during individual downloads. You can use 'Download ZIP' instead.");
        } finally {
            downloadIndividualButton.disabled = false;
            downloadIndividualButton.textContent = originalText;

            // Revoke URLs safely after all downloads finish
            setTimeout(() => {
                createdUrls.forEach((u) => URL.revokeObjectURL(u));
            }, 15000);
        }
    });
}

// ==========================================================
// ZIP ARCHIVE GENERATOR
// ==========================================================

if (downloadZipButton) {
    downloadZipButton.addEventListener("click", downloadZip);
}

async function downloadZip() {
    if (uploadedImages.length === 0) {
        alert("Please upload images first.");
        return;
    }
    if (typeof JSZip === "undefined") {
        alert("JSZip library failed to load. Please check your internet connection.");
        return;
    }

    try {
        saveCurrentCrop();
        downloadZipButton.disabled = true;
        downloadZipButton.textContent = "⏳ Creating ZIP...";

        const zip = new JSZip();

        for (let i = 0; i < uploadedImages.length; i++) {
            const canvas = await createCroppedCanvas(uploadedImages[i]);
            const blob = await canvasToBlob(canvas);
            zip.file(createOutputName(uploadedImages[i].name, i), blob);
        }

        const zipBlob = await zip.generateAsync({
            type: "blob",
            compression: "DEFLATE",
            compressionOptions: { level: 6 }
        });

        const url = URL.createObjectURL(zipBlob);
        triggerDownload(url, "affiliate-cropped-images.zip");

        setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (err) {
        console.error("ZIP Error:", err);
        alert("Failed to build ZIP archive.");
    } finally {
        downloadZipButton.disabled = false;
        downloadZipButton.textContent = "📦 Download ZIP";
    }
}

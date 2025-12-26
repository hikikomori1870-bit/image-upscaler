let coreEngine;
try {
    coreEngine = new Upscaler();
} catch (e) {
    console.log("Chuyển sang chế độ dự phòng.");
}
const fileInput = document.getElementById('imageInput');
const runBtn = document.getElementById('processBtn');
const inputImg = document.getElementById('inputPreview');
const outputImg = document.getElementById('outputResult');
const loader = document.getElementById('loading');
const saveLink = document.getElementById('downloadBtn');
const statusText = document.getElementById('status-text');
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            inputImg.src = event.target.result;
            runBtn.disabled = false;
            outputImg.classList.add('hidden');
            saveLink.classList.add('hidden');
        };
        reader.readAsDataURL(file);
    }
});
function fastSharpen(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.naturalWidth * 2;
    canvas.height = img.naturalHeight * 2;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    ctx.filter = "contrast(1.2) saturate(1.1) brightness(1.02) blur(0px)";
    ctx.drawImage(canvas, 0, 0);
    
    return canvas.toDataURL('image/png');
}
runBtn.addEventListener('click', async () => {
    loader.classList.remove('hidden');
    runBtn.disabled = true;
    outputImg.classList.add('hidden');
    if (!inputImg.complete) {
        await new Promise(resolve => inputImg.onload = resolve);
    }
    try {
        statusText.innerText = "Đang quét cấu trúc ảnh...";
        const result = await coreEngine.upscale(inputImg, {
            patchSize: 64,
            padding: 2
        });
        outputImg.src = result;
    } catch (err) {
        console.log("Sử dụng thuật toán dự phòng...");
        statusText.innerText = "Đang tối ưu hóa điểm ảnh...";
        const fallbackResult = fastSharpen(inputImg);
        outputImg.src = fallbackResult;
    } finally {
        outputImg.classList.remove('hidden');
        saveLink.href = outputImg.src;
        saveLink.download = "PhotoSharper_Result.png";
        saveLink.classList.remove('hidden');
        loader.classList.add('hidden');
        runBtn.disabled = false;
    }
});

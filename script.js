const imageInput = document.getElementById('imageInput');
const upscaleBtn = document.getElementById('upscaleBtn');
const originalImg = document.getElementById('originalImg');
const upscaledImg = document.getElementById('upscaledImg');
const loading = document.getElementById('loading');
const downloadBtn = document.getElementById('downloadBtn');
const pica = window.pica();
imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            originalImg.src = event.target.result;
            upscaleBtn.disabled = false;
            upscaledImg.classList.add('hidden');
            downloadBtn.classList.add('hidden');
        };
        reader.readAsDataURL(file);
    }
});
function applySmartSharpen(ctx, width, height) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const copy = new Uint8ClampedArray(data);
    const weight = 0.8;
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            for (let c = 0; c < 3; c++) { 
                const i = (y * width + x) * 4 + c;
                const top = ((y - 1) * width + x) * 4 + c;
                const bottom = ((y + 1) * width + x) * 4 + c;
                const left = (y * width + (x - 1)) * 4 + c;
                const right = (y * width + (x + 1)) * 4 + c;
                
                let val = copy[i] * (1 + 4 * weight) 
                          - (copy[top] + copy[bottom] + copy[left] + copy[right]) * weight;
                data[i] = val;
            }
        }
    }
    ctx.putImageData(imageData, 0, 0);
}
upscaleBtn.addEventListener('click', async () => {
    if (!originalImg.src) return;
    loading.classList.remove('hidden');
    upscaledImg.classList.add('hidden');
    upscaleBtn.disabled = true;
    const fromCanvas = document.createElement('canvas');
    const toCanvas = document.createElement('canvas');
    const width = originalImg.naturalWidth;
    const height = originalImg.naturalHeight;
    fromCanvas.width = width;
    fromCanvas.height = height;
    toCanvas.width = width * 2;
    toCanvas.height = height * 2;
    const ctxFrom = fromCanvas.getContext('2d');
    ctxFrom.drawImage(originalImg, 0, 0);
    try {
        await pica.resize(fromCanvas, toCanvas, {
            unsharpAmount: 250, 
            unsharpRadius: 0.6,
            unsharpThreshold: 1
        });
        const ctxTo = toCanvas.getContext('2d');
        applySmartSharpen(ctxTo, toCanvas.width, toCanvas.height);
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = toCanvas.width;
        tempCanvas.height = toCanvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.filter = "contrast(1.2) brightness(1.08) saturate(1.1)";
        tempCtx.drawImage(toCanvas, 0, 0);
        const resultUrl = tempCanvas.toDataURL('image/png', 1.0);
        upscaledImg.src = resultUrl;
        upscaledImg.classList.remove('hidden');
        downloadBtn.href = resultUrl;
        downloadBtn.download = "photo_ultra_hd.png";
        downloadBtn.classList.remove('hidden');
    } catch (err) {
        alert("Lỗi xử lý: " + err.message);
    } finally {
        loading.classList.add('hidden');
        upscaleBtn.disabled = false;
    }
});

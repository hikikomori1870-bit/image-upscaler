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
            upscaledImg.src = "";
            downloadBtn.classList.add('hidden');
        };
        reader.readAsDataURL(file);
    }
});
function applySmartSharpen(ctx, width, height) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const copy = new Uint8ClampedArray(data);
    const weight = 0.5; 
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
    loading.classList.remove('hidden');
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
    const ctxTo = toCanvas.getContext('2d');
    try {
        await pica.resize(fromCanvas, toCanvas, {
            unsharpAmount: 160,
            unsharpRadius: 0.5,
            unsharpThreshold: 1
        });
        applySmartSharpen(ctxTo, toCanvas.width, toCanvas.height);
        ctxTo.filter = "contrast(1.1) saturate(1.1) brightness(1.02)";
        ctxTo.drawImage(toCanvas, 0, 0);
        const resultUrl = toCanvas.toDataURL('image/png', 1.0);
        upscaledImg.src = resultUrl;
        downloadBtn.href = resultUrl;
        downloadBtn.download = "anh-hd-sieu-net.png";
        downloadBtn.classList.remove('hidden');
    } catch (err) {
        alert("Lỗi: " + err.message);
    } finally {
        loading.classList.add('hidden');
        upscaleBtn.disabled = false;
    }
});

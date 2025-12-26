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
        };
        reader.readAsDataURL(file);
    }
});
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
    const ctx = fromCanvas.getContext('2d');
    ctx.drawImage(originalImg, 0, 0);
    try {
        await pica.resize(fromCanvas, toCanvas, {
            unsharpAmount: 100,
            unsharpRadius: 0.8,
            unsharpThreshold: 0
        });
        const resultUrl = toCanvas.toDataURL('image/png');
        upscaledImg.src = resultUrl;
        downloadBtn.href = resultUrl;
        downloadBtn.download = "anh-lam-net.png";
        downloadBtn.classList.remove('hidden');        
    } catch (err) {
        console.error(err);
        alert("Lỗi xử lý ảnh!");
    } finally {
        loading.classList.add('hidden');
        upscaleBtn.disabled = false;
    }
});

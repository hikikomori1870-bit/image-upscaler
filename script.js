const imageInput = document.getElementById('imageInput');
const upscaleBtn = document.getElementById('upscaleBtn');
const originalImg = document.getElementById('originalImg');
const upscaledImg = document.getElementById('upscaledImg');
const loading = document.getElementById('loading');
const downloadBtn = document.getElementById('downloadBtn');
const pica = Pica();
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
    const offScreenCanvas = document.createElement('canvas');
    const targetWidth = originalImg.naturalWidth * 2; // Phóng to 2 lần
    const targetHeight = originalImg.naturalHeight * 2;
    offScreenCanvas.width = targetWidth;
    offScreenCanvas.height = targetHeight;
    try {
        await pica.resize(originalImg, offScreenCanvas, {
            unsharpAmount: 80,
            unsharpRadius: 0.6,
            unsharpThreshold: 2
        });
        const ctx = offScreenCanvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
        const resultUrl = offScreenCanvas.toDataURL('image/png');
        upscaledImg.src = resultUrl;
        downloadBtn.href = resultUrl;
        downloadBtn.download = "anh-phong-to.png";
        downloadBtn.classList.remove('hidden');
    } catch (err) {
        console.error(err);
        alert("Có lỗi xảy ra khi xử lý ảnh.");
    } finally {
        loading.classList.add('hidden');
        upscaleBtn.disabled = false;
    }
});

const MODEL_CONFIG = {
  model: 'espcann', 
  size: 'x2'        
};
const upscaler = new Upscaler({
  model: {
    path: 'https://cdn.jsdelivr.net/npm/@upscalerjs/models@latest/models/espcann/x2/model.json',
    scale: 2
  }
});
const imageInput = document.getElementById('imageInput');
const upscaleBtn = document.getElementById('upscaleBtn');
const originalImg = document.getElementById('originalImg');
const upscaledImg = document.getElementById('upscaledImg');
const loading = document.getElementById('loading');
const downloadBtn = document.getElementById('downloadBtn');
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
upscaleBtn.addEventListener('click', async () => {
    if (originalImg.naturalWidth > 1500 || originalImg.naturalHeight > 1500) {
        alert("Ảnh này có kích thước pixel quá lớn.");
        return;
    }
    loading.classList.remove('hidden');
    upscaleBtn.disabled = true;
    upscaledImg.src = "";
    try {
        console.log("Đang bắt đầu xử lý...");
        const upscaledSrc = await upscaler.upscale(originalImg.src, {
            patchSize: 64, 
            padding: 2,
            progress: (percent) => {
                console.log(`Đang xử lý: ${Math.round(percent * 100)}%`);
            }
        });
        upscaledImg.src = upscaledSrc;
        downloadBtn.href = upscaledSrc;
        downloadBtn.download = "anh-da-lam-net.png";
        downloadBtn.classList.remove('hidden');
        console.log("Thành công!");
    } catch (error) {
        console.error("Lỗi hệ thống:", error);
        alert("Lỗi: " + error.message + "\n\nHướng dẫn: Bạn hãy thử nhấn F12, chọn tab Console để xem dòng chữ đỏ báo lỗi gì nhé.");
    } finally {
        loading.classList.add('hidden');
        upscaleBtn.disabled = false;
    }
});

const originalImg = document.getElementById('originalImg');
const upscaleBtn = document.getElementById('upscaleBtn');
const upscaledImg = document.getElementById('upscaledImg');
const loading = document.getElementById('loading');
const downloadBtn = document.getElementById('downloadBtn');
let model;
async function loadModel() {
    console.log("Đang tải mô hình...");
    try {
        model = new Upscaler({
            model: {
                path: 'https://cdn.jsdelivr.net/npm/@upscalerjs/models@latest/models/espcann/x2/model.json',
                scale: 2
            }
        });
        console.log("Mô hình đã sẵn sàng!");
    } catch (e) {
        console.error("Không tải được mô hình:", e);
    }
}
loadModel();
document.getElementById('imageInput').addEventListener('change', function(e) {
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
    if (!model) {
        alert("Mô hình vẫn đang tải, vui lòng đợi vài giây!");
        return;
    }
    loading.classList.remove('hidden');
    upscaleBtn.disabled = true;

    try {
        const result = await model.upscale(originalImg.src, {
            patchSize: 48, // Chia ảnh thành các ô nhỏ 48x48 pixel để xử lý
            padding: 2
        });
        upscaledImg.src = result;
        downloadBtn.href = result;
        downloadBtn.download = "ket-qua-net-cang.png";
        downloadBtn.classList.remove('hidden');
    } catch (err) {
        console.error("Lỗi:", err);
        alert("Lỗi: " + err.message);
    } finally {
        loading.classList.add('hidden');
        upscaleBtn.disabled = false;
    }
});

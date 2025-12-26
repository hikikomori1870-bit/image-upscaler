console.log("Script đã tải thành công!");
const imageInput = document.getElementById('imageInput');
const upscaleBtn = document.getElementById('upscaleBtn');
const originalImg = document.getElementById('originalImg');
const upscaledImg = document.getElementById('upscaledImg');
const loading = document.getElementById('loading');
const downloadBtn = document.getElementById('downloadBtn');
const upscaler = new Upscaler();
imageInput.addEventListener('change', (e) => {
    console.log("Đã chọn file!"); 
    const file = e.target.files[0];   
    if (file) {
        const reader = new FileReader();       
        reader.onload = (event) => {
            console.log("Đã đọc file xong, đang hiển thị preview...");
            originalImg.src = event.target.result;
            upscaleBtn.disabled = false;
            upscaledImg.src = "";
            downloadBtn.classList.add('hidden');
        };
        reader.onerror = (err) => {
            console.error("Lỗi FileReader:", err);
        };
        reader.readAsDataURL(file);
    }
});
upscaleBtn.addEventListener('click', async () => {
    console.log("Bắt đầu xử lý AI...");
    loading.classList.remove('hidden');
    upscaleBtn.disabled = true;
    try {
        const upscaledSrc = await upscaler.upscale(originalImg.src);
        console.log("Xử lý AI thành công!");
        upscaledImg.src = upscaledSrc;
        downloadBtn.href = upscaledSrc;
        downloadBtn.download = "anh-net-cang.png";
        downloadBtn.classList.remove('hidden');
    } catch (error) {
        console.error("Lỗi AI:", error);
        alert("Có lỗi khi xử lý ảnh bằng AI. Hãy thử ảnh khác nhẹ hơn.");
    } finally {
        loading.classList.add('hidden');
        upscaleBtn.disabled = false;
    }
});
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: #e0f7fa;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    margin: 0;
}
.container {
    background: white;
    padding: 30px;
    border-radius: 20px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    width: 90%;
    max-width: 900px;
    text-align: center;
}
h1 { color: #00796b; margin-bottom: 5px; }
.upload-section {
    margin: 25px 0;
    display: flex;
    justify-content: center;
    gap: 15px;
    align-items: center;
}
.btn-select {
    background: #00acc1;
    color: white;
    padding: 12px 25px;
    border-radius: 50px;
    cursor: pointer;
    font-weight: bold;
    transition: 0.3s;
}
.btn-select:hover { background: #00838f; }
input[type="file"] { display: none; }
.btn-run {
    background: #4caf50;
    color: white;
    border: none;
    padding: 12px 25px;
    border-radius: 50px;
    font-weight: bold;
    cursor: pointer;
    transition: 0.3s;
}
.btn-run:disabled { background: #ccc; cursor: not-allowed; }
.btn-run:hover:not(:disabled) { background: #388e3c; }
.result-section {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    gap: 20px;
}
.box { flex: 1; min-width: 300px; }
.img-frame {
    width: 100%;
    min-height: 200px;
    border: 2px dashed #b2dfdb;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}
img { max-width: 100%; height: auto; }
.btn-download {
    display: inline-block;
    margin-top: 15px;
    background: #ff5722;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    text-decoration: none;
    font-weight: bold;
}
.hidden { display: none; }
.spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #00acc1;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 1s linear infinite;
    margin: auto;
}
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

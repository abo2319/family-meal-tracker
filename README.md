# 家庭飲食記錄 — 部署說明

## 你需要做的事（共 3 個步驟）

---

## 步驟 1：設定 Google Cloud（取得 Client ID）

1. 打開 https://console.cloud.google.com
2. 點右上角「略過」跳過付費畫面
3. 左上角 → 選取專案 → 新增專案 → 名稱填 `family-meal-tracker` → 建立
4. 左側選單 → API 和服務 → 程式庫 → 搜尋 `Google Drive API` → 啟用
5. 左側 → 憑證 → 建立憑證 → OAuth 用戶端 ID
6. 如果要求設定同意畫面，選「外部」→ 填寫應用程式名稱 → 儲存後繼續
7. 應用程式類型選「網頁應用程式」
8. 已授權的 JavaScript 來源，填入：
   ```
   https://abo2319.github.io
   ```
9. 已授權的重新導向 URI，填入：
   ```
   https://abo2319.github.io/family-meal-tracker/
   ```
10. 點「建立」→ 複製 Client ID（格式：xxxxxxx.apps.googleusercontent.com）

---

## 步驟 2：把 Client ID 填入程式碼

打開 `index.html`，找到第 6 行：

```javascript
const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID_HERE';
```

把 `YOUR_GOOGLE_CLIENT_ID_HERE` 換成你剛複製的 Client ID，例如：

```javascript
const CLIENT_ID = '123456789-abcdef.apps.googleusercontent.com';
```

---

## 步驟 3：上傳到 GitHub Pages

1. 打開 https://github.com/new
2. 建立新 repository，名稱填：`family-meal-tracker`
3. 設定為 Public（重要！GitHub Pages 免費版需要 Public）
4. 建立後，把這個資料夾裡的所有檔案上傳：
   - index.html
   - manifest.json
   - sw.js
   - icon-192.png
   - icon-512.png
5. 上傳後，到 Settings → Pages → Source 選 `main` branch → 儲存
6. 等 1-2 分鐘後，網址就是：
   ```
   https://abo2319.github.io/family-meal-tracker/
   ```

---

## iPhone 加入主畫面

1. 用 Safari 打開網址
2. 點下方分享按鈕 ↑
3. 選「加入主畫面」
4. 就像 App 一樣可以用了！

---

## 功能說明

- 📷 拍照：點餐點區域，可直接用相機拍照
- 💾 儲存：每餐點「儲存這餐」，資料存在手機本地
- ☁️ 同步：底部「同步到 Drive ↑」，把數據存到 Google Drive
- 📥 匯出：右上角頭像 → 匯出資料，下載 JSON 檔案
- 👨‍👩‍👧 家庭成員：可新增多位成員，各自獨立記錄

---

## 資料儲存位置

- **手機本地**：localStorage（離線也能用）
- **Google Drive**：`FamilyMealTracker/meal_data.json`（數據）
- **Google Drive**：`FamilyMealTracker/成員_日期_餐次.jpg`（照片）

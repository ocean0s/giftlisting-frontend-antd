# 🎁 GiftList App - Frontend
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) 
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Ant-Design](https://img.shields.io/badge/-AntDesign-%230170FE?style=for-the-badge&logo=ant-design&logoColor=white)

A React app styled with Ant Design.
This project consumes the GiftList App API. The **backend URL** is configured in [Globals.js](https://github.com/ocean0s/giftlisting-frontend-antd/blob/1c8e2bc38b07e3366d301350984389a1f00259c2/src/Globals.js).

> Backend repository: https://github.com/ocean0s/giftlisting-backend

# ✨ Features
- Modern UI with Ant Design components
- Clean, responsive layout
- API-driven views for managing gift lists

# 🚀 Quick Start
## Prerequisites
- Node.js 18+ (LTS recommended)
- npm 8+

## 1. Clone & Install

```Shell
git clone https://github.com/ocean0s/giftlisting-frontend-antd.git
cd giftlisting-frontend-antd
# using npm
npm install
```

## 2. Configure Backend URL
The app reads the API base URL from src/Globals.js.
Open [Globals.js](https://github.com/ocean0s/giftlisting-frontend-antd/blob/1c8e2bc38b07e3366d301350984389a1f00259c2/src/Globals.js) and set your backend URL.

```JavaScript
// src/Globals.js
export const API_BASE_URL = 'http://localhost:5000'; // or your deployed API URL
```

## 3. Run the App

```Shell
# for development
npm run dev
# for production
npm run build && npm start
```
App will start on http://localhost:3000/
Ensure your backend is running and accessible from the browser (CORS enabled if needed).

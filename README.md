# FlowForge – Visual Bot Builder

**FlowForge** is an interactive drag-and-drop tool for designing conversational bot flows. It provides a node-based editor where you can create, connect, and preview decision trees for customer support, lead generation, or any conversational AI.

---

## ✨ Features

* **Node-based flow builder** – Drag nodes on an infinite canvas, connect them with options.
* **Rich node types** – Start, Step (mid), End nodes with custom questions & answer options.
* **Live preview** – Test your flow in a realistic chat interface.
* **Undo / Redo** – Full history with keyboard shortcuts (`Ctrl+Z` / `Ctrl+Y`).
* **Dark / Light theme** – Toggle instantly, persists in local storage.
* **Import / Export** – Save flows as JSON files or restore them.
* **Zoom & Pan** – Smooth canvas navigation with zoom controls.
* **Search nodes** – Quickly find any node by text or ID.
* **Real-time auto-save** – Your flow is stored in `localStorage` and autosaves on every change.

### ⌨️ Keyboard Shortcuts

* `Delete` – Remove selected node
* `Escape` – Close edit panel
* `Ctrl+Z` / `Ctrl+Y` – Undo / Redo

---

## 🚀 Live Demo

A live version of FlowForge is available at:
👉https://flow-forge1.netlify.app/


---

## 🛠️ Tech Stack

* **React 18** – UI framework
* **Vite** – Build tool & dev server
* **CSS custom properties** – Theming & styling
* **localStorage** – Persistence & auto-save

---

## 📦 Installation & Setup

### Prerequisites

* Node.js (v16 or later)
* npm or yarn

### Steps

#### 1. Clone the repository

```bash
git clone https://github.com/mahoro-belyse/flowforge.git
cd flowforge
```

#### 2. Install dependencies

```bash
npm install
```

#### 3. Run the development server

```bash
npm run dev
```

Open: http://localhost:5173

#### 4. Build for production

```bash
npm run build
```

Output will be in the `dist/` folder.

#### 5. Preview production build

```bash
npm run preview
```

---

## 🎮 How to Use

### Create a new node

Use the **Add Node** buttons in the sidebar (Start / Step / End).

### Drag nodes

Click and drag any node to reposition it.

### Edit a node

* Double-click a node OR
* Select it and open the edit panel

You can:

* Change message/question
* Add/remove/reorder options
* Link options to other nodes
* Change node type

### Connect options

Use the dropdown in the edit panel to link nodes. Connectors appear automatically.

### Preview the bot

Click **Preview** in the top bar to simulate the chat flow.

### Save / Export

* Export: Download flow as JSON
* Import: Load saved JSON

### Reset

Restore default example flow using **Reset**.

---

## 🧩 Project Structure

```
flowforge/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── styles/
│   │   └── global.css
│   ├── components/
│   │   ├── Icon.jsx
│   │   ├── NodeCard.jsx
│   │   ├── Connectors.jsx
│   │   ├── EditPanel.jsx
│   │   ├── PreviewMode.jsx
│   │   └── Toast.jsx
│   ├── hooks/
│   │   ├── useFlow.js
│   │   └── useCanvasPanZoom.js
│   └── utils/
│       └── constants.js
```





* Inspired by tools like Node-RED and Botpress
* Icons by Feather Icons (adapted for React)

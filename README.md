# Sri Prasanna Vigneswara Superbazaar (SPV Super Bazar) 🛒

A fast, modern quick-commerce web application inspired by **Swiggy Instamart**, built for **Sri Prasanna Vigneswara Superbazaar** located on Kutukuluru Road, Ramavaram, Dr. B. R. Ambedkar Konaseema District, Andhra Pradesh.

---

## 🌟 Key Features

### ⚡ Instamart-Inspired Quick-Commerce Experience
- **Curated Grocery Catalog**: Packaged daily staples (Aashirvaad Atta, Fortune/Freedom cooking oils, Tata dals, pulses, spices), fresh dairy (Heritage, Amul milk, butter, paneer), snacks, beverages, and home cleaning essentials.
- **Brand Aesthetic**: Tailored **Emerald Green** brand palette (`#065f46`), high-contrast Gilroy typography, and unified rounded card geometry (`rounded-2xl` / `rounded-3xl`).
- **Hero Promotional Carousel**: Smooth auto-sliding hero banners with direct asset integration (`banner_1.png`, `banner_2.png`, `Banner_3.png`).
- **Shop by Department**: Quick-access category shelves, subcategory chips, instant search filters, and department browser.

### 📍 Local-Priority Geolocation & Delivery System
- **Local Priority Search Layer**: Instant, prioritized auto-complete matching for Konaseema and East Godavari regional villages (*Ramavaram, Kutukuluru, Someswaram, Machavaram, Rayavaram, Mandapeta, Pasalapudi, Chelluru*).
- **One-Tap GPS Detection**: Device GPS geolocation with reverse geocoding to automatically resolve the user's current mandal and PIN code.
- **Global OSM Fallback**: Seamless fallback to OpenStreetMap (Nominatim API) with debouncing, AbortController cancellation, and localStorage caching.

### 💬 WhatsApp Instant Order Checkout
- **Automated WhatsApp Message Generation**: Converts the digital shopping cart into a structured, itemized WhatsApp order message.
- **Location Pin Integration**: Embeds the customer's Google Maps pin link (`https://maps.google.com/?q=lat,lng`) and formatted address directly in the order message.
- **Cart Management**: Slide-out cart drawer, quantity steppers, and sticky bottom cart bar for mobile quick access.

### 🏬 Authentic Store Story & Gallery
- **Dedicated About Page**: Authentic story of Sri Prasanna Vigneswara Superbazaar, physical store photo gallery with lightbox zoom, operating hours, and service coverage.
- **Store Contact & Directions**: Integrated Google Maps viewer, direct dial, and WhatsApp support.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | [React 18](https://react.dev/) + [Vite](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) + Custom CSS utilities |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **State Management** | React Context API (`CartContext`) |
| **Maps & Geocoding** | Leaflet / OpenStreetMap (Nominatim API) |
| **Deployment** | [Vercel](https://vercel.com/) (configured via `vercel.json` SPA rewrites) |

---

## 📁 Project Structure

```text
SVP/
├── public/                     # Static assets (logo, banners, store photos)
│   ├── logo.png
│   ├── banner_1.png
│   ├── banner_2.png
│   ├── Banner_3.png
│   ├── gallery_1.png
│   ├── gallery_2.png
│   └── gallery_3.png
├── src/
│   ├── assets/                 # Processed images and styles
│   ├── components/
│   │   ├── about/              # About Us page & store gallery
│   │   ├── cart/               # Cart drawer, checkout form, success modal
│   │   ├── categories/         # Department & subcategory browser
│   │   ├── common/             # Modals, location search, WhatsApp button
│   │   ├── contact/            # Contact & store directions page
│   │   ├── home/               # Hero banner, category tiles, product shelves
│   │   ├── layout/             # Header, footer, mobile bottom navigation
│   │   ├── location/           # Geolocation search & confirmation
│   │   └── shop/               # Product cards, catalog grid, filters
│   ├── config/                 # Central store configuration (STORE_CONFIG)
│   ├── context/                # Cart and order context
│   ├── data/                   # Categories, departments, and product catalog
│   ├── hooks/                  # Custom React hooks (location, geocoding)
│   ├── services/               # Location services & Nominatim geocoder
│   ├── utils/                  # WhatsApp order builder, formatters, storage
│   ├── App.jsx                 # Root application component & routing
│   ├── index.css               # Global styles & Tailwind directives
│   └── main.jsx                # Application entry point
├── package.json
├── vercel.json                 # Vercel SPA rewrite & caching configuration
├── vite.config.js
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/Charantej111/SVP.git

# Navigate into the project folder
cd SVP

# Install project dependencies
npm install
```

### 3. Development Server
```bash
# Start local Vite development server
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) or your local network IP in your browser.

### 4. Production Build
```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## ☁️ Deployment to Vercel

The project is pre-configured with `vercel.json` for zero-configuration SPA routing:

1. Import the repository in [Vercel Dashboard](https://vercel.com/dashboard).
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. Deploy!

All routes (e.g. `/#/about`, `/#/shop`, `/#/contact`) and deep links will be handled by the SPA rewrite configuration.

---

## 🏪 Store & Business Details

- **Store Name**: Sri Prasanna Vigneswara Superbazaar (SPV Super Bazar)
- **Proprietor**: **Padala Venkata Jayapal Reddy**
- **Address**: Kutukuluru Road, Ramavaram, Kutukuluru, Dr. B. R. Ambedkar Konaseema District, Andhra Pradesh 533264
- **Working Hours**: 7:00 AM – 9:30 PM (Open All 7 Days)
- **Phone / WhatsApp**: [+91 95516 24444](https://wa.me/919551624444)
- **Verified Village Coverage**: Ramavaram (533264), Kutukuluru (533264), Someswaram (533261), Machavaram (533261), Rayavaram (533346), Mandapeta (533308), Pasalapudi (533261), Chelluru (533308).

---

## 👨‍💻 Developer Credit

- **Designed & Developed by**: **[Charan Tej Neelam](https://charan.ofzen.in/)**
- **Website**: [https://charan.ofzen.in/](https://charan.ofzen.in/)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

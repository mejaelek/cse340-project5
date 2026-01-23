 # ShopSmart E-Commerce Website

A modern, responsive e-commerce website built with HTML, CSS, and JavaScript.

## 📋 Project Overview

ShopSmart is a fully functional e-commerce website featuring product listings, shopping cart functionality, an about us page, and contact form.

## ✨ Features

### Completed Features
- ✅ Responsive navigation with hamburger menu
- ✅ Home page with hero section and featured products
- ✅ Products page with filtering and search
- ✅ **About Us page** (Main assignment task)
- ✅ Contact page with form validation
- ✅ Shopping cart functionality
- ✅ Mobile-responsive design
- ✅ Add to cart functionality
- ✅ Product details modal
- ✅ Cart quantity management
- ✅ Real-time cart count updates

### About Us Page Features
The About Us page includes:
- Company story and background
- Mission and vision statements
- Core values section
- Team member profiles
- Professional design with animations
- Fully responsive layout

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Flexbox and Grid
- **JavaScript (ES6)** - Interactive functionality
- **No external dependencies** - Pure vanilla JavaScript

## 📁 File Structure

```
project-root/
│
├── index.html              # Homepage
├── about.html              # About Us page ⭐ (Assignment Task)
├── products.html           # Products listing page
├── contact.html            # Contact page
├── cart.html              # Shopping cart page
│
├── css/
│   ├── style.css          # Main stylesheet
│   ├── about.css          # About page specific styles
│   └── responsive.css     # Responsive design rules
│
├── js/
│   ├── main.js            # Core functionality
│   ├── cart.js            # Cart management
│   └── products.js        # Product display and filtering
│
├── images/                # Image assets (create as needed)
│   ├── products/
│   └── team/
│
├── assets/                # Additional assets
│   ├── icons/
│   └── fonts/
│
└── README.md              # Project documentation
```

## 🚀 Getting Started

### Installation

1. **Clone or download** this repository
2. **Open the folder** in VS Code
3. **File structure** should match the structure above

### Running the Project

#### Option 1: Live Server (Recommended)
1. Install **Live Server** extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"
4. Website will open at `http://localhost:5500`

#### Option 2: Direct File Open
1. Navigate to project folder
2. Double-click `index.html`
3. Opens in default browser

### Deploying to GitHub Pages

1. **Create a GitHub repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Add About Us page"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings
   - Navigate to Pages section
   - Select branch: `main`
   - Click Save
   - Your site will be live at: `https://YOUR-USERNAME.github.io/YOUR-REPO/`

## 📝 Assignment Submission Format

```
Task: Create About Us Page
Source: https://github.com/YOUR-USERNAME/YOUR-REPO/blob/main/about.html
Site: https://YOUR-USERNAME.github.io/YOUR-REPO/about.html
```

## 🎨 Customization Guide

### Changing Brand Name
Replace "ShopSmart" with your brand name in:
- All HTML files (header and footer)
- README.md

### Updating Colors
Edit `css/style.css` root variables:
```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    /* Modify these values */
}
```

### Adding Products
Edit `js/products.js`:
```javascript
const productsData = [
    { id: 1, name: 'Product Name', price: 99.99, category: 'electronics', featured: true },
    // Add more products
];
```

### Modifying Team Members
Edit the team section in `about.html` to add/remove team members.

## 📱 Responsive Breakpoints

- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: Below 768px

## 🔧 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

## 📄 Page Descriptions

### index.html
Homepage featuring hero section, featured products, and company highlights.

### about.html ⭐ (ASSIGNMENT FOCUS)
Comprehensive about page with company story, mission, vision, values, and team.

### products.html
Product catalog with filtering, sorting, and search functionality.

### contact.html
Contact information and functional contact form.

### cart.html
Shopping cart with quantity management and order summary.

## 🐛 Known Issues / Future Enhancements

- [ ] Add product image upload functionality
- [ ] Implement actual checkout process
- [ ] Add user authentication
- [ ] Create product database integration
- [ ] Add order history tracking

## 📞 Support

For issues or questions:
- Create an issue in the GitHub repository
- Contact: support@shopsmart.com

## 👥 Contributors

- Your Name - Developer

## 📜 License

This project is created for educational purposes as part of a course assignment.

## 🎓 Assignment Details

**Course**: Web Development
**Task**: Create About Us Page
**Completion Date**: [Add your date]
**Grade**: [To be added after grading]

---

**Note**: This README should be updated as you add more features to the project.
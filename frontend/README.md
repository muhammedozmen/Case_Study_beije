# beije Case Study - Custom Packet Frontend

This project is a replica of Beije's Custom Package Selection page (https://beije.co/custom-packet). It was developed using Next.js.

## Project Overview

### Purpose
To develop a responsive web page where users can create their own custom packages.

### Features
- **Custom Package Selection**: Users can select different product types (Pads, Daily Pads, Tampons, Heat Pads, Essentials)
- **Global State Management**: User selection management with Redux Toolkit
- **State Persistence**: Preserving selections after page refresh with localStorage
- **Shopping Cart**: Cart system and cart management
- **Category-based Deletion**: Product deletion feature by category
- **Multi-language Support**: Turkish/English language switching with React Context
- **Language Persistence**: Selected language saved in localStorage
- **Responsive Design**: Compatible design for all devices
- **Modern UI**: Design consistent with Beije's brand identity

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **TypeScript**: For type safety
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit + React Redux
- **Internationalization**: React Context API for language management
- **Icons**: Lucide React
- **Responsive**: Mobile-first approach

## Page Structure

### Navigation Bar
- Beije logo (redirects to homepage)
- "Create Your Package" button (gradient design)
- Cart icon (with cart count badge)
- Profile icon
- Mobile responsive menu

### Homepage (/)
- Welcome message
- "Start Creating Package" button
- Feature cards (Personal Package, Automatic Delivery, Natural Products)

### Custom Packet Page (/custom-packet)
1. **Title**: "Create Your Package"
2. **Tab System**: Menstrual Products and Supportive Products
3. **Product Categories**:
   - **beije Pads**: Standard, Super, Super+ options
   - **beije Daily Pads**: Daily, Super Daily, Thong Daily options
   - **beije Tampons**: Mini, Standard, Super options
   - **Heat Pads**: 2-pack and 4-pack options
   - **beije Cycle Essentials**: Vitamin support
   - **beije Cranberry Essentials**: Cranberry support
4. **Right Panel**: Custom package summary and price calculation
5. **Category Deletion**: Separate delete button for each category
6. **Add to Cart Button**: Save selections to cart

### Cart Page (/cart)
- List of cart items
- Quantity updates
- Clear cart
- Total price display

### Footer
- Copyright and description text (centered)
- Language selector (Turkish/English) on the right
- Language preference persistence

## Installation and Setup

### Requirements
- Node.js 18+
- npm or yarn

### Installation
```bash
cd frontend
npm install
```

### Development Mode
```bash
npm run dev
```

The application will run at http://localhost:3001.

### Production Build
```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── cart/               # Cart page
│   │   │   └── page.tsx
│   │   ├── custom-packet/      # Package creation page
│   │   │   └── page.tsx
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Main layout
│   │   ├── page.tsx            # Homepage
│   │   └── providers.tsx       # Redux provider
│   ├── components/             # React components
│   │   ├── Navigation.tsx      # Navigation bar
│   │   ├── CustomPackage.tsx   # Main package selection component
│   │   ├── ProductSelector.tsx # Product selection component
│   │   ├── PackageInfo.tsx     # Package info component
│   │   ├── CartPage.tsx        # Cart page component
│   │   ├── Footer.tsx          # Footer with language selector
│   │   └── ClientOnly.tsx      # Hydration wrapper
│   ├── contexts/               # React contexts
│   │   └── LanguageContext.tsx # Language management context
│   ├── store/                  # Redux store
│   │   ├── index.ts            # Store configuration
│   │   ├── packageSlice.ts     # Package selections slice
│   │   ├── middleware.ts       # localStorage middleware
│   │   └── types.ts            # TypeScript types
│   └── lib/                    # Helper functions
│       └── utils.ts            # Utility functions
├── public/                     # Static files
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

## Design System

### Colors
- **Primary**: Beije brand colors (#FF6B35)
- **Standard Pad**: Orange (#FF6B35)
- **Super Pad**: Red (#E53E3E)
- **Super+ Pad**: Dark red (#C53030)
- **Daily Pad**: Orange tones (#FFA500, #FF8C00)
- **Thong Daily Pad**: Gold (#FFD700)
- **Tampons**: Purple tones (#9B59B6, #8E44AD, #7D3C98)
- **Heat Pads**: Orange (#FF6B35)
- **Essentials**: Brown tones (#8B5A3C)

### Typography
- **Font**: Inter (system font)
- **Headers**: Font weight 600-700
- **Text**: Font weight 400-500

### Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## State Management

### Redux Store Structure
```typescript
interface PackageState {
  selections: {
    standartPed: number;
    superPed: number;
    superPlusPed: number;
    gunlukPed: number;
    superGunlukPed: number;
    tangaGunlukPed: number;
    miniTampon: number;
    standartTampon: number;
    superTampon: number;
    isiPaketi2li: number;
    isiPaketi4lu: number;
    cycleEssentials: number;
    cranberryEssentials: number;
  };
  totalPrice: number;
  isValid: boolean;
  isLoading: boolean;
  cartItems: ProductSelection;
  cartTotalPrice: number;
}
```

### Actions
- `updateSelection`: Update product selection
- `incrementSelection`: Increase product quantity
- `decrementSelection`: Decrease product quantity
- `resetSelections`: Reset selections
- `addToCart`: Add selections to cart
- `updateCartItem`: Update cart item
- `clearCart`: Clear cart
- `loadFromStorage`: Load data from localStorage

### Middleware
- `localStorageMiddleware`: Automatic localStorage saving
- `loadFromLocalStorage`: State restoration on page load

## Language System

### Supported Languages
- **Turkish (TR)**: Default language
- **English (EN)**: Secondary language

### Language Context
The application uses React Context API for language management:


## Test Scenarios

### Functional Tests
1. **Product Selection**: Changing quantities with + and - buttons
2. **Tab System**: Switching between Menstrual and Supportive products
3. **Accordion**: Opening and closing product categories
4. **State Management**: Storing selections in global state
5. **State Persistence**: Preserving selections after page refresh
6. **Cart Operations**: Adding to cart, updating, deleting
7. **Category Deletion**: Separate deletion for each category
8. **Language Switching**: Turkish/English language toggle
9. **Language Persistence**: Language preference preservation
10. **Responsive**: Display on different screen sizes
11. **Validation**: Checking for at least one product selection
12. **Price Calculation**: Dynamic total price calculation

### UI/UX Tests
1. **Navigation**: All links working
2. **Routing**: Page transitions (/, /custom-packet, /cart)
3. **Hover Effects**: Button and card hover states
4. **Loading States**: Loading states and skeleton loader
5. **Error Handling**: Error states and fallback UI
6. **Mobile Menu**: Mobile menu opening and closing
7. **Badge System**: Cart count badge updates
8. **Language UI**: Language selector buttons and active state
9. **Translation Quality**: All UI text properly translated

## Development Notes

### Performance Optimizations
- Next.js Image component usage
- Lazy loading
- Code splitting
- Bundle optimization

### Accessibility
- ARIA labels
- Keyboard navigation
- Screen reader support
- Color contrast compliance

---
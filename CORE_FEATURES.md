# Vitaway Marketing Website; Core Features

The Vitaway marketing website is the public-facing digital presence at `vitaway.org`. Built with Next.js, it showcases Vitaway's healthcare and nutrition services, drives patient acquisition through pre-registration and assessments, and provides an e-commerce shop for health products.

**Stack:** Next.js (App Router), TypeScript, Tailwind CSS

**Backend integration:** Vitaway EHR API (`NEXT_PUBLIC_INVENTORY_API_URL`)

---

## Platform Role

The marketing website serves as the top-of-funnel entry point for the Vitaway ecosystem:

- **Patient acquisition**; Pre-registration, appointment booking, health assessments
- **Brand & education**; Company story, team, nutrition programs, blog content
- **E-commerce**; Health product shop with cart and checkout
- **App promotion**; Download page driving mobile app installs

---

## Homepage

The main landing page with seven content sections:

- **Hero**; Headline, app mockups, Download and "Join for free" call-to-action buttons
- **Consultation**; Remote consultation cards: Diabetes, Hypertension, Weight Management, Well Being
- **Services**; Chronic condition focus areas: Diabetes, Prevention, Hypertension, Mental Wellness
- **Video promo**; 14-day free trial promotion with social proof
- **Diabetes program**; How the diabetes program works with linked program details
- **Partners**; Partner organization logos
- **Office notice**; Dismissible in-person consultation notice (Kimironko office, Kigali)

---

## Company & Team

- **About Us**; Company story, photo gallery, mission statement
- **Our Team**; Team member grid from static content data
- **Team member profiles**; Individual pages with bio, role, and photo (`/our-team/members/[slug]`)
- **Who We Serve**; Target audiences: individuals, families, companies, institutions

---

## Health Programs & Education

Structured nutrition education content organized by topic:

### Well-Being Programs
- Chronic condition and healthy diet education overview

### Life Stages
- Nutrition guidance hub for different life stages:
  - Pregnancy nutrition
  - Children nutrition
  - Adult nutrition

### Food Groups
- Comprehensive food group education:
  - Vegetables, Dairy, Grains & Starch, Proteins, Fruit
  - MyPlate guide
  - Hydration

### Eat Well Guide
- Dietary proportions and balanced eating guidance

### Individual Programs
- Targeted programs for: diabetes, hypertension, weight management, mental health

---

## Health Tools & Assessments

Interactive health tools that engage visitors and collect intake data.

- **Health assessments**; Quiz listing with search, filter, and pagination; fetches quizzes from EHR API
- **Take a quiz**; Individual assessment pages with question flow and scoring
- **CanRisk assessment**; 13-step diabetes risk questionnaire wizard (validated clinical tool)
- **Appointment booking**; Book consultation form posting to EHR business appointment API
- **Pre-registration**; 7-step wizard: joining type, health goals, health conditions, consent, organization selection

---

## Content & Blog

- **Blog listing**; Health and nutrition articles fetched from EHR API with pagination
- **Blog post detail**; Individual article pages with rich content (`/blogs/[slug]`)
- **FAQs**; Accordion-style frequently asked questions from static content

---

## E-Commerce Shop

- **Product catalog**; Browse health products and supplements from EHR API
- **Product detail**; Individual product pages with images, description, and related products
- **Shopping cart**; Cart context provider for adding/removing items across pages
- **Categories**; Product category filtering

---

## Pricing & Downloads

- **Pricing page**; Subscription tiers and service pricing from static content
- **App download**; Mobile app download page with device mockups and App Store / Play Store links

---

## Contact & Support

- **Contact form**; Office information (Kigali) and message submission to EHR API
- **Customer support**; Ethics and compliance policy page
- **Live chat**; Tidio embedded chat widget on all pages

---

## Legal & Compliance

- **Privacy policy**; Data handling and privacy practices
- **Terms and conditions**; Service terms and liability disclaimer

---

## Site-Wide Features

- **Guest layout**; Shared navbar (top + bottom navigation), footer on all pages
- **Top progress bar**; Route transition loading indicator
- **SEO optimization**; Rich metadata, Open Graph, Twitter cards, JSON-LD Organization schema
- **Responsive design**; Mobile-first layout across all pages

---

## External API Integrations

All dynamic content is fetched from the Vitaway EHR API:

| Service | Endpoints | Used On |
|---------|-----------|---------|
| **Blogs** | `GET /api/blogs`, `GET /api/blogs/:slug` | Blog pages |
| **Products** | `GET /api/products`, categories | Shop pages |
| **Appointments** | `POST /api/appointments/business` | Appointment booking |
| **Pre-registration** | `POST /api/pre-registrations` | Pre-registration wizard |
| **Contact** | Contact form submission | Contact page |
| **Organizations** | Organization list | Pre-registration dropdowns |
| **Quizzes** | `GET/POST /api/quizzes/*` | Assessment pages |

---

## Static Content

Managed via JSON files in `content/`:

| File | Content |
|------|---------|
| `pricing.json` | Pricing tiers |
| `members.json` | Team member profiles |
| `faqs.json` | FAQ entries |
| `programs.json` | Diabetes program details |
| `parteners.json` | Partner logos |
| `testimonies.json` | Customer testimonials |
| `life-stages.json` | Life stages program data |

---

## Page Inventory

| Route | Purpose |
|-------|---------|
| `/` | Homepage |
| `/about-us` | Company story |
| `/our-team` | Team listing |
| `/our-team/members/[slug]` | Team member profile |
| `/serves` | Who we serve |
| `/indivituals` | Individual health programs |
| `/indivituals/canrisk` | CanRisk diabetes assessment |
| `/pricing` | Pricing tiers |
| `/download` | App download |
| `/contacts` | Contact form |
| `/faqs` | FAQs |
| `/customer-support` | Ethics & compliance |
| `/assessments` | Health quiz listing |
| `/assessments/[id]` | Take a health quiz |
| `/appointments` | Book appointment |
| `/pre-registration` | Patient pre-registration wizard |
| `/blogs` | Blog listing |
| `/blogs/[slug]` | Blog post |
| `/shop` | Product catalog |
| `/shop/[slug]` | Product detail |
| `/programs/well-being` | Well-being education |
| `/programs/eat-well-guide` | Eat Well Guide |
| `/programs/life-stages` | Life stages hub |
| `/programs/life-stages/stages/*` | Pregnancy, children, adult |
| `/programs/food-groups` | Food groups hub |
| `/programs/food-groups/groups/*` | Individual food groups |
| `/privacy-policy` | Privacy policy |
| `/terms-and-conditions` | Terms & conditions |

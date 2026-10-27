# Luxury Estates — Frontend

A responsive luxury real estate web application built with Next.js. It allows users to explore property listings, view property details, and submit inquiries. The admin interface provides property management features and an inquiry dashboard.

## Features

### Property Listings
- Display luxury properties in a responsive grid.
- Show property name, location, price, area, bedrooms, description, and images.
- View individual property details.
- Filter and sort property listings.

### Admin Dashboard
- Add new property listings.
- Edit existing property details.
- Delete property listings.
- Upload property images.
- Validate required fields and property prices.

### Inquiry Management
- Submit inquiries from property detail pages.
- Capture buyer name, email, phone number, and message.
- Display submitted inquiries in an admin table.
- Refresh inquiries to fetch the latest records.

## Tech Stack

- **Framework:** Next.js (App Router)
- **UI Library:** React
- **Language:** JavaScript
- **Component Library:** Material UI (MUI)
- **HTTP Client:** Axios
- **Styling:** Material UI styling system
- **API Integration:** REST API

## Project Structure

```text
luxury_estates_frontend/
├── public/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   ├── properties/
│   │   │   └── [id]/
│   │   ├── layout.jsx
│   │   └── page.jsx
│   ├── components/
│   │   └── admin/
│   │       └── InquiriesTable.jsx
│   └── lib/
│       └── api/
│           ├── axios.js
│           ├── propertyApi.js
│           └── inquiryApi.js
├── .env.local
├── package.json
└── README.md
```

*The structure above is illustrative. Adjust it to match your actual project files.*

## Getting Started

### Prerequisites

- Node.js and npm
- A running backend API

### 1. Clone the repository

```bash
git clone https://github.com/26nikitachhattani/luxury_estates_frontend
cd luxury_estates_frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

Update the URL if your backend runs at a different address.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production

```bash
npm run build
npm run start
```

## API Integration

The frontend uses Axios to communicate with the backend REST API.

| API function | Purpose |
|---|---|
| `getProperties()` | Fetch property listings |
| `getPropertyById(id)` | Fetch a property's details |
| `createProperty(data)` | Create a property |
| `updateProperty(id, data)` | Update a property |
| `deleteProperty(id)` | Delete a property |
| `submitInquiry(propertyId, data)` | Submit an inquiry |
| `getInquiries()` | Fetch inquiries for the admin dashboard |

The API functions are organized under `src/lib/api/`.

## Environment Configuration

The `NEXT_PUBLIC_API_URL` variable defines the base URL used by the frontend API client.

Ensure the backend is running and configured to accept requests from the frontend's origin. Admin-only operations also require the appropriate backend authentication and permissions.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build |
| `npm run lint` | Run linting if configured in `package.json` |

## Future Enhancements

- Add admin authentication and session management.
- Add pagination and search to the inquiries table.
- Add inquiry status management.
- Improve loading, empty, and error states.
- Add responsive image galleries and advanced property filters.

## License

Developed as part of a property showcase and inquiry management application assignment.

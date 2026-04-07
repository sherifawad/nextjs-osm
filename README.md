# Find a Mosque (Masjid) - ابحث عن مسجد

A community-driven map application designed to help Muslims find and add mosques (Masajid) in their region. This project leverages OpenStreetMap to provide an interactive and accessible platform for the community.

## 🌟 Features

- **Interactive Map**: View mosques in your area using an OpenStreetMap-powered interface.
- **Add & Edit Places**: Community members can add new mosques or update existing information.
- **Verification System**: Users can rate and verify the reputation of locations (VERIFIED or FAKE) to ensure data accuracy.
- **Multilingual Support**: Supports both Arabic and English names for locations.
- **User Authentication**: Secure sign-in via Google.
- **Responsive Design**: Optimized for both desktop and mobile devices using Tailwind CSS.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Mapping**: [OpenStreetMap](https://www.openstreetmap.org/), [Leaflet](https://leafletjs.com/), [React Leaflet](https://react-leaflet.js.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
- **Validation**: [Zod](https://zod.dev/)

## 🚀 Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- pnpm (Preferred package manager)
- A PostgreSQL database instance
- Google Cloud Console project for OAuth credentials

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/nextjs-osm.git
    cd nextjs-osm
    ```

2.  **Install dependencies**:
    ```bash
    pnpm install
    ```

3.  **Configure Environment Variables**:
    Create a `.env.dev.local` file in the root directory and add the following variables:

    ```env
    # Database
    DATABASE_URL="postgresql://user:password@localhost:5432/nextjs_osm?schema=public"

    # NextAuth
    NEXTAUTH_URL="http://localhost:3000"
    NEXTAUTH_SECRET="your-nextauth-secret"

    # Google OAuth
    GOOGLE_CLIENT_ID="your-google-client-id"
    GOOGLE_CLIENT_SECRET="your-google-client-secret"

    # Optional
    PREVIEW_API_KEY="your-preview-api-key"
    ```

    - **`DATABASE_URL`**: Your PostgreSQL connection string.
    - **`NEXTAUTH_SECRET`**: A random string used to hash tokens. You can generate one using `openssl rand -base64 32`.
    - **`GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`**: Obtain these from the [Google Cloud Console](https://console.cloud.google.com/) by creating OAuth 2.0 credentials.

4.  **Database Setup**:
    Generate the Prisma client and run migrations:
    ```bash
    pnpm run prepare
    pnpm run migrate
    ```

5.  **Run the Development Server**:
    ```bash
    pnpm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 📖 Scripts

- `pnpm run dev`: Starts the development server.
- `pnpm run build`: Builds the application for production.
- `pnpm run start`: Starts the production server.
- `pnpm run lint`: Runs ESLint for code quality checks.
- `pnpm run studio`: Opens Prisma Studio to explore your database.

## 🤝 Contributing

Contributions are welcome! If you're interested in improving the app, feel free to fork the repository and submit a pull request.

## 📜 License

This project is private. (Adjust as necessary based on project requirements).

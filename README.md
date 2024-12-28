This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
 

 # Project Name

A Next.js project initialized with Tailwind CSS and TypeScript, following a feature-sliced architecture for better code organization and maintainability.

---

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v14 or higher  
- **npm**: v6 or higher  
- **yarn**: v1.22 or higher (optional)  

---

### Installation

Follow these steps to set up the project:

1. **Clone the repository**  
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
### Installation

Follow these steps to set up the project:

2. **Navigate to the project folder**  
   ```bash
   cd your-repo-name
   
### Installation

3. **Install dependencies**  
   Using npm:  
   ```bash
   npm install
   ```  
   Or using Yarn:  
   ```bash
   yarn install
   ```

---

## Project Structure

This project is organized following the feature-sliced architecture. Below is an overview of the folder structure:

```plaintext
.
├── public/                # Static files
├── src/
│   ├── app/               # Application entry (Next.js app directory)
│   ├── features/          # Feature modules
│   ├── shared/
│   │   └── ui/            # Shared UI components
│   └── widgets/           # Widgets
├── .gitignore
├── README.md
├── eslint.config.mjs      # ESLint configuration
├── next.config.ts         # Next.js configuration
├── package.json
├── postcss.config.mjs     # PostCSS configuration
├── tailwind.config.ts     # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

---

## Configuration

### Environment Variables

For environment-specific settings, create a `.env.local` file in the root directory. For example:

```env
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_SOME_KEY=12345
```

> **Note:** Variables prefixed with `NEXT_PUBLIC_` are accessible in the client-side code.

---

### ESLint

To ensure consistent code quality, use the following command to check for linting issues:

```bash
npm run lint
```

Or using Yarn:

```bash
yarn lint
```

---

### Tailwind CSS

Tailwind CSS is pre-configured in the project. You can customize it by modifying:

- `tailwind.config.ts`
- `postcss.config.mjs`

---

## Usage

### Running in Development

To start the development server, use:

```bash
npm run dev
```

Or with Yarn:

```bash
yarn dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser. Changes to the code will automatically reload the page.

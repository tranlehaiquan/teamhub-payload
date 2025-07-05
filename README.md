# TeamHub Payload

A modern team management platform built with **Next.js**, **Payload CMS**, **tRPC**, and **Shadcn/UI**.

---

## 🚀 Quick Start

1. **Clone the repository**

   ```sh
   git clone https://github.com/your-org/teamhub-payload.git
   cd teamhub-payload
   ```

2. **Install dependencies**

   ```sh
   pnpm install
   ```

3. **Set up environment variables**

   ```sh
   cp .env.example .env.local
   # Edit .env.local as needed
   ```

4. **Run database migrations**

   ```sh
   pnpm migrate
   ```

5. **(Optional) Seed the database**

   ```sh
   pnpm seed
   ```

6. **Start the development server**

   ```sh
   pnpm dev
   ```

7. **Open the app**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Payload Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 🗂️ Project Structure

- **[src/app](src/app)**: Next.js App Router pages and layouts
- **[src/components](src/components)**: Reusable UI components (Shadcn/UI)
- **[src/collections](src/collections)**: Payload CMS collections
- **[src/server](src/server)**: tRPC routers and server logic
- **[src/migrations](src/migrations)**: Database schema changes
- **[public](public)**: Static files and images

See [Cursor Rules](.cursor/rules/) for detailed conventions.

---

## 🛠️ Scripts

| Command               | Description                       |
| --------------------- | --------------------------------- |
| `pnpm dev`            | Start development server          |
| `pnpm build`          | Build for production              |
| `pnpm start`          | Start production server           |
| `pnpm lint`           | Run ESLint                        |
| `pnpm format`         | Format code with Prettier         |
| `pnpm test`           | Run tests with Vitest             |
| `pnpm migrate`        | Run database migrations           |
| `pnpm generate:types` | Generate Payload TypeScript types |

---

## 🏗️ Architecture

```mermaid
graph TD
  A[Next.js App Router] -->|API| B[tRPC Routers]
  B -->|DB Access| C[Payload CMS]
  C --> D[Database]
  A -->|UI| E[Shadcn/UI Components]
```

- **Next.js**: Frontend and API routes
- **tRPC**: Type-safe API layer
- **Payload CMS**: Headless CMS and database
- **Shadcn/UI**: Design system and UI components

---

## 🧑‍💻 Onboarding Checklist

- [ ] Clone the repo
- [ ] Install dependencies
- [ ] Set up `.env.local`
- [ ] Run migrations/seed data
- [ ] Start the dev server
- [ ] Run tests (`pnpm test`)
- [ ] Read [Cursor Rules](.cursor/rules/) for conventions

---

## 📝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for our guidelines.

- Use feature branches and open PRs for review.
- Run `pnpm lint` and `pnpm test` before pushing.
- Follow our [Cursor Rules](.cursor/rules/) for code conventions.

---

## 🧩 Useful Links

- [Payload CMS Docs](https://payloadcms.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [tRPC Docs](https://trpc.io/docs)
- [Shadcn/UI Docs](https://ui.shadcn.com/docs)
- [Cursor Rules](.cursor/rules/)

---

## 🛡️ Environment Variables

See `.env.example` for all required environment variables and their descriptions.

---

## 💡 Editor & Tooling

- Recommended: VSCode with extensions for ESLint, Prettier, Tailwind CSS, and MDX.
- See `.vscode/extensions.json` for suggestions.

---

## 📄 License

[MIT](LICENSE)

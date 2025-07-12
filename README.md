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

## 🗃️ Entity Relationship Diagram (ERD)

The following ERD visualizes the main entities (collections) and their relationships in the TeamHub Payload CMS schema:

```mermaid
erDiagram
    USERS {
        string id PK
        string email
        string name
        string[] roles
        string jobTitle
        string reportTo FK
        string profile FK
        timestamp createdAt
        timestamp updatedAt
    }

    PROFILES {
        string id PK
        string firstName
        string lastName
        string avatar FK
        timestamp createdAt
        timestamp updatedAt
    }

    MEDIA {
        string id PK
        string filename
        string alt
        text caption
        string mimeType
        number filesize
        number width
        number height
        timestamp createdAt
        timestamp updatedAt
    }

    SKILLS {
        string id PK
        string name
        text description
        string category FK
        timestamp createdAt
        timestamp updatedAt
    }

    CATEGORIES {
        string id PK
        string title
        timestamp createdAt
        timestamp updatedAt
    }

    USERS_SKILLS {
        string id PK
        string user FK
        string skill FK
        number currentLevel
        number desiredLevel
        timestamp createdAt
        timestamp updatedAt
    }

    TEAMS {
        string id PK
        string name
        text description
        string owner FK
        timestamp createdAt
        timestamp updatedAt
    }

    TEAMS_USERS {
        string id PK
        string team FK
        string user FK
        timestamp createdAt
        timestamp updatedAt
    }

    TEAM_SKILLS {
        string id PK
        string team FK
        string skill FK
        timestamp createdAt
        timestamp updatedAt
    }

    TEAM_REQUIREMENTS {
        string id PK
        string team FK
        string skill FK
        number desiredLevel
        number desiredMembers
        timestamp createdAt
        timestamp updatedAt
    }

    CERTIFICATES {
        string id PK
        string name
        string issuingOrganization
        date deliveryDate
        date expiryDate
        string user FK
        timestamp createdAt
        timestamp updatedAt
    }

    TRAININGS {
        string id PK
        string name
        string link
        text description
        string user FK
        string status
        date startDate
        date endDate
        string certificate FK
        timestamp createdAt
        timestamp updatedAt
    }

    CERTIFICATES_USERS_SKILLS {
        string certificate FK
        string userSkill FK
    }

    TRAININGS_USERS_SKILLS {
        string training FK
        string userSkill FK
    }

    %% Self-referencing relationship
    USERS ||--o{ USERS : "reportTo"

    %% User Profile relationship
    USERS ||--|| PROFILES : "has profile"

    %% Profile Avatar relationship
    PROFILES }o--|| MEDIA : "has avatar"

    %% User Skills (many-to-many with attributes)
    USERS ||--o{ USERS_SKILLS : "has skills"
    SKILLS ||--o{ USERS_SKILLS : "skilled by users"

    %% Skills Categories
    CATEGORIES ||--o{ SKILLS : "contains skills"

    %% Team Ownership
    USERS ||--o{ TEAMS : "owns teams"

    %% Team Membership (many-to-many)
    TEAMS ||--o{ TEAMS_USERS : "has members"
    USERS ||--o{ TEAMS_USERS : "member of teams"

    %% Team Skills (many-to-many)
    TEAMS ||--o{ TEAM_SKILLS : "requires skills"
    SKILLS ||--o{ TEAM_SKILLS : "used by teams"

    %% Team Requirements
    TEAMS ||--o{ TEAM_REQUIREMENTS : "has requirements"
    SKILLS ||--o{ TEAM_REQUIREMENTS : "required by teams"

    %% User Certificates
    USERS ||--o{ CERTIFICATES : "has certificates"

    %% User Trainings
    USERS ||--o{ TRAININGS : "has trainings"

    %% Training Certificate relationship
    CERTIFICATES ||--o| TRAININGS : "awarded from training"

    %% Certificate Skills relationship (many-to-many)
    CERTIFICATES ||--o{ CERTIFICATES_USERS_SKILLS : "validates skills"
    USERS_SKILLS ||--o{ CERTIFICATES_USERS_SKILLS : "validated by certificates"

    %% Training Skills relationship (many-to-many)
    TRAININGS ||--o{ TRAININGS_USERS_SKILLS : "develops skills"
    USERS_SKILLS ||--o{ TRAININGS_USERS_SKILLS : "developed by trainings"
```

### ERD Summary

- **Users** can have a profile, report to another user, and have many skills, certificates, and trainings.
- **Profiles** can have an avatar (media).
- **Skills** are grouped by categories and linked to users and teams.
- **Teams** have members, skills, and requirements.
- **Certificates** and **Trainings** are linked to users and can validate or develop specific user skills.
- Many-to-many relationships are managed via join tables (e.g., `users_skills`, `teams_users`).

---

## 📋 Collections Summary Table

| Table/Collection      | Purpose/Notes                                 |
|----------------------|-----------------------------------------------|
| Users                | Core user data, roles, reporting structure    |
| Profiles             | Extended user info, avatar                    |
| Skills               | Skill definitions, linked to categories       |
| Categories           | Skill grouping                                |
| UserSkills           | User's skill levels, many-to-many             |
| Teams                | Team info, single owner                       |
| TeamMembers          | Team membership, many-to-many                 |
| TeamSkills           | Skills required by teams                      |
| TeamRequirements     | Desired skill levels/members for teams        |
| Certificates         | User certifications, can validate skills      |
| Trainings            | User trainings, can develop skills            |
| Media                | File uploads, avatars, etc.                   |

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

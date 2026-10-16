# 2Game Vietnam Gaming Portal Clone

A high-performance, feature-complete web portal replicating **2Game Vietnam** (https://www.2game.com/vi-vn/), built with React, TypeScript, and Tailwind CSS. Featuring latest gaming news, mobile & PC game reviews, active giftcode claiming directory, video trailers, release schedules, game database search & filtering, and community discussion boards.

## User Review & Critical Decisions

> [!IMPORTANT]
> Based on your confirmed preferences in Phase 1:
> - **Primary Scope**: Full gaming portal with news, reviews, giftcodes, and community.
> - **Interactive Features**: Fully functional giftcode directory with copy codes, game search and filtering by platform/genre, user comments and rating submission.
> - **Visual Aesthetic**: Authentic 2Game dark gaming theme with red and dark card aesthetics (`#0f1115` background, `#dc2626` red accents, sleek dark cards).

- **Confirmed Decision**: Client-side robust mock state with localStorage persistence for bookmarked games, claimed giftcodes history, user comments, and review ratings so the portal is 100% interactive out of the box.
- **Open Choice / Recommended Default**: Pre-populated with dozens of realistic Vietnamese gaming news items, hot mobile/PC games (Genshin Impact, Honor of Kings, Honkai Star Rail, Black Myth Wukong, Ragnarok Origin, Sword and Magic, etc.), and active giftcodes.

---

## 1. Overview & Core Concept

- **What It Does**: A comprehensive Vietnamese gaming portal delivering breaking gaming news, expert reviews, release dates, video guides, and an active giftcode hub where gamers can search, filter, and claim redeemable codes instantly.
- **Target Audience / Persona**: Vietnamese gamers (PC and mobile MMORPG, MOBA, tactical RPG, and strategy players) seeking news, codes, and game guides.
- **Key Value**: Instant access to verified giftcodes with one-click copy, up-to-date game directory with filters (Android, iOS, PC), and immersive editorial design matching 2Game's signature dark red gaming aesthetic.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Home Portal**: Breaking news hero carousel, trending giftcodes ticker, latest news grid, popular game rankings, and recent video highlights.
  2. **Giftcode Hub (`/giftcodes`)**: Searchable directory of active redeemable giftcodes for top games, with one-click copy-to-clipboard, expiration countdowns, redemption guides, and claimed code tracking.
  3. **News & Reviews (`/news`, `/reviews`)**: Filterable articles by category (MMORPG, Mobile, PC, Esports, Hand-on preview) with full article reading view, view counts, and user comment section.
  4. **Game Directory & Database (`/games`)**: Browse upcoming and released games filtered by platform (iOS, Android, PC) and genre, with release dates and ratings.
  5. **Community Discussions (`/community`)**: Gamer forums and comment streams where users can post reviews and share tips.
- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Authentic gaming portal (dark immersive slate background `#0b0d10`, surface cards `#161a22`, vibrant gaming red `#ef4444` for primary buttons/badges/accents, crisp white and light gray text).
  - *Typography*: Clean sans-serif font family (`Plus Jakarta Sans` or system sans) with tabular numerals for countdowns and scores.
  - *Component Styling*: Tailwind CSS v4 styling with hairline borders (`border-neutral-800`), smooth hover glows, and zero-pill metadata representation.
- **Interactive Feedback**: Instant toast notifications when copying giftcodes, optimistic UI updates when posting comments or bookmarking games, modal previews for game trailers and giftcode redemption instructions.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Full Client-Side Interactivity vs Static Mockup**
  - *Chosen Approach*: Fully interactive state management (React `useState`, `useEffect`, localStorage) for giftcodes claiming, search filters, bookmarking, and comment posting.
  - *Why*: Delivers an engaging, living application experience without needing external backend dependencies.
- **Decision 2: Authentic 2Game Visual Styling**
  - *Chosen Approach*: Dark mode obsidian backdrop with vibrant crimson red branding and clean card layouts mimicking professional gaming portals.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────┐
│                        App.tsx                         │
│           (State: active tab, search, filters,          │
│            bookmarks, claimed codes, comments)         │
└──────┬──────────────┬──────────────┬──────────────┬────┘
       │              │              │              │
       ▼              ▼              ▼              ▼
┌──────────────┐┌──────────────┐┌──────────────┐┌──────────────┐
│  Navbar &    ││  Hero &      ││  Giftcodes   ││ News & Game  │
│  Navigation  ││  Carousels   ││  Directory   ││ Catalog Grid │
└──────────────┘└──────────────┘└──────────────┘└──────────────┘
       │              │              │              │
       └──────────────┴──────┬───────┴──────┬───────┘
                             ▼              ▼
                ┌──────────────────────────┐┌──────────────┐
                │ Modal Previews & Toasts  ││  Community   │
                │ (Article Reader, Copy    ││  Discussions │
                │  Code Dialog, Trailers)  ││  & Comments  │
                └──────────────────────────┘└──────────────┘
```

- **Data Models**:
  - `Game`: ID, title, image, platform (iOS, Android, PC), genre, rating, releaseDate, status.
  - `NewsArticle`: ID, title, excerpt, content, category, author, date, views, commentsCount, image.
  - `GiftCode`: ID, gameTitle, gameImage, code, description, expiryDate, rewards, steps, claimedCount.
  - `Comment`: ID, author, avatar, content, timestamp, rating.
- **Interactive Component Mapping**:
  - Giftcode search input filters list instantly and copy button copies code to clipboard with success toast.
  - Game catalog filter tabs filter by platform and genre with zero latency.
  - Article modal opens full markdown-style review with interactive comment submission.

---
marp: true
theme: gaia
class: default
paginate: true
backgroundColor: #fff
footer: 'Payload CMS Strategy: Architecture & Integration'
style: |
  section { font-family: 'Arial', sans-serif; font-size: 28px; }
  h1 { color: #2c3e50; font-size: 60px; }
  h2 { color: #e67e22; }
  strong { color: #e74c3c; }
  code { background: #f0f0f0; padding: 2px 5px; border-radius: 4px; color: #d63384; }
  table { width: 100%; font-size: 0.7em; }
  th { background-color: #f8f9fa; text-align: left; }
---

# Application Architecture Strategy
## Adopting Payload CMS in a Spring Boot Ecosystem

### A "Sidecar" Approach to Content & Experience Management

---

# Agenda

1.  **Technology Overview:** What is Payload CMS?
2.  **The Business Case:** Why do we need a dedicated CMS?
3.  **Risk Assessment:** Addressing "Vendor Lock-in" concerns.
4.  **Architecture:** Integration with Spring Boot & PostgreSQL.
5.  **Frontend Strategy:** Next.js as a Security Layer (BFF).
6.  **Implementation:** Next Steps & POC.

---

# Section 1: Technology Overview
## What is Payload CMS?

---

# What is Payload CMS?

Payload is a **headless, code-first Content Management System** built natively with TypeScript, Node.js, and React.

* **"Headless":** It provides APIs (REST & GraphQL) to deliver content to *any* frontend, rather than building HTML pages itself.
* **"Code-First":** We define our content structures (Schemas) in code, not by clicking around in a GUI.
* **"Self-Hosted":** We own the data and the infrastructure. It is not a SaaS black box.



---

# The "Code-First" Advantage

Unlike traditional CMSs where you create fields via a drag-and-drop UI, Payload uses **TypeScript Config Files**.

* **Version Controllable:** Database schema is committed to Git alongside our code.
* **Developer Friendly:** Full IntelliSense and type safety while defining content.
* **Zero Magic:** It's just a Node.js Express application under the hood.



---

# The Admin UI (React-Based)

Payload auto-generates a functional Admin Panel based on our config.

* **No Code Required:** We define the data model; Payload builds the UI.
* **Extensible:** Because the Admin UI is built in React, we can swap out *any* component (fields, views, dashboard) with our own.
* **White-Label:** Fully customizable branding for internal tools.



---

# Key Technical Features

Why we chose Payload over competitors (Strapi, Contentful):

1.  **Database Agnostic:** Native support for **PostgreSQL** (via Drizzle ORM).
2.  **TypeScript Native:** It auto-generates TypeScript types for our frontend to consume.
3.  **Local Development:** Works perfectly on `localhost`. No cloud syncing required.
4.  **License:** MIT License. Free to use, modify, and scale without per-seat pricing.

---

# Section 2: The Business Case
## Solving the "Admin Panel Tax"

---

# The Problem: The "Admin Panel" Tax

We are a Spring Boot & React shop. Building internal tools from scratch is expensive.

* **The Spring Overhead:** Creating Entities, Repositories, and Controllers for simple text, settings, or "About Us" pages.
* **The React Gap:** Building custom Admin UIs takes focus away from core business logic.
* **The "Reinvention" Risk:** Building **Drafts**, **Versioning**, and **Rich Text** from scratch is complex and error-prone.

---

# The Solution: Buy Commodity, Build Core

We use Payload as a **Specialized Sidecar Service**.

* **Do Not Build:** Generic CRUD, Auth screens, Password resets, File uploads.
* **Do Build:** Unique business logic (Orders, Payments, Calculations).

**The Payoff:** We save months of engineering time by treating Content Management as a solved problem.

---

# Section 3: Risk Assessment
## Vendor Lock-in Analysis

---

# Risk Analysis: Are we locked in?

We analyzed three layers of lock-in risk.

| Layer | Risk Level | Assessment |
| :--- | :--- | :--- |
| **Infrastructure** | **Very Low** | Self-hosted, Open Source (MIT). Runs on any Docker container. No external SaaS dependency. |
| **Data** | **Low** | **Database Agnostic.** Connects to our existing PostgreSQL. If we remove Payload, data remains in standard SQL tables. |
| **Framework** | **Medium** | We are coupled to Payload's config logic. **Mitigation:** Keep business logic in Spring Boot; use Payload only for CRUD/Content. |

---

# Section 4: Architecture
## Integration with Spring Boot

---

# Architecture: The "Sidecar" Pattern



* **Database:** Shared PostgreSQL instance.
    * Schema A: `public` (Spring Boot / Business Data)
    * Schema B: `cms` (Payload / Experience Data)
* **Separation of Concerns:**
    * **Spring Boot:** Orders, Transactions, Complex Computations.
    * **Payload:** Themes, Messaging, Text content, Media assets.

---

# Section 5: Frontend Strategy
## Next.js as a Security Layer

---

# Frontend Strategy: Why Next.js?
*(Even for Internal Systems)*

We recommend **Next.js** as a **Backend-for-Frontend (BFF)**.

1.  **Security Shield:** Next.js acts as a proxy. It hides internal Spring Boot APIs from the client and handles `HttpOnly` cookies (preventing XSS).
2.  **Live Preview:** Next.js enables "Draft Mode," allowing editors to see changes safely before publishing.
3.  **Unified Stack:** Payload V3 *is* a Next.js app. Leveraging it for the UI optimizes our infrastructure footprint.



---

# Handling Custom UIs (Figma Designs)

We have custom React designs from Figma. We will use the **"Embedded Pattern."**

* **Do NOT build a separate Admin App.**
* **Strategy:** Inject Figma-generated React components directly into Payload's config.
    * *Example:* Replace the default Dashboard with our custom Figma design.
    * *Example:* Use custom React components for complex form inputs.
* **Benefit:** We get Auth, Permissions, and Navigation for free, focusing only on the unique UI parts.

---

# Section 6: Feature Deep Dive
## Where Payload Beats Custom Code

---

# Feature: Versioning & Drafts

Why buying is better than building in Spring Boot:

| Spring Boot Implementation | Payload CMS Implementation |
| :--- | :--- |
| Create shadow tables (`orders_history`) | **Native:** `versions: { drafts: true }` |
| Build "Restore" logic manually | **Native:** One-click restore API |
| Build "Autosave" endpoints | **Native:** Automatic autosave hooks |
| **Est. Effort: 3 Sprints** | **Est. Effort: 1 Hour** |

---

# Feature: Rich Text (Lexical)

Payload uses **Lexical** (by Meta), solving the "HTML string" nightmare.

* **The Problem with HTML Strings:** Security risks (XSS) and hard to style natively on mobile apps.
* **The Payload Solution:** Saves content as a **JSON Tree**.
    * **React Synergy:** Map JSON nodes directly to React components.
    * *Example:* A "Warning Block" in the editor renders as our `<CustomAlert />` component in the frontend.



---

# Configuration Example: Global Theming

Defining a "Theme" singleton without touching the DB schema:

```typescript
// payload.config.ts
export const Theme: GlobalConfig = {
  slug: 'theme',
  access: { read: () => true }, // Publicly readable
  fields: [
    {
      name: 'actionPrimaryColor',
      type: 'text', // Users select brand color
      defaultValue: '#007bff',
    },
    {
      name: 'maintenanceMessage',
      type: 'richText', // Lexical editor for banner
    }
  ],
};
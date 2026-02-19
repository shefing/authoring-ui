# End-User-Comm — Domain Model

This document describes the domain model of the **end-user-comm-services** module.

---

## Entity-Relationship Overview

```
MSG_BRANDING  1──────┐
                     │
                     ▼
MSG_TEMPLATE  *──── MSG_BRANDING (via MSG_BRANDING_ID)
      │
      │ (via MSG_TEMPLATE_ID)
      ▼
MSG_DEFINITION  1───*  MSG_TRIGGER  1───*  MSG_TRIGGER_TARGET
                                                  │
                                                  ▼
                                            MSG_CLIENT (matched by hostname)
```

---

## Database Tables (Private PostgreSQL)

### MSG_DEFINITION
The core entity — a reusable message that can be triggered to endpoints.

| Column | Type | Notes |
|--------|------|-------|
| MSG_DEFINITION_ID | uuid PK | |
| MSG_DEFINITION_NAME | varchar(1024) | Unique per account (case-insensitive) |
| ACCOUNT_ID | int | Tenant identifier |
| UPDATED_AT | timestamp | Auto-set |
| UPDATED_BY | varchar(1024) | |
| MSG_TEMPLATE_ID | uuid | FK → MSG_TEMPLATE |
| TITLE | jsonb | Lexical editor content |
| BODY | jsonb | Lexical editor content |
| BUTTONS | jsonb | Button text list |
| IS_HIDDEN | boolean | Visibility flag (default true) |
| IS_DELETED | boolean | Soft delete (default false) |

### MSG_TRIGGER
Represents an activation of a message definition — sending it to a set of targets.

| Column | Type | Notes |
|--------|------|-------|
| MSG_TRIGGER_ID | uuid PK | |
| MSG_DEFINITION_ID | uuid | FK → MSG_DEFINITION |
| ACCOUNT_ID | int | |
| TRIGGERED_AT | timestamp | |
| TRIGGERED_BY | varchar(1024) | |
| EXPIRES_AT | timestamp | |
| TRIGGER_TYPE | varchar(50) | `Manual` or `API` |
| TRIGGER_REFERENCE_ID | text | External reference for API triggers |
| CONTENT | jsonb | Snapshot of branding + template + definition at trigger time |

### MSG_TRIGGER_TARGET
One row per device/user that should receive a triggered message. Tracks delivery status.

| Column | Type | Notes |
|--------|------|-------|
| MSG_TRIGGER_TARGET_ID | uuid PK | |
| MSG_TRIGGER_ID | uuid | FK → MSG_TRIGGER |
| ACCOUNT_ID | int | |
| TRIGGERED_AT | timestamp | |
| UPDATED_AT | timestamp | |
| TARGET_HOSTNAME | varchar(1024) | Decrypted hostname |
| TARGET_HOSTNAME_ENCRYPTED | text | Encrypted hostname (for logs/display) |
| TARGET_USERNAME | varchar(1024) | |
| EXPIRES_AT | timestamp | |
| STATUS | varchar(100) | `Triggered` → `Rendered` → `Acknowledged` / `Expired` |

### MSG_TEMPLATE
Defines the visual layout and structure of a message.

| Column | Type | Notes |
|--------|------|-------|
| ID | uuid PK | |
| NAME | varchar(1024) | Unique per account (case-insensitive) |
| ACCOUNT_ID | int | |
| UPDATED_AT | timestamp | |
| UPDATED_BY | varchar(1024) | |
| DESCRIPTION | varchar(1024) | |
| TYPE | varchar(1024) | Message type (e.g. `Notification`) |
| BASE_TEMPLATE_NAME | varchar(1024) | OOTB template reference |
| HTML | text | Template HTML |
| CSS | text | Template CSS |
| MSG_BRANDING_ID | uuid | FK → MSG_BRANDING |
| TITLE | jsonb | Title field config (null = disabled) |
| BODY | jsonb | Body field config (null = disabled) |
| BUTTONS | jsonb | Button definitions |
| CHANNELS | jsonb | Delivery channels |
| LOGO | jsonb | Logo attributes |
| IS_DELETED | boolean | Soft delete (default false) |

### MSG_BRANDING
Account-level visual branding (colors, logo) applied to templates.

| Column | Type | Notes |
|--------|------|-------|
| ID | uuid PK | |
| NAME | varchar(1024) | |
| ACCOUNT_ID | int | |
| UPDATED_AT | timestamp | |
| UPDATED_BY | varchar(1024) | |
| PRIMARY_COLOR | varchar(100) | |
| SECONDARY_COLOR | varchar(100) | |
| BACKGROUND_COLOR | varchar(100) | |
| TEXT_COLOR | varchar(100) | |
| LOGO | text | Base64 or URL |

### MSG_CLIENT
Tracks agent endpoints that have connected and support messaging.

| Column | Type | Notes |
|--------|------|-------|
| ACCOUNT_ID | int | Composite PK |
| HOSTNAME | varchar(1024) | Encrypted hostname — Composite PK |
| HOSTNAME_DECRYPTED | varchar(1024) | |
| UPDATED_AT | timestamp | Last heartbeat |
| SUPPORTS_MESSAGES_AT | timestamp | When messaging capability was first reported |

---

## Java Domain Records

### Core Records (`com.aternity.endusercomm.message`)

| Record | Key Fields | Purpose |
|--------|-----------|---------|
| `MessageDefinition` | definitionId, definitionName, templateId, titleLexical, bodyLexical, buttonsText | Reusable message content |
| `MessageTemplate` | id, name, type, baseTemplateName, html, css, brandingId, title, body, buttons, channels, logo | Visual template with layout |
| `MessageTemplateInfo` | id, name, type, channels | Lightweight template summary |
| `MessageTrigger` | triggerId, triggerType, definitionId, triggeredAt, expiresAt, content | An activation of a definition |
| `MessageTriggerTarget` | triggerTargetId, triggerId, hostname, encryptedHostname, username, status, expiresAt | Per-device delivery tracking |
| `TriggerContent` | branding, template, messageDefinition | Snapshot of all content at trigger time |
| `MessageInfo` | definitionId, definitionName, templateId | Lightweight definition summary |

### Branding (`com.aternity.endusercomm.branding`)

| Record | Key Fields | Purpose |
|--------|-----------|---------|
| `BrandingInfo` | brandingId, brandingName, primaryColor, secondaryColor, backgroundColor, textColor, logo | Account branding configuration |

### Supporting Records

| Record | Key Fields | Purpose |
|--------|-----------|---------|
| `MessageButton` | text, style, action | Single button definition |
| `MessageButtons` | alignment, buttons | Button group with layout |
| `MessageButtonsText` | buttonText | Button labels for definitions |
| `MessageChannel` | riverbed | Delivery channel flags |
| `MessageLogo` | alignment | Logo positioning |
| `BaseTemplate` | html, css | OOTB template content |
| `DeviceCountResult` | totalDevices, matchingDevices | Trigger target count preview |

---

## Enums

| Enum | Values | Purpose |
|------|--------|---------|
| `MessageStatus` | `Triggered`, `Rendered`, `Acknowledged`, `Expired` | Target delivery lifecycle. `Acknowledged` and `Expired` are terminal states. |
| `MessageType` | `Notification` | Type of message template |
| `TriggerType` | `Manual`, `API` | How a trigger was initiated |
| `ButtonAction` | `Cancel`, `Acknowledge` | What happens when a button is clicked |
| `ButtonStyle` | `Primary`, `Secondary`, `Plain` | Visual button style |
| `Alignment` | `Left`, `Center`, `Right` | Layout alignment for buttons and logo |

---

## Message Lifecycle

```
1. DEFINE    — Create MSG_DEFINITION (with template + branding references)
2. TRIGGER   — Create MSG_TRIGGER + MSG_TRIGGER_TARGET rows (status = Triggered)
               Snapshot content into TRIGGER.CONTENT (jsonb)
               Publish Kafka event
3. DELIVER   — Agent polls → receives message → status updated to Rendered
               Publish Kafka event
4. COMPLETE  — User clicks button → status updated to Acknowledged
               Publish Kafka event
5. EXPIRE    — Scheduled cleanup marks overdue targets as Expired
               Cleanup removes old triggers (90-day retention)
               Cleanup removes stale clients (7-day retention)
```

---

## Data Flow

```
UI/API → Management Resource → Service → DAO (JdbcTemplate) → PostgreSQL
                                  │
                                  ├──→ OrchestratorService → KafkaProducer
                                  │
                                  └──→ MessageTargetCache (in-memory)
                                                ▲
Agent ← AgentResource ← EndpointService ← Cache │
                                                 │
                              KafkaConsumer ──────┘
```

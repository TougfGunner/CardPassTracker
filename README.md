# 🎫 ServiceDesk Banking Letters & Credentials Tracker

[![Vue 3.x](https://img.shields.io/badge/Vue-3.x-4FC08D?style=flat-square&logo=vue.js)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Pinia](https://img.shields.io/badge/Pinia-2.x-FD3136?style=flat-square)](https://pinia.vuejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

> Enterprise-grade Service Desk platform for tracking banking letters, system passwords, and new starter credentials with complete audit trails, manager escalation, and email reminder workflows.

## Overview

ServiceDesk Banking Tracker solves three critical Service Desk challenges:

1. **Banking Letters Management**: Track when banking letters are ordered, ready for collection, and actually collected by employees with automatic reminders and manager escalation.

2. **System Credentials Distribution**: Generate secure system passwords (CRM, Trading Platform, HR Portal, etc.) for new starters and send them via email with confirmation tracking.

3. **Comprehensive Audit Logging**: Complete audit trail showing who ordered what, when reminders were sent, which managers were escalated, and collection confirmation timestamps.

Instead of manually tracking spreadsheets or logging into multiple systems, this centralized dashboard provides real-time visibility into critical onboarding deliverables.

## ✨ Key Features

### Banking Letters Workflow
- **Order Placement**: Analysts search Active Directory, select users, and mark them for banking orders
- **Ready Notification**: Automatic email sent 5 days after order (configurable) to notify employee collection is ready
- **Collection Confirmation**: Employee clicks email link to confirm collection has been picked up
- **Manager Escalation**: If not collected within 7 days (configurable), reminder sent to manager
- **Status Tracking**: Dashboard shows pending, ready, collected, and overdue banking items

### System Credentials Management
- **Credential Generation**: Secure server-side password generation for new starters
- **Welcome Email**: Automated emails with AJ Bell system credentials (CRM, Trading, HR Portal, VPN, Email)
- **Delivery Tracking**: Monitor which new starters have received and confirmed credentials
- **Status Monitoring**: Pending, sent, and confirmed credential tracking

### Audit & Compliance
- **Complete Audit Log**: Every action logged (order created, email sent, collection confirmed, manager notified)
- **User Attribution**: Track which Service Desk analyst performed which action
- **Timestamp Accuracy**: All timestamps in ISO 8601 format for reporting
- **Manager Tracking**: Monitor which managers have been escalated and when

### Dashboard & Reporting
- **Real-Time Statistics**:
  - Banking items: total ordered, ready, collected, overdue
  - Collection rate percentage
  - Average days to collection
  - New starters: credentials created vs. delivered
  - Manager escalation alerts

- **Advanced Filtering**:
  - Filter by status (ORDERED, READY, COLLECTED, OVERDUE)
  - Filter by type (BANK_LETTER, SYSTEM_PASSWORD)
  - Search by bank name or system name
  - Department-level aggregation
  - Sort by ordered date, ready date, or days waiting

- **Employee Search**:
  - Integrated Active Directory search
  - Autocomplete from AD users
  - One-click banking order creation

## 🏗️ Architecture

### Frontend Stack
- **Vue 3**: Composition API with `<script setup>` syntax
- **TypeScript**: Full type safety with comprehensive interfaces
- **Vite**: Lightning-fast development and production builds
- **Pinia**: State management with modular stores
- **Tailwind CSS**: Utility-first styling
- **Vue Router**: Client-side routing with lazy-loaded views

### State Management (Pinia Stores)

#### `useEmployeeStore`
- Employee records with banking status
- AD user search integration
- Filter employees needing banking
- Track banking completion dates

#### `useBankingStore`
- Banking item CRUD operations
- Status transitions (ORDERED → READY → COLLECTED/OVERDUE)
- Advanced filtering and sorting
- Collection statistics calculation
- Email confirmation token validation

#### `useNewStarterStore`
- New starter credential management
- Secure password generation tracking
- Welcome email send status
- Delivery rate monitoring
- Multi-system credential assignment

### Data Model

#### Employee
```typescript
interface Employee {
  id: string
  name: string
  email: string
  managerEmail: string
  department: string
  startDate: string (ISO 8601)
  needsBanking: boolean
  bankingCompletedDate?: string
}
```

#### BankingItem
```typescript
type BankingItemType = 'BANK_LETTER' | 'SYSTEM_PASSWORD'
type BankingStatus = 'ORDERED' | 'READY' | 'COLLECTED' | 'OVERDUE'

interface BankingItem {
  id: string
  employeeId: string
  type: BankingItemType
  bankName?: string
  systemName?: string
  status: BankingStatus
  orderedDate: string
  readyDate?: string
  collectedDate?: string
  collectedConfirmedByUser: boolean
  reminderCount: number
  confirmationToken?: string
}
```

#### AuditLogEntry
```typescript
interface AuditLogEntry {
  id: string
  entityType: 'BANKING_ITEM' | 'EMPLOYEE' | 'NEW_STARTER'
  entityId: string
  action: 'CREATED' | 'UPDATED' | 'EMAIL_SENT' | 'COLLECTION_CONFIRMED' | 'MANAGER_NOTIFIED'
  performedBy: string
  timestamp: string (ISO 8601)
  metadata?: Record<string, unknown>
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend API (Node.js/Express, .NET, or equivalent)
- Active Directory integration (PowerShell module for AD queries)
- Email service (SMTP or cloud provider)

### Installation

```bash
# Clone repository
git clone https://github.com/TougfGunner/CardPassTracker.git
cd CardPassTracker

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### Environment Configuration

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api

# Banking Letter Timings (days)
VITE_BANK_LETTER_READY_DAYS=5
VITE_BANK_LETTER_REMINDER_DAYS=7
VITE_MAX_REMINDERS=2

# Application Settings
VITE_APP_NAME=ServiceDesk Banking Tracker
VITE_ENVIRONMENT=development
```

### Development

```bash
# Start development server
npm run dev

# Run type checking
npm run type-check

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔌 API Contract

### AD User Search
```
GET /api/ad/users?q=john
Response: {
  samAccountName: "jsmith",
  displayName: "John Smith",
  mail: "john.smith@company.com",
  manager: "jane.doe@company.com",
  department: "Finance",
  startDate: "2024-01-15T00:00:00Z"
}
```

### Banking Items
```
GET /api/banking-items
POST /api/banking-items
POST /api/banking-items/confirm
GET /api/banking-items/{id}
```

### New Starters
```
GET /api/new-starters
POST /api/new-starters
POST /api/new-starters/generate-credentials
POST /api/new-starters/{id}/send-welcome
```

### Audit Log
```
GET /api/audit?entityType=BANKING_ITEM&entityId={id}
```

## 📊 Email Workflows

### Banking Letter Ready (Day 5)
**To**: Employee
**Subject**: Your banking letter is ready for collection
**Content**: Bank name, pickup location, confirmation link
**Action**: Employee clicks link to confirm collection

### First Reminder (Day 7)
**To**: Employee
**Subject**: REMINDER: Uncollected banking letter
**Content**: Please collect within 24 hours
**CC**: Manager email

### Manager Escalation (Day 7, after 2nd attempt)
**To**: Manager
**Subject**: ESCALATION: Employee has not collected banking letter
**Content**: Employee name, bank name, days pending, remediation steps

### New Starter Welcome
**To**: New employee
**Subject**: Welcome to AJ Bell - Your System Credentials
**Content**: System names, temporary passwords, password change instructions

## 🛠️ Technology Decisions

| Aspect | Choice | Rationale |
|--------|--------|----------|
| Frontend Framework | Vue 3 | Rapid development, excellent DX, small bundle size |
| Bundler | Vite | 10x faster HMR, optimized builds, modern ES modules |
| State Management | Pinia | Simpler than Vuex, better TypeScript support |
| Styling | Tailwind CSS | Utility-first, consistent design system |
| Type Safety | TypeScript | Catch errors early, improved maintainability |
| Routing | Vue Router | Official solution, lazy-loading support |
| Timestamps | ISO 8601 | International standard, timezone-safe |

## 📈 Scalability

- **Lazy-loaded views**: Dashboard, Banking, NewStarter, Audit views load on-demand
- **Computed properties**: Efficient filtering and statistics without unnecessary recalculations
- **Pagination support**: API contract includes page-based pagination
- **Optimistic updates**: UI updates before API confirmation for better UX

## 🔒 Security Considerations

- **Passwords**: Generated server-side, never exposed in frontend
- **Email tokens**: Short-lived, one-time-use tokens for collection confirmation
- **Audit logging**: Non-repudiation of actions
- **AD authentication**: Integrate with company AD for user authentication
- **Manager emails**: Retrieved from AD, never manually entered

## 📝 Future Enhancements

- [ ] SMS reminders in addition to email
- [ ] Bulk operations (create multiple banking orders at once)
- [ ] Integration with HR systems for auto-completion of new starters
- [ ] Mobile-friendly redesign
- [ ] Notification preferences per user
- [ ] Integration with ticketing systems (Jira, ServiceNow)
- [ ] Analytics dashboard with trends and forecasting

## 📄 License

MIT License - See LICENSE file for details

## 👥 Contributing

Contributions welcome! Please submit PRs with:
- Descriptive commit messages
- Type-safe code
- Updated tests
- Documentation updates

## 📞 Support

For issues, feature requests, or questions, please open a GitHub issue or contact the development team.

---

**Built with ❤️ for efficient Service Desk operations**

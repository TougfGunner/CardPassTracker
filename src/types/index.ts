// ============================================================================
// EMPLOYEE TYPES
// ============================================================================

export interface Employee {
  id: string
  name: string
  email: string
  managerEmail: string
  department: string
  startDate: string // ISO 8601
  needsBanking: boolean
  bankingCompletedDate?: string
}

// ============================================================================
// BANKING ITEM TYPES
// ============================================================================

export type BankingItemType = 'BANK_LETTER' | 'SYSTEM_PASSWORD'

export type BankingStatus = 'ORDERED' | 'READY' | 'COLLECTED' | 'OVERDUE'

export interface BankingItem {
  id: string
  employeeId: string
  type: BankingItemType
  bankName?: string // For BANK_LETTER
  systemName?: string // For SYSTEM_PASSWORD
  status: BankingStatus
  orderedDate: string // ISO 8601
  readyDate?: string
  collectedDate?: string
  collectedConfirmedByUser: boolean
  reminderCount: number
  confirmationToken?: string // For email links
}

// ============================================================================
// NEW STARTER CREDENTIAL TYPES
// ============================================================================

export type SystemType = 'CRM' | 'TRADING_PLATFORM' | 'HR_PORTAL' | 'EMAIL' | 'VPN' | 'OTHER'

export interface NewStarter {
  id: string
  employeeId: string
  systems: SystemType[]
  createdAt: string
  status: 'CREATED' | 'SENT' | 'CONFIRMED'
  sentByUser?: string
  notes?: string
}

// ============================================================================
// AUDIT LOG TYPES
// ============================================================================

export type AuditEntityType = 'BANKING_ITEM' | 'EMPLOYEE' | 'NEW_STARTER'

export type AuditAction =
  | 'CREATED'
  | 'UPDATED'
  | 'STATUS_CHANGED'
  | 'EMAIL_SENT'
  | 'COLLECTION_CONFIRMED'
  | 'OVERDUE_TRIGGERED'
  | 'MANAGER_NOTIFIED'

export interface AuditLogEntry {
  id: string
  entityType: AuditEntityType
  entityId: string
  action: AuditAction
  performedBy: string // User email or 'system'
  timestamp: string // ISO 8601
  metadata?: Record<string, unknown>
}

// ============================================================================
// FORM DATA TYPES
// ============================================================================

export interface BankingOrderFormData {
  employeeId: string
  type: BankingItemType
  bankName?: string
  systemNames?: SystemType[]
  notes?: string
}

export interface EmployeeSearchFormData {
  searchQuery: string
}

export interface NewStarterFormData {
  employeeId: string
  systems: SystemType[]
  notes?: string
}

// ============================================================================
// FILTER & DASHBOARD TYPES
// ============================================================================

export interface BankingFilterOptions {
  status: BankingStatus | 'ALL'
  type: BankingItemType | 'ALL'
  department: string | 'ALL'
  searchQuery: string
  sortBy: 'orderedDate' | 'readyDate' | 'daysWaiting'
}

export interface DashboardStats {
  // Banking items
  bankingTotalOrdered: number
  bankingReady: number
  bankingOverdue: number
  bankingCollected: number
  bankingCollectionRate: number // Percentage

  // New starters
  newStartersCreated: number
  newStartersWithCredentialsDelivered: number

  // Audit
  todayEmailsSent: number
  pendingManagerNotifications: number
}

export interface BankingItemStats {
  totalOrdered: number
  ready: number
  overdue: number
  collected: number
  averageDaysToCollection: number
  collectionRate: number
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  timestamp: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// ============================================================================
// EMAIL NOTIFICATION TYPES
// ============================================================================

export interface EmailNotification {
  id: string
  recipientEmail: string
  recipientName: string
  type: 'READY_FOR_COLLECTION' | 'REMINDER' | 'MANAGER_ESCALATION' | 'WELCOME_NEW_STARTER'
  subject: string
  sentAt: string
  confirmationLink?: string
  bankingItemId?: string
}

// ============================================================================
// AD INTEGRATION TYPES
// ============================================================================

export interface ADUserResult {
  samAccountName: string
  displayName: string
  mail: string
  manager: string // Manager's email or DN
  department: string
  title: string
  startDate?: string
}

export interface ApiKey {
  PK: string // APIKEY#${apiKeyId}
  SK: string // APIKEY#${apiKeyId}
  GSI1PK: string // WAITLIST#${waitlistId}
  GSI1SK: string // APIKEY#${createdAt}
  apiKeyId: string
  waitlistId: string
  name: string
  keyHash: string
  keyPrefix: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  lastUsedAt?: string
}
export interface Subscriber {
  PK: string // SUBSCRIBER#${subscriberId}
  SK: string // SUBSCRIBER#${subscriberId}
  GSI1PK: string // WAITLIST#${waitlistId}
  GSI1SK: string // SUBSCRIBER#${createdAt}
  subscriberId: string
  waitlistId: string
  email: string
  createdAt: string
  updatedAt: string
}
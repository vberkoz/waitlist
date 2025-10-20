import { createHash, randomBytes } from 'crypto'

export function generateApiKey(): { key: string; hash: string; prefix: string } {
  const key = `wl_${randomBytes(32).toString('hex')}`
  const hash = createHash('sha256').update(key).digest('hex')
  const prefix = key.substring(0, 12) // wl_xxxxxxxx
  
  return { key, hash, prefix }
}

export function hashApiKey(key: string): string {
  return createHash('sha256').update(key).digest('hex')
}

export function validateApiKeyFormat(key: string): boolean {
  return /^wl_[a-f0-9]{64}$/.test(key)
}
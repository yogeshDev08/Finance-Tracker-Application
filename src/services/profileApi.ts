import profileFixture from '../constants/profile.json'
import type { User } from '../types'

export type ProfileUpdate = Pick<User, 'name' | 'email' | 'location'>

let profileRecord: User = { ...profileFixture }

function waitForResponse<T>(value: T, signal?: AbortSignal): Promise<T> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('The request was cancelled.', 'AbortError'))
      return
    }

    const timeoutId = window.setTimeout(() => {
      signal?.removeEventListener('abort', cancelRequest)
      resolve(value)
    }, 250)

    function cancelRequest() {
      window.clearTimeout(timeoutId)
      reject(new DOMException('The request was cancelled.', 'AbortError'))
    }

    signal?.addEventListener('abort', cancelRequest, { once: true })
  })
}

export async function getProfile(fallback: User, signal?: AbortSignal): Promise<User> {
  await waitForResponse(null, signal)
  profileRecord = { ...profileRecord, ...fallback }
  return { ...profileRecord }
}

export async function updateProfile(update: ProfileUpdate, signal?: AbortSignal): Promise<User> {
  const name = update.name.trim()
  const email = update.email.trim()
  const location = update.location.trim()
  const atIndex = email.indexOf('@')
  const domain = email.slice(atIndex + 1)

  if (!name || !location) {
    throw new Error('Name and location are required.')
  }
  if (atIndex <= 0 || domain.includes('@') || email.includes(' ') || !domain.includes('.') || domain.endsWith('.')) {
    throw new Error('Enter a valid email address.')
  }

  await waitForResponse(null, signal)
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  profileRecord = { ...profileRecord, name, email, location, initials }
  return { ...profileRecord }
}
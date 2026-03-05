import '@testing-library/jest-dom'
import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'


expect.extend(matchers)


afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})


vi.mock('../api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn() },
    },
  },
  setAuthToken: vi.fn(),
  getAuthToken: vi.fn(),
}))


Object.defineProperty(window, 'scrollTo', { value: vi.fn(), writable: true });

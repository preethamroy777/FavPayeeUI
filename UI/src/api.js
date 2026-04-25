import axios from 'axios'

const STORAGE_KEYS = {
  payees: 'sg-payees',
  favorites: 'sg-favorites',
}

const defaultPayees = [
  { id: 1, name: 'Société Générale London', account: 'GB29 NWBK 6016 1331 9268 19', bank: 'SG London', country: 'United Kingdom' },
  { id: 2, name: 'SG Frankfurt Trade', account: 'DE12 5001 0517 5407 3249 04', bank: 'SG Frankfurt', country: 'Germany' },
  { id: 3, name: 'SG Paris Corporate', account: 'FR76 3000 6000 0112 3456 7890 189', bank: 'Société Générale', country: 'France' },
  { id: 4, name: 'Nordic Supply AS', account: 'NO93 8601 1117 947', bank: 'Nordea', country: 'Norway' },
  { id: 5, name: 'Mediterranean Foods GmbH', account: 'DE89 3704 0044 0532 0130 00', bank: 'HypoVereinsbank', country: 'Germany' },
  { id: 6, name: 'Lisbon Logistics', account: 'PT50 0002 0123 1234 5678 9015 4', bank: 'CGD', country: 'Portugal' },
  { id: 7, name: 'Madrid Energy SA', account: 'ES79 2100 0813 6101 2345 6789', bank: 'Banco Santander', country: 'Spain' },
  { id: 8, name: 'Stockholm Advisors', account: 'SE45 5000 0000 0583 9825 7466', bank: 'SEB', country: 'Sweden' },
  { id: 9, name: 'Vienna Health Partners', account: 'AT61 1904 3002 3457 3201', bank: 'Erste Bank', country: 'Austria' },
  { id: 10, name: 'Brussels Media Group', account: 'BE68 5390 0754 7034', bank: 'BNP Paribas Fortis', country: 'Belgium' },
]

const mockAccounts = [
  { id: 1, name: 'SG Business Euro', type: 'Current', balance: 248903.12 },
  { id: 2, name: 'SG Treasury EUR', type: 'Savings', balance: 115430.54 },
  { id: 3, name: 'SG Liquidity', type: 'Current', balance: 79850.87 },
]

const mockUsers = [
  { email: 'user1@societegenerale.eu', password: 'SG1234!', name: 'Claire Dubois', role: 'Retail Manager' },
  { email: 'user2@societegenerale.eu', password: 'SG4321!', name: 'Antoine Martin', role: 'Account Executive' },
]

const loadState = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : fallback
  } catch {
    return fallback
  }
}

const saveState = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

const mockState = {
  payees: loadState(STORAGE_KEYS.payees, defaultPayees),
  favorites: loadState(STORAGE_KEYS.favorites, [1, 3, 5]),
}

const savePayeeState = () => {
  saveState(STORAGE_KEYS.payees, mockState.payees)
  saveState(STORAGE_KEYS.favorites, mockState.favorites)
}

const adapter = async (config) => {
  await new Promise((resolve) => setTimeout(resolve, 220))
  const method = config.method?.toLowerCase()
  const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data || {}

  if (config.url === '/api/login' && method === 'post') {
    const user = mockUsers.find((record) => record.email === body.email && record.password === body.password)
    if (!user) {
      return {
        data: { error: 'Invalid email or password.' },
        status: 401,
        statusText: 'Unauthorized',
        headers: {},
        config,
      }
    }

    return {
      data: {
        user: { email: user.email, name: user.name, role: user.role },
        token: 'mock-session-token',
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    }
  }

  if (config.url === '/api/accounts' && method === 'get') {
    const totalBalance = mockAccounts.reduce((sum, account) => sum + account.balance, 0)
    return {
      data: { accounts: mockAccounts, totalBalance },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    }
  }

  if (config.url === '/api/payees' && method === 'get') {
    const payees = mockState.payees.slice(0, 20)
    return {
      data: { payees, favorites: mockState.favorites },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    }
  }

  if (config.url === '/api/payees' && method === 'post') {
    const nextId = mockState.payees.length ? Math.max(...mockState.payees.map((p) => p.id)) + 1 : 1
    const newPayee = {
      id: nextId,
      name: body.name,
      account: body.account,
      bank: body.bank,
      country: body.country,
    }
    mockState.payees.unshift(newPayee)
    if (mockState.payees.length > 20) {
      mockState.payees = mockState.payees.slice(0, 20)
    }
    savePayeeState()
    return {
      data: { payee: newPayee },
      status: 201,
      statusText: 'Created',
      headers: {},
      config,
    }
  }

  if (config.url === '/api/favorites' && method === 'post') {
    const id = Number(body.id)
    if (mockState.favorites.includes(id)) {
      mockState.favorites = mockState.favorites.filter((entry) => entry !== id)
    } else {
      mockState.favorites = [id, ...mockState.favorites].slice(0, 20)
    }
    savePayeeState()
    return {
      data: { favorites: mockState.favorites },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    }
  }

  return {
    data: { error: 'Endpoint not found.' },
    status: 404,
    statusText: 'Not Found',
    headers: {},
    config,
  }
}

const client = axios.create({ adapter })

const api = {
  login: async ({ email, password }) => {
    const response = await client.post('/api/login', { email, password })
    if (response.status !== 200) {
      throw new Error(response.data.error || 'Login failed')
    }
    return response.data
  },
  getAccounts: async () => {
    const response = await client.get('/api/accounts')
    return response.data
  },
  getPayees: async () => {
    const response = await client.get('/api/payees')
    return response.data
  },
  toggleFavorite: async (id) => {
    const response = await client.post('/api/favorites', { id })
    return response.data
  },
  addPayee: async (payee) => {
    const response = await client.post('/api/payees', payee)
    return response.data
  },
}

export default api

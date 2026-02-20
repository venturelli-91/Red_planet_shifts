export interface Workplace {
  id: string
  name: string
  address: string
  createdAt: string
}

export interface Worker {
  id: string
  name: string
  trade: string
  createdAt: string
}

export interface Shift {
  id: string
  workplaceId: string
  workerId: string | null
  start: string
  end: string
  trade: string
  cancelled: boolean
  createdAt: string
  workplace?: Workplace
  worker?: Worker | null
}

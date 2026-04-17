export interface User {
  id: number
  username: string
  email: string
}

export interface Night {
  id: number
  title: string
  caption?: string
  location?: string
  rating: number
  mood?: string
  drinks_count: number
  date: string
  owner_id: number
  owner_username?: string
  likes_count?: number
  is_liked?: boolean
}

export interface AuthResponse {
  token: string
  user: User
}

export interface User {
  id: number
  username: string
  email: string
  bio?: string
  location?: string
}

export interface NightAuthor {
  id: number
  username: string
}

export interface Night {
  id: number
  title: string
  caption?: string
  location?: string
  rating: number
  mood?: string
  drinks_count: number
  created_at: string
  user_id: number
  user: NightAuthor
  like_count: number
  liked_by_me: boolean
}

export interface AuthResponse {
  token: string
  user: User
}

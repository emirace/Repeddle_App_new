export type SearchOptions = {
  category?: string
  price?: string
  rating?: string
  color?: string
  size?: string
  shipping?: string
  condition?: string
  availability?: string
  type?: string
  pattern?: string
  brand?: string
  deal?: string
  maxPrice?: string
  minPrice?: string
  order?: string
  page?: number
  query?: number
}

export type SearchOptionsKey = keyof SearchOptions

export type SearchOptionsObject = {
  [key in SearchOptionsKey]?: string | string
}

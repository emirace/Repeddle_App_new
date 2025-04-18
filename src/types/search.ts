export type SearchOptions = FilterOptions & {
  // price?: string
  order?: string
  page?: number
  query?: string
}

export type FilterOptions = {
  category?: string
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
  mainCategory?: string
}

export type SearchOptionsKey = keyof SearchOptions

export type SearchOptionsObject = {
  [key in SearchOptionsKey]?: string
}

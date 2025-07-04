import { Key } from "react"

export type ICategory = {
  [x: string]: Key | null | undefined | boolean | string | ISubCategory[]
  name: string
  image: string
  isCategory: boolean
  path: string
  subCategories: ISubCategory[]
  _id: string
  createdAt: string
  updatedAt: string
} & {
  mobile_path?: string | object
}

export type ISubCategory = {
  name: string
  items: ISubCategoryItem[]
  isCategory: boolean
  path: string
  _id: string
} & {
  mobile_path?: string | object
}

export type ISubCategoryItem = {
  name: string
  isCategory: boolean
  path: string
  _id: string
} & {
  mobile_path?: string | object
}

export type ICreateCategory = Omit<
  ICategory,
  "_id" | "createdAt" | "updatedAt"
> & {
  subCategories: (Omit<ISubCategory, "_id"> & {
    items: Omit<ISubCategoryItem, "_id">[]
  })[]
}

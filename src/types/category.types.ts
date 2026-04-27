// Category
export interface Category {
  id: string
  name: string
  description?: string
  parentId?: string
  imageUrl?: string
  productCount?: number
  createdAt: string
}

export interface CreateCategoryRequest {
  name: string
  description?: string
  parentId?: string
}

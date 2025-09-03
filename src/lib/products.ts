import { InMemoryRepository } from './memoryRepository'
import type { Identifiable } from './types'

export interface Product extends Identifiable {
  id: number
  name: string
  price: number
  stock: number
  description?: string
  createdAt: string
  updatedAt: string
}

export interface CreateProduct {
  name: string
  price: number
  stock: number
  description?: string
}

export interface UpdateProduct {
  name?: string
  price?: number
  stock?: number
  description?: string
}

let nextId = 1
function nowIso(): string {
  return new Date().toISOString()
}

function createFrom(input: CreateProduct): Product {
  const product: Product = {
    id: nextId++,
    name: input.name,
    price: input.price,
    stock: input.stock,
    description: input.description,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  }
  return product
}

function updateFrom(existing: Product, input: UpdateProduct): Product {
  return {
    ...existing,
    ...input,
    updatedAt: nowIso(),
  }
}

export const productRepository = new InMemoryRepository<Product, CreateProduct, UpdateProduct>(
  createFrom,
  updateFrom,
  [
    {
      id: nextId++,
      name: 'Sample Keyboard',
      price: 49.99,
      stock: 25,
      description: 'Compact mechanical keyboard',
      createdAt: nowIso(),
      updatedAt: nowIso(),
    },
    {
      id: nextId++,
      name: 'Wireless Mouse',
      price: 24.99,
      stock: 40,
      description: 'Ergonomic wireless mouse',
      createdAt: nowIso(),
      updatedAt: nowIso(),
    },
  ],
)



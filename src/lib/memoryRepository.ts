import type { CrudRepository, Identifiable } from './types'

export class InMemoryRepository<TEntity extends Identifiable, TCreate, TUpdate>
  implements CrudRepository<TEntity, TCreate, TUpdate>
{
  private readonly items: Map<TEntity['id'], TEntity> = new Map()
  private readonly createFn: (data: TCreate) => TEntity
  private readonly updateFn: (existing: TEntity, data: TUpdate) => TEntity

  constructor(
    createFn: (data: TCreate) => TEntity,
    updateFn: (existing: TEntity, data: TUpdate) => TEntity,
    initialItems: TEntity[] = [],
  ) {
    this.createFn = createFn
    this.updateFn = updateFn
    for (const item of initialItems) {
      this.items.set(item.id, item)
    }
  }

  async create(data: TCreate): Promise<TEntity> {
    const entity = this.createFn(data)
    this.items.set(entity.id, entity)
    return entity
  }

  async getById(id: TEntity['id']): Promise<TEntity | null> {
    return this.items.get(id) ?? null
  }

  async list(): Promise<TEntity[]> {
    return Array.from(this.items.values())
  }

  async update(id: TEntity['id'], data: TUpdate): Promise<TEntity> {
    const existing = this.items.get(id)
    if (!existing) {
      throw new Error(`Entity with id ${String(id)} not found`)
    }
    const updated = this.updateFn(existing, data)
    this.items.set(id, updated)
    return updated
  }

  async delete(id: TEntity['id']): Promise<void> {
    this.items.delete(id)
  }
}



export interface Identifiable {
  id: string | number
}

export interface Createable<TCreate, TEntity extends Identifiable> {
  create(data: TCreate): Promise<TEntity>
}

export interface Readable<TEntity extends Identifiable> {
  getById(id: TEntity["id"]): Promise<TEntity | null>
  list(): Promise<TEntity[]>
}

export interface Updatable<TUpdate, TEntity extends Identifiable> {
  update(id: TEntity["id"], data: TUpdate): Promise<TEntity>
}

export interface Deletable<TEntity extends Identifiable> {
  delete(id: TEntity["id"]): Promise<void>
}

export type CrudRepository<TEntity extends Identifiable, TCreate, TUpdate> =
  Createable<TCreate, TEntity> &
  Readable<TEntity> &
  Updatable<TUpdate, TEntity> &
  Deletable<TEntity>



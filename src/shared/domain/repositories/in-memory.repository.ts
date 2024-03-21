import { Entity } from '../entities/entity'
import { RepositoryInterface } from './repository-contracts'

export abstract class InMemoryRepository<E extends Entity>
  implements RepositoryInterface<E>
{
  itens: E[] = []

  async insert(entity: E): Promise<void> {
    this.itens.push(entity)
  }

  async findById(id: string): Promise<E> {
    const _id = `${id}`
    const entity = this.itens.find(item => item.id === _id)
    if (!entity) {
      throw new Error('Entity not found')
    }
  }

  async findAll(): Promise<E[]> {
    throw new Error('Method not implemented.')
  }

  async update(entity: E): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async delete(id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
}

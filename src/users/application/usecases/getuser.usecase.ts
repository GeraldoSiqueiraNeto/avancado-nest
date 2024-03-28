import { HashProvider } from '../../../shared/application/providers/hash-provider'
import { UserEntity } from '../../domain/entities/user.entity'
import { UserRepository } from '../../domain/repositories/user.repository'
import { BadRequestError } from '../errors/bad-request-error'

export namespace GetUserUseCase {
  export type Input = {
    id: string
  }

  export type Output = {
    id: string
    name: string
    email: string
    password: string
    createdAt: Date
  }

  export class UseCase {
    constructor(private userRepository: UserRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const entity = await this.userRepository.findById(input.id)
      return entity.toJson()
    }
  }
}

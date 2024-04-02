import { HashProvider } from '../../../shared/application/providers/hash-provider'
import { UserEntity } from '../../domain/entities/user.entity'
import { UserRepository } from '../../domain/repositories/user.repository'
import { BadRequestError } from '../../../shared/application/errors/bad-request-error'
import { UseCase as DefaultUseCase } from '../../../shared/application/usecases/use-case'
import { UserOutputMapper } from '../dto/user-output'

export namespace SignupUseCase {
  export type Input = {
    name: string
    email: string
    password: string
  }

  export type Output = {
    id: string
    name: string
    email: string
    password: string
    createdAt: Date
  }

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private userRepository: UserRepository.Repository,
      private hashProvider: HashProvider,
    ) {}

    async execute(input: Input): Promise<Output> {
      const { email, name, password } = input
      if (!email || !name || !password) {
        throw new BadRequestError('Input data not provided')
      }
      await this.userRepository.emailExists(email)

      const hashPassword = await this.hashProvider.generateHash(password)

      const entity = new UserEntity(
        Object.assign(input, { password: hashPassword }),
      )
      await this.userRepository.insert(entity)
      return UserOutputMapper.toOutput(entity)
    }
  }
}

import { InvalidPasswordError } from '../../../../../shared/application/errors/invalid-password-error'
import { HashProvider } from '../../../../../shared/application/providers/hash-provider'
import { NotFoundError } from '../../../../../shared/domain/errors/not-found-error'
import { UserEntity } from '../../../../domain/entities/user.entity'
import { UserDataBuilder } from '../../../../domain/testing/helpers/user-data-builder'
import { UserInMemoryRepository } from '../../../../infrastructure/database/in-memory/repositories/user-in-memory.repository'
import { BcryptjsHashProvider } from '../../../../infrastructure/providres/hash-provider/bcryptjs-hash.provider'
import { UpdatePasswordUseCase } from '../../update-password.usecase'

describe('UpdatePasswordUseCase unit tests', () => {
  let sut: UpdatePasswordUseCase.UseCase
  let repository: UserInMemoryRepository
  let hashProvider: HashProvider

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    hashProvider = new BcryptjsHashProvider()
    sut = new UpdatePasswordUseCase.UseCase(repository, hashProvider)
  })

  it('Should throws error when entity not found', async () => {
    await expect(() =>
      sut.execute({
        id: 'fakeId',
        password: 'test password',
        oldPassword: 'old password',
      }),
    ).rejects.toThrow(new NotFoundError('Entity not found'))
  })

  it('Should throws error when old password not provided', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    repository.items = [entity]
    await expect(() =>
      sut.execute({
        id: entity._id,
        password: 'test password',
        oldPassword: '',
      }),
    ).rejects.toThrow(
      new InvalidPasswordError('Old password and new password are required'),
    )
  })

  it('Should throws error when new password not provided', async () => {
    const entity = new UserEntity(UserDataBuilder({ password: 'old password' }))
    repository.items = [entity]
    await expect(() =>
      sut.execute({
        id: entity._id,
        password: '',
        oldPassword: 'old password',
      }),
    ).rejects.toThrow(
      new InvalidPasswordError('Old password and new password are required'),
    )
  })

  it('Should throws error when old password does not match', async () => {
    const hashPassword = await hashProvider.generateHash('old password')
    const entity = new UserEntity(UserDataBuilder({ password: hashPassword }))
    repository.items = [entity]
    await expect(() =>
      sut.execute({
        id: entity._id,
        password: 'new password',
        oldPassword: 'fake old password',
      }),
    ).rejects.toThrow(new InvalidPasswordError('Old password does not match'))
  })

  it('Should update a password', async () => {
    const spyUpdate = jest.spyOn(repository, 'update')
    const hashPassword = await hashProvider.generateHash('old password')
    const entity = new UserEntity(UserDataBuilder({ password: hashPassword }))
    repository.items = [entity]

    const result = await sut.execute({
      id: entity._id,
      password: 'new password',
      oldPassword: 'old password',
    })
    const checkNewPassword = await hashProvider.compareHash(
      'new password',
      result.password,
    )
    expect(spyUpdate).toHaveBeenCalledTimes(1)
    expect(checkNewPassword).toBeTruthy()
  })
})

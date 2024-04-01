import { UserEntity } from '../../../../domain/entities/user.entity'
import { UserDataBuilder } from '../../../../domain/testing/helpers/user-data-builder'
import { UserOutputMapper } from '../../user-output'

describe('UserOutputMapper unit tests', () => {
  it('should convert a user in output', () => {
    const entity = new UserEntity(UserDataBuilder({}))
    const spyToJson = jest.spyOn(entity, 'toJson')
    const sut = UserOutputMapper.toOutput(entity)

    expect(spyToJson).toHaveBeenCalled()
    expect(sut).toEqual(entity.toJson())
  })
})

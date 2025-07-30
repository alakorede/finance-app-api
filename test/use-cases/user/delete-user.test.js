import { DeleteUserUseCase } from "../../../src/use-cases/index.js"
import { faker } from "@faker-js/faker"

describe("DeleteUserUseCase", () => {
    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
    }

    class DeleteUserRepositoryStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const deleteUserReposytory = new DeleteUserRepositoryStub()
        const sut = new DeleteUserUseCase(deleteUserReposytory)

        return { deleteUserReposytory, sut }
    }

    test("Should successfully delete a user", async () => {
        //arrange
        const { sut } = makeSut()
        //act
        const result = await sut.execute(faker.string.uuid())
        //assert
        expect(result).toBeTruthy
        expect(result).toEqual(user)
    })

    test("Should call DeleteUserRepositoru with correct params", async () => {
        //arrange
        const { sut, deleteUserReposytory } = makeSut()
        const executeSpy = jest.spyOn(deleteUserReposytory, "execute")
        const userId = faker.string.uuid()
        //act
        await sut.execute(userId)
        //assert
        expect(executeSpy).toHaveBeenCalledWith(userId)
    })
})

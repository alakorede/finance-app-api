import { GetUserByIdUseCase } from "../../../src/use-cases/index.js"
import { faker } from "@faker-js/faker"

describe("GetUserByIdUseCase", () => {
    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
    }

    class GetUserByIdRepositoryStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const sut = new GetUserByIdUseCase(getUserByIdRepository)

        return { getUserByIdRepository, sut }
    }

    test("Should return user successfully", async () => {
        //arrange
        const { sut } = makeSut()
        //act
        const result = await sut.execute(user.id)
        //assert
        expect(result).toBeTruthy
        expect(result).toEqual(user)
    })

    test("Should return null when GetUserByIdRepository returns null", async () => {
        //arrange
        const { getUserByIdRepository, sut } = makeSut()
        jest.spyOn(getUserByIdRepository, "execute").mockResolvedValueOnce(null)
        //act
        const result = await sut.execute(user.id)
        //assert
        expect(result).toBeTruthy
        expect(result).toEqual(null)
    })

    test("Should return throw when GetUserByIdRepository throws", async () => {
        //arrange
        const { getUserByIdRepository, sut } = makeSut()
        jest.spyOn(getUserByIdRepository, "execute").mockRejectedValueOnce(
            new Error(),
        )
        //act
        const promise = sut.execute(faker.string.uuid())

        //assert
        await expect(promise).rejects.toThrow()
    })
})

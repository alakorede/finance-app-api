import bcrypt from "bcrypt"

export class PasswordHasherAdapter {
    async hash(password) {
        return await bcrypt.hash(password, 10)
    }
}

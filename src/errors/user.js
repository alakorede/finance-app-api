export class EmailAlreadyInUseError extends Error {
    constructor() {
        super("The provided e-mail is already in use.")
        this.name = EmailAlreadyInUseError
    }
}

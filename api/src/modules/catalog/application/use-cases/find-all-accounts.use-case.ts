import { CatalogAccountRepository } from "../../domain/repositories/index.js";

export class FIndAllAccountsUseCase {
    constructor(private readonly catalogAccountRepository: CatalogAccountRepository) { }

    execute() {
        return this.catalogAccountRepository.findAllCatalog();
    }
}
import { ClientRepository } from '@database/repositories/client.repository';
import { Injectable } from '@nestjs/common';
import * as errors from '@errors';

@Injectable()
export class ClientService {
  constructor(private clientRepository: ClientRepository) {}

  getAllClients() {
    return this.clientRepository.find({});
  }

  async getOrCreateClientByNameOrId(clientNameOrId: string) {
    const client = await this.clientRepository.find({
      where: [{ id: clientNameOrId }, { name: clientNameOrId }],
    });
    if (client && client.length) return client[0];
    const result = await this.clientRepository.insert({ name: clientNameOrId });
    if (result.identifiers.length == 0)
      throw new errors.ErrorCreatingNewClient();
    return await this.clientRepository.findById(result.identifiers[0].id);
  }
}

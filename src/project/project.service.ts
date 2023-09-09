import { ProjectRepository } from './../lib/database/repositories/project.repository';
import { ClientService } from './../client/client.service';
import { CreateProjectDto } from '@database/dtos/project.dto';
import { Injectable } from '@nestjs/common';
import { UserRepository } from '@database/repositories';
import { UserEntity, projectStatusEnum } from '@database/entities';

@Injectable()
export class ProjectService {
  constructor(
    private clientService: ClientService,
    private projectRepository: ProjectRepository,
    private userRepository: UserRepository,
  ) {}

  async createProject(createProjectInput: CreateProjectDto, user: UserEntity) {
    const client = await this.clientService.getOrCreateClientByNameOrId(
      createProjectInput.client,
    );
    return this.projectRepository.insert({
      client: client,
      name: createProjectInput.name,
      startDate: new Date(createProjectInput.startDate),
      endDate: new Date(createProjectInput.endDate),
      description: createProjectInput.description,
      operationManager: await this.userRepository.findById(
        createProjectInput.operationManager,
      ),
      createdBy: user,
    });
  }

  getProjectById(projectId: string) {
    return this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['client', 'operationManager', 'createdBy'],
    });
  }

  getAllProjects() {
    return this.projectRepository.find({
      relations: ['client', 'operationManager', 'createdBy'],
    });
  }

  getActiveProjects() {
    return this.projectRepository.find({
      where: { status: projectStatusEnum.STARTED },
      relations: [
        'client',
        'operationManager',
        'createdBy',
        'budgets',
        'budgets.categories',
        'budgets.categories.items',
      ],
    });
  }

  async startProject(projectId: string) {
    // TODO: Check if the project has a client approved budget
    const project = await this.getProjectById(projectId);
    project.status = projectStatusEnum.STARTED;
    return this.projectRepository.save(project);
  }

  async finishProject(projectId: string) {
    const project = await this.getProjectById(projectId);
    project.status = projectStatusEnum.FINISHED;
    return this.projectRepository.save(project);
  }
}

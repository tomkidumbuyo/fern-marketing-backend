import { ProjectRepository } from './../lib/database/repositories/project.repository';
import { ClientService } from './../client/client.service';
import { CreateProjectDto } from '@database/dtos/project.dto';
import { Injectable } from '@nestjs/common';
import { UserRepository } from '@database/repositories';
import {
  UserEntity,
  UserTypeEnum,
  projectStatusEnum,
} from '@database/entities';

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
      relations: [
        'client',
        'operationManager',
        'createdBy',
        'tickets',
        'tickets.budget',
        'tickets.items',
        'tickets.createdBy',
      ],
    });
  }

  getAllProjects(user: UserEntity) {
    if (user.userType == UserTypeEnum.ADMIN) {
      return this.projectRepository.find({
        relations: ['client', 'operationManager', 'createdBy'],
      });
    } else if (user.userType == UserTypeEnum.OPERATION_MANAGER) {
      return this.projectRepository.find({
        where: { operationManager: { id: user.id } },
        relations: ['client', 'operationManager', 'createdBy'],
      });
    } else if (user.userType == UserTypeEnum.MANAGING_DIRECTOR) {
      return this.projectRepository.find({
        relations: ['client', 'operationManager', 'createdBy'],
      });
    } else if (user.userType == UserTypeEnum.HEAD_OPERATION_MANAGER) {
      return this.projectRepository.find({
        relations: ['client', 'operationManager', 'createdBy'],
      });
    } else if (user.userType == UserTypeEnum.FINANCE) {
      return this.projectRepository.find({
        relations: ['client', 'operationManager', 'createdBy'],
      });
    }
    return this.projectRepository.find({
      relations: ['client', 'operationManager', 'createdBy'],
    });
  }

  getActiveProjects() {
    return this.projectRepository.find({
      where: { status: projectStatusEnum.STARTED },
      relations: [
        'tickets',
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

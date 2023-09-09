import {
  Controller,
  Get,
  Post,
  Request,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from '@database/dtos/project.dto';
import { JwtAuthGuard } from '@auth/jwt-auth.guard';

@Controller('project')
@UseGuards(JwtAuthGuard)
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Post('create')
  createProject(@Request() req, @Body() createProjectInput: CreateProjectDto) {
    return this.projectService.createProject(createProjectInput, req.user);
  }

  @Get('getAllProjects')
  getAllProjects(@Request() req) {
    return this.projectService.getAllProjects();
  }

  @Get('getActiveProjects')
  getActiveProjects(@Request() req) {
    return this.projectService.getActiveProjects();
  }

  @Get('startProject/:projectId')
  async startProject(@Request() req, @Param('projectId') projectId: string) {
    this.projectService.startProject(projectId);
  }

  @Get('finishProject/:projectId')
  async finishProject(@Request() req, @Param('projectId') projectId: string) {
    this.projectService.finishProject(projectId);
  }

  @Get(':projectId')
  getProjectById(@Request() req, @Param('projectId') projectId: string) {
    return this.projectService.getProjectById(projectId);
  }
}

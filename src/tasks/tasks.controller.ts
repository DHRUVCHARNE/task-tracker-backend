import { Controller, Get, Post, Patch, Body, Req, UseGuards, Param,Delete } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuthGuard } from '@nestjs/passport';
import { Task } from './tasks.schema';


@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // Get tasks for the logged-in user
@Get()
@UseGuards(AuthGuard('jwt'))
async getTasks(@Req() req): Promise<Task[]> {
  console.log('req.user:', req.user); // Debugging log to check req.user
  const userId = req.user.userId; // Access userId from req.user
  if (!userId) {
    throw new Error('User ID is undefined in req.user');
  }
  console.log('Getting tasks for user:', userId); // Log the retrieved userId
  return this.tasksService.getTasks(userId); // Call the service with userId
}



  // Create a task for the logged-in user
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createTask(@Req() req, @Body() body: { title: string; description: string }) {
    console.log('req.user:', req.user); // Debugging log to check req.user
    return this.tasksService.createTask(req.user.userId, body.title, body.description);
  }

  // Mark a task as completed
  @Patch(':id/complete')
  @UseGuards(AuthGuard('jwt'))
  async markTaskAsCompleted(@Req() req, @Param('id') taskId: string) {
    return this.tasksService.markTaskAsCompleted(req.user.userId, taskId);
  }
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteTask(@Req() req, @Param('id') taskId: string) {
  return this.tasksService.deleteTask(req.user.userId, taskId); // Call the delete service
}

}

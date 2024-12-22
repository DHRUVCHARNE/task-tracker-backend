import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument } from './tasks.schema';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>, // Inject taskModel
  ) {}

  // Fetch tasks for a specific user
async getTasks(userId: string): Promise<Task[]> {
  console.log('Fetching tasks for userId:', userId); // Log userId
  console.log(typeof userId); // Should be "string"
  console.log(await this.taskModel.find({})); // Inspect task records
  
  const tasks = await this.taskModel.find({ userId: new Types.ObjectId(userId) }).exec(); // Fetch tasks
  console.log('Tasks fetched:', tasks); // Log fetched tasks
  return tasks;
}

  // Create a new task
  async createTask(userId: string, title: string, description: string): Promise<Task> {


    const newTask = new this.taskModel({
      title,
      description,
      userId: new Types.ObjectId(userId),
    });
    return newTask.save();
  }

  // Mark task as completed
async markTaskAsCompleted(userId: string, taskId: string): Promise<Task> {
  try {
    console.log('Marking task as completed:', taskId); // Log taskId
    return this.taskModel.findOneAndUpdate(
      { _id: new Types.ObjectId(taskId), userId: new Types.ObjectId(userId) }, // Match userId and taskId
      [
        {
          $set: {
            completed: { $not: "$completed" } // Toggle the completed status
          }
        }
      ],
      { new: true } // Return the updated document
    ).exec();
  } catch (error) {
    console.error('Error marking task as completed:', error);
    throw error;
  }
}
async deleteTask(userId: string, taskId: string): Promise<Task> {
  try {
    console.log('Deleting task:', taskId); // Log taskId
    const deletedTask = await this.taskModel.findOneAndDelete(
      { _id: new Types.ObjectId(taskId), userId: new Types.ObjectId(userId) } // Ensure task belongs to the user
    ).exec();

    if (!deletedTask) {
      throw new Error('Task not found or you do not have permission to delete this task');
    }

    console.log('Task deleted:', deletedTask); // Log the deleted task
    return deletedTask; // Return the deleted task
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error; // Rethrow the error if any occurs
  }
}



}

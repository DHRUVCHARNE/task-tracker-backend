import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Task extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User'
   }) // Reference to User model
  userId: Types.ObjectId;

  @Prop({ default: false }) // Default to false
  completed: boolean;

      // Add _id explicitly
  _id: Types.ObjectId;
}

// Create the schema
export const TaskSchema = SchemaFactory.createForClass(Task);

TaskSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Export TaskDocument
export type TaskDocument = Task & Document;

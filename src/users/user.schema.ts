import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({  toJSON: {
    virtuals: true, // Include virtual fields
    versionKey: false, // Exclude the `__v` field
    transform: (doc, ret) => {
      delete ret.__v; // Explicitly remove __v
      return ret;
    },
  },
 }) // Enable virtual fields in JSON output
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;


  // Virtual field to retrieve tasks associated with the user
  tasks: any[];

    // Add _id explicitly
  _id: Types.ObjectId;

  // Virtual field for 'id' (optional)
  id: string;


}

const schema = SchemaFactory.createForClass(User);

// Virtual field for 'id' (optional)
// Add a virtual field to map _id to id
schema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Virtual field to retrieve tasks associated with the user
schema.virtual('tasks', {
  ref: 'Task', // Reference to Task model
  localField: '_id', // Field in User model
  foreignField: 'userId', // Field in Task model
});

export const UserSchema = schema;

import mongoose, { Document } from 'mongoose';

export interface IUserSecurity extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  hashPassword: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSecuritySchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    hashPassword: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const UserSecurity = mongoose.model('UserSecurity', UserSecuritySchema);

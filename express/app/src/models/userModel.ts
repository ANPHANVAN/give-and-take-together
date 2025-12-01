import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface định nghĩa kiểu dữ liệu người dùng, extend từ plugin để có deleted, deletedAt, và methods tự động

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  oauthId: string;
  provider: string;
  username: string;
  fullname: string;
  email: string;
  role: 'admin' | 'student' | 'teacher';
  birthday?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Schema với typing đầy đủ
const UsersSchema: Schema = new Schema(
  {
    oauthId: { type: String, unique: true },
    provider: { type: String, unique: true },
    username: { type: String, required: true, unique: true },
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['admin', 'student', 'teacher'], default: 'student' },
    birthday: { type: Date },
  },
  { timestamps: true },
);

// Export model với type đúng
export const UserModel: Model<IUser> = mongoose.models.Users || mongoose.model<IUser>('Users', UsersSchema);

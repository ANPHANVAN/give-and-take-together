import mongoose, { Document } from 'mongoose';

export interface IOtpReset extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  otp: string;
  expiresAt: Date;
}

const otpResetSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

otpResetSchema.index({ email: 1 }, { unique: true });

export const OtpResetModel = mongoose.model('OtpReset', otpResetSchema);

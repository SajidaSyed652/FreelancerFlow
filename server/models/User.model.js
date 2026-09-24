import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ['client', 'freelancer', 'admin'],
      default: 'freelancer',
      required: true,
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    bio: { type: String, default: '' },
    title: { type: String, default: 'Full Stack Developer' },
    hourlyRate: { type: Number, default: 500 },
    skills: [{ type: String }],
    portfolio: [
      {
        title: { type: String, required: true },
        description: { type: String },
        link: { type: String },
        image: { type: String },
      },
    ],
    isVerified: { type: Boolean, default: true },
    isBlocked: { type: Boolean, default: false },
    wallet: {
      balance: { type: Number, default: 25000 }, // simulated default balance
      escrow: { type: Number, default: 0 },
    },
    ratings: {
      avg: { type: Number, default: 5.0 },
      count: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchema);

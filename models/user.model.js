import mongoose from "mongoose";
import {nanoid} from "nanoid";
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, unique: true, required: true, default: function () {
      const randomId = nanoid(5);
      return `${this.name.split(' ')[0].toLowerCase()}${randomId}`;
    } },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'farmOwner'], default: 'customer' },
  stats: {
    walkingDistance: { type: Number, default: 0 },
    runningDistance: { type: Number, default: 0 },
    cyclingDistance: { type: Number, default: 0 },
    caloriesBurned: { type: Number, default: 0 },
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;


import { Types } from "mongoose";

export interface TActivity {
  userId: Types.ObjectId;
  action: string;
  createdAt: Date
}

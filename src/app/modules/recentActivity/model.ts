
import  { Schema, model } from "mongoose";
import { TActivity } from "./interface";

const activitySchema = new Schema<TActivity>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const ActivityLog = model<TActivity>("ActivityLog", activitySchema);
export default ActivityLog;

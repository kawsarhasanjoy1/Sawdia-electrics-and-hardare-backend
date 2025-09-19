import ActivityLog from "./model";

const createActivity = async (userId: string) => {
  const activity = await ActivityLog.create(userId);
  return activity;
};

const getRecentActivities = async () => {
  const activities = await ActivityLog.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate("user", "name email");
  return activities;
};

export const ActivityService = {
  createActivity,
  getRecentActivities,
};

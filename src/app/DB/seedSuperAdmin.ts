import { UserModel } from "../modules/user/model";
const userData = {
  name: "Md Kawsar",
  email: "kawsarhasanjoy342@gmail.com",
  password: "kawsar12",
  role: "superAdmin",
  avatar: "https://ibb.co.com/Mx3sF58d",
};
export const seedSuperAdmin = async () => {
  const user = await UserModel.findOne({ role: "superAdmin" });
  if (!user) {
    await UserModel.create(userData);
  }
};

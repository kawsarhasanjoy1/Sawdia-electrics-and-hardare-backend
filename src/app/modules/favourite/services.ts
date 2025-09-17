import { ProductModel } from "../product/model";
import { FavouriteModel } from "./model";

const toggleFavourite = async (userId: string, productId: string) => {
  const exists = await FavouriteModel.findOne({
    userId,
    productId,
  });

  if (exists) {
    await ProductModel.findByIdAndUpdate(
      productId,
      { $inc: { favouriteCount: -1 } },
      { new: true }
    );
    await FavouriteModel.findByIdAndDelete(exists._id);
    return { removed: true, message: "Fevourite deleted successful" };
  }

  const fav = await FavouriteModel.create({ userId, productId });
  await ProductModel.findByIdAndUpdate(
    productId,
    { $inc: { favouriteCount: 1 } },
    { new: true }
  );
  return { removed: false, data: fav, message: "Fevourite added successful" };
};

const getFavourites = async (userId: string) => {
  return await FavouriteModel.find({
    userId: userId
  })
    .populate("productId")
    .populate("userId");
};

export const FavouriteService = { toggleFavourite, getFavourites };

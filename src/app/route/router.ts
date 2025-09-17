import { Router } from 'express';
import { userRoutes } from '../modules/user/route';
import { authRoutes } from '../modules/auth/route';
import { productRouter } from '../modules/product/route';
import { parentCategoryRouter } from '../modules/parentCategory/route';
import { categoryRouter } from '../modules/category/router';
import { reviewRouter } from '../modules/review/router';
import { paymentRouter } from '../modules/payment/route';
import { CouponRoutes } from '../modules/coupon/route';
import { blogRoutes } from '../modules/blog/route';
import { FavouriteRoutes } from '../modules/favourite/route';
import { brandRouter } from '../modules/brend/route';
import { activityRouter } from '../modules/recentActivity/route';

const router = Router();

const moduleRoutes = [
  {
    path: '/user',
    route: userRoutes
  },
  {
    path: '/auth',
    route: authRoutes
  },
  {
    path: '/product',
    route: productRouter
  },

  {
    path: '/payment',
    route: paymentRouter
  },
  {
    path: '/review',
    route: reviewRouter
  },
  {
    path: '/parent-category',
    route: parentCategoryRouter
  },
  {
    path: '/category',
    route: categoryRouter
  },
  {
    path: '/brand',
    route: brandRouter
  },
  {
    path: '/coupon',
    route: CouponRoutes
  },
  {
    path: '/favourite',
    route: FavouriteRoutes
  },
  {
    path: '/blog',
    route: blogRoutes
  },
  {
    path: '/recent-activity',
    route: activityRouter
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

import { Router } from 'express';
import { userRoutes } from '../modules/user/route';
import { authRoutes } from '../modules/auth/route';
import { productRouter } from '../modules/product/route';
import { parentCategoryRouter } from '../modules/parentCategory/route';
import { categoryRouter } from '../modules/category/router';
import { reviewRouter } from '../modules/review/router';

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
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

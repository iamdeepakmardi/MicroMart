import express, { Request, Response } from 'express';
import { Category } from '../models/category';

const router = express.Router();

router.get('/api/categories', async (req: Request, res: Response) => {
    const categories = await Category.find({}).populate('parentCategory');

    res.send(categories);
});

export { router as indexCategoryRouter };

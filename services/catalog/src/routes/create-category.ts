import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, requireAdmin, validateRequest } from '@micromart/common';
import { Category } from '../models/category';

const router = express.Router();

router.post(
    '/api/categories',
    requireAuth,
    requireAdmin,
    [
        body('name').not().isEmpty().withMessage('Name is required')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { name, description, parentCategory } = req.body;

        const category = Category.build({
            name,
            description,
            parentCategory
        });
        await category.save();

        res.status(201).send(category);
    }
);

export { router as createCategoryRouter };

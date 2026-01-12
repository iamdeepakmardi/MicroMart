import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, requireAdmin, validateRequest, BadRequestError, NotFoundError } from '@micromart/common';
import { Product } from '../models/product';
import { Category } from '../models/category';

const router = express.Router();

router.post(
    '/api/products',
    requireAuth,
    requireAdmin,
    [
        body('name').not().isEmpty().withMessage('Name is required'),
        body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
        body('category').not().isEmpty().withMessage('Category ID is required'),
        body('inventory').isInt({ min: 0 }).withMessage('Inventory must be greater than or equal to 0'),
        body('description').not().isEmpty().withMessage('Description is required')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { name, price, category, inventory, description, images } = req.body;

        const categoryDoc = await Category.findById(category);
        if (!categoryDoc) {
            throw new BadRequestError('Invalid category ID');
        }

        const product = Product.build({
            name,
            price,
            category,
            inventory,
            description,
            images
        });
        await product.save();

        res.status(201).send(product);
    }
);

export { router as createProductRouter };

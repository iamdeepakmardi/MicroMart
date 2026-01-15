import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, NotFoundError, requireAuth, requireAdmin, BadRequestError } from '@micromart/common';
import { Product } from '../models/product';
import { Category } from '../models/category';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
    '/api/products/:id',
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
        const product = await Product.findById(req.params.id);

        if (!product) {
            throw new NotFoundError();
        }

        const { name, price, category, inventory, description, images } = req.body;

        const categoryDoc = await Category.findById(category);
        if (!categoryDoc) {
            throw new BadRequestError('Invalid category ID');
        }

        product.set({
            name,
            price,
            category,
            inventory,
            description,
            images
        });

        await product.save();

        new TicketUpdatedPublisher(natsWrapper.client).publish({
            id: product.id,
            title: product.name,
            price: product.price,
            userId: req.currentUser!.id,
            version: product.version
        });

        res.send(product);
    }
);

export { router as updateProductRouter };

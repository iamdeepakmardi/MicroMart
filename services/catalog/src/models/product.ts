import mongoose from 'mongoose';

interface ProductAttrs {
    name: string;
    description: string;
    price: number;
    category: string; // ID reference
    inventory: number;
    images?: string[];
}

interface ProductDoc extends mongoose.Document {
    name: string;
    description: string;
    price: number;
    category: string;
    inventory: number;
    images?: string[];
    version: number;
    id: string;
}

interface ProductModel extends mongoose.Model<ProductDoc> {
    build(attrs: ProductAttrs): ProductDoc;
}

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    inventory: {
        type: Number,
        required: true,
        default: 0
    },
    images: [{
        type: String
    }]
}, {
    toJSON: {
        transform(doc, ret: any) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});

// Auto-increment version on save to ensure OCC works for all field updates
productSchema.pre('save', async function () {
    console.log(`[Product Model] Pre-save: ID=${this.id}, Version=${this.get('version')}`);
    this.increment();
    console.log(`[Product Model] Post-increment: Version=${this.get('version')}`);
});

productSchema.set('versionKey', 'version');
productSchema.set('optimisticConcurrency', true);

productSchema.statics.build = (attrs: ProductAttrs) => {
    return new Product(attrs);
};

const Product = mongoose.model<ProductDoc, ProductModel>('Product', productSchema);

export { Product };

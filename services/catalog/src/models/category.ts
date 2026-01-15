import mongoose from 'mongoose';

interface CategoryAttrs {
    name: string;
    description?: string;
    parentCategory?: string;
}

interface CategoryDoc extends mongoose.Document {
    name: string;
    description?: string;
    parentCategory?: string;
    id: string;
}

interface CategoryModel extends mongoose.Model<CategoryDoc> {
    build(attrs: CategoryAttrs): CategoryDoc;
}

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    parentCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }
}, {
    toJSON: {
        transform(doc, ret: any) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});

categorySchema.statics.build = (attrs: CategoryAttrs) => {
    return new Category(attrs);
};

const Category = mongoose.model<CategoryDoc, CategoryModel>('Category', categorySchema);

export { Category };

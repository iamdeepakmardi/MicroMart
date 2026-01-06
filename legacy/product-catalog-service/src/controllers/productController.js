import Product from "../models/Product.js";

export const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find()
      .skip(skip)
      .limit(limit)
      .populate("category", "name");

    const total = await Product.countDocuments();

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name"
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching product", error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating product", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(updatedProduct);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating product", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting product", error: error.message });
  }
};

// export const searchProducts = async (req, res) => {
//   try {
//     const { query, category, minPrice, maxPrice } = req.query;
//     const searchCriteria = {};

//     if (query) {
//       searchCriteria.$or = [
//         { name: { $regex: query, $options: "i" } },
//         { description: { $regex: query, $options: "i" } },
//       ];
//     }

//     if (category) {
//       searchCriteria.category = category;
//     }

//     if (minPrice || maxPrice) {
//       searchCriteria.price = {};
//       if (minPrice) searchCriteria.price.$gte = parseFloat(minPrice);
//       if (maxPrice) searchCriteria.price.$lte = parseFloat(maxPrice);
//     }

//     const products = await Product.find(searchCriteria).populate(
//       "category",
//       "name"
//     );
//     res.json(products);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error searching products", error: error.message });
//   }
// };

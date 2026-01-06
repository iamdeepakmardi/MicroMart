import axios from "axios";

const PRODUCT_SERVICE_URL =
  process.env.PRODUCT_SERVICE_URL || "http://localhost:3001";

export const verifyProduct = async (productId) => {
  try {
    const response = await axios.get(
      `${PRODUCT_SERVICE_URL}/api/products/${productId}`
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error(`Product not found: ${productId}`);
    }
    throw new Error(`Error verifying product: ${productId}`);
  }
};

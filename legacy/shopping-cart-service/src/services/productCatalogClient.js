import axios from "axios";
import { PRODUCT_CATALOG_SERVICE_URL } from "../config.js";

console.log("PRODUCT_CATALOG_SERVICE_URL:", PRODUCT_CATALOG_SERVICE_URL);

export const productCatalogClient = {
  async getProduct(productId) {
    try {
      // console.log(`Attempting to fetch product with ID: ${productId}`);
      // console.log(
      //   `Full URL: ${PRODUCT_CATALOG_SERVICE_URL}/products/${productId}`
      // );
      const response = await axios.get(
        `${PRODUCT_CATALOG_SERVICE_URL}/products/${productId}`
      );
      return response.data;
    } catch (error) {
      //  console.error("Error in getProduct:", error.message);
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw error;
    }
  },
};

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Data Loader Utility
 * Loads test data from JSON files for data-driven testing
 */
class DataLoader {
  /**
   * Load users data from users.json
   */
  static loadUsers() {
    const usersPath = path.join(__dirname, '../data/users.json');
    const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
    return usersData;
  }

  /**
   * Get all valid users for testing
   */
  static getValidUsers() {
    const users = this.loadUsers();
    return users.validUsers;
  }

  /**
   * Get all invalid users for negative testing
   */
  static getInvalidUsers() {
    const users = this.loadUsers();
    return users.invalidUsers;
  }

  /**
   * Get specific user by username
   */
  static getUserByUsername(username) {
    const users = this.loadUsers();
    
    // Check in valid users
    let user = users.validUsers.find(u => u.username === username);
    if (user) return user;
    
    // Check in invalid users
    user = users.invalidUsers.find(u => u.username === username);
    if (user) return user;
    
    // Return test user if not found
    return users.testUser;
  }

  /**
   * Get user credentials as object
   */
  static getUserCredentials(username) {
    const user = this.getUserByUsername(username);
    return {
      username: user.username,
      password: user.password
    };
  }

  /**
   * Load products data from products.json
   */
  static loadProducts() {
    const productsPath = path.join(__dirname, '../data/products.json');
    const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    return productsData;
  }

  /**
   * Get all products for testing
   */
  static getAllProducts() {
    const products = this.loadProducts();
    return products.products;
  }

  /**
   * Get product by name
   */
  static getProductByName(productName) {
    const products = this.getAllProducts();
    return products.find(p => p.name === productName);
  }
}

export default DataLoader; 
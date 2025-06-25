@allure.label.epic:E-Commerce
@allure.label.feature:ShoppingCart
Feature: Shopping Cart Management
  As a customer of the Sauce Demo e-commerce site
  I want to add and remove items from my shopping cart
  So that I can manage my purchases before checkout

  @authenticated @smoke @cart @add-to-cart
  @allure.label.story:AddToCart
  @allure.label.severity:critical
  Scenario: Add single item to cart and verify badge
    # Arrange: User is on the products page
    Given Alice is on the Sauce Demo login page
    And Alice is a registered user with valid credentials
    And Alice attempts to log in with valid credentials
    And Alice should be redirected to the products page
    And Alice verifies the cart badge is not visible
    
    # Act: Add an item to cart
    When Alice adds "Sauce Labs Backpack" to the cart
    
    # Assert: Verify cart badge appears with correct count
    Then Alice should see the cart badge showing "1" items
    And Alice should see the "Add to cart" button changed to "Remove" for "Sauce Labs Backpack"

  @authenticated @smoke @cart @add-multiple
  @allure.label.story:AddToCart
  @allure.label.severity:normal
  Scenario: Add multiple items to cart and verify count
    # Arrange: User is on products page with empty cart
    Given Alice is on the Sauce Demo login page
    And Alice is a registered user with valid credentials
    And Alice attempts to log in with valid credentials
    And Alice should be redirected to the products page
    And Alice verifies the cart badge is not visible
    
    # Act: Add multiple items to cart
    When Alice adds "Sauce Labs Backpack" to the cart
    And Alice adds "Sauce Labs Bike Light" to the cart
    And Alice adds "Sauce Labs Bolt T-Shirt" to the cart
    
    # Assert: Verify cart badge shows correct total count
    Then Alice should see the cart badge showing "3" items
    And Alice should see all added items showing "Remove" buttons instead of "Add to cart"

  @authenticated @smoke @cart @remove-from-products
  @allure.label.story:RemoveFromCart
  @allure.label.severity:critical
  Scenario: Remove item from cart on products page
    # Arrange: User has items in cart
    Given Alice is on the Sauce Demo login page
    And Alice is a registered user with valid credentials
    And Alice attempts to log in with valid credentials
    And Alice should be redirected to the products page
    And Alice adds "Sauce Labs Backpack" to the cart
    And Alice should see the cart badge showing "1" items
    
    # Act: Remove item from products page
    When Alice removes "Sauce Labs Backpack" from the products page
    
    # Assert: Verify cart badge disappears and button changes back
    Then Alice should see the cart badge is not visible
    And Alice should see the "Remove" button changed to "Add to cart" for "Sauce Labs Backpack"

  @authenticated @cart @remove-from-cart-page
  @allure.label.story:RemoveFromCart
  @allure.label.severity:critical
  Scenario: Remove item from cart page
    # Arrange: User has items in cart
    Given Alice is on the Sauce Demo login page
    And Alice is a registered user with valid credentials
    And Alice attempts to log in with valid credentials
    And Alice should be redirected to the products page
    And Alice adds "Sauce Labs Backpack" to the cart
    And Alice adds "Sauce Labs Bike Light" to the cart
    And Alice should see the cart badge showing "2" items
    
    # Act: Navigate to cart and remove one item
    When Alice navigates to the cart page
    And Alice removes "Sauce Labs Backpack" from the cart page
    
    # Assert: Verify item is removed and count updated
    Then Alice should see the cart badge showing "1" items
    And Alice should see "Sauce Labs Backpack" should not be visible in the cart
    And Alice should see "Sauce Labs Bike Light" in the cart

  @authenticated @cart @empty-cart
  @allure.label.story:RemoveFromCart
  @allure.label.severity:normal
  Scenario: Remove all items to empty the cart
    # Arrange: User has items in cart
    Given Alice is on the Sauce Demo login page
    And Alice is a registered user with valid credentials
    And Alice attempts to log in with valid credentials
    And Alice should be redirected to the products page
    And Alice adds "Sauce Labs Backpack" to the cart
    And Alice adds "Sauce Labs Bike Light" to the cart
    And Alice should see the cart badge showing "2" items
    
    # Act: Remove all items from cart page
    When Alice navigates to the cart page
    And Alice removes "Sauce Labs Backpack" from the cart page
    And Alice removes "Sauce Labs Bike Light" from the cart page
    
    # Assert: Verify cart is completely empty
    Then Alice should see the cart badge is not visible
    And Alice should see the cart should be empty

  @authenticated @cart @cart-navigation
  @allure.label.story:CartNavigation
  @allure.label.severity:normal
  Scenario: Navigate between products and cart pages
    # Arrange: User has items in cart
    Given Alice is on the Sauce Demo login page
    And Alice is a registered user with valid credentials
    And Alice attempts to log in with valid credentials
    And Alice should be redirected to the products page
    And Alice adds "Sauce Labs Backpack" to the cart
    And Alice should see the cart badge showing "1" items
    
    # Act: Navigate to cart and back to products
    When Alice navigates to the cart page
    Then Alice should see "Sauce Labs Backpack" in the cart
    
    # Act: Continue shopping back to products
    When Alice clicks "Continue Shopping"
    
    # Assert: Verify back on products page with cart intact
    Then Alice should be on the products page
    And Alice should see the cart badge showing "1" items

  # ========== CART PERSISTENCE SCENARIOS ==========

  @authenticated @cart @persistence @critical
  @allure.label.story:CartPersistence
  @allure.label.severity:critical
  Scenario: Cart items persist after logout and login with single item
    # Arrange: User adds item to cart
    Given Alice is on the Sauce Demo login page
    And Alice is a registered user with valid credentials
    And Alice attempts to log in with valid credentials
    And Alice should be redirected to the products page
    And Alice adds "Sauce Labs Backpack" to the cart
    And Alice should see the cart badge showing "1" items
    
    # Act: Logout and login again
    When Alice logs out from the application
    And Alice logs in again with the same credentials
    And Alice is redirected to the products page
    
    # Assert: Verify cart items are still present
    Then Alice should see the cart badge showing "1" items
    When Alice navigates to the cart page
    Then Alice should see "Sauce Labs Backpack" in the cart

  @authenticated @cart @persistence @multiple-items
  @allure.label.story:CartPersistence  
  @allure.label.severity:critical
  Scenario: Cart items persist after logout and login with multiple items
    # Arrange: User adds 2 items to cart
    Given Alice is on the Sauce Demo login page
    And Alice is a registered user with valid credentials
    And Alice attempts to log in with valid credentials
    And Alice should be redirected to the products page
    And Alice adds "Sauce Labs Backpack" to the cart
    And Alice adds "Sauce Labs Bike Light" to the cart
    And Alice should see the cart badge showing "2" items
    
    # Act: Logout and login again
    When Alice logs out from the application
    And Alice logs in again with the same credentials
    And Alice is redirected to the products page
    
    # Assert: Verify both cart items are still present
    Then Alice should see the cart badge showing "2" items
    When Alice navigates to the cart page
    Then Alice should see "Sauce Labs Backpack" in the cart
    And Alice should see "Sauce Labs Bike Light" in the cart

  @authenticated @cart @persistence @boundary
  @allure.label.story:CartPersistence
  @allure.label.severity:normal
  Scenario: Cart persistence with maximum items
    # Arrange: User adds multiple items to cart (boundary test)
    Given Alice is on the Sauce Demo login page
    And Alice is a registered user with valid credentials
    And Alice attempts to log in with valid credentials
    And Alice should be redirected to the products page
    And Alice adds "Sauce Labs Backpack" to the cart
    And Alice adds "Sauce Labs Bike Light" to the cart  
    And Alice adds "Sauce Labs Bolt T-Shirt" to the cart
    And Alice should see the cart badge showing "3" items
    
    # Act: Logout and login again
    When Alice logs out from the application
    And Alice logs in again with the same credentials
    And Alice is redirected to the products page
    
    # Assert: Verify all cart items persist
    Then Alice should see the cart badge showing "3" items
    When Alice navigates to the cart page
    Then Alice should see "Sauce Labs Backpack" in the cart
    And Alice should see "Sauce Labs Bike Light" in the cart
    And Alice should see "Sauce Labs Bolt T-Shirt" in the cart

  @authenticated @cart @persistence @empty-cart
  @allure.label.story:CartPersistence
  @allure.label.severity:normal
  Scenario: Empty cart state persists after logout and login
    # Arrange: User has empty cart
    Given Alice is on the Sauce Demo login page
    And Alice is a registered user with valid credentials
    And Alice attempts to log in with valid credentials
    And Alice should be redirected to the products page
    And Alice verifies the cart badge is not visible
    
    # Act: Logout and login again
    When Alice logs out from the application
    And Alice logs in again with the same credentials
    And Alice is redirected to the products page
    
    # Assert: Verify cart remains empty
    Then Alice should see the cart badge is not visible
    When Alice navigates to the cart page
    Then Alice should see the cart should be empty

  @authenticated @cart @persistence @different-user
  @allure.label.story:CartIsolation
  @allure.label.severity:normal
  Scenario: Cart items are isolated between different users
    # Arrange: Standard user adds items to cart
    Given Alice is on the Sauce Demo login page
    And Alice is a registered user with valid credentials
    And Alice attempts to log in with valid credentials
    And Alice should be redirected to the products page
    And Alice adds "Sauce Labs Backpack" to the cart
    And Alice should see the cart badge showing "1" items
    
    # Act: Logout and login as different user
    When Alice logs out from the application
    And Bob logs in with username "performance_glitch_user" and password "secret_sauce"
    And Bob is redirected to the products page
    
    # Assert: Verify cart is empty for different user
    Then Bob should see the cart badge is not visible
    When Bob navigates to the cart page
    Then Bob should see the cart should be empty
    
    # Act: Logout and login back as original user
    When Bob logs out from the application
    And Alice logs in with username "standard_user" and password "secret_sauce"
    And Alice is redirected to the products page
    
    # Assert: Verify original user's cart is restored
    Then Alice should see the cart badge showing "1" items
    When Alice navigates to the cart page
    Then Alice should see "Sauce Labs Backpack" in the cart

  @authenticated @cart @persistence @session-management
  @allure.label.story:SessionManagement
  @allure.label.severity:minor
  Scenario: Cart modifications persist through multiple logout/login cycles
    # Arrange: User starts with items in cart
    Given Alice is on the Sauce Demo login page
    And Alice is a registered user with valid credentials
    And Alice attempts to log in with valid credentials
    And Alice should be redirected to the products page
    And Alice adds "Sauce Labs Backpack" to the cart
    And Alice should see the cart badge showing "1" items
    
    # Act: First logout/login cycle
    When Alice logs out from the application
    And Alice logs in again with the same credentials
    And Alice should be redirected to the products page
    And Alice adds "Sauce Labs Bike Light" to the cart
    And Alice should see the cart badge showing "2" items
    
    # Act: Second logout/login cycle
    When Alice logs out from the application
    And Alice logs in again with the same credentials
    And Alice is redirected to the products page
    
    # Assert: Verify all modifications persist
    Then Alice should see the cart badge showing "2" items
    When Alice navigates to the cart page
    Then Alice should see "Sauce Labs Backpack" in the cart
    And Alice should see "Sauce Labs Bike Light" in the cart

  # ========== PRODUCT DETAIL PAGE SCENARIOS ==========

  @authenticated @smoke @cart @product-detail @add-via-detail
  @allure.label.story:ProductDetailNavigation
  @allure.label.severity:critical
  Scenario: Add product to cart via product detail page
    # Arrange: User is on the products page
    Given Alice is on the Sauce Demo login page
    And Alice is a registered user with valid credentials
    And Alice attempts to log in with valid credentials
    And Alice should be redirected to the products page
    And Alice verifies the cart badge is not visible
    
    # Act: Navigate to product detail and add to cart
    When Alice clicks on "Sauce Labs Backpack" product title
    Then Alice should be on the product detail page for "Sauce Labs Backpack"
    When Alice adds the product to cart from detail page
    
    # Assert: Verify cart badge appears and product is added
    Then Alice should see the cart badge showing "1" items
    When Alice navigates to the cart page
    Then Alice should see "Sauce Labs Backpack" in the cart

  @authenticated @cart @product-detail @navigation
  @allure.label.story:ProductDetailNavigation
  @allure.label.severity:normal
  Scenario: Navigate to product detail page and back to products
    # Arrange: User is on the products page
    Given Alice is on the Sauce Demo login page
    And Alice is a registered user with valid credentials
    And Alice attempts to log in with valid credentials
    And Alice should be redirected to the products page
    
    # Act: Navigate to product detail page
    When Alice clicks on "Sauce Labs Backpack" product title
    Then Alice should be on the product detail page for "Sauce Labs Backpack"
    
    # Act: Navigate back to products page
    When Alice clicks "Back to products"
    
    # Assert: Verify back on products page
    Then Alice should be on the products page

  @authenticated @cart @product-detail @multiple-products
  @allure.label.story:ProductDetailNavigation
  @allure.label.severity:normal
  Scenario: Add multiple products via product detail pages
    # Arrange: User is on the products page
    Given Alice is on the Sauce Demo login page
    And Alice is a registered user with valid credentials
    And Alice attempts to log in with valid credentials
    And Alice should be redirected to the products page
    And Alice verifies the cart badge is not visible
    
    # Act: Add first product via detail page
    When Alice clicks on "Sauce Labs Backpack" product title
    Then Alice should be on the product detail page for "Sauce Labs Backpack"
    When Alice adds the product to cart from detail page
    Then Alice should see the cart badge showing "1" items
    
    # Act: Navigate back and add second product via detail page
    When Alice clicks "Back to products"
    And Alice should be on the products page
    And Alice clicks on "Sauce Labs Bike Light" product title
    Then Alice should be on the product detail page for "Sauce Labs Bike Light"
    When Alice adds the product to cart from detail page
    
    # Assert: Verify both products are in cart
    Then Alice should see the cart badge showing "2" items
    When Alice navigates to the cart page
    Then Alice should see "Sauce Labs Backpack" in the cart
    And Alice should see "Sauce Labs Bike Light" in the cart

  @authenticated @cart @product-detail @comparison
  @allure.label.story:AddToCartComparison
  @allure.label.severity:normal
  Scenario: Compare adding products from list vs detail page
    # Arrange: User is on the products page
    Given Alice is on the Sauce Demo login page
    And Alice is a registered user with valid credentials
    And Alice attempts to log in with valid credentials
    And Alice should be redirected to the products page
    And Alice verifies the cart badge is not visible
    
    # Act: Add first product directly from products list
    When Alice adds "Sauce Labs Backpack" to the cart
    Then Alice should see the cart badge showing "1" items
    
    # Act: Add second product via detail page
    When Alice clicks on "Sauce Labs Bike Light" product title
    Then Alice should be on the product detail page for "Sauce Labs Bike Light"
    When Alice adds the product to cart from detail page
    
    # Assert: Verify both methods result in cart addition
    Then Alice should see the cart badge showing "2" items
    When Alice navigates to the cart page
    Then Alice should see "Sauce Labs Backpack" in the cart
    And Alice should see "Sauce Labs Bike Light" in the cart

  @authenticated @cart @product-detail @button-state
  @allure.label.story:ButtonStatePersistence
  @allure.label.severity:normal
  Scenario: Product detail page shows correct button state after adding to cart from product list
    # Arrange: User is on the products page
    Given Alice is on the Sauce Demo login page
    And Alice is a registered user with valid credentials
    And Alice attempts to log in with valid credentials
    And Alice should be redirected to the products page
    And Alice verifies the cart badge is not visible
    
    # Act: Add product to cart from products list
    When Alice adds "Sauce Labs Backpack" to the cart
    Then Alice should see the cart badge showing "1" items
    
    # Act: Navigate to product detail page of the added product
    When Alice clicks on "Sauce Labs Backpack" product title
    Then Alice should be on the product detail page for "Sauce Labs Backpack"
    
    # Assert: Verify the button shows "Remove from Cart" instead of "Add to Cart"
    Then Alice should see the "Remove from Cart" button on the product detail page
    And Alice should not see the "Add to Cart" button on the product detail page
    
    # Act: Remove product from cart via detail page
    When Alice removes the product from cart on detail page
    
    # Assert: Verify cart badge updates and button changes back
    Then Alice should see the cart badge is not visible
    And Alice should see the "Add to Cart" button on the product detail page
    And Alice should not see the "Remove from Cart" button on the product detail page 
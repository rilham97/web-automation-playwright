@allure.label.epic:E-Commerce
@allure.label.feature:CheckoutFlow
Feature: Checkout Process
  As a customer of the Sauce Demo e-commerce site
  I want to complete the checkout process with my order
  So that I can purchase items and receive confirmation

  @authenticated @smoke @checkout @complete-flow
  @allure.label.story:CompleteCheckout
  @allure.label.severity:critical
  Scenario: Complete successful checkout flow
    # Arrange: User has items in cart and is authenticated
    Given Alice is on the Sauce Demo login page
    And Alice is a registered user with valid credentials
    And Alice attempts to log in with valid credentials
    And Alice should be redirected to the products page
    And Alice adds "Sauce Labs Backpack" to the cart
    And Alice navigates to the cart page
    
    # Act: Proceed through complete checkout process
    When Alice starts the checkout process
    Then Alice should be on the checkout information step
    When Alice fills checkout information with "John", "Doe", and "12345"
    And Alice continues to the next checkout step
    Then Alice should be on the checkout overview step
    And Alice should see the order summary with correct items
    When Alice finishes the checkout process
    
    # Assert: Verify successful order completion
    Then Alice should be on the checkout complete step
    And Alice should see the completion confirmation
    And Alice should see "Thank you for your order!" message
    And Alice should see the "Back Home" button

  @authenticated @checkout @step-validation
  @allure.label.story:CheckoutSteps
  @allure.label.severity:normal
  Scenario: Navigate through each checkout step individually
    # Arrange: User has items in cart
    Given Alice is on the Sauce Demo login page
    And Alice is a registered user with valid credentials
    And Alice attempts to log in with valid credentials
    And Alice should be redirected to the products page
    And Alice adds "Sauce Labs Backpack" to the cart
    And Alice navigates to the cart page
    
    # Act & Assert: Step 1 - Information
    When Alice starts the checkout process
    Then Alice should be on step 1 "Checkout: Your Information"
    And Alice should see customer information form fields
    
    # Act & Assert: Step 2 - Overview
    When Alice fills checkout information with "Jane", "Smith", and "54321"
    And Alice continues to the next checkout step
    Then Alice should be on step 2 "Checkout: Overview"
    And Alice should see payment information section
    And Alice should see shipping information section
    And Alice should see price breakdown with totals
    
    # Act & Assert: Step 3 - Complete
    When Alice finishes the checkout process
    Then Alice should be on step 3 "Checkout: Complete!"
    And Alice should see order completion elements

  @authenticated @checkout @form-validation @negative
  @allure.label.story:FormValidation
  @allure.label.severity:normal
  Scenario Outline: Checkout form validation with missing fields
    # Arrange: User is on checkout information page
    Given Alice is on the Sauce Demo login page
    And Alice is a registered user with valid credentials
    And Alice attempts to log in with valid credentials
    And Alice should be redirected to the products page
    And Alice adds "Sauce Labs Backpack" to the cart
    And Alice navigates to the cart page
    And Alice starts the checkout process
    And Alice should be on the checkout information step
    
    # Act: Submit form with missing required fields
    When Alice fills first name "<firstName>"
    And Alice fills last name "<lastName>"
    And Alice fills postal code "<postalCode>"
    And Alice continues to the next checkout step
    
    # Assert: Verify appropriate error message
    Then Alice should see a checkout error message containing "<expectedError>"
    And Alice should remain on the checkout information page

    Examples: Missing Field Scenarios
      | firstName | lastName | postalCode | expectedError                |
      |           | Doe      | 12345      | First Name is required       |
      | John      |          | 12345      | Last Name is required        |
      | John      | Doe      |            | Postal Code is required      |
      |           |          |            | First Name is required       |

  @authenticated @checkout @cart-items-validation
  @allure.label.story:OrderValidation
  @allure.label.severity:normal
  Scenario: Validate cart items appear correctly in checkout overview
    # Arrange: User has specific items in cart
    Given Alice is on the Sauce Demo login page
    And Alice is a registered user with valid credentials
    And Alice attempts to log in with valid credentials
    And Alice should be redirected to the products page
    And Alice adds "Sauce Labs Backpack" to the cart
    And Alice adds "Sauce Labs Bike Light" to the cart
    And Alice navigates to the cart page
    
    # Act: Proceed to checkout overview
    When Alice starts the checkout process
    And Alice fills checkout information with "Test", "User", and "12345"
    And Alice continues to the next checkout step
    And Alice should be on the checkout overview step
    
    # Assert: Verify cart items and calculations
    Then Alice should see "Sauce Labs Backpack" in the checkout items
    And Alice should see "Sauce Labs Bike Light" in the checkout items
    And Alice should see correct item total calculation
    And Alice should see tax amount displayed
    And Alice should see correct grand total calculation

  @authenticated @checkout @cancellation
  @allure.label.story:CheckoutCancellation
  @allure.label.severity:minor
  Scenario: Cancel checkout process from different steps
    # Arrange: User has items in cart
    Given Alice is on the Sauce Demo login page
    And Alice is a registered user with valid credentials
    And Alice attempts to log in with valid credentials
    And Alice should be redirected to the products page
    And Alice adds "Sauce Labs Backpack" to the cart
    And Alice navigates to the cart page
    
    # Act: Cancel from step 1
    When Alice starts the checkout process
    And Alice should be on the checkout information step
    And Alice cancels the checkout process
    Then Alice should be back on the cart page
    
    # Act: Cancel from step 2
    When Alice starts the checkout process
    And Alice fills checkout information with "Cancel", "Test", and "99999"
    And Alice continues to the next checkout step
    And Alice should be on the checkout overview step
    And Alice cancels the checkout process
    Then Alice should be back on the cart page

  @authenticated @checkout @navigation @back-home
  @allure.label.story:CheckoutNavigation
  @allure.label.severity:minor
  Scenario: Navigate back to products after successful checkout
    # Arrange: User completes a checkout
    Given Alice is on the Sauce Demo login page
    And Alice is a registered user with valid credentials
    And Alice attempts to log in with valid credentials
    And Alice should be redirected to the products page
    And Alice adds "Sauce Labs Backpack" to the cart
    And Alice navigates to the cart page
    And Alice starts the checkout process
    And Alice fills checkout information with "Complete", "Test", and "12345"
    And Alice continues to the next checkout step
    And Alice finishes the checkout process
    And Alice should be on the checkout complete step

    # Act: Click the back home button
    When Alice clicks the "Back Home" button
    
    # Assert: User is returned to the products page
    Then Alice should be on the "Products" page
    And Alice should not see the cart badge
    And Alice should see the products page header

  @authenticated @checkout @price-calculation
  @allure.label.story:PriceCalculation
  @allure.label.severity:critical
  Scenario: Verify dynamic price calculations in checkout overview
    # Arrange: User adds items with known prices to the cart
    Given Alice is on the Sauce Demo login page
    And Alice is a registered user with valid credentials
    And Alice attempts to log in with valid credentials
    And Alice should be redirected to the products page
    And Alice adds the following items to the cart:
      | product_name             | price   |
      | Sauce Labs Backpack      | 29.99   |
      | Sauce Labs Bolt T-Shirt  | 15.99   |
      | Sauce Labs Onesie        | 7.99    |
    And Alice navigates to the cart page
    And Alice starts the checkout process

    # Act: Proceed to checkout overview
    When Alice fills checkout information with "Price", "Test", and "12345"
    And Alice continues to the next checkout step
    And Alice should be on the checkout overview step

    # Assert: Verify accurate price calculations based on items added
    Then Alice should see the item total calculated correctly based on cart items
    And Alice should see the tax calculated correctly based on the item total
    And Alice should see the final total equal to the sum of item total and tax 
@allure.label.epic:E-Commerce
@allure.label.feature:ProductSorting
Feature: Product Sorting
  As a customer browsing the Sauce Demo products
  I want to sort products by name and price  
  So that I can find products more easily

  @authenticated @smoke @sorting @name-sorting
  @allure.label.story:NameSorting
  @allure.label.severity:critical
  Scenario: Sort products by name A to Z (default)
    # Arrange: User is on products page with default sorting
    Given Alice is on the Sauce Demo login page
    And Alice is a registered user with valid credentials
    And Alice attempts to log in with valid credentials
    And Alice should be redirected to the products page
    And Alice sees the sort dropdown is visible
    
    # Act: Verify default sorting is A to Z
    When Alice checks the current sorting option
    
    # Assert: Verify products are sorted alphabetically A to Z
    Then the sorting should be "Name (A to Z)"
    And Alice should see products sorted alphabetically from A to Z
    And "Sauce Labs Backpack" should appear before "Sauce Labs Onesie"

  @authenticated @sorting @name-sorting
  @allure.label.story:NameSorting  
  @allure.label.severity:normal
  Scenario: Sort products by name Z to A
    # Arrange: User is on products page
    Given Alice is on the Sauce Demo login page
    And Alice is a registered user with valid credentials
    And Alice attempts to log in with valid credentials
    And Alice should be redirected to the products page
    And Alice sees the sort dropdown is visible
    
    # Act: Select Z to A sorting
    When Alice sorts products by "Name (Z to A)"
    
    # Assert: Verify products are sorted alphabetically Z to A
    Then the sorting should be "Name (Z to A)"
    And Alice should see products sorted alphabetically from Z to A
    And "Test.allTheThings() T-Shirt (Red)" should appear before "Sauce Labs Backpack"

  @authenticated @sorting @price-sorting
  @allure.label.story:PriceSorting
  @allure.label.severity:normal
  Scenario: Sort products by price low to high
    # Arrange: User is on products page
    Given Alice is on the Sauce Demo login page
    And Alice is a registered user with valid credentials
    And Alice attempts to log in with valid credentials
    And Alice should be redirected to the products page
    And Alice sees the sort dropdown is visible
    
    # Act: Select price low to high sorting
    When Alice sorts products by "Price (low to high)"
    
    # Assert: Verify products are sorted by price ascending
    Then the sorting should be "Price (low to high)"
    And Alice should see products sorted by price from low to high
    And Alice should see the cheapest product appears first
    And Alice should see the most expensive product appears last

  @authenticated @sorting @price-sorting
  @allure.label.story:PriceSorting
  @allure.label.severity:normal
  Scenario: Sort products by price high to low
    # Arrange: User is on products page
    Given Alice is on the Sauce Demo login page
    And Alice is a registered user with valid credentials
    And Alice attempts to log in with valid credentials
    And Alice should be redirected to the products page
    And Alice sees the sort dropdown is visible
    
    # Act: Select price high to low sorting
    When Alice sorts products by "Price (high to low)"
    
    # Assert: Verify products are sorted by price descending
    Then the sorting should be "Price (high to low)"
    And Alice should see products sorted by price from high to low
    And Alice should see the most expensive product appears first
    And Alice should see the cheapest product appears last

  @authenticated @sorting @dropdown-validation
  @allure.label.story:SortingInterface
  @allure.label.severity:minor
  Scenario: Verify all sorting options are available
    # Arrange: User is on products page
    Given Alice is on the Sauce Demo login page
    And Alice is a registered user with valid credentials
    And Alice attempts to log in with valid credentials
    And Alice should be redirected to the products page
    And Alice sees the sort dropdown is visible
    
    # Act: Check available sorting options
    When Alice checks all available sorting options
    
    # Assert: Verify all 4 sorting options exist
    Then Alice should see sorting option "Name (A to Z)"
    And Alice should see sorting option "Name (Z to A)"
    And Alice should see sorting option "Price (low to high)"
    And Alice should see sorting option "Price (high to low)"

  @authenticated @sorting @sorting-persistence
  @allure.label.story:SortingBehavior
  @allure.label.severity:minor
  Scenario Outline: Verify sorting works correctly for all options
    # Arrange: User is on products page
    Given Alice is on the Sauce Demo login page
    And Alice is a registered user with valid credentials
    And Alice attempts to log in with valid credentials
    And Alice should be redirected to the products page
    And Alice sees the sort dropdown is visible
    
    # Act: Select each sorting option
    When Alice sorts products by "<sortOption>"
    
    # Assert: Verify sorting is applied correctly
    Then the sorting should be "<sortOption>"
    And Alice should see products displayed in the correct "<sortType>" order

    Examples: All Sorting Options
      | sortOption              | sortType        |
      | Name (A to Z)          | alphabetical-az |
      | Name (Z to A)          | alphabetical-za |
      | Price (low to high)    | price-ascending |
      | Price (high to low)    | price-descending|

  @authenticated @sorting @ui-interaction
  @allure.label.story:SortingInterface
  @allure.label.severity:minor
  Scenario: Sort dropdown maintains selection after page interactions
    # Arrange: User is on products page with custom sorting
    Given Alice is on the Sauce Demo login page
    And Alice is a registered user with valid credentials
    And Alice attempts to log in with valid credentials
    And Alice should be redirected to the products page
    And Alice sorts products by "Price (low to high)"
    And the sorting should be "Price (low to high)"
    
    # Act: Add item to cart (UI interaction)
    When Alice adds "Sauce Labs Backpack" to the cart
    And Alice waits for the cart badge to update
    
    # Assert: Verify sorting is maintained
    Then the sorting should still be "Price (low to high)"
    And Alice should see products still sorted by price from low to high

  @authenticated @sorting @comprehensive-validation
  @allure.label.story:SortingValidation
  @allure.label.severity:normal
  Scenario: Comprehensive sorting validation with specific products
    # Arrange: User is on products page
    Given Alice is on the Sauce Demo login page
    And Alice is a registered user with valid credentials
    And Alice attempts to log in with valid credentials
    And Alice should be redirected to the products page
    
    # Act & Assert: Test each sorting option with specific validations
    When Alice sorts products by "Name (A to Z)"
    Then "Sauce Labs Backpack" should be among the first products
    
    When Alice sorts products by "Name (Z to A)"
    Then "Test.allTheThings() T-Shirt (Red)" should be among the first products
    
    When Alice sorts products by "Price (low to high)"
    Then Alice should see the first product has the lowest price
    
    When Alice sorts products by "Price (high to low)"
    Then Alice should see the first product has the highest price 
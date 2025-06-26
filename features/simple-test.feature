Feature: Simple Basic Test
  As a tester
  I want to verify basic Cucumber functionality
  So that I can isolate any issues with the test framework

  @simple @basic
  Scenario: Basic web navigation test
    Given I am on the SauceDemo website
    When I check the page title
    Then the title should contain "Swag Labs"

  @simple @basic @login-simple
  Scenario: Simple login test  
    Given I am on the SauceDemo website
    When I enter username "standard_user"
    And I enter password "secret_sauce"
    And I click the login button
    Then I should see the products page 
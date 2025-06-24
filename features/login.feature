@allure.label.epic:WebInterface
@allure.label.feature:Authentication  
@allure.label.story:LoginLogout
Feature: User Authentication
  As a user of the Sauce Demo application
  I want to be able to log in and log out
  So that I can access the application securely

  # ========== ESSENTIAL BASIC SCENARIOS ==========

  @smoke @login @allure.label.severity:critical
  Scenario: Quick smoke test - Standard user login
    Given Alice is on the Sauce Demo login page
    When Alice attempts to log in with valid credentials
    Then Alice should be redirected to the products page
    And Alice should see the products page header
    And the page title should be "Swag Labs"

  @smoke @logout @allure.label.severity:critical  
  Scenario: Quick smoke test - Standard user logout
    Given Alice is on the Sauce Demo login page
    And Alice is a registered user with valid credentials
    And Alice attempts to log in with valid credentials
    And Alice should be redirected to the products page
    When Alice clicks the hamburger menu
    And Alice clicks the logout link
    Then Alice should be redirected to the login page
    And Alice should see the login form

  @allure.label.severity:critical
  Scenario: Successful login with valid credentials
    Given Alice is on the Sauce Demo login page
    And Alice is a registered user with valid credentials
    When Alice attempts to log in with valid credentials
    Then Alice should be redirected to the products page
    And Alice should see the products page header

  # ========== COMPREHENSIVE DATA-DRIVEN SCENARIOS ==========

  @login @data-driven @positive @allure.label.severity:critical
  Scenario Outline: Data-driven login with multiple valid user types
    Given Alice is on the Sauce Demo login page
    When Alice attempts to log in with username "<username>" and password "<password>"
    Then Alice should see the result "success"

    Examples: Valid Users
      | username                | password     |
      | standard_user          | secret_sauce |
      | performance_glitch_user| secret_sauce |
      | problem_user           | secret_sauce |
      | error_user             | secret_sauce |
      | visual_user            | secret_sauce |

  @login @data-driven @negative @allure.label.severity:normal
  Scenario Outline: Data-driven login with invalid credentials
    Given Alice is on the Sauce Demo login page
    When Alice attempts to log in with username "<username>" and password "<password>"
    Then Alice should see the error message "<expectedError>"
    And Alice should remain on the login page

    Examples: Invalid Credentials
      | username        | password      | expectedError                                               |
      | invalid_user    | wrong_password| Username and password do not match any user in this service|
      | locked_out_user | secret_sauce  | Sorry, this user has been locked out                       |
      | standard_user   | wrong_pass    | Username and password do not match any user in this service|
      | wrong_user      | secret_sauce  | Username and password do not match any user in this service|

  @login @data-driven @negative @boundary @allure.label.severity:minor  
  Scenario Outline: Data-driven login with empty and boundary values
    Given Alice is on the Sauce Demo login page
    When Alice attempts to log in with username "<username>" and password "<password>"
    Then Alice should see the error message "<expectedError>"
    And Alice should remain on the login page

    Examples: Empty and Boundary Cases
      | username     | password     | expectedError           |
      |              | secret_sauce | Username is required    |
      | standard_user|              | Password is required    |
      |              |              | Username is required    |

  # ========== LOGOUT SCENARIOS ==========

  @data-driven @logout @allure.label.severity:normal
  Scenario Outline: Data-driven logout with different user types
    Given Alice is on the Sauce Demo login page
    When Alice attempts to log in with username "<username>" and password "<password>"
    And Alice should be redirected to the products page
    And Alice clicks the hamburger menu
    And Alice clicks the logout link
    Then Alice should be redirected to the login page
    And Alice should see the login form

    Examples: Users for Logout Testing
      | username          | password     |
      | standard_user     | secret_sauce |
      | visual_user       | secret_sauce |

  # ========== MULTI-ACTOR SCENARIOS ==========

  @multi-actor @login @allure.label.severity:normal
  Scenario: Multiple users can log in simultaneously  
    Given Alice is on the Sauce Demo login page
    And Bob is on the Sauce Demo login page
    When Alice attempts to log in with username "standard_user" and password "secret_sauce"
    And Bob attempts to log in with username "problem_user" and password "secret_sauce"
    Then Alice should be redirected to the products page
    And Bob should be redirected to the products page 
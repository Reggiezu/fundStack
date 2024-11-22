# Testing Documentation for FundStack

## User Authentication Tests

### 1. User Sign-Up
- **Test Case**: User tries to sign up with valid information.
- **Steps**:
  1. Open `signup.html`.
  2. Fill in `email` and `password`.
  3. Click "Sign Up".
- **Expected Result**: User should be redirected to the profile completion page.
- **Result**: [Pass]

### 2. User Sign-In
- **Test Case**: User tries to sign in with correct credentials.
- **Steps**:
  1. Open `signin.html`.
  2. Enter valid `email` and `password`.
  3. Click "Sign In".
- **Expected Result**: User should be redirected to the dashboard.
- **Result**: [Pass]

## Form Validation Tests

### 3. Empty Fields Validation
- **Test Case**: User tries to submit forms with empty fields.
- **Steps**:
  1. Open `signup.html`.
  2. Leave fields empty.
  3. Click "Sign Up".
- **Expected Result**: Appropriate error message should be displayed.
- **Result**: [Pass]


## UI.Vision Test Results

- **Macro Name**: Sign-In Test
- **Date**: Nov 22, 2024
- **Result**: Passed
- **Notes**: Sign-in successful with valid email and password.



# Functionality Checklist

## Authentication
- [x] Sign-Up with valid credentials.
- [x] Sign-Up with invalid credentials.
- [x] Sign-In with valid credentials.
- [x] Sign-In with invalid credentials.
- [x] Sign-Out functionality.

## Page Access
- [x] Restricted pages should be blocked without login.
- [x] Dashboard access without completing profile should redirect to profile-completion page.

## Forms
- [x] Full name field should not be empty.
- [x] Email field should validate email format.

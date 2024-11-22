console.log("Running basic authentication tests...");

async function testSignIn(email, password) {
  try {
    await signIn(email, password);
    console.log(`Test for signIn(${email}, ${password}) should fail but passed unexpectedly.`);
  } catch (e) {
    console.error(`Test for signIn(${email}, ${password}) failed as expected:`, e.message);
  }
}

async function testSignUp(email, password) {
  try {
    await signUp(email, password);
    console.log(`Test for signUp(${email}, ${password}) should fail but passed unexpectedly.`);
  } catch (e) {
    console.error(`Test for signUp(${email}, ${password}) failed as expected:`, e.message);
  }
}

async function testSignOut() {
  try {
    await signOut();
    console.log("Test for signOut passed");
  } catch (e) {
    console.error("Test for signOut failed:", e.message);
  }
}

// Run Tests
testSignIn('noemail@fundstack.com', 'password');  // Should fail
testSignIn('invalid@example.com', 'wrongpassword');  // Should fail
testSignUp('newuser@fundstack.com', 'newpassword');  // Should pass initially, fail if user exists
testSignOut();  // Should pass if user is signed in



console.log("Running form validation tests...");

// Example function to test form field validation
function testFieldValidation(fieldName, value) {
  const inputField = document.getElementById(fieldName);
  if (!inputField) {
    console.error(`Test for ${fieldName} failed: Field not found`);
    return;
  }

  inputField.value = value;
  if (inputField.checkValidity()) {
    console.log(`Test for ${fieldName} with value '${value}' passed`);
  } else {
    console.error(`Test for ${fieldName} with value '${value}' failed validation`);
  }
}

// Testing different fields
testFieldValidation('fullname', 'John Doe');
testFieldValidation('email', 'invalid-email');
testFieldValidation('email', 'validemail@fundstack.com');
testFieldValidation('phone', '12345'); // Should fail if format is not accepted


console.log("Running dashboard interaction tests...");

// Check if key dashboard elements are present
function testDashboardElements() {
  const elements = ['userBalanceInfoCard', 'expenseInfoCard', 'savingInfoCard', 'highestExpenseCategoryInfoCard'];
  
  elements.forEach((elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      console.log(`Test for element '${elementId}' passed: Element found`);
    } else {
      console.error(`Test for element '${elementId}' failed: Element not found`);
    }
  });
}

testDashboardElements();

// Check if user can add new transaction
function testAddTransaction(amount, description, category) {
  try {
    const transaction = {
      amount: amount,
      description: description,
      category: category,
      date: new Date().toISOString()
    };

    addTransaction(transaction); // Assuming addTransaction is a function defined to handle this
    console.log(`Test for adding transaction with amount '${amount}', description '${description}', category '${category}' passed`);
  } catch (e) {
    console.error(`Test for adding transaction with amount '${amount}', description '${description}', category '${category}' failed:`, e.message);
  }
}

// Example Add Transaction Test
testAddTransaction(100, 'Groceries', 'Food');
testAddTransaction(-50, 'Gas', 'Gas Expense');

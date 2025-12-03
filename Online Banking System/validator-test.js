import Validator from "./index.js";

// Email Tests
console.log("Email Tests:");
console.log(Validator.validateEmail("test@gmail.com"));  // true
console.log(Validator.validateEmail("bad-email"));       // false

// Phone Tests
console.log("\nPhone Tests:");
console.log(Validator.validatePhone("08034567890"));     // true
console.log(Validator.validatePhone("+2348034567890"));  // true
console.log(Validator.validatePhone("8034567890"));      // false

// PIN Tests
console.log("\nPIN Tests:");
console.log(Validator.validatePin("1234"));              // true
console.log(Validator.validatePin("12a4"));              // false
console.log(Validator.validatePin("12345"));             // false

// Amount Tests
console.log("\nAmount Tests:");
console.log(Validator.validateAmount(500));              // true
console.log(Validator.validateAmount(-10));              // false
console.log(Validator.validateAmount("100"));            // false

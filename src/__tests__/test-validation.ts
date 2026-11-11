import { registerSchema } from '../validators/auth.validator.js';

const result = registerSchema.safeParse({
  name: "shaahid",
  email: "Shaahid@gmail.com",
  password: "Password123"
});

if (result.success) {
  console.log("Validation successfull")
  console.log(result.data);
} else {
  console.log("Validation error")
  console.log(result.error.issues[0]?.message);
}


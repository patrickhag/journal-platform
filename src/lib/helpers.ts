const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isEmail(email: string): boolean {
  return emailRegex.test(email);
}


const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+=[\]{}|;':",.<>/?-])(?=.{8,})/;

export function isPasswordStrong(password: string): boolean {
  return passwordRegex.test(password);
}

export function isPasswordMatch(
  password: string,
  confirmPassword: string,
): boolean {
  return password === confirmPassword;
}

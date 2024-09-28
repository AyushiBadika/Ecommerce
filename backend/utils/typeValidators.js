const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const uppercaseRegex = /[A-Z]/;
const lowercaseRegex = /[a-z]/;
const numberRegex = /\d/;
const specialCharRegex = /[^a-zA-Z0-9]/;

export function isEmailValid(email) {
  if (!email || email.length > 254) return false;

  if (!emailRegex.test(email)) return false;

  const parts = email.split("@");
  if (parts[0].length > 64) return false;

  const domainParts = parts[1].split(".");

  if (domainParts.some((part) => part.length > 63) || domainParts.length < 2) return false;

  return true;
}

export function ispasswordValid(password) {
  if (password.length < 8) {
    return false;
  }

  if (!uppercaseRegex.test(password)) {
    return false;
  }

  if (!lowercaseRegex.test(password)) {
    return false;
  }

  if (!numberRegex.test(password)) {
    return false;
  }

  if (!specialCharRegex.test(password)) {
    return false;
  }

  return true;
}

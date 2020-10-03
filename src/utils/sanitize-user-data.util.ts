export const stripUserData = (string: string): string => {
  const personalDataRegexps = {
    login: /"login":"(?<login>\w+)"/,
    password: /"password":"(?<password>\w+)"/,
    age: /"age":"(?<age>\w+)"/,
  };

  const loginMatch = string.match(personalDataRegexps['login']);
  const pwMatch = string.match(personalDataRegexps['password']);
  const ageMatch = string.match(personalDataRegexps['age']);

  const mask = '***';
  let sanitizedString = string;

  if (loginMatch) {
    sanitizedString = string.replace(loginMatch[1], mask);
  }

  if (pwMatch) {
    sanitizedString = string.replace(pwMatch[1], mask);
  }

  if (ageMatch) {
    sanitizedString = string.replace(ageMatch[1], mask);
  }

  return sanitizedString;
};

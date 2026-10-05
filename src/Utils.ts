function hello(): string {
  return 'Hello, world!';
}

function add(a: number, b: number): number {
  return a + b;
}

function add_user(name: string, email: string, password: string): boolean {
  name = name.trim();
  if (name.search(' ') !== -1) {
    return false;
  }
  password = password.trim();
  if (password.length < 6) {
    return false;
  }
  email = email.trim();
  const regx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regx.test(email)) {
    return false;
  }
  return true;
}

export const utils = {
  hello,
  add,
  add_user,
};

class CustomError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = 'Custom Error';
  }
}

export default CustomError;

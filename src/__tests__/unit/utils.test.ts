import { isError, isNamedError } from '../../utils/isError';

describe('Utils - Blackbox Testing', () => {
  describe('isError function', () => {
    it('should return true for Error instances', () => {
      // Given
      const error = new Error('Test error');

      // When
      const result = isError(error);

      // Then
      expect(result).toBe(true);
    });

    it('should return true for custom Error types', () => {
      // Given
      const customError = new TypeError('Type error');
      const rangeError = new RangeError('Range error');
      const syntaxError = new SyntaxError('Syntax error');

      // When & Then
      expect(isError(customError)).toBe(true);
      expect(isError(rangeError)).toBe(true);
      expect(isError(syntaxError)).toBe(true);
    });

    it('should return false for non-Error values', () => {
      // Given
      const testCases = [
        'string error',
        42,
        null,
        undefined,
        {},
        [],
        () => undefined,
        new Date(),
        new RegExp('test'),
      ];

      // When & Then
      testCases.forEach((testCase) => {
        expect(isError(testCase)).toBe(false);
      });
    });

    it('should return false for objects with error-like properties', () => {
      // Given
      const fakeError = {
        message: 'Fake error',
        name: 'FakeError',
        stack: 'fake stack trace',
      };

      // When
      const result = isError(fakeError);

      // Then
      expect(result).toBe(false);
    });
  });

  describe('isNamedError function', () => {
    it('should return true for objects with string name property', () => {
      // Given
      const namedErrors = [
        { name: 'TestError' },
        { name: 'ValidationError', message: 'Invalid input' },
        { name: 'NetworkError', code: 404 },
        { name: '' }, // Empty string is still a string
        { name: '123' }, // Numeric string
      ];

      // When & Then
      namedErrors.forEach((error) => {
        expect(isNamedError(error)).toBe(true);
      });
    });

    it('should return false for objects without name property', () => {
      // Given
      const nonNamedErrors = [
        { message: 'No name property' },
        { code: 500, details: 'Server error' },
        { type: 'error', description: 'Some error' },
      ];

      // When & Then
      nonNamedErrors.forEach((error) => {
        expect(isNamedError(error)).toBe(false);
      });
    });

    it('should return false for objects with non-string name property', () => {
      // Given
      const invalidNamedErrors = [
        { name: 123 },
        { name: true },
        { name: null },
        { name: undefined },
        { name: {} },
        { name: [] },
        { name: () => undefined },
      ];

      // When & Then
      invalidNamedErrors.forEach((error) => {
        expect(isNamedError(error)).toBe(false);
      });
    });

    it('should return false for non-object values', () => {
      // Given
      const nonObjects = [
        'string',
        42,
        null,
        undefined,
        true,
        false,
        () => undefined,
      ];

      // When & Then
      nonObjects.forEach((value) => {
        expect(isNamedError(value)).toBe(false);
      });
    });

    it('should handle edge cases correctly', () => {
      // Given
      const edgeCases = [
        null,
        undefined,
        {},
        { name: 'valid' },
        { name: 0 },
        { name: '' },
        { name: '   ' }, // Whitespace string
        { name: 'a'.repeat(1000) }, // Very long string
      ];

      // When & Then
      expect(isNamedError(edgeCases[0])).toBe(false); // null
      expect(isNamedError(edgeCases[1])).toBe(false); // undefined
      expect(isNamedError(edgeCases[2])).toBe(false); // empty object
      expect(isNamedError(edgeCases[3])).toBe(true); // valid name
      expect(isNamedError(edgeCases[4])).toBe(false); // numeric name
      expect(isNamedError(edgeCases[5])).toBe(true); // empty string name
      expect(isNamedError(edgeCases[6])).toBe(true); // whitespace string name
      expect(isNamedError(edgeCases[7])).toBe(true); // long string name
    });
  });

  describe('Integration between isError and isNamedError', () => {
    it('should handle real Error instances correctly', () => {
      // Given
      const realError = new Error('Real error');
      const typeError = new TypeError('Type error');

      // When & Then
      expect(isError(realError)).toBe(true);
      // Error instances DO have a name property, so this should be true
      expect(isNamedError(realError)).toBe(true);

      expect(isError(typeError)).toBe(true);
      expect(isNamedError(typeError)).toBe(true);
    });

    it('should handle custom error objects correctly', () => {
      // Given
      const customError = {
        name: 'CustomError',
        message: 'Custom error message',
        stack: 'Custom stack trace',
      };

      // When & Then
      expect(isError(customError)).toBe(false);
      expect(isNamedError(customError)).toBe(true);
    });
  });
});

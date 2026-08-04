import { validateCustomerInput } from "../../src/logic/it-1-br-3-1-1-1";

describe("顧客情報入力検証機能", () => {
  // SCEN-628
  test("顧客情報の型が不正な場合、ValidationErrorを throw する", () => {
    const invalidInputCases = [
      {
        input: { name: null, email: "test@example.com", phone: "09012345678" },
        expectedField: "name",
        expectedType: "string",
        receivedType: "null",
      },
      {
        input: { name: undefined, email: "test@example.com", phone: "09012345678" },
        expectedField: "name",
        expectedType: "string",
        receivedType: "undefined",
      },
      {
        input: { name: true, email: "test@example.com", phone: "09012345678" },
        expectedField: "name",
        expectedType: "string",
        receivedType: "boolean",
      },
      {
        input: { name: ["太郎"], email: "test@example.com", phone: "09012345678" },
        expectedField: "name",
        expectedType: "string",
        receivedType: "array",
      },
      {
        input: { name: { firstName: "太郎" }, email: "test@example.com", phone: "09012345678" },
        expectedField: "name",
        expectedType: "string",
        receivedType: "object",
      },
      {
        input: { name: "太郎", email: null, phone: "09012345678" },
        expectedField: "email",
        expectedType: "string",
        receivedType: "null",
      },
      {
        input: { name: "太郎", email: 123, phone: "09012345678" },
        expectedField: "email",
        expectedType: "string",
        receivedType: "number",
      },
      {
        input: { name: "太郎", email: "test@example.com", phone: 9012345678 },
        expectedField: "phone",
        expectedType: "string",
        receivedType: "number",
      },
      {
        input: { name: "太郎", email: false, phone: "09012345678" },
        expectedField: "email",
        expectedType: "string",
        receivedType: "boolean",
      },
      {
        input: { name: "太郎", email: ["test@example.com"], phone: "09012345678" },
        expectedField: "email",
        expectedType: "string",
        receivedType: "array",
      },
    ];

    invalidInputCases.forEach((testCase) => {
      expect(() => validateCustomerInput(testCase.input)).toThrow(/INVALID_INPUT_FORMAT/);
    });
  });

  test("複数フィールドが型不正な場合、全ての不正フィールドのエラー情報を配列で返す", () => {
    const multipleInvalidInput = {
      name: null,
      email: 123,
      phone: ["09012345678"],
    };

    let thrownError: any;
    try {
      validateCustomerInput(multipleInvalidInput);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toBeDefined();
    expect(Array.isArray(thrownError.errors)).toBe(true);
    expect(thrownError.errors.length).toBe(3);

    const errorCodes = thrownError.errors.map((err: any) => err.code);
    expect(errorCodes).toEqual(["INVALID_INPUT_FORMAT", "INVALID_INPUT_FORMAT", "INVALID_INPUT_FORMAT"]);

    const invalidFieldNames = thrownError.errors.map((err: any) => err.field);
    expect(invalidFieldNames).toContain("name");
    expect(invalidFieldNames).toContain("email");
    expect(invalidFieldNames).toContain("phone");
  });
});
import { validateCustomerInput } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-649: 顧客名が最大文字数を超えるとき、修正を促す", () => {
    // Arrange
    const maxCharacterLimit = 50;
    const excessiveCustomerName = "a".repeat(51); // 51文字の文字列
    const currentCharacterCount = 51;

    const inputData = {
      customerName: excessiveCustomerName,
    };

    // Act
    const validationResult = validateCustomerInput(inputData);

    // Assert
    expect(validationResult.isValid).toBe(false);
    expect(validationResult.errors).toHaveLength(1);
    expect(validationResult.errors[0]).toEqual({
      fieldName: "customerName",
      errorMessage: `顧客名は${maxCharacterLimit}文字以内で入力してください。現在の文字数：${currentCharacterCount}文字`,
      shouldShowErrorColor: true,
      shouldDisableSubmitButton: true,
      shouldKeepFocus: true,
    });
    expect(validationResult.fieldBackgroundColor).toBe("red");
    expect(validationResult.isSubmitButtonDisabled).toBe(true);
    expect(validationResult.focusedFieldName).toBe("customerName");
  });
});
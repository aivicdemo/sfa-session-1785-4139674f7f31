import {
  validateAndNormalizeBusinessData,
} from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  test("SCEN-191: 正規化ルール適用後に同じ入力で再実行したとき、同じ結果が得られる", () => {
    const inputData = {
      customer_name: "  山田太郎  ",
      phone_number: "090-1234-5678",
      email_address: "YAMADA@EXAMPLE.COM",
    };

    const normalizationRules = {
      trim_whitespace: true,
      phone_number_format: "remove_hyphen",
      email_address_lowercase: true,
    };

    // 第1回目の検証実行
    const firstValidationResult = validateAndNormalizeBusinessData(
      inputData,
      normalizationRules
    );

    // 第1回目の結果から正規化済みデータを抽出
    const normalizedData = {
      customer_name: firstValidationResult.normalized_data.customer_name,
      phone_number: firstValidationResult.normalized_data.phone_number,
      email_address: firstValidationResult.normalized_data.email_address,
    };

    // 第2回目の検証実行：正規化済みデータを入力として使用
    const secondValidationResult = validateAndNormalizeBusinessData(
      normalizedData,
      normalizationRules
    );

    // 第1回目と第2回目の検証結果を比較
    // 期待値：正規化済みデータ、検証ステータス、エラーコードが同一
    expect(firstValidationResult.normalized_data.customer_name).toBe(
      "山田太郎"
    );
    expect(firstValidationResult.normalized_data.phone_number).toBe(
      "09012345678"
    );
    expect(firstValidationResult.normalized_data.email_address).toBe(
      "yamada@example.com"
    );
    expect(firstValidationResult.validation_status).toEqual({
      customer_name: "valid",
      phone_number: "valid",
      email_address: "valid",
    });
    expect(firstValidationResult.error_codes).toEqual([]);

    // 第2回目の結果が第1回目と同一であることを検証
    expect(secondValidationResult.normalized_data.customer_name).toBe(
      firstValidationResult.normalized_data.customer_name
    );
    expect(secondValidationResult.normalized_data.phone_number).toBe(
      firstValidationResult.normalized_data.phone_number
    );
    expect(secondValidationResult.normalized_data.email_address).toBe(
      firstValidationResult.normalized_data.email_address
    );
    expect(secondValidationResult.validation_status).toEqual(
      firstValidationResult.validation_status
    );
    expect(secondValidationResult.error_codes).toEqual(
      firstValidationResult.error_codes
    );
  });
});
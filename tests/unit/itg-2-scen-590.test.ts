import { validateNormalizedCustomerDataBatch } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  test("SCEN-590: 正規化済み顧客データ複数件の場合、各件ごとに独立して検証される", () => {
    // テストコンテキスト初期化
    const normalizedCustomerDataBatch = [
      {
        customer_id: "CUST_001",
        customer_name: "顧客A",
        postal_code: "123-45",
        business_category_code: "0101",
        address: "東京都渋谷区",
        phone_number: "090-1234-5678",
      },
      {
        customer_id: "CUST_002",
        customer_name: "顧客B",
        postal_code: "100-0001",
        business_category_code: "9999",
        address: "東京都千代田区丸の内1-1-1",
        phone_number: "090-9876-5432",
      },
      {
        customer_id: "CUST_003",
        customer_name: "顧客C",
        postal_code: "200-0001",
        business_category_code: "0102",
        address:
          "東京都東京都東京都東京都東京都東京都東京都東京都東京都東京都東京都東京都東京都東京都東京都東京都東京都東京都東京都東京都東京都東京都東京都東京都東京都東京都",
        phone_number: "090-5555-5555",
      },
    ];

    // 検証エンジンに複数件を一括入力
    const validationResults = validateNormalizedCustomerDataBatch(
      normalizedCustomerDataBatch
    );

    // 各顧客データの検証結果がそれぞれ独立して返されることを検証
    expect(validationResults).toHaveLength(3);

    // 顧客A: 郵便番号形式エラー (期待値: postal_code_format_invalid)
    expect(validationResults[0]).toEqual({
      customer_id: "CUST_001",
      is_valid: false,
      validation_errors: [
        {
          field: "postal_code",
          error_code: "postal_code_format_invalid",
          message: "郵便番号の形式が正しくありません",
        },
      ],
    });

    // 顧客B: 業種コード不正 (期待値: business_category_code_invalid)
    expect(validationResults[1]).toEqual({
      customer_id: "CUST_002",
      is_valid: false,
      validation_errors: [
        {
          field: "business_category_code",
          error_code: "business_category_code_invalid",
          message: "業種コードが不正です",
        },
      ],
    });

    // 顧客C: 住所文字数超過 (期待値: address_length_exceeded)
    expect(validationResults[2]).toEqual({
      customer_id: "CUST_003",
      is_valid: false,
      validation_errors: [
        {
          field: "address",
          error_code: "address_length_exceeded",
          message: "住所の文字数が上限を超えています",
        },
      ],
    });

    // 各件の検証結果が他の件に影響を受けないことを検証
    expect(validationResults[0].validation_errors).not.toContain(
      validationResults[1].validation_errors[0]
    );
    expect(validationResults[1].validation_errors).not.toContain(
      validationResults[2].validation_errors[0]
    );
    expect(validationResults[2].validation_errors).not.toContain(
      validationResults[0].validation_errors[0]
    );
  });
});
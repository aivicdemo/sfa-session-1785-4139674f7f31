import { standardizeCustomerResponse } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-298: 顧客反応が1件の状態で標準化されて記録される", () => {
    // 準備: 顧客反応記録の初期状態（1件のみ）
    const input_customer_response = {
      response_id: "resp_001",
      customer_id: "cust_12345",
      response_type: "  INQUIRY  ",
      response_text: "  こんにちは。製品について詳しく教えてください。  ",
      created_at: new Date("2024-02-15T10:30:00Z"),
      is_normalized: false,
    };

    // 実行: 標準化処理
    const standardized_result = standardizeCustomerResponse(input_customer_response);

    // 検証: 返却されたデータが1件であること
    expect(Array.isArray(standardized_result)).toBe(true);
    expect(standardized_result.length).toBe(1);

    // 検証: 標準化されたフィールド値を確認
    const normalized_record = standardized_result[0];

    // カテゴリが正規化されて「問い合わせ」に統一されていること
    expect(normalized_record.response_type).toBe("問い合わせ");

    // テキストが半角スペース削除・小文字化されていること
    expect(normalized_record.response_text).toBe("こんにちは。製品について詳しく教えてください。");

    // その他フィールドが保持されていること
    expect(normalized_record.response_id).toBe("resp_001");
    expect(normalized_record.customer_id).toBe("cust_12345");

    // 正規化フラグが true に更新されていること
    expect(normalized_record.is_normalized).toBe(true);

    // 作成日時が保持されていること
    expect(normalized_record.created_at).toEqual(new Date("2024-02-15T10:30:00Z"));
  });
});
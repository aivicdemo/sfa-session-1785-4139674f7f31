import { standardizeCustomerResponse } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-308: 顧客反応記録・標準化機能 - 同じ入力で2回実行した場合、同じ標準化結果が得られる", () => {
    // テスト用の顧客反応入力データ
    const customer_response_input = {
      customer_name: "山田太郎",
      response_content: "製品に興味あり、次週デモ希望",
      response_datetime: "2024-01-15T14:30:00Z",
    };

    // 1回目の実行
    const first_result = standardizeCustomerResponse(customer_response_input);

    // 2回目の実行
    const second_result = standardizeCustomerResponse(customer_response_input);

    // 1回目と2回目の標準化結果が完全に一致することを検証
    expect(first_result).toEqual(second_result);

    // 標準化結果の全要素が同一の値・順序で出力されることを検証
    expect(first_result.normalized_text).toBe(second_result.normalized_text);
    expect(first_result.classification_tags).toEqual(
      second_result.classification_tags
    );
    expect(first_result.extracted_keywords).toEqual(
      second_result.extracted_keywords
    );
    expect(first_result.priority).toBe(second_result.priority);
    expect(first_result.followup_recommended_datetime).toBe(
      second_result.followup_recommended_datetime
    );
    expect(first_result.metadata).toEqual(second_result.metadata);
  });
});
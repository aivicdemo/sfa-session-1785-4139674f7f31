import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { getUnificationJudgmentHistory } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データ重複検出機能 - 統合判定履歴参照", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-267
  test("統合判定履歴が1件のとき、その1件の履歴が正常に参照される", async () => {
    const customer_id = "CUST-001";
    const judgment_datetime = "2024-01-15T10:30:00Z";
    const judgment_result = "重複あり";
    const confidence_score = 0.95;

    const mock_history = {
      unification_judgment_histories: [
        {
          customer_id: customer_id,
          judgment_datetime: judgment_datetime,
          judgment_result: judgment_result,
          confidence_score: confidence_score,
        },
      ],
    };

    global.fetch = jest.fn(() =>
      Promise.resolve(
        new Response(JSON.stringify(mock_history), { status: 200 })
      )
    ) as jest.Mock;

    const result = await getUnificationJudgmentHistory(customer_id);

    expect(result).toEqual({
      unification_judgment_histories: [
        {
          customer_id: "CUST-001",
          judgment_datetime: "2024-01-15T10:30:00Z",
          judgment_result: "重複あり",
          confidence_score: 0.95,
        },
      ],
    });

    expect(result.unification_judgment_histories).toHaveLength(1);
    expect(result.unification_judgment_histories[0].judgment_datetime).toBe(
      "2024-01-15T10:30:00Z"
    );
    expect(result.unification_judgment_histories[0].judgment_result).toBe(
      "重複あり"
    );
    expect(result.unification_judgment_histories[0].confidence_score).toBe(0.95);
  });
});
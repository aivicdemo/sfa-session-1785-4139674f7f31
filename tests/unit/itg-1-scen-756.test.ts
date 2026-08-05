import { calculateInferenceAccuracyScore } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度監視 - 推論結果と提案内容の矛盾検出", () => {
  // SCEN-756
  test("推論結果と提案内容が矛盾しているときエラーが返される", () => {
    // 推論結果: 顧客Aは高購買意欲
    // 提案内容: フォローアップメール送信を推奨しない
    // この組み合わせは矛盾している
    const inference_result = {
      customer_id: "CUST_A",
      purchase_intent: "high",
      confidence_score: 0.92,
    };

    const proposal_content = {
      recommended_action: "do_not_send_followup_email",
      action_type: "no_action",
    };

    const result = calculateInferenceAccuracyScore({
      inference_result,
      proposal_content,
    });

    // エラーオブジェクトが返される
    expect(result).toBeDefined();
    expect(result.error_code).toBe("ERR_INFERENCE_PROPOSAL_CONTRADICTION");
    expect(result.error_message).toMatch(/推論結果と提案内容に矛盾/);
    expect(result.error_message).toMatch(/高購買意欲/);
    expect(result.error_message).toMatch(/フォローアップメール送信非推奨/);

    // スコア算出は実行されず、精度スコアはnullまたは未設定
    expect(result.accuracy_score).toBeNull();
  });
});
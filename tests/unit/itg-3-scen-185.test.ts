import { recordRecommendationHistory } from "../../src/logic/it-1-br-3-3-2-1";

describe("推奨履歴記録機能", () => {
  test("SCEN-185: 推奨実行時刻が月初となる場合に正確に記録される", async () => {
    // モック化した日時を月初に設定
    const monthStartDate = new Date("2024-01-01T00:00:00.000Z");
    jest.useFakeTimers();
    jest.setSystemTime(monthStartDate);

    // AIRecommendationEngine のスタブを構成
    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        customerId: "CUST-001",
        dealId: "DEAL-2024-001",
        proposalApproach: "提案アプローチA: 顧客の経営課題に対応した段階的導入戦略",
      }),
    };

    // 推奨実行時のリクエストパラメータ
    const dealConditionInput = {
      customerId: "CUST-001",
      dealId: "DEAL-2024-001",
      industry: "製造業",
      companySize: "大企業",
      customerChallenge: "デジタルトランスフォーメーション",
    };

    // 推奨実行APIを呼び出し
    const recommendationResult = await aiRecommendationEngineStub.generateRecommendation(dealConditionInput);

    // 推奨履歴記録機能を実行
    const recordedHistory = await recordRecommendationHistory({
      customerId: recommendationResult.customerId,
      dealId: recommendationResult.dealId,
      proposalApproach: recommendationResult.proposalApproach,
      executedAt: new Date(monthStartDate),
      aiEngine: aiRecommendationEngineStub,
    });

    // 推奨履歴テーブルから記録されたタイムスタンプを取得
    const recordedTimestamp = recordedHistory.executedAt;
    const recordedDate = recordedHistory.executedAt.toISOString().split("T")[0];

    // タイムスタンプが月初（2024-01-01T00:00:00.000Z）と正確に一致することを検証
    expect(recordedTimestamp.toISOString()).toBe("2024-01-01T00:00:00.000Z");

    // 日付フィールドが月初（2024-01-01）と一致することを検証
    expect(recordedDate).toBe("2024-01-01");

    // 商談IDと推奨内容がリクエスト時の値と完全に一致することを検証
    expect(recordedHistory.dealId).toBe(dealConditionInput.dealId);
    expect(recordedHistory.customerId).toBe(dealConditionInput.customerId);
    expect(recordedHistory.proposalApproach).toBe("提案アプローチA: 顧客の経営課題に対応した段階的導入戦略");

    // タイムスタンプの秒単位までの精度を確認
    expect(recordedTimestamp.getUTCFullYear()).toBe(2024);
    expect(recordedTimestamp.getUTCMonth()).toBe(0); // 0 = January
    expect(recordedTimestamp.getUTCDate()).toBe(1);
    expect(recordedTimestamp.getUTCHours()).toBe(0);
    expect(recordedTimestamp.getUTCMinutes()).toBe(0);
    expect(recordedTimestamp.getUTCSeconds()).toBe(0);
    expect(recordedTimestamp.getUTCMilliseconds()).toBe(0);

    jest.useRealTimers();
  });
});
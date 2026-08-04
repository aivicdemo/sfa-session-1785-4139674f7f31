import { generateRecommendation } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-2904
  test("[edge] 推奨の生成対象期間の判定 - 検証対象が月末日のときに過去1ヶ月の全営業データが含まれる", () => {
    // 固定日時: 2026年1月31日（検証対象日時）
    const targetDate = new Date("2026-01-31T23:59:59Z");

    // 期待される推奨生成対象期間: 2026年1月1日00:00:00 ～ 2026年1月31日23:59:59
    const expectedPeriodStartDate = new Date("2026-01-01T00:00:00Z");
    const expectedPeriodEndDate = new Date("2026-01-31T23:59:59Z");

    // 過去1ヶ月内の営業データ（2026年1月1日～31日）
    const salesDataWithinPeriod = [
      {
        id: "deal_001",
        customerId: "cust_001",
        dealDate: new Date("2026-01-15T10:00:00Z"),
        status: "won",
        amount: 500000,
      },
      {
        id: "deal_002",
        customerId: "cust_002",
        dealDate: new Date("2026-01-20T14:30:00Z"),
        status: "won",
        amount: 350000,
      },
      {
        id: "deal_003",
        customerId: "cust_003",
        dealDate: new Date("2026-01-25T09:15:00Z"),
        status: "lost",
        amount: 200000,
      },
      {
        id: "deal_004",
        customerId: "cust_004",
        dealDate: new Date("2026-01-10T11:00:00Z"),
        status: "won",
        amount: 450000,
      },
      {
        id: "deal_005",
        customerId: "cust_005",
        dealDate: new Date("2026-01-08T13:45:00Z"),
        status: "won",
        amount: 600000,
      },
      {
        id: "deal_006",
        customerId: "cust_006",
        dealDate: new Date("2026-01-12T15:20:00Z"),
        status: "lost",
        amount: 300000,
      },
      {
        id: "deal_007",
        customerId: "cust_007",
        dealDate: new Date("2026-01-18T10:50:00Z"),
        status: "won",
        amount: 550000,
      },
      {
        id: "deal_008",
        customerId: "cust_008",
        dealDate: new Date("2026-01-22T16:30:00Z"),
        status: "lost",
        amount: 180000,
      },
      {
        id: "deal_009",
        customerId: "cust_009",
        dealDate: new Date("2026-01-05T08:00:00Z"),
        status: "won",
        amount: 420000,
      },
      {
        id: "deal_010",
        customerId: "cust_010",
        dealDate: new Date("2026-01-28T12:00:00Z"),
        status: "won",
        amount: 380000,
      },
      {
        id: "deal_011",
        customerId: "cust_011",
        dealDate: new Date("2026-01-02T09:30:00Z"),
        status: "won",
        amount: 470000,
      },
      {
        id: "deal_012",
        customerId: "cust_012",
        dealDate: new Date("2026-01-14T14:15:00Z"),
        status: "lost",
        amount: 250000,
      },
      {
        id: "deal_013",
        customerId: "cust_013",
        dealDate: new Date("2026-01-30T11:45:00Z"),
        status: "won",
        amount: 520000,
      },
      {
        id: "deal_014",
        customerId: "cust_014",
        dealDate: new Date("2026-01-07T13:20:00Z"),
        status: "lost",
        amount: 220000,
      },
      {
        id: "deal_015",
        customerId: "cust_015",
        dealDate: new Date("2026-01-31T17:00:00Z"),
        status: "won",
        amount: 410000,
      },
    ];

    // 過去1ヶ月外のデータ（2025年12月31日以前）- 除外対象
    const salesDataOutsidePeriod = [
      {
        id: "deal_outside_001",
        customerId: "cust_outside_001",
        dealDate: new Date("2025-12-31T10:00:00Z"),
        status: "won",
        amount: 300000,
      },
      {
        id: "deal_outside_002",
        customerId: "cust_outside_002",
        dealDate: new Date("2025-12-15T14:00:00Z"),
        status: "won",
        amount: 450000,
      },
    ];

    // 全営業データ（期間内 + 期間外）
    const allSalesData = [
      ...salesDataOutsidePeriod,
      ...salesDataWithinPeriod,
    ];

    // AIRecommendationEngineのスタブ
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(
        (
          input: {
            customerId: string;
            dealCondition: Record<string, unknown>;
            salesDataPeriod: {
              startDate: Date;
              endDate: Date;
              data: Array<{
                id: string;
                customerId: string;
                dealDate: Date;
                status: string;
                amount: number;
              }>;
            };
          },
        ) => {
          // 渡された営業データの期間と内容をログに記録
          return {
            recommendation: "sample_recommendation",
            periodStartDate: input.salesDataPeriod.startDate,
            periodEndDate: input.salesDataPeriod.endDate,
            dataCount: input.salesDataPeriod.data.length,
            wonCount: input.salesDataPeriod.data.filter(
              (d) => d.status === "won",
            ).length,
            lostCount: input.salesDataPeriod.data.filter(
              (d) => d.status === "lost",
            ).length,
            visitCount: input.salesDataPeriod.data.length * 2.8, // 仮計算: 平均訪問数
          };
        },
      ),
    };

    // 推奨生成処理を実行
    const result = generateRecommendation(
      {
        customerId: "cust_test_001",
        dealCondition: {
          industry: "technology",
          companySize: "large",
        },
        targetDate: targetDate,
        salesData: allSalesData,
      },
      mockAIRecommendationEngine,
    );

    // 検証: AIエージェントが受け取った営業データの期間パラメータを確認
    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalled();

    const callArgs = mockAIRecommendationEngine.generateRecommendation.mock
      .calls[0][0];

    // 期待値: 推奨生成対象期間は2026年1月1日00:00:00～2026年1月31日23:59:59
    expect(callArgs.salesDataPeriod.startDate.toISOString()).toBe(
      expectedPeriodStartDate.toISOString(),
    );
    expect(callArgs.salesDataPeriod.endDate.toISOString()).toBe(
      expectedPeriodEndDate.toISOString(),
    );

    // 期待値: 過去1ヶ月内のデータ件数は15件（成約15件、失注8件は集計内の分類）
    // ただし実際には成約件数：15件、失注件数：8件の合計23件ではなく、
    // テストデータセットの内訳で確認：成約10件、失注5件 = 15件
    expect(callArgs.salesDataPeriod.data).toHaveLength(15);
    expect(
      callArgs.salesDataPeriod.data.every(
        (d) =>
          d.dealDate >= expectedPeriodStartDate &&
          d.dealDate <= expectedPeriodEndDate,
      ),
    ).toBe(true);

    // 期待値: 成約件数は10件
    const wonCount = callArgs.salesDataPeriod.data.filter(
      (d) => d.status === "won",
    ).length;
    expect(wonCount).toBe(10);

    // 期待値: 失注件数は5件
    const lostCount = callArgs.salesDataPeriod.data.filter(
      (d) => d.status === "lost",
    ).length;
    expect(lostCount).toBe(5);

    // 期待値: 期間外データ（2025年12月31日以前）は除外されている
    const outsideData = callArgs.salesDataPeriod.data.filter(
      (d) => d.dealDate < expectedPeriodStartDate,
    );
    expect(outsideData).toHaveLength(0);

    // 推奨結果の信頼度スコア（構造化根拠とともに返される）
    expect(result).toHaveProperty("recommendationScore");
    expect(typeof result.recommendationScore).toBe("number");
    expect(result.recommendationScore).toBeGreaterThanOrEqual(0);
    expect(result.recommendationScore).toBeLessThanOrEqual(100);

    // 推奨根拠に期間情報が含まれる
    expect(result).toHaveProperty("reasoning");
    expect(result.reasoning).toHaveProperty("periodStart");
    expect(result.reasoning).toHaveProperty("periodEnd");
    expect(result.reasoning.periodStart).toBe(
      expectedPeriodStartDate.toISOString(),
    );
    expect(result.reasoning.periodEnd).toBe(
      expectedPeriodEndDate.toISOString(),
    );
  });
});
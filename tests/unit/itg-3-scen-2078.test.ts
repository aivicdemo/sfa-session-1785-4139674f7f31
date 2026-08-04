import { generateRecommendation } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  test("SCEN-2078: 標準プロセスが定義されていない場合、デフォルトの標準プロセスで照合される", () => {
    // 顧客情報（業種：IT、企業規模：中堅、課題：DX推進）と商談パターン（初回接触、予算未決定）
    const inputData = {
      customerId: "CUST-20240115-001",
      industry: "IT",
      companySize: "mid_market",
      businessChallenge: "DX推進",
      dealStage: "initial_contact",
      budgetStatus: "undecided",
    };

    // AIRecommendationEngine のスタブ
    // 標準プロセスが定義されていない状態で、推奨パターンマスタから統計的に上位の成功パターンを返却
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockReturnValue({
        recommendationPattern: "DX_STANDARD_APPROACH",
        appliedProcessType: "DEFAULT",
        proposalApproach:
          "過去成功事例に基づいたDX推進案件向けの標準提案アプローチ",
        reasoningText: "過去成功事例に基づいた推奨",
        confidenceScore: 0.75,
        baseData: {
          successExampleCount: 12,
          similarCustomerMatchRate: 0.82,
        },
      }),
    };

    // generateRecommendation() を呼び出し、標準プロセスが定義されていない状態での推奨生成を実行
    const result = generateRecommendation(inputData, mockAIRecommendationEngine);

    // 返却された推奨内容に、デフォルト標準プロセス（推奨パターンマスタの最上位パターン）が適用されていることを確認
    expect(result.appliedProcessType).toBe("DEFAULT");

    // 推奨パターンが DX 案件向けの標準提案アプローチであることを確認
    expect(result.recommendationPattern).toBe("DX_STANDARD_APPROACH");

    // 推奨内容の根拠説明が簡略版（「過去成功事例に基づいた推奨」など）で返却されていることを確認
    expect(result.reasoningText).toBe("過去成功事例に基づいた推奨");

    // 提案アプローチが含まれていることを確認
    expect(result.proposalApproach).toContain("DX推進案件向けの標準提案アプローチ");

    // 推奨結果オブジェクトの以下のフィールドが正しく設定されていることをアサート
    // confidenceScore: 0.65以上
    expect(result.confidenceScore).toBeGreaterThanOrEqual(0.65);
    expect(result.confidenceScore).toBe(0.75);

    // 根拠データが含まれていることを確認
    expect(result.baseData).toBeDefined();
    expect(result.baseData.successExampleCount).toBeGreaterThan(0);
    expect(result.baseData.similarCustomerMatchRate).toBeGreaterThan(0);

    // AIRecommendationEngine のスタブが呼び出されたことを確認
    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(
      inputData
    );
  });
});
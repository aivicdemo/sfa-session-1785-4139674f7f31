import { generateExecutivePersuasionMaterial } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能 - 経営層向け説得資料生成", () => {
  test("SCEN-2030: 投資対効果計算で分母が0のとき、計算エラーが検出され代替文言が表示される", () => {
    // Arrange: AIRecommendationEngineのスタブを設定
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposalId: "PROP-20240115-001",
        customerName: "ABC Corporation",
        proposalContent: "クラウドERP導入",
        estimatedBenefit: 5000000, // 年間便益: 500万円
        investmentAmount: 0, // 投資額: 0円（分母エラーケース）
        implementationPeriod: "3ヶ月",
        riskFactors: ["既存システム連携リスク", "ユーザー習熟期間"],
        successFactors: [
          "段階的導入により現業への影響を最小化",
          "専任サポート体制による習熟促進",
        ],
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          caseId: "CASE-2023-087",
          similarity: 0.92,
          result: "成功",
          roi: 2.5,
        },
        {
          caseId: "CASE-2023-045",
          similarity: 0.85,
          result: "成功",
          roi: 1.8,
        },
      ]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(
        "ABC Corporationは製造業で従業員規模500名程度。既存システムの老朽化による業務効率低下が主要課題。" +
          "過去の同業他社導入事例では平均ROI2.5倍を達成。当社の規模・業種での成功パターンに合致している。"
      ),
    };

    const customerData = {
      customerId: "CUST-001",
      customerName: "ABC Corporation",
      industry: "製造業",
      employeeCount: 500,
      annualRevenue: 2000000000,
      currentSystemAge: 15,
      businessChallenge: "既存システムの老朽化による業務効率低下",
    };

    const proposalData = {
      proposalId: "PROP-20240115-001",
      productService: "クラウドERP導入",
      estimatedBenefit: 5000000,
      investmentAmount: 0, // 分母が0のエッジケース
      implementationPeriod: "3ヶ月",
      constraints: {
        budgetLimit: 10000000,
        scheduleDeadline: "2024-04-30",
        technicalConstraints: ["既存システム連携必須"],
      },
    };

    // Act: 経営層向け説得資料の生成を実行
    const result = generateExecutivePersuasionMaterial(
      customerData,
      proposalData,
      mockAIEngine
    );

    // Assert: 投資対効果計算エラーが検出され、代替文言が表示されることを検証
    expect(result).toBeDefined();
    expect(result.status).toBe("completed_with_warnings");
    expect(result.material).toBeDefined();

    // ROI計算が分母0で失敗したことを確認
    const roiSection = result.material.sections.find(
      (s: { title: string }) => s.title.includes("投資対効果")
    );
    expect(roiSection).toBeDefined();
    expect(roiSection.content).toContain("投資額が不明なため投資対効果は計算できません");

    // エラー検出の警告が含まれることを確認
    expect(result.warnings).toBeDefined();
    expect(result.warnings.length).toBeGreaterThan(0);
    const investmentWarning = result.warnings.find((w: { field: string }) =>
      w.field.includes("投資額")
    );
    expect(investmentWarning).toBeDefined();
    expect(investmentWarning.message).toMatch(/投資条件の確認が必要|投資額が不明/);
    expect(investmentWarning.severity).toBe("high");

    // エラーがログに記録されたことを確認
    expect(result.errorLog).toBeDefined();
    expect(result.errorLog.length).toBeGreaterThan(0);
    const roiError = result.errorLog.find((e: { errorType: string }) =>
      e.errorType.includes("ROI_CALCULATION")
    );
    expect(roiError).toBeDefined();
    expect(roiError.cause).toMatch(/分母.*0|投資額.*0/);

    // 代替文言が経営層向けの理解可能な形式で生成されたことを確認
    expect(result.material.sections).toBeDefined();
    const recommendationSection = result.material.sections.find(
      (s: { title: string }) => s.title.includes("推奨")
    );
    expect(recommendationSection).toBeDefined();
    expect(recommendationSection.content).toBeTruthy();

    // 営業担当者向けの確認が必要という表示があることを確認
    expect(result.material.highlightedFields).toBeDefined();
    expect(result.material.highlightedFields).toContain("investment_amount");

    // 警告内容の詳細を確認
    expect(investmentWarning.recommendedAction).toBe("投資額の詳細確認が必要です");
  });
});
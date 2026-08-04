import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("推奨内容生成機能 - 顧客・商談条件に基づいた推奨提案アプローチの自動生成", () => {
  // SCEN-036
  test("顧客情報と商談条件を入力後、AIエージェントが推奨提案アプローチを正常に生成する", async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: {
          proposalStrategy: "クラウド移行ニーズへの段階的提案戦略",
          actionSteps: [
            {
              step: 1,
              action: "初期ヒアリング：IT基盤現状把握と課題抽出",
              timing: "導入予定時期の4週間前",
            },
            {
              step: 2,
              action: "PoC提案：クラウド移行シミュレーション実施",
              timing: "導入予定時期の2週間前",
            },
            {
              step: 3,
              action: "本導入提案：予算500万円での最適構成提示",
              timing: "導入予定時期の1週間前",
            },
          ],
        },
        rationale: {
          similarPatterns: [
            {
              patternId: "SUCCESS_PATTERN_001",
              description: "500名規模IT企業のクラウド移行成功事例",
              matchScore: 0.92,
              adoptedApproach: "段階的PoC+本導入提案モデル",
              result: "契約成立・3ヶ月内導入実現",
            },
            {
              patternId: "SUCCESS_PATTERN_002",
              description: "予算500万円帯でのクラウドソリューション成功事例",
              matchScore: 0.88,
              adoptedApproach: "初期ヒアリング重視の提案",
              result: "契約成立・予算内実装達成",
            },
            {
              patternId: "SUCCESS_PATTERN_003",
              description: "3ヶ月以内導入を実現した事例",
              matchScore: 0.85,
              adoptedApproach: "タイムライン管理型提案",
              result: "予定通り導入完了",
            },
          ],
          explanationForSales:
            "貴社の顧客はIT企業で500名規模、予算制約が500万円、導入期限が3ヶ月と限定的です。過去の類似案件3件では、段階的なヒアリング→PoC→本提案というアプローチが成功しており、顧客の意思決定プロセスを理解させながら提案を進めることが重要です。特に初期ヒアリングで現状課題を深掘りすることで、後続のPoC提案の精度が大幅に向上します。",
        },
        salesMeasures: {
          initialContact: "オンライン会議での技術責任者向けヒアリング（60分）",
          proposalFocusPoints: [
            "クラウド移行による運用効率化（ROI試算を含める）",
            "セキュリティ・コンプライアンス対応の詳細説明",
            "導入スケジュールと実装リスク軽減策",
          ],
        },
        generationTimestamp: "2026-08-15T14:30:00Z",
        generationDurationMs: 2800,
      }),
    };

    const customerCondition = {
      industry: "IT",
      companySize: 500,
      budget: 5000000,
      implementationDueDate: "2026-11-15",
      interestAreas: ["クラウド移行"],
    };

    const dealCondition = {
      expectedClosingDate: "2026-11-15",
      decisionMakersCount: 3,
      competitionRisk: "high",
    };

    const result = await generateRecommendation(customerCondition, dealCondition, mockAIEngine);

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        industry: "IT",
        companySize: 500,
        budget: 5000000,
        implementationDueDate: "2026-11-15",
        interestAreas: ["クラウド移行"],
      }),
      expect.objectContaining({
        expectedClosingDate: "2026-11-15",
        decisionMakersCount: 3,
        competitionRisk: "high",
      })
    );

    expect(result.recommendedApproach.actionSteps).toHaveLength(3);
    expect(result.recommendedApproach.actionSteps[0].step).toBe(1);
    expect(result.recommendedApproach.actionSteps[1].step).toBe(2);
    expect(result.recommendedApproach.actionSteps[2].step).toBe(3);

    expect(result.rationale.similarPatterns).toHaveLength(3);
    expect(result.rationale.similarPatterns[0].matchScore).toBeGreaterThanOrEqual(0.85);
    expect(result.rationale.similarPatterns[1].matchScore).toBeGreaterThanOrEqual(0.85);
    expect(result.rationale.similarPatterns[2].matchScore).toBeGreaterThanOrEqual(0.85);

    expect(result.rationale.explanationForSales).toMatch(/顧客/);
    expect(result.rationale.explanationForSales).toMatch(/500名/);
    expect(result.rationale.explanationForSales).toMatch(/500万円/);
    expect(result.rationale.explanationForSales).toMatch(/3ヶ月/);

    expect(result.salesMeasures.initialContact).toBeDefined();
    expect(result.salesMeasures.proposalFocusPoints).toHaveLength(3);

    const generationDurationSeconds = result.generationDurationMs / 1000;
    expect(generationDurationSeconds).toBeLessThanOrEqual(30);

    expect(result.recommendedApproach.proposalStrategy).toMatch(/クラウド移行/);
    expect(result.rationale.similarPatterns.every((p) => p.matchScore >= 0.85)).toBe(true);
  });
});
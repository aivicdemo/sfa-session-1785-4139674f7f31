import { findSimilarPatterns } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1920
  test("推奨根拠の可視化機能 - 根拠データの同値が並ぶときに全件が返却される", () => {
    const dealCondition = {
      customerIndustry: "製造業",
      productCategory: "生産管理システム",
      budgetRange: "500万～1000万円",
      dealStage: "初期提案",
    };

    const mockSuccessPatternA = {
      patternId: "pattern-001",
      customerIndustry: "製造業",
      productCategory: "生産管理システム",
      budgetRange: "500万～1000万円",
      closingReason: "経営効率化",
      proposalContent: "工程短縮による原価削減",
      relevanceScore: 0.85,
      rationale: {
        customerAttribute: "従業員300～500人規模",
        closingFactor: "ROI実績",
        proposalStrategy: "段階導入アプローチ",
      },
    };

    const mockSuccessPatternB = {
      patternId: "pattern-002",
      customerIndustry: "製造業",
      productCategory: "生産管理システム",
      budgetRange: "500万～1000万円",
      closingReason: "品質向上",
      proposalContent: "不良率低減による品質改善",
      relevanceScore: 0.85,
      rationale: {
        customerAttribute: "従業員250～400人規模",
        closingFactor: "品質実績",
        proposalStrategy: "品質保証重視",
      },
    };

    const mockSuccessPatternC = {
      patternId: "pattern-003",
      customerIndustry: "製造業",
      productCategory: "生産管理システム",
      budgetRange: "500万～1000万円",
      closingReason: "運用効率化",
      proposalContent: "帳票作成自動化",
      relevanceScore: 0.85,
      rationale: {
        customerAttribute: "従業員400～600人規模",
        closingFactor: "運用時間削減実績",
        proposalStrategy: "自動化重視",
      },
    };

    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        mockSuccessPatternA,
        mockSuccessPatternB,
        mockSuccessPatternC,
      ]),
    };

    return findSimilarPatterns(dealCondition, mockAIEngine).then((result) => {
      expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(
        dealCondition
      );
      expect(result).toHaveLength(3);

      const relevanceScores = result.map((pattern) => pattern.relevanceScore);
      expect(relevanceScores).toEqual([0.85, 0.85, 0.85]);

      const patternIds = result.map((pattern) => pattern.patternId);
      expect(patternIds).toEqual(["pattern-001", "pattern-002", "pattern-003"]);

      result.forEach((pattern) => {
        expect(pattern).toHaveProperty("rationale");
        expect(pattern.rationale).toHaveProperty("customerAttribute");
        expect(pattern.rationale).toHaveProperty("closingFactor");
        expect(pattern.rationale).toHaveProperty("proposalStrategy");
        expect(pattern.rationale.customerAttribute).toBeTruthy();
        expect(pattern.rationale.closingFactor).toBeTruthy();
        expect(pattern.rationale.proposalStrategy).toBeTruthy();
      });

      expect(result[0]).toEqual(mockSuccessPatternA);
      expect(result[1]).toEqual(mockSuccessPatternB);
      expect(result[2]).toEqual(mockSuccessPatternC);
    });
  });
});
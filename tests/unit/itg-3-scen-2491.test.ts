import { findSimilarPatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("過去商談の類似案件検索機能", () => {
  // SCEN-2491
  test("現在の商談条件に類似した過去成功事例が1件検索される", () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          pastProjectId: "PAST-001",
          customerName: "ABC製造株式会社",
          industry: "製造業",
          dealAmount: 5000000,
          amountRangeMin: 4500000,
          amountRangeMax: 5500000,
          challengeArea: "業務効率化",
          proposalContent: "生産管理システム導入支援",
          successFlag: true,
          matchScore: 0.87,
          contractedDate: "2024-01-15T09:30:00Z",
          salesRepName: "営業太郎",
          contractValue: 5200000,
          implementationStatus: "完了",
          customerSatisfactionScore: 4.5,
        },
      ]),
    };

    const currentDealCondition = {
      industry: "製造業",
      dealAmount: 5000000,
      challengeArea: "業務効率化",
    };

    const result = findSimilarPatterns(currentDealCondition, mockAIEngine);

    expect(result).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          pastProjectId: "PAST-001",
          customerName: "ABC製造株式会社",
          industry: "製造業",
          dealAmount: 5000000,
          amountRangeMin: 4500000,
          amountRangeMax: 5500000,
          challengeArea: "業務効率化",
          proposalContent: "生産管理システム導入支援",
          successFlag: true,
          matchScore: expect.any(Number),
          contractedDate: "2024-01-15T09:30:00Z",
        })
      ])
    );

    return result.then((searchResults) => {
      expect(searchResults).toHaveLength(1);
      expect(searchResults[0].matchScore).toBeGreaterThanOrEqual(0.85);
      expect(searchResults[0].successFlag).toBe(true);
      expect(searchResults[0].industry).toBe("製造業");
      expect(searchResults[0].dealAmount).toBe(5000000);
      expect(searchResults[0].amountRangeMin).toBe(4500000);
      expect(searchResults[0].amountRangeMax).toBe(5500000);
      expect(searchResults[0].challengeArea).toBe("業務効率化");
      expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(
        currentDealCondition
      );
    });
  });
});
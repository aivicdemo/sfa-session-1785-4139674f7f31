import { findSimilarPatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("過去商談データから成功パターンを抽出し新規案件に提案アプローチを推奨", () => {
  // SCEN-1820
  test("類似パターン検索機能 - 現在の商談条件に類似した過去成功事例が複数件検索される", async () => {
    const dealCondition = {
      industry: "製造業",
      customerScale: "中堅企業",
      challenge: "デジタル化推進",
      budgetAmount: 50000000,
    };

    const mockSimilarPatterns = [
      {
        caseId: "case_001",
        industry: "製造業",
        customerScale: "中堅企業",
        proposalContent: "デジタル化推進支援パッケージ",
        contractDays: 45,
        similarityScore: 0.92,
      },
      {
        caseId: "case_002",
        industry: "製造業",
        customerScale: "中堅企業",
        proposalContent: "DX導入コンサルティング",
        contractDays: 52,
        similarityScore: 0.88,
      },
      {
        caseId: "case_003",
        industry: "製造業",
        customerScale: "中堅企業",
        proposalContent: "業務プロセス改革支援",
        contractDays: 38,
        similarityScore: 0.85,
      },
    ];

    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue(mockSimilarPatterns),
    };

    const result = await findSimilarPatterns(dealCondition, mockAIEngine);

    expect(result).toHaveLength(3);
    expect(result[0].similarityScore).toBe(0.92);
    expect(result[0].caseId).toBe("case_001");
    expect(result[0].contractDays).toBe(45);
    expect(result[1].similarityScore).toBe(0.88);
    expect(result[1].caseId).toBe("case_002");
    expect(result[1].contractDays).toBe(52);
    expect(result[2].similarityScore).toBe(0.85);
    expect(result[2].caseId).toBe("case_003");
    expect(result[2].contractDays).toBe(38);

    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(dealCondition);

    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].similarityScore).toBeGreaterThanOrEqual(
        result[i + 1].similarityScore
      );
    }
  });
});
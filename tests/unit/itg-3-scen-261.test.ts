import { findSimilarPatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出・マッチング機能", () => {
  // SCEN-261
  test("過去商談データから成功パターンが0件のとき、内部推奨パターンマスタから統計的上位パターンが返却される", async () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const input = {
      customerIndustry: "IT",
      dealAmount: 8000,
      customerSize: "large",
      dealStage: "proposal",
    };

    const result = await findSimilarPatterns(
      input,
      mockAIRecommendationEngine,
      mockFileStorageAdapter
    );

    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      input
    );

    expect(result).toHaveLength(3);

    expect(result[0]).toEqual({
      patternId: "PM-001",
      patternName: "大規模SIer向け長期提案型",
      applicableConditions: "案件規模>5000万円",
      successRateScore: 0.87,
      description: "大規模SIer向けの長期提案アプローチ",
    });

    expect(result[1]).toEqual({
      patternId: "PM-002",
      patternName: "金融機関向け規制対応型",
      applicableConditions: "業種=金融・規制対応必須",
      successRateScore: 0.84,
      description: "金融機関向けの規制対応提案アプローチ",
    });

    expect(result[2]).toEqual({
      patternId: "PM-003",
      patternName: "製造業向けDX推進型",
      applicableConditions: "業種=製造・DX課題あり",
      successRateScore: 0.81,
      description: "製造業向けのDX推進提案アプローチ",
    });

    expect(result[0].successRateScore).toBeGreaterThan(
      result[1].successRateScore
    );
    expect(result[1].successRateScore).toBeGreaterThan(
      result[2].successRateScore
    );
  });
});
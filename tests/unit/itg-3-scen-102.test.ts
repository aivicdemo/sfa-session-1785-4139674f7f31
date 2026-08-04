import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("AIエージェント推奨支援システム - 商談条件バリデーション", () => {
  test("SCEN-102: 新規案件の商談条件が空のとき推論実行が拒否される", () => {
    const newDealData = {
      customerName: "テスト顧客",
      industry: "IT",
      dealConditions: "",
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
    };

    expect(() =>
      generateRecommendation(newDealData, mockAIEngine)
    ).toThrow(/商談条件/);

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});
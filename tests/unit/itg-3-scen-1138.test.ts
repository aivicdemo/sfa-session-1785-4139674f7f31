import { findSimilarPatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("商談条件マッチング機能", () => {
  test("SCEN-1138: 顧客の契約金額が0円のとき、金額ベースの照合ルールをスキップする", () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          dealId: "DEAL-2023-001",
          customerId: "CUST-REF-001",
          industry: "金融",
          productCategory: "システム開発",
          contractAmount: 5000000,
          matchScore: 0.92,
          successIndicators: ["要件定義完了", "予算承認取得", "導入スケジュール確定"],
        },
        {
          dealId: "DEAL-2023-015",
          customerId: "CUST-REF-015",
          industry: "金融",
          productCategory: "システム開発",
          contractAmount: 3000000,
          matchScore: 0.85,
          successIndicators: ["PoC実施", "経営層承認", "導入計画書完成"],
        },
      ]),
    };

    const input = {
      customerId: "CUST001",
      contractAmount: 0,
      productCategory: "システム開発",
      industry: "金融",
    };

    const result = findSimilarPatterns(input, mockAIEngine);

    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: "CUST001",
        productCategory: "システム開発",
        industry: "金融",
      })
    );

    const callArgs = mockAIEngine.findSimilarPatterns.mock.calls[0][0];
    expect(callArgs.contractAmount).toBeUndefined();
    expect(callArgs.contractAmountMin).toBeUndefined();
    expect(callArgs.contractAmountMax).toBeUndefined();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);
    expect(result[0]).toMatchObject({
      dealId: "DEAL-2023-001",
      industry: "金融",
      productCategory: "システム開発",
    });
    expect(result[1]).toMatchObject({
      dealId: "DEAL-2023-015",
      industry: "金融",
      productCategory: "システム開発",
    });
  });
});
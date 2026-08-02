import { getRecommendationBasisDetail } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-687
  test("推奨内容根拠の可視化機能 - 推奨アプローチの対象顧客が変更後状態のとき、その顧客データが正しく取得される", () => {
    const customerId = "CUST-20240115-001";
    const customerName = "テスト顧客A";
    const customerStatus = "変更後";

    const recommendationApproachId = "APP-20240115-001";
    const recommendationBasisId = "BASIS-20240115-001";

    const inputData = {
      recommendationApproachId: recommendationApproachId,
      customerId: customerId,
    };

    const mockCustomerData = {
      customerId: customerId,
      customerName: customerName,
      status: customerStatus,
    };

    const result = getRecommendationBasisDetail(inputData);

    expect(result).toEqual(
      expect.objectContaining({
        recommendationApproachId: recommendationApproachId,
        customerData: expect.objectContaining({
          customerId: customerId,
          customerName: customerName,
          status: customerStatus,
        }),
      })
    );

    expect(result.customerData.customerId).toBe(customerId);
    expect(result.customerData.customerName).toBe(customerName);
    expect(result.customerData.status).toBe(customerStatus);
  });
});
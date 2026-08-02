import { validateProposal } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-956
  test("提案内容検証機能 - 同じ提案内容で2回検証を実行しても同じ結果が返される", () => {
    const proposalData = {
      customerId: "CUST_A_001",
      customerName: "A社",
      proposalAmount: 5000000,
      proposalDeadline: "2024-12-31",
      proposalItems: [
        {
          productId: "PROD_001",
          productName: "コンサルティングサービス",
          quantity: 1,
          unitPrice: 5000000,
        },
      ],
    };

    const firstValidationResult = validateProposal(proposalData);
    const secondValidationResult = validateProposal(proposalData);

    expect(firstValidationResult.validationId).toBe(
      secondValidationResult.validationId
    );
    expect(firstValidationResult.status).toBe(secondValidationResult.status);
    expect(firstValidationResult.errorMessages).toEqual(
      secondValidationResult.errorMessages
    );
    expect(firstValidationResult.errorMessages.length).toBe(
      secondValidationResult.errorMessages.length
    );

    if (firstValidationResult.errorMessages.length > 0) {
      firstValidationResult.errorMessages.forEach((error, index) => {
        expect(error).toBe(secondValidationResult.errorMessages[index]);
      });
    }
  });
});
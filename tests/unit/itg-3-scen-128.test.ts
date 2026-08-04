import { validateLearningDataVolume } from "../../src/logic/it-1-br-3-3-2-1";

describe("過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能", () => {
  // SCEN-128
  test("学習データが最小要件直上の件数で検証が許可される", () => {
    const MINIMUM_LEARNING_DATA_VOLUME = 100;
    const learningDataset = Array.from({ length: MINIMUM_LEARNING_DATA_VOLUME }, (_, index) => ({
      dealId: `deal_${index + 1}`,
      customerId: `customer_${index + 1}`,
      industry: "IT",
      dealAmount: 500000 + index * 10000,
      status: "closed_won",
      approachMethod: "direct_proposal",
      closureDate: "2024-01-15T00:00:00Z",
    }));

    const validationResult = validateLearningDataVolume(learningDataset);

    expect(validationResult.isValid).toBe(true);
    expect(validationResult.status).toBe("VALID");
    expect(validationResult.errorMessage).toBe("");
    expect(validationResult.canProceedToGeneration).toBe(true);
  });
});
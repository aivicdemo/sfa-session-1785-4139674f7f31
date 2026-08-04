import { findSimilarPatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能", () => {
  // SCEN-2145
  test("類似パターン検索とランク付け - 過去成功事例のデータセットが null のとき、エラーが発生する", () => {
    const currentDealCondition = {
      industry: "IT",
      dealSize: "10000000",
      decisionMakerCount: 3,
    };

    const nullSuccessCaseDataset = null;

    expect(() =>
      findSimilarPatterns(currentDealCondition, nullSuccessCaseDataset)
    ).toThrow(/過去成功事例データセット/);

    try {
      findSimilarPatterns(currentDealCondition, nullSuccessCaseDataset);
    } catch (error: unknown) {
      if (error instanceof Error && "code" in error) {
        expect((error as Error & { code: string }).code).toBe(
          "INVALID_DATASET_STATE"
        );
      }
      expect(error).toBeInstanceOf(Error);
    }
  });
});
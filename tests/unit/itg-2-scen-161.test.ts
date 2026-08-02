import { detectDuplicateAndJudgeIntegration } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  test("SCEN-161: 重複候補のレコードペアが逆順で検査されるとき、元の順序での判定結果と同じ結果が返される", () => {
    const customerDataA = {
      customerId: "CUST001",
      customerName: "株式会社テスト",
      customerNameKana: "カブシキガイシャテスト",
      postalCode: "100-0001",
      prefecture: "東京都",
      city: "千代田区",
      address: "丸の内1-1-1",
      phoneNumber: "03-1234-5678",
      email: "test@example.com",
      foundedYear: 2010,
      employeeCount: 50,
      capitalAmount: 10000000,
      industryCode: "6420",
      businessDescription: "ソフトウェア開発",
      lastContactDate: "2024-01-15",
      contactFrequency: 5,
      purchaseHistory: 3,
      totalPurchaseAmount: 500000,
      dataQualityScore: 0.95,
      lastUpdateDate: "2024-01-10",
    };

    const customerDataB = {
      customerId: "CUST002",
      customerName: "テスト株式会社",
      customerNameKana: "テストカブシキガイシャ",
      postalCode: "100-0001",
      prefecture: "東京都",
      city: "千代田区",
      address: "丸の内1-1-1",
      phoneNumber: "03-1234-5678",
      email: "info@test.com",
      foundedYear: 2010,
      employeeCount: 50,
      capitalAmount: 10000000,
      industryCode: "6420",
      businessDescription: "ソフトウェア開発",
      lastContactDate: "2024-01-20",
      contactFrequency: 6,
      purchaseHistory: 4,
      totalPurchaseAmount: 600000,
      dataQualityScore: 0.93,
      lastUpdateDate: "2024-01-18",
    };

    // 正順（A→B）で重複検出・統合判定を実行
    const resultOrdered = detectDuplicateAndJudgeIntegration(
      customerDataA,
      customerDataB
    );

    // 逆順（B→A）で重複検出・統合判定を実行
    const resultReversed = detectDuplicateAndJudgeIntegration(
      customerDataB,
      customerDataA
    );

    // 重複判定フラグが同じ値であることを検証
    expect(resultOrdered.isDuplicate).toBe(resultReversed.isDuplicate);

    // マッチスコアが同じ数値であることを検証
    expect(resultOrdered.matchScore).toBe(resultReversed.matchScore);

    // 推奨アクション（統合/統合しない）が同じ値であることを検証
    expect(resultOrdered.recommendedAction).toBe(
      resultReversed.recommendedAction
    );

    // 判定結果オブジェクト全体の同値性を検証
    expect(resultOrdered).toEqual(resultReversed);
  });
});
import { calculateNeedsAlignment } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  test("SCEN-715: 提案資料と顧客ニーズの適合度スコア化機能 - 顧客課題が空のとき、課題適合スコア計算が適切に処理される", () => {
    const proposalDocument = {
      title: "営業ソリューション提案",
      content: "当社ソリューションにより業務効率化を実現します",
      targetIndustry: "製造業",
      targetCompanySize: "中堅企業",
      estimatedBudget: 5000000,
    };

    const customerNeeds = {
      customerId: "CUST-001",
      businessChallenge: "",
      industry: "製造業",
      companySize: "中堅企業",
      budget: 5000000,
    };

    const errorLogs: string[] = [];
    const originalError = console.error;
    console.error = (message: string) => {
      errorLogs.push(message);
    };

    const result = calculateNeedsAlignment(proposalDocument, customerNeeds);

    console.error = originalError;

    expect(result).toBe(0);
    expect(errorLogs).toContain("顧客課題が未入力のため課題適合スコアをスキップ");
  });
});
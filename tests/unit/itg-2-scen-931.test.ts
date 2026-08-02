import { validateProposal } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-931
  test("提案内容検証機能 - 必須項目がすべて入力され形式が正しいとき検証が成功する", () => {
    const proposalData = {
      title: "システム構築提案",
      customerName: "株式会社テスト",
      amount: 1500000,
      proposalDate: "2024-01-15",
      description: "当社のシステム構築サービスにより、貴社の業務効率化を実現します。最新のクラウド技術を活用した堅牢で拡張性の高いシステムをご提供いたします。実装期間は3ヶ月、運用サポートは24ヶ月間となります。ご検討よろしくお願いいたします。",
    };

    const result = validateProposal(proposalData);

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.status).toBe("valid");
  });
});
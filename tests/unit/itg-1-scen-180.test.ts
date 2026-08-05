import { convertProcessRequirementsToSystemSpecs } from "../../src/logic/it-1";

describe("営業プロセス実行状況の監査ダッシュボード", () => {
  // SCEN-180
  test("判定基準の定義が空配列のとき、入力値不正エラーが発生する", () => {
    const input = {
      processName: "営業提案プロセス",
      version: "1.0",
      description: "標準的な営業提案フロー",
      criteria: [],
      dataItems: [
        {
          name: "顧客名",
          type: "string",
          required: true,
        },
      ],
    };

    expect(() => convertProcessRequirementsToSystemSpecs(input)).toThrow(
      /判定基準/
    );
  });
});
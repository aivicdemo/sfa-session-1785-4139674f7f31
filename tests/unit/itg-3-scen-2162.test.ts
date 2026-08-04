import { generateDownloadUrl } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-2162
  test("推奨レポートIDが空文字列のとき、エラーが発生する", () => {
    const emptyReportId = "";

    expect(() => {
      generateDownloadUrl(emptyReportId);
    }).toThrow(/INVALID_REPORT_ID|Report ID cannot be empty/);
  });
});
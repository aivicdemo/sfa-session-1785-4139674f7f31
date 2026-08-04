import { uploadRecommendationReport } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-588
  test("レポートファイル生成・保存機能 - FileStorageAdapter.uploadRecommendationReportの呼び出しが失敗するときHTML形式の代替表示が返される", async () => {
    const mockRecommendationContent = {
      recommendationPatternName: "新規顧客への初期接触戦略",
      recommendationScore: 85,
      similarityDegree: 0.92,
      briefReasoningExplanation: "過去事例から抽出された成功パターンに基づく",
      relatedSuccessCases: [
        {
          caseId: "CASE-001",
          customerIndustry: "製造業",
          dealAmount: 5000000,
          successFactors: ["営業資料のカスタマイズ", "経営層への直接提案"],
        },
        {
          caseId: "CASE-002",
          customerIndustry: "卸売業",
          dealAmount: 3500000,
          successFactors: ["導入スケジュール早期合意", "予算上限の事前確認"],
        },
      ],
    };

    let callCount = 0;
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(async () => {
        callCount++;
        if (callCount === 1 || callCount === 2) {
          throw new Error("AccessDenied");
        }
        throw new Error("NetworkTimeout");
      }),
    };

    const result = await uploadRecommendationReport(
      mockRecommendationContent,
      mockFileStorageAdapter
    );

    expect(result).toHaveProperty("format", "html");
    expect(result).toHaveProperty("content");

    const htmlContent = result.content;

    expect(htmlContent).toContain("新規顧客への初期接触戦略");
    expect(htmlContent).toContain("85");
    expect(htmlContent).toContain("0.92");

    expect(htmlContent).toContain(
      "過去事例から抽出された成功パターンに基づく"
    );

    expect(htmlContent).toContain("CASE-001");
    expect(htmlContent).toContain("製造業");
    expect(htmlContent).toContain("5000000");
    expect(htmlContent).toContain("営業資料のカスタマイズ");
    expect(htmlContent).toContain("経営層への直接提案");

    expect(htmlContent).toContain("CASE-002");
    expect(htmlContent).toContain("卸売業");
    expect(htmlContent).toContain("3500000");
    expect(htmlContent).toContain("導入スケジュール早期合意");
    expect(htmlContent).toContain("予算上限の事前確認");

    expect(htmlContent).toContain("<!DOCTYPE html>");
    expect(htmlContent).toContain("</html>");

    expect(result).toHaveProperty("userMessage");
    expect(result.userMessage).toMatch(
      /レポート生成に失敗しました。画面上で推奨内容を確認するか、後ほど再度お試しください/
    );

    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(
      3
    );
  });
});
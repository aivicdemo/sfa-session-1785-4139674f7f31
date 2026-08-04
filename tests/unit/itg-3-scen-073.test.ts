import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { generateRecommendationReport } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能 - レポート生成", () => {
  let aiRecommendationEngineStub: any;
  let fileStorageAdapterStub: any;

  beforeEach(() => {
    aiRecommendationEngineStub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendations: [],
        reasoning: "顧客業種・規模の条件では一致する成功パターンが見つかりませんでした。",
        confidenceScore: 0,
      }),
    };

    fileStorageAdapterStub = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        fileId: "report-2024-01-15-001",
        uploadedAt: "2024-01-15T11:00:00Z",
      }),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-073
  test("推奨レポート生成機能 - レポート内容が0件の推奨を含む場合に正常に生成される", async () => {
    const testCaseInput = {
      customerId: "CUST-2024-001",
      customerName: "テスト顧客A社",
      industry: "IT",
      companySize: "middle",
      dealConditions: {
        dealId: "DEAL-2024-001",
        dealAmount: 5000000,
        dealStage: "proposal",
        dealDescription: "新規顧客初回提案",
      },
      generatedAt: "2024-01-15T11:00:00Z",
    };

    const result = await generateRecommendationReport(
      testCaseInput,
      aiRecommendationEngineStub,
      fileStorageAdapterStub
    );

    expect(result).not.toBeNull();
    expect(result).not.toBeUndefined();

    expect(result.recommendations).toEqual([]);

    expect(result.header).toBeDefined();
    expect(result.header.title).toBe("AI推奨レポート");
    expect(result.header.generatedAt).toBe("2024-01-15T11:00:00Z");
    expect(result.header.dealId).toBe("DEAL-2024-001");
    expect(result.header.customerId).toBe("CUST-2024-001");

    expect(result.status).toBe("SUCCESS");

    expect(fileStorageAdapterStub.uploadRecommendationReport).toHaveBeenCalledTimes(1);

    const uploadedReport =
      fileStorageAdapterStub.uploadRecommendationReport.mock.calls[0][0];
    expect(uploadedReport.recommendations).toEqual([]);
    expect(uploadedReport.status).toBe("SUCCESS");
    expect(uploadedReport.header.dealId).toBe("DEAL-2024-001");
  });
});
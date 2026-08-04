import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { uploadRecommendationReport } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能 - レポート生成・出力", () => {
  let mockAIEngine: any;
  let mockFileStorage: any;

  beforeEach(() => {
    mockAIEngine = {
      generateRecommendation: jest.fn(),
    };

    mockFileStorage = {
      uploadRecommendationReport: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1700
  test("推奨内容がnullの場合、エラーをスローする", () => {
    const inputData = {
      customerId: "CUST-001",
      dealId: "DEAL-2024-001",
      dealConditions: {
        industry: "IT",
        companySize: 500,
        budget: 5000000,
      },
    };

    mockAIEngine.generateRecommendation.mockReturnValue(null);

    expect(() => {
      uploadRecommendationReport(
        inputData,
        mockAIEngine,
        mockFileStorage
      );
    }).toThrow(/推奨内容がnull/);

    expect(mockFileStorage.uploadRecommendationReport).not.toHaveBeenCalled();
  });
});
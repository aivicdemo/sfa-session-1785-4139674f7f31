import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { generateRecommendationReportWithFallback } from "../../src/logic/it-1-br-3-2-1-1";

const fetchMock = require("jest-fetch-mock");

describe("AIエージェント推奨内容の根拠表示機能", () => {
  beforeEach(() => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.disableMocks();
  });

  // SCEN-2348
  test("推奨内容のレポート生成・保存機能 - S3アップロード失敗時にHTML形式で画面表示用コンテンツが返却される", async () => {
    const recommendationRequest = {
      customerId: "CUST-00001",
      customerName: "テスト顧客株式会社",
      industry: "製造業",
      employeeCount: 500,
      dealStatus: "初期接触",
      dealAmount: 5000000,
      dealCondition: "予算上限500万円、導入期間3ヶ月以内",
    };

    const aiEngineStub = {
      generateRecommendation: jest
        .fn()
        .mockResolvedValue({
          proposalApproach:
            "クラウドベースの業務効率化ソリューションの提案",
          targetCustomerProfile:
            "従業員500名程度の製造業企業、初期接触段階",
          successPatterns: [
            {
              patternId: "PAT-001",
              description: "製造業向けDX推進案件での成功事例",
              matchingScore: 0.92,
              pastDealSummary:
                "同規模顧客での導入実績、ROI150%達成",
            },
          ],
          recommendedActions: [
            "経営層との初期打ち合わせ設定",
            "業務プロセスのヒアリング実施",
          ],
          confidenceScore: 87,
        })
        .mockName("generateRecommendation"),
    };

    const fileStorageAdapterStub = {
      uploadRecommendationReport: jest
        .fn()
        .mockRejectedValueOnce(new Error("Network error"))
        .mockRejectedValueOnce(new Error("Authentication failed")),
    };

    const result = await generateRecommendationReportWithFallback(
      recommendationRequest,
      aiEngineStub,
      fileStorageAdapterStub
    );

    expect(aiEngineStub.generateRecommendation).toHaveBeenCalledWith(
      recommendationRequest
    );
    expect(fileStorageAdapterStub.uploadRecommendationReport).toHaveBeenCalledTimes(
      2
    );

    expect(result).toBeDefined();
    expect(typeof result).toBe("string");
    expect(result).toMatch(/<html>/i);
    expect(result).toMatch(/<body>/i);
    expect(result).toMatch(/テスト顧客株式会社/);
    expect(result).toMatch(/クラウドベースの業務効率化ソリューションの提案/);
    expect(result).toMatch(/製造業向けDX推進案件での成功事例/);
    expect(result).toMatch(/0\.92/);
    expect(result).toMatch(/87/);
    expect(result).toMatch(/text\/html/i);
  });
});
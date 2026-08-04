import { describe, test, expect, jest, beforeEach, afterEach } from "@jest/globals";

interface AIRecommendationEngineStub {
  generateRecommendation: jest.Mock;
}

interface FileStorageAdapterStub {
  uploadRecommendationReport: jest.Mock;
}

interface CustomerInfo {
  customerId: string;
  customerName: string;
  industry: string;
  scale: string;
}

interface ProposalContent {
  proposalId: string;
  title: string;
  description: string;
  investmentAmount: number;
  expectedROI: number;
}

interface GeneratePersuasiveDocumentResponse {
  statusCode: number;
  body: {
    errorMessage?: string;
    userMessage?: string;
    documentUrl?: string;
  };
}

interface ReportFileMetadata {
  id: string;
  customerId: string;
  proposalId: string;
  createdAt: string;
  fileUrl: string;
}

// Mock implementation of the logic module
const generatePersuasiveDocument = async (
  customerInfo: CustomerInfo,
  proposalContent: ProposalContent,
  aiEngine: AIRecommendationEngineStub,
  fileStorageAdapter: FileStorageAdapterStub,
  reportMetadataStore: ReportFileMetadata[]
): Promise<GeneratePersuasiveDocumentResponse> => {
  const maxRetries = 2;
  const initialBackoffMs = 3000;

  try {
    // Step 1: Generate recommendation using AI Engine
    const recommendationResult = await aiEngine.generateRecommendation(
      customerInfo,
      proposalContent
    );

    // Step 2: Prepare persuasive document content
    const documentContent = {
      customerId: customerInfo.customerId,
      proposalId: proposalContent.proposalId,
      title: `経営層向け説得資料 - ${proposalContent.title}`,
      customerName: customerInfo.customerName,
      industry: customerInfo.industry,
      proposalTitle: proposalContent.title,
      investmentAmount: proposalContent.investmentAmount,
      expectedROI: proposalContent.expectedROI,
      recommendedApproach: recommendationResult.recommendedApproach,
      riskFactors: recommendationResult.riskFactors,
      improvementProposals: recommendationResult.improvementProposals,
      generatedAt: new Date().toISOString(),
    };

    // Step 3: Attempt to upload report with retry logic
    let uploadError: Error | null = null;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const uploadResult = await fileStorageAdapter.uploadRecommendationReport(
          documentContent
        );
        // Success path
        const metadata: ReportFileMetadata = {
          id: `meta_${Date.now()}`,
          customerId: customerInfo.customerId,
          proposalId: proposalContent.proposalId,
          createdAt: new Date().toISOString(),
          fileUrl: uploadResult.fileUrl,
        };
        reportMetadataStore.push(metadata);
        return {
          statusCode: 200,
          body: {
            documentUrl: uploadResult.fileUrl,
          },
        };
      } catch (error) {
        uploadError = error as Error;
        if (attempt < maxRetries) {
          const backoffMs = initialBackoffMs * Math.pow(2, attempt - 1);
          await new Promise((resolve) => setTimeout(resolve, backoffMs));
        }
      }
    }

    // All retries failed
    return {
      statusCode: 500,
      body: {
        errorMessage:
          "FileStorageAdapterでの2度のアップロード失敗により、資料生成が完了できません",
        userMessage:
          "レポート生成に失敗しました。画面上で推奨内容を確認するか、後ほど再度お試しください",
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: {
        errorMessage: `Unexpected error during document generation: ${(error as Error).message}`,
        userMessage:
          "レポート生成に失敗しました。画面上で推奨内容を確認するか、後ほど再度お試しください",
      },
    };
  }
};

describe("AIエージェント推奨根拠の可視化 - 経営層向け説得資料生成", () => {
  let aiEngineStub: AIRecommendationEngineStub;
  let fileStorageAdapterStub: FileStorageAdapterStub;
  let reportMetadataStore: ReportFileMetadata[];

  beforeEach(() => {
    reportMetadataStore = [];

    aiEngineStub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: "段階的な導入による段階的リスク軽減",
        riskFactors: ["初期段階での導入複雑性", "チーム教育期間の必要性"],
        improvementProposals: [
          "パイロット導入から段階展開へ",
          "トレーニング体制の整備",
        ],
      }),
    };

    fileStorageAdapterStub = {
      uploadRecommendationReport: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-2003
  test("FileStorageAdapterのuploadRecommendationReportが1回目失敗、2回目も失敗したとき、資料生成がエラーになる", async () => {
    // Setup: Configure FileStorageAdapter stub to fail on both retry attempts
    const networkTimeoutError = new Error("Network timeout from S3");
    const s3PermissionError = new Error("S3接続権限エラー");

    fileStorageAdapterStub.uploadRecommendationReport
      .mockRejectedValueOnce(networkTimeoutError)
      .mockRejectedValueOnce(s3PermissionError);

    // Setup: Create customer and proposal inputs
    const customerInfo: CustomerInfo = {
      customerId: "CUST_20240115_001",
      customerName: "ABC株式会社",
      industry: "製造業",
      scale: "従業員1000-5000人",
    };

    const proposalContent: ProposalContent = {
      proposalId: "PROP_20240115_001",
      title: "クラウド基盤ディジタル変革",
      description: "既存システムのクラウド移行による業務効率化",
      investmentAmount: 50000000,
      expectedROI: 0.35,
    };

    // Record execution start time
    const executionStartTime = new Date("2024-01-15T11:00:00Z");

    // Execute: Call the persuasive document generation API
    const response = await generatePersuasiveDocument(
      customerInfo,
      proposalContent,
      aiEngineStub,
      fileStorageAdapterStub,
      reportMetadataStore
    );

    // Verify: API response status code and error message
    expect(response.statusCode).toBe(500);
    expect(response.body.errorMessage).toMatch(
      /FileStorageAdapterでの2度のアップロード失敗/
    );
    expect(response.body.userMessage).toBe(
      "レポート生成に失敗しました。画面上で推奨内容を確認するか、後ほど再度お試しください"
    );

    // Verify: FileStorageAdapter was called exactly 2 times
    expect(fileStorageAdapterStub.uploadRecommendationReport).toHaveBeenCalledTimes(
      2
    );

    // Verify: Report file metadata was NOT created in the store
    expect(reportMetadataStore).toHaveLength(0);

    // Verify: AI Engine generateRecommendation was called once
    expect(aiEngineStub.generateRecommendation).toHaveBeenCalledTimes(1);
    expect(aiEngineStub.generateRecommendation).toHaveBeenCalledWith(
      customerInfo,
      proposalContent
    );
  });
});
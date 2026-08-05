import { runTx11Imp1Agent } from "../../src/logic/it-1";

interface SalesCase {
  caseId: string;
  customerIndustry: string;
  proposalContent: string;
  outcome: "won" | "lost";
  amount: number;
  salesPersonName: string;
}

interface ClassificationResult {
  patternId: string;
  successFactors: string;
  classificationScore: number;
  skipHumanReview: boolean;
}

interface AgentResponse {
  status: string;
  registeredCaseCount: number;
  skippedHumanReviewCount: number;
  escalationCaseCount: number;
  timestamp: string;
}

interface Tx11Imp1AiClient {
  extractSalesCases(): Promise<SalesCase[]>;
  analyzeCaseFactors(
    cases: SalesCase[]
  ): Promise<ClassificationResult[]>;
  matchExistingPatterns(
    classifications: ClassificationResult[]
  ): Promise<{ patternMatches: boolean; newPatternDetected: boolean }>;
  generateRecommendationMessage(
    classifications: ClassificationResult[]
  ): Promise<string>;
}

describe("営業事例の収集・分類・言語化の自動化と例外時のみ人による確認", () => {
  // SCEN-1293
  test("should complete case classification and knowledge base registration without human review for normal cases", async () => {
    const mockAiClient: Tx11Imp1AiClient = {
      extractSalesCases: jest.fn(async () => [
        {
          caseId: "CASE001",
          customerIndustry: "製造業",
          proposalContent: "業務効率化システム導入提案",
          outcome: "won",
          amount: 5000000,
          salesPersonName: "営業太郎",
        },
        {
          caseId: "CASE002",
          customerIndustry: "金融業",
          proposalContent: "データ分析プラットフォーム導入提案",
          outcome: "won",
          amount: 8000000,
          salesPersonName: "営業花子",
        },
        {
          caseId: "CASE003",
          customerIndustry: "小売業",
          proposalContent: "顧客管理システム導入提案",
          outcome: "won",
          amount: 3000000,
          salesPersonName: "営業次郎",
        },
      ]),

      analyzeCaseFactors: jest.fn(async (cases: SalesCase[]) => [
        {
          patternId: "PATTERN_001",
          successFactors:
            "顧客のニーズを詳細にヒアリングし、複数の代替案を提示した上で最適ソリューションを推奨した",
          classificationScore: 0.85,
          skipHumanReview: true,
        },
        {
          patternId: "PATTERN_002",
          successFactors:
            "導入後の効果測定指標を顧客と共有し、実装計画を段階的に提示した",
          classificationScore: 0.88,
          skipHumanReview: true,
        },
        {
          patternId: "PATTERN_003",
          successFactors:
            "顧客の業界特性と競争環境を事前に分析し、業界標準との比較を交えて提案した",
          classificationScore: 0.82,
          skipHumanReview: true,
        },
      ]),

      matchExistingPatterns: jest.fn(
        async (classifications: ClassificationResult[]) => ({
          patternMatches: true,
          newPatternDetected: false,
        })
      ),

      generateRecommendationMessage: jest.fn(async () =>
        JSON.stringify({
          recommendations: [
            {
              patternId: "PATTERN_001",
              successFactors:
                "顧客のニーズを詳細にヒアリングし、複数の代替案を提示した上で最適ソリューションを推奨した",
              relatedCaseId: "CASE001",
            },
            {
              patternId: "PATTERN_002",
              successFactors:
                "導入後の効果測定指標を顧客と共有し、実装計画を段階的に提示した",
              relatedCaseId: "CASE002",
            },
            {
              patternId: "PATTERN_003",
              successFactors:
                "顧客の業界特性と競争環境を事前に分析し、業界標準との比較を交えて提案した",
              relatedCaseId: "CASE003",
            },
          ],
        })
      ),
    };

    const result: AgentResponse = await runTx11Imp1Agent(
      mockAiClient
    );

    expect(result.status).toBe("completed");
    expect(result.registeredCaseCount).toBe(3);
    expect(result.skippedHumanReviewCount).toBe(0);
    expect(result.escalationCaseCount).toBe(0);
    expect(typeof result.timestamp).toBe("string");

    expect(mockAiClient.extractSalesCases).toHaveBeenCalled();
    expect(mockAiClient.analyzeCaseFactors).toHaveBeenCalled();
    expect(mockAiClient.matchExistingPatterns).toHaveBeenCalled();
    expect(mockAiClient.generateRecommendationMessage).toHaveBeenCalled();
  });
});
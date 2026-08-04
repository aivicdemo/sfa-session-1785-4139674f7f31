import { describe, test, expect, beforeEach } from "@jest/globals";
import type { AIRecommendationEngine } from "../../src/adapters/AIRecommendationEngine";
import { validateAndGenerateProposalMaterial } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能 - 提案資料生成の前提条件検証", () => {
  let mockAIEngine: jest.Mocked<AIRecommendationEngine>;

  beforeEach(() => {
    mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };
  });

  // SCEN-1008
  test("顧客情報が空文字列の場合、警告メッセージが表示され提案資料生成は実行されない", () => {
    const input = {
      customerInfo: "",
      industry: "IT",
      scale: "large",
      challenges: "デジタル変革",
      dealConditions: {
        dealId: "DEAL-001",
        customerId: "CUST-001",
        dealStage: "proposal",
        dealValue: 5000000,
        expectedCloseDate: new Date("2024-12-31"),
      },
    };

    const result = validateAndGenerateProposalMaterial(input, mockAIEngine);

    expect(result.success).toBe(false);
    expect(result.warningMessage).toBe(
      "顧客情報が入力されていません。顧客名、業種、課題などの情報を入力してください。"
    );
    expect(result.proposalMaterialGenerated).toBe(false);
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});
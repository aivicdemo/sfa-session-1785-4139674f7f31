import { generateExecutivePersuasionDocument } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 経営層向け説得資料自動生成', () => {
  test('SCEN-2005: 提案妥当性スコアが空文字列のとき、資料生成がエラーになる', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockFileStorage = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const inputData = {
      customerId: 'CUST-20250115-001',
      customerName: '株式会社テック太郎',
      industry: 'IT',
      businessChallenge: 'システム統合コスト削減',
      proposalApproach: 'クラウドマイグレーション提案',
      expectedEffect: '年間1500万円のコスト削減見込み',
      proposalValidityScore: '',
      investmentROI: 150,
      riskFactors: ['技術的リスク低', '市場リスク中'],
    };

    expect(() =>
      generateExecutivePersuasionDocument(
        inputData,
        mockAIEngine,
        mockFileStorage,
      ),
    ).toThrow(/proposalValidityScore/);

    expect(mockFileStorage.uploadRecommendationReport).not.toHaveBeenCalled();
  });
});
import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2694
  test('explainRecommendationReasoningが失敗したとき、簡略版の根拠説明が代替出力される', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn().mockRejectedValue(
        new Error('API timeout')
      ),
      evaluatePatternRelevance: jest.fn(),
    };

    const topPatternFromMaster = {
      patternId: 'TOP_PATTERN_001',
      patternName: '既存顧客への追加営業アプローチ',
      successRate: 85,
      applicableIndustries: ['製造業', '金融'],
      applicableCompanySize: ['mid', 'large'],
    };

    const newCaseData = {
      customerName: 'テスト顧客',
      industry: '製造業',
      companySize: 'large',
      budgetRange: 5000000,
      stage: 'proposal',
    };

    const expectedResult = {
      reasoningType: 'simplified',
      reason: '過去成功パターン（成功率85%）から推奨されました',
      sourcePattern: {
        patternId: 'TOP_PATTERN_001',
        patternName: '既存顧客への追加営業アプローチ',
        successRate: 85,
      },
      fullReasoningAvailable: false,
    };

    const result = generateRecommendation(
      newCaseData,
      mockAIRecommendationEngine,
      topPatternFromMaster
    );

    expect(result.reasoningType).toBe('simplified');
    expect(result.reason).toBe('過去成功パターン（成功率85%）から推奨されました');
    expect(result.sourcePattern.patternId).toBe('TOP_PATTERN_001');
    expect(result.sourcePattern.patternName).toBe('既存顧客への追加営業アプローチ');
    expect(result.sourcePattern.successRate).toBe(85);
    expect(result.fullReasoningAvailable).toBe(false);
  });
});
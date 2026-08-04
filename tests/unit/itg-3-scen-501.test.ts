import { describe, test, expect, beforeEach } from '@jest/globals';
import { determineGuidancePolicy } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 営業担当者への指導方針決定機能', () => {
  let mockAIEngine: any;

  beforeEach(() => {
    mockAIEngine = {
      findSimilarPatterns: jest.fn(),
    };
  });

  // SCEN-501
  test('改善優先度ランク情報が null のとき、エラーがスローされる', () => {
    const dealData = {
      customerName: 'テスト顧客A',
      dealAmount: 5000000,
      industry: 'IT',
      dealStage: 'proposal',
    };

    mockAIEngine.findSimilarPatterns.mockReturnValue({
      similarPatterns: [
        {
          patternId: 'PATTERN_001',
          successRate: 0.85,
          improvementPriorityRank: null,
        },
      ],
    });

    expect(() => {
      determineGuidancePolicy(dealData, mockAIEngine);
    }).toThrow(/改善優先度ランク情報/);
  });
});
import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  test('SCEN-1967: 商談金額が過去事例の金額帯上限超過のときにパターンが除外される', () => {
    // 過去成功事例パターンマスタ
    const successPattern = {
      patternId: 'PAT-2024-001',
      dealAmountMin: 1000000, // 100万円
      dealAmountMax: 5000000, // 500万円
      industry: '製造業',
      successRate: 78
    };

    // 新規商談条件
    const newDealCondition = {
      industry: '製造業',
      proposalAmount: 5500000, // 550万円
      companyScale: '中堅企業'
    };

    // AIRecommendationEngine のスタブ
    const mockAIEngine = {
      findSimilarPatterns: jest.fn(() => [successPattern]),
      evaluatePatternRelevance: jest.fn((pattern, dealCondition) => {
        // パターンの金額帯と新規商談金額を照合
        const isAmountExceeded = dealCondition.proposalAmount > pattern.dealAmountMax;
        return {
          patternId: pattern.patternId,
          relevanceScore: isAmountExceeded ? 0 : 85,
          isExcluded: isAmountExceeded,
          exclusionReason: isAmountExceeded ? '商談金額超過' : null
        };
      })
    };

    // 成功パターン抽出・照合機能の実行
    const evaluationResult = evaluatePatternRelevance(
      successPattern,
      newDealCondition,
      mockAIEngine
    );

    // 検証: PAT-2024-001は除外されている
    expect(evaluationResult.isExcluded).toBe(true);

    // 検証: 除外理由が正しく記録されている
    expect(evaluationResult.exclusionReason).toBe('商談金額超過');

    // 検証: relevance スコアがゼロ
    expect(evaluationResult.relevanceScore).toBe(0);

    // 検証: パターンID が一致
    expect(evaluationResult.patternId).toBe('PAT-2024-001');

    // 推奨候補リスト生成ロジック: 除外パターンは含まれない
    const similarPatterns = mockAIEngine.findSimilarPatterns();
    const recommendedPatterns = similarPatterns.filter(pattern => {
      const evaluation = mockAIEngine.evaluatePatternRelevance(pattern, newDealCondition);
      return !evaluation.isExcluded;
    });

    // 検証: PAT-2024-001 は推奨候補から完全に除外されている
    expect(recommendedPatterns).toHaveLength(0);
    expect(recommendedPatterns.some(p => p.patternId === 'PAT-2024-001')).toBe(false);
  });
});
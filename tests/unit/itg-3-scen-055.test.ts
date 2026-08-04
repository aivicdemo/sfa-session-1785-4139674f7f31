import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-055
  test('推奨根拠説明生成機能 - 根拠に使用された成功パターンが1件の場合に説明が正常に生成される', () => {
    const mockRecommendationResult = {
      customer_industry: '製造業',
      proposal_approach: 'コスト削減提案',
      applicability_score: 0.92,
      success_pattern_ids: ['SP-2024-001'],
      success_pattern_details: [
        {
          pattern_id: 'SP-2024-001',
          industry: '製造業',
          proposal_type: 'コスト削減',
          contract_rate: 0.85,
          year: 2024,
        },
      ],
    };

    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockReturnValue(
        '過去の製造業向けコスト削減提案（2024年成約率85%）と顧客の課題構造が合致しているため、同じアプローチを推奨します'
      ),
    };

    const generatedExplanation = explainRecommendationReasoning(
      mockRecommendationResult,
      mockAIEngine
    );

    expect(generatedExplanation).toBeDefined();
    expect(typeof generatedExplanation).toBe('string');
    expect(generatedExplanation).toContain('製造業');
    expect(generatedExplanation).toContain('コスト削減');
    expect(generatedExplanation).toContain('85%');
    expect(generatedExplanation.length).toBeGreaterThanOrEqual(50);
    expect(generatedExplanation.length).toBeLessThanOrEqual(500);
    expect(generatedExplanation).toBe(
      '過去の製造業向けコスト削減提案（2024年成約率85%）と顧客の課題構造が合致しているため、同じアプローチを推奨します'
    );
  });
});
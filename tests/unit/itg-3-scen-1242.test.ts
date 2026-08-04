import { evaluateProposalAppropriateness } from '../../src/logic/it-1-br-3-1-1-1';

// Mock AIRecommendationEngine
jest.mock('../../src/external/AIRecommendationEngine', () => ({
  evaluatePatternRelevance: jest.fn(),
}));

describe('提案妥当性判定機能 - 顧客ニーズ適合度可視化', () => {
  // SCEN-1242
  test('顧客ニーズ適合度が閾値直下（69.9%）のときに改善指摘が出力される', async () => {
    const { evaluatePatternRelevance } = require('../../src/external/AIRecommendationEngine');

    // Mock APIレスポンス: 適合度69.9%で返却
    evaluatePatternRelevance.mockResolvedValue({
      relevanceScore: 69.9,
      matchedPatterns: ['enterprise_digital_transformation'],
      confidenceLevel: 0.82,
    });

    const dealData = {
      customerId: 'CUST-20240115-001',
      customerIndustry: 'manufacturing',
      businessChallenge: 'supply_chain_optimization',
      budgetScale: 5000000,
      decisionMakerId: 'DEC-2024-01-15',
      proposalContent: {
        productCategory: 'supply_chain_software',
        proposedApproach: 'phase1_implementation',
        estimatedROI: 2.5,
        implementationDuration: 180,
      },
      successPatternId: 'SP-enterprise-digital-2024',
    };

    const result = await evaluateProposalAppropriateness(dealData);

    // 適合度スコアが69.9%であることを確認
    expect(result.appropriatenessScore).toBe(69.9);

    // 改善指摘フィールドが存在し空ではないことを確認
    expect(result.improvementGuidance).toBeDefined();
    expect(result.improvementGuidance).not.toEqual('');

    // 改善指摘の内容が営業担当者向けの具体的なアドバイスであることを確認
    expect(result.improvementGuidance).toMatch(
      /顧客の課題|提案アプローチ|修正|適合度|可能性/,
    );

    // 改善指摘の出力フラグが true に設定されていることを確認
    expect(result.showImprovementGuidance).toBe(true);

    // 改善指摘が推奨パターンマスタの統計情報に基づいていることを確認
    expect(result.guidanceBasis).toBeDefined();
    expect(result.guidanceBasis).toMatch(/推奨パターン|統計/);
  });
});
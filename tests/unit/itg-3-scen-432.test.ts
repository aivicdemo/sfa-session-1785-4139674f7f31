import { decideLearningGuidancePolicy } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 指導方針決定機能', () => {
  test('SCEN-432: 改善対象項目が1件の場合、該当項目が方針に正しく含まれる', () => {
    // Arrange
    const salesPersonId = 'SP-001';
    const dealId = 'DEAL-20240115-001';
    const improvementItems = ['顧客対応品質'];

    // AIRecommendationEngine スタブ準備
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockReturnValue({
        guidancePolicySummary: '営業担当者の顧客対応品質向上に向けて、以下の改善を推奨します：',
        policyContent: '顧客対応品質を高めるためには、商談前の顧客背景調査の充実と、提案時の顧客課題への応答精度向上が必要です。',
        targetItems: ['顧客対応品質'],
      }),
    };

    // Act
    const result = decideLearningGuidancePolicy(
      {
        salesPersonId,
        dealId,
        improvementTargetItems: improvementItems,
      },
      mockAIEngine
    );

    // Assert
    // 1. AIEngine の generateRecommendation が正確に1回呼び出されたことを確認
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(1);

    // 2. 返却された指導方針オブジェクトの『方針内容』フィールドを検証
    expect(result.policyContent).toContain('顧客対応品質');

    // 3. 返却された指導方針オブジェクトの『適用対象項目リスト』フィールドを検証
    expect(result.targetItems).toHaveLength(1);
    expect(result.targetItems[0]).toBe('顧客対応品質');
  });
});
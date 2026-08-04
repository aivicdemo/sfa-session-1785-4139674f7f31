import { saveRecommendationHistory } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-112
  test('推奨履歴テーブルへの保存時に商談IDが空のとき保存が拒否される', () => {
    const invalidRecommendationHistoryInput = {
      dealId: '',
      recommendationContent: '顧客の経営課題に基づいた段階的な提案アプローチを推奨',
      generatedAt: new Date('2024-01-15T11:00:00Z'),
      confidence: 85,
      basedOnPatternId: 'pattern_001',
      recommendedAction: 'フォローアップメール送信'
    };

    expect(() => {
      saveRecommendationHistory(invalidRecommendationHistoryInput);
    }).toThrow(/商談ID/);
  });
});
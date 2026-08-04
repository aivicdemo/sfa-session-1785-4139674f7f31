import { describe, test, expect } from '@jest/globals';
import { calculateRecommendationCredibilityScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-829
  test('営業担当者IDが空文字列のとき、エラーで処理が進まない', () => {
    const input = {
      salesPersonId: '',
      dealId: 'deal-12345',
      customerId: 'cust-67890',
      proposalContent: 'テスト提案内容',
      recommendationType: 'follow_up_timing'
    };

    expect(() => calculateRecommendationCredibilityScore(input)).toThrow(/営業担当者ID/);
  });
});
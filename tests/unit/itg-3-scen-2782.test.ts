import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件に適用可能な提案アプローチを自動推奨する機能', () => {
  test('SCEN-2782: 営業担当者の行動ログが欠けている商談レコードが含まれるとき、エラーを返す', () => {
    const dealWithMissingActivityLog = {
      customerId: 'CUST001',
      dealId: 'DEAL-2782',
      activityLog: [],
      customerIndustry: 'manufacturing',
      dealAmount: 500000,
      dealStage: 'proposal'
    };

    const dealsDataset = [dealWithMissingActivityLog];

    const result = findSimilarPatterns(dealsDataset);

    expect(result).toEqual({
      code: 'MISSING_ACTIVITY_LOG',
      message: '商談ID=DEAL-2782の営業担当者行動ログが欠けています。成功パターン抽出に必要な行動履歴データが不足しています。',
      affectedDealId: 'DEAL-2782',
      severity: 'error'
    });
  });
});
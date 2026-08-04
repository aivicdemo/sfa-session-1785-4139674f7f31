import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-1821
  test('[normal] 類似パターン検索機能 - 類似事例が存在しない場合、空のリストが返却される', () => {
    const dealCondition = {
      customer_industry: 'IT',
      budget_range_max: 5000000,
      deal_stage: '初期接触'
    };

    const result = findSimilarPatterns(dealCondition);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
    expect(result).toEqual([]);
  });
});
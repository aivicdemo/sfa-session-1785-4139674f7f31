import { determineImprovementPriorityRank } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 改善優先度ランク決定機能', () => {
  // SCEN-422
  test('エラー件数が複数件の場合、件数に応じたランクが正しく決定される', () => {
    // エラー件数1件のケース - ランク『低』
    const result1Error = determineImprovementPriorityRank(1);
    expect(result1Error).toBe('低');

    // エラー件数5件のケース - ランク『中』
    const result5Error = determineImprovementPriorityRank(5);
    expect(result5Error).toBe('中');

    // エラー件数10件のケース - ランク『高』
    const result10Error = determineImprovementPriorityRank(10);
    expect(result10Error).toBe('高');

    // エラー件数20件以上のケース - ランク『緊急』
    const result20Error = determineImprovementPriorityRank(20);
    expect(result20Error).toBe('緊急');

    // 各ランク値の段階的上昇を確認
    const rankOrder = ['低', '中', '高', '緊急'];
    expect(rankOrder.indexOf(result1Error)).toBeLessThan(rankOrder.indexOf(result5Error));
    expect(rankOrder.indexOf(result5Error)).toBeLessThan(rankOrder.indexOf(result10Error));
    expect(rankOrder.indexOf(result10Error)).toBeLessThan(rankOrder.indexOf(result20Error));
  });
});
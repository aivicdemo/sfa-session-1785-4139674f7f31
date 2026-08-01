import { classifyProblem } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-563
  test('問題分類結果の一貫性検証機能 - 同じ入力で2回実行した場合、同じ分類結果が返される', () => {
    const problemDescription = '顧客フォローアップ期限切れ';
    const targetCategory = 'プロセス遵守';

    const firstResult = classifyProblem({
      problemDescription,
      targetCategory,
    });

    const secondResult = classifyProblem({
      problemDescription,
      targetCategory,
    });

    expect(firstResult.classificationId).toBe(secondResult.classificationId);
    expect(firstResult.classificationName).toBe(secondResult.classificationName);
    expect(firstResult.confidenceScore).toBe(secondResult.confidenceScore);

    expect(firstResult.classificationId).toBe('CLS-0015');
    expect(firstResult.classificationName).toBe('顧客対応遅延');
    expect(firstResult.confidenceScore).toBe(0.94);
  });
});
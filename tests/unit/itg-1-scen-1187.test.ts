import { analyzeUserBehaviorPatterns } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-1187: 行動パターンデータが null のとき ValidationError がスローされる', () => {
    expect(() => {
      analyzeUserBehaviorPatterns(null);
    }).toThrow(/行動パターンデータ/);
  });
});
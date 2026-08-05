import { analyzeActivityAndPerformance } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-1137
  test('営業活動データが空のリストのとき、処理がエラーになること', () => {
    const emptyActivityData: unknown[] = [];

    expect(() => analyzeActivityAndPerformance(emptyActivityData)).toThrow(/営業活動データが取得できません/);
  });
});
import { selectBehaviorAnalysisMetrics } from '../../src/logic/it-1-br-2-1-1';

describe('行動パターン分析指標自動選定機能', () => {
  // SCEN-1070: [error] 行動パターン分析指標自動選定機能 - 開始日が終了日より後の場合にエラーが発生する
  test('開始日が終了日より後の場合、バリデーションエラーを発生させる', () => {
    const start_date = new Date('2024-12-31T00:00:00Z');
    const end_date = new Date('2024-12-01T00:00:00Z');

    expect(() =>
      selectBehaviorAnalysisMetrics({
        start_date,
        end_date,
      })
    ).toThrow(/開始日は終了日以前の日付を指定してください/);
  });
});
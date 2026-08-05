import { convertProcessToSystemRequirements } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセス標準書のシステム要件変換機能 - プロセス段階数上限値チェック', () => {
  test('SCEN-197: プロセス段階数が上限値直上（11段階）のとき変換処理が拒否される', () => {
    // Arrange: テスト用営業プロセス標準書オブジェクトを作成
    const processStandardBook = {
      process_id: 'PROC-001',
      process_name: '営業プロセス標準書テスト',
      stages: Array.from({ length: 11 }, (_, index) => ({
        stage_number: index + 1,
        stage_name: `ステージ${index + 1}`,
        description: `プロセスステージ${index + 1}の説明`,
        transition_rules: `ステージ${index + 1}から${index + 2}への遷移ルール`,
        kpi_criteria: `ステージ${index + 1}のKPI基準`,
      })),
      max_stage_limit: 10,
      created_at: new Date('2024-01-15T09:00:00Z'),
      updated_at: new Date('2024-01-15T09:00:00Z'),
    };

    // Act & Assert: 変換処理を実行してエラーハンドリングを検証
    expect(() => convertProcessToSystemRequirements(processStandardBook)).toThrow(
      /プロセス段階数は10段階以下である必要があります。現在の段階数：11/
    );
  });
});
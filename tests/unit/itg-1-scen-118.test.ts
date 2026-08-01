import { convertProcessStandardToSystemRequirement } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-118
  test('プロセス標準書のシステム要件変換機能 - 必須データ項目が0件の場合、変換処理がエラーになる', () => {
    const processStandardData = {
      process_id: 'PROC-001',
      process_name: '営業プロセス標準書',
      stages: [
        {
          stage_id: 'STAGE-001',
          stage_name: '初回接触',
          required_actions: ['顧客情報取得', '初期ヒアリング'],
        },
      ],
      mandatory_data_items: [],
      decision_criteria: [
        {
          criterion_id: 'CRIT-001',
          criterion_name: '継続判定',
          threshold: 0.5,
        },
      ],
    };

    expect(() =>
      convertProcessStandardToSystemRequirement(processStandardData)
    ).toThrow(/必須データ項目/);
  });
});
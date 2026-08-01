import { convertProcessStandardToSystemRequirements } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセス標準書のシステム要件変換機能', () => {
  // SCEN-113
  test('プロセス段階の段階番号が空文字列の場合、変換処理がエラーになる', () => {
    const processStage = {
      stage_number: '',
      stage_name: '初回接触',
      description: '顧客との初回接触を行う段階',
      required_actions: ['顧客情報確認', '初期ニーズ把握'],
      success_criteria: '初回面談完了',
      kpi_threshold: 5,
    };

    expect(() => convertProcessStandardToSystemRequirements(processStage)).toThrow(/段階番号/);
  });
});
import { selectAnalysisIndicators } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターン分析指標自動選定機能', () => {
  // SCEN-1061: [normal] 行動パターン分析指標自動選定機能 - 営業プロセス標準書と成約実績から指標が0件の場合、空の分析対象指標リストが返される
  test('指標マスタに該当するレコードがない場合、空の配列が返される', () => {
    const business_process_definition_id = 'bpd_001';
    const contract_result_id = 'cr_001';

    const result = selectAnalysisIndicators({
      business_process_definition_id,
      contract_result_id,
    });

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
    expect(result).toEqual([]);
  });
});
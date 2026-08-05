import { selectBehaviorPatternAnalysisIndicators } from '../../src/logic/it-1-br-2-1-1';

describe('行動パターン分析指標自動選定機能', () => {
  // SCEN-1074
  test('成約実績と営業案件の対応が存在しない場合にエラーが発生する', () => {
    const contract_result_id = 'SA001';
    const sales_opportunity_id = 'OP001';

    const input = {
      contract_result_id: contract_result_id,
      sales_opportunity_id: undefined,
    };

    expect(() => selectBehaviorPatternAnalysisIndicators(input)).toThrow(
      /成約実績SA001に対応する営業案件が存在しません/
    );
  });
});
import { analyzeAgentInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-1183: 営業担当者IDが null のとき INVALID_SALES_PERSON_ID エラーをスロー', () => {
    expect(() =>
      analyzeAgentInferenceAccuracy({
        salesPersonId: null,
        analysisStartDate: '2024-01-01T00:00:00Z',
        analysisEndDate: '2024-01-31T23:59:59Z',
      })
    ).toThrow(/INVALID_SALES_PERSON_ID/);
  });
});
import { selectAnalysisIndicators } from '../../src/logic/it-1-br-2-1-1';

describe('行動パターン分析対象指標の自動選定機能', () => {
  // SCEN-775
  test('相関値がNaNまたはnullの指標は分析対象から除外される', () => {
    const indicatorsData = [
      {
        indicator_id: 'ind_001',
        indicator_name: '初回接触頻度',
        correlation_value: 0.75,
      },
      {
        indicator_id: 'ind_002',
        indicator_name: '提案成功率',
        correlation_value: Number.NaN,
      },
      {
        indicator_id: 'ind_003',
        indicator_name: 'フォローアップ間隔',
        correlation_value: 0.82,
      },
      {
        indicator_id: 'ind_004',
        indicator_name: '顧客接触頻度',
        correlation_value: null,
      },
      {
        indicator_id: 'ind_005',
        indicator_name: '提案資料品質',
        correlation_value: Number.NaN,
      },
      {
        indicator_id: 'ind_006',
        indicator_name: '商談期間',
        correlation_value: 0.68,
      },
    ];

    const result = selectAnalysisIndicators(indicatorsData);

    expect(result).toEqual([
      {
        indicator_id: 'ind_001',
        indicator_name: '初回接触頻度',
        correlation_value: 0.75,
      },
      {
        indicator_id: 'ind_003',
        indicator_name: 'フォローアップ間隔',
        correlation_value: 0.82,
      },
      {
        indicator_id: 'ind_006',
        indicator_name: '商談期間',
        correlation_value: 0.68,
      },
    ]);
  });
});
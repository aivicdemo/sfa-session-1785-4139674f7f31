import { analyzeProcessIndicators } from '../../src/logic/it-1-br-2-1-1';

describe('行動パターン分析指標自動選定機能', () => {
  test('SCEN-1059: 営業プロセス標準書と成約実績から複数の関連指標が抽出される場合、全指標が分析対象指標リストに含まれる', () => {
    const process_standard_book = {
      indicators: [
        { indicator_id: 'ind_001', indicator_name: '初回訪問実施率' },
        { indicator_id: 'ind_002', indicator_name: '提案資料提出率' },
        { indicator_id: 'ind_003', indicator_name: '見積提示率' },
      ],
    };

    const contract_result_dataset = {
      metrics: [
        { metric_id: 'met_001', metric_name: '初回訪問実施率', value: 85 },
        { metric_id: 'met_002', metric_name: '提案資料提出率', value: 72 },
        { metric_id: 'met_003', metric_name: '見積提示率', value: 68 },
        { metric_id: 'met_004', metric_name: 'クロージング成功率', value: 45 },
      ],
    };

    const analysis_indicator_list = analyzeProcessIndicators(
      process_standard_book,
      contract_result_dataset
    );

    expect(analysis_indicator_list.length).toBe(3);
    expect(analysis_indicator_list).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ indicator_name: '初回訪問実施率' }),
        expect.objectContaining({ indicator_name: '提案資料提出率' }),
        expect.objectContaining({ indicator_name: '見積提示率' }),
      ])
    );
    expect(analysis_indicator_list).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ indicator_name: 'クロージング成功率' }),
      ])
    );
  });
});
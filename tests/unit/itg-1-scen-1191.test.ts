import { describe, it, expect, beforeEach } from '@jest/globals';
import { analyzeContractCorrelation } from '../../src/logic/it-1-br-2-1-1-1';

describe('成約実績相関分析機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1191
  it('分析期間の終了日が null のとき処理がエラーになる', () => {
    const analysis_input = {
      start_date: '2024-01-01',
      end_date: null,
      department_id: 'DEPT001',
      include_historical_data: true,
    };

    expect(() => {
      analyzeContractCorrelation(analysis_input);
    }).toThrow(/分析期間の終了日は必須です/);
  });
});
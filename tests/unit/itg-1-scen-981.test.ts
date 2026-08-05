import { describe, test, expect, beforeEach } from '@jest/globals';
import { extractAndApproveSuccessFailureFactors } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-981
  test('ワークショップ完了状態の検証に失敗したとき、前提条件を満たさないためエラーになる', () => {
    const workshop_id = 'ws_20240115_001';
    const workshop_status = 'in_progress';
    const extracted_factors = [
      {
        factor_type: 'success',
        description: 'Customer engagement before proposal',
        frequency: 12,
      },
    ];

    expect(() =>
      extractAndApproveSuccessFailureFactors({
        workshop_id,
        workshop_status,
        extracted_factors,
      })
    ).toThrow(/WORKSHOP_NOT_COMPLETED/);
  });
});
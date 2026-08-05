import { describe, test, expect, beforeEach } from '@jest/globals';
import { analyzeVendorActionPatterns } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-549
  test('開始日が終了日より後の場合、エラーになる', () => {
    const start_date = new Date('2024-12-31T00:00:00Z');
    const end_date = new Date('2024-12-01T00:00:00Z');
    const vendor_id = 'V001';

    expect(() =>
      analyzeVendorActionPatterns({
        start_date,
        end_date,
        vendor_id,
      })
    ).toThrow(/開始日/);
  });
});
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';

const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();

import { calculateProcessComplianceDeviationScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-237: [error] 標準プロセス遵守度スコア計算機能 - 乖離度計算において営業担当者の過去商談データが取得できないときエラーになる
  test('should return error when sales history data cannot be retrieved for the specified sales user', async () => {
    const sales_user_id = 'sales_user_001';

    fetchMock.mockResponseOnce(JSON.stringify([]), { status: 200 });

    const result = await calculateProcessComplianceDeviationScore({
      sales_user_id: sales_user_id,
      standard_process_definition: {
        stages: [
          { stage_id: 'stage_001', stage_name: 'initial_contact', order: 1 },
          { stage_id: 'stage_002', stage_name: 'proposal', order: 2 },
          { stage_id: 'stage_003', stage_name: 'negotiation', order: 3 },
          { stage_id: 'stage_004', stage_name: 'close', order: 4 }
        ]
      }
    });

    expect(result).toHaveProperty('error_code');
    expect(result).toHaveProperty('error_message');
    expect(result.error_code).toBe('ERR_SALES_HISTORY_NOT_FOUND');
    expect(result.error_message).toBe(
      `営業担当者${sales_user_id}の過去商談データが取得できません`
    );
    expect(result).not.toHaveProperty('deviation_score');
    expect(result).not.toHaveProperty('deviation_degree');
  });
});
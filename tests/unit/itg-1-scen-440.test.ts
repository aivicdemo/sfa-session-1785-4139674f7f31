import { separateInferenceLogsByRepresentative, calculateInferencePrecisionByRepresentative } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-440
  test('異なる複数の営業担当者の推論ログが混在する場合、営業担当者ごとに正確に分離されて処理される', () => {
    const mixedInferenceLogs = [
      {
        inference_id: 'INF-A-001',
        representative_id: 'REP-A',
        timestamp: '2024-01-15T09:00:00Z',
        contract_amount: 500000,
        judgment_result: 'success',
      },
      {
        inference_id: 'INF-B-001',
        representative_id: 'REP-B',
        timestamp: '2024-01-15T09:15:00Z',
        contract_amount: 750000,
        judgment_result: 'success',
      },
      {
        inference_id: 'INF-A-002',
        representative_id: 'REP-A',
        timestamp: '2024-01-15T09:30:00Z',
        contract_amount: 300000,
        judgment_result: 'success',
      },
      {
        inference_id: 'INF-C-001',
        representative_id: 'REP-C',
        timestamp: '2024-01-15T09:45:00Z',
        contract_amount: 1000000,
        judgment_result: 'failure',
      },
      {
        inference_id: 'INF-B-002',
        representative_id: 'REP-B',
        timestamp: '2024-01-15T10:00:00Z',
        contract_amount: 450000,
        judgment_result: 'success',
      },
      {
        inference_id: 'INF-A-003',
        representative_id: 'REP-A',
        timestamp: '2024-01-15T10:15:00Z',
        contract_amount: 600000,
        judgment_result: 'failure',
      },
      {
        inference_id: 'INF-C-002',
        representative_id: 'REP-C',
        timestamp: '2024-01-15T10:30:00Z',
        contract_amount: 800000,
        judgment_result: 'success',
      },
      {
        inference_id: 'INF-B-003',
        representative_id: 'REP-B',
        timestamp: '2024-01-15T10:45:00Z',
        contract_amount: 200000,
        judgment_result: 'failure',
      },
      {
        inference_id: 'INF-A-004',
        representative_id: 'REP-A',
        timestamp: '2024-01-15T11:00:00Z',
        contract_amount: 550000,
        judgment_result: 'success',
      },
      {
        inference_id: 'INF-C-003',
        representative_id: 'REP-C',
        timestamp: '2024-01-15T11:15:00Z',
        contract_amount: 900000,
        judgment_result: 'success',
      },
      {
        inference_id: 'INF-A-005',
        representative_id: 'REP-A',
        timestamp: '2024-01-15T11:30:00Z',
        contract_amount: 400000,
        judgment_result: 'success',
      },
      {
        inference_id: 'INF-B-004',
        representative_id: 'REP-B',
        timestamp: '2024-01-15T11:45:00Z',
        contract_amount: 350000,
        judgment_result: 'success',
      },
      {
        inference_id: 'INF-C-004',
        representative_id: 'REP-C',
        timestamp: '2024-01-15T12:00:00Z',
        contract_amount: 700000,
        judgment_result: 'failure',
      },
      {
        inference_id: 'INF-C-005',
        representative_id: 'REP-C',
        timestamp: '2024-01-15T12:15:00Z',
        contract_amount: 650000,
        judgment_result: 'success',
      },
      {
        inference_id: 'INF-C-006',
        representative_id: 'REP-C',
        timestamp: '2024-01-15T12:30:00Z',
        contract_amount: 1100000,
        judgment_result: 'success',
      },
    ];

    const separatedLogs = separateInferenceLogsByRepresentative(mixedInferenceLogs);

    expect(separatedLogs).toHaveProperty('REP-A');
    expect(separatedLogs).toHaveProperty('REP-B');
    expect(separatedLogs).toHaveProperty('REP-C');

    expect(separatedLogs['REP-A']).toHaveLength(5);
    expect(separatedLogs['REP-B']).toHaveLength(4);
    expect(separatedLogs['REP-C']).toHaveLength(6);

    const rep_a_ids = separatedLogs['REP-A'].map((log) => log.inference_id);
    const rep_b_ids = separatedLogs['REP-B'].map((log) => log.inference_id);
    const rep_c_ids = separatedLogs['REP-C'].map((log) => log.inference_id);

    expect(rep_a_ids).toEqual([
      'INF-A-001',
      'INF-A-002',
      'INF-A-003',
      'INF-A-004',
      'INF-A-005',
    ]);
    expect(rep_b_ids).toEqual(['INF-B-001', 'INF-B-002', 'INF-B-003', 'INF-B-004']);
    expect(rep_c_ids).toEqual([
      'INF-C-001',
      'INF-C-002',
      'INF-C-003',
      'INF-C-004',
      'INF-C-005',
      'INF-C-006',
    ]);

    const rep_a_set = new Set(rep_a_ids);
    const rep_b_set = new Set(rep_b_ids);
    const rep_c_set = new Set(rep_c_ids);

    const a_b_overlap = rep_a_ids.filter((id) => rep_b_set.has(id));
    const a_c_overlap = rep_a_ids.filter((id) => rep_c_set.has(id));
    const b_c_overlap = rep_b_ids.filter((id) => rep_c_set.has(id));

    expect(a_b_overlap).toEqual([]);
    expect(a_c_overlap).toEqual([]);
    expect(b_c_overlap).toEqual([]);

    const precisionScores = calculateInferencePrecisionByRepresentative(separatedLogs);

    expect(precisionScores).toHaveProperty('REP-A');
    expect(precisionScores).toHaveProperty('REP-B');
    expect(precisionScores).toHaveProperty('REP-C');

    expect(typeof precisionScores['REP-A']).toBe('number');
    expect(typeof precisionScores['REP-B']).toBe('number');
    expect(typeof precisionScores['REP-C']).toBe('number');

    expect(precisionScores['REP-A']).toBeGreaterThanOrEqual(0);
    expect(precisionScores['REP-A']).toBeLessThanOrEqual(1);
    expect(precisionScores['REP-B']).toBeGreaterThanOrEqual(0);
    expect(precisionScores['REP-B']).toBeLessThanOrEqual(1);
    expect(precisionScores['REP-C']).toBeGreaterThanOrEqual(0);
    expect(precisionScores['REP-C']).toBeLessThanOrEqual(1);

    expect(precisionScores['REP-A']).toBeCloseTo(0.87, 2);
    expect(precisionScores['REP-B']).toBeCloseTo(0.92, 2);
    expect(precisionScores['REP-C']).toBeCloseTo(0.79, 2);
  });
});
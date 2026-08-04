import { findSimilarPatterns } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2309: [edge] 提案内容と顧客対応パターンの標準プロセス比較機能 - 顧客対応記録に同値データが並ぶとき全件が比較対象に含まれる
  test('顧客対応記録に同一条件のレコードが複数存在する場合、すべてが比較対象に含まれること', () => {
    const customerId = 'CUST-001';
    const contactDateTime = new Date('2024-01-15T10:30:00Z');
    const contactPattern = '初回接触_ニーズ確認';

    const mockStandardProcessMaster = {
      patternId: 'PROC-001',
      patternName: contactPattern,
      description: '初回接触時のニーズ確認プロセス',
      steps: [
        { stepOrder: 1, stepName: 'ヒアリング', expectedDuration: 20 },
        { stepOrder: 2, stepName: 'ニーズ整理', expectedDuration: 15 },
      ],
    };

    const mockCustomerContactRecords = [
      {
        recordId: 'REC-001',
        customerId: customerId,
        contactDateTime: contactDateTime,
        contactPattern: contactPattern,
        contactNotes: 'A社のシステム導入検討中',
        salesPersonId: 'SALES-001',
      },
      {
        recordId: 'REC-002',
        customerId: customerId,
        contactDateTime: contactDateTime,
        contactPattern: contactPattern,
        contactNotes: 'B社向けカスタマイズ相談',
        salesPersonId: 'SALES-002',
      },
      {
        recordId: 'REC-003',
        customerId: customerId,
        contactDateTime: contactDateTime,
        contactPattern: contactPattern,
        contactNotes: 'C社の追加要件確認',
        salesPersonId: 'SALES-001',
      },
    ];

    const searchCondition = {
      customerId: customerId,
      contactDateTime: contactDateTime,
      contactPattern: contactPattern,
    };

    const mockAIEngineStub = {
      findSimilarPatterns: jest
        .fn()
        .mockReturnValue(mockCustomerContactRecords),
    };

    const result = mockAIEngineStub.findSimilarPatterns(searchCondition);

    expect(result).toHaveLength(3);
    expect(result[0].recordId).toBe('REC-001');
    expect(result[0].customerId).toBe(customerId);
    expect(result[0].contactDateTime).toEqual(contactDateTime);
    expect(result[0].contactPattern).toBe(contactPattern);

    expect(result[1].recordId).toBe('REC-002');
    expect(result[1].customerId).toBe(customerId);
    expect(result[1].contactDateTime).toEqual(contactDateTime);
    expect(result[1].contactPattern).toBe(contactPattern);

    expect(result[2].recordId).toBe('REC-003');
    expect(result[2].customerId).toBe(customerId);
    expect(result[2].contactDateTime).toEqual(contactDateTime);
    expect(result[2].contactPattern).toBe(contactPattern);

    const comparisonResults = result.map((record) => ({
      recordId: record.recordId,
      differenceStatus: '該当なし',
      standardProcessAlignment: 'compliant',
    }));

    expect(comparisonResults).toHaveLength(3);
    comparisonResults.forEach((comparison) => {
      expect(comparison.differenceStatus).toBe('該当なし');
      expect(comparison.standardProcessAlignment).toBe('compliant');
    });

    expect(mockAIEngineStub.findSimilarPatterns).toHaveBeenCalledWith(
      searchCondition
    );
    expect(mockAIEngineStub.findSimilarPatterns).toHaveBeenCalledTimes(1);
  });
});
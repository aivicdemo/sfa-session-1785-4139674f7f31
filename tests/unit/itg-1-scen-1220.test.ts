import { jest } from '@jest/globals';
import { calculateCorrelationWithDeduplication } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセス標準書との乖離分析と成約実績の相関分析機能', () => {
  // SCEN-1220
  test('営業活動ログに重複データが含まれるときに相関係数の計算で重複排除が正確に行われる', () => {
    // テストデータ準備: 同一の営業活動ログエントリを3件含むデータセット
    const duplicateLogEntry = {
      salesPersonId: 'SP001',
      contactDateTime: '2024-01-15T10:30:00Z',
      proposalContent: 'Product A proposal for customer segmentation',
      contractedFlag: true,
    };

    const activityLogDataset = [
      duplicateLogEntry,
      duplicateLogEntry,
      duplicateLogEntry,
      {
        salesPersonId: 'SP002',
        contactDateTime: '2024-01-16T14:00:00Z',
        proposalContent: 'Product B proposal for cost reduction',
        contractedFlag: false,
      },
      {
        salesPersonId: 'SP001',
        contactDateTime: '2024-01-17T11:15:00Z',
        proposalContent: 'Follow-up meeting scheduled',
        contractedFlag: true,
      },
    ];

    const contractResultsDataset = [
      { salesPersonId: 'SP001', contractDate: '2024-01-15T10:30:00Z', contractValue: 500000 },
      { salesPersonId: 'SP002', contractDate: '2024-01-16T14:00:00Z', contractValue: 0 },
      { salesPersonId: 'SP001', contractDate: '2024-01-17T11:15:00Z', contractValue: 750000 },
    ];

    // 相関分析処理の呼び出し
    const correlationResult = calculateCorrelationWithDeduplication(
      activityLogDataset,
      contractResultsDataset
    );

    // 重複排除後のデータセットサイズが正確に2件減少していることを確認
    const expectedDedupedDatasetSize = 3; // 元の5件から重複2件を除去 → 3件
    expect(correlationResult.dedupedDatasetSize).toBe(expectedDedupedDatasetSize);

    // 重複排除件数が2であることをアサーションで検証
    expect(correlationResult.deduplicationCount).toBe(2);

    // 元のデータセットサイズが5であることを確認
    expect(correlationResult.originalDatasetSize).toBe(5);

    // 計算された相関係数が存在することを確認
    expect(typeof correlationResult.correlationCoefficient).toBe('number');
    expect(correlationResult.correlationCoefficient).toBeGreaterThanOrEqual(-1);
    expect(correlationResult.correlationCoefficient).toBeLessThanOrEqual(1);

    // 重複を含めた場合の誤った相関係数と異なることを数値比較で検証
    const correlationWithoutDedup = calculateCorrelationWithoutDeduplication(
      activityLogDataset,
      contractResultsDataset
    );
    expect(correlationResult.correlationCoefficient).not.toBe(correlationWithoutDedup);

    // メタデータに正確な記録が含まれていることを確認
    expect(correlationResult.metadata).toBeDefined();
    expect(correlationResult.metadata.datasetSize).toBe(3);
    expect(correlationResult.metadata.deduplicationCount).toBe(2);
    expect(correlationResult.metadata.calculationLogic).toBeDefined();

    // 営業管理者向けレポート出力オブジェクトに根拠情報が含まれていることを確認
    expect(correlationResult.reportOutput).toBeDefined();
    expect(correlationResult.reportOutput.originalDatasetCount).toBe(5);
    expect(correlationResult.reportOutput.dedupedDatasetCount).toBe(3);
    expect(correlationResult.reportOutput.removedDuplicateCount).toBe(2);
    expect(correlationResult.reportOutput.deduplicationSummary).toMatch(/元データセット5件→重複排除後3件/);
    expect(correlationResult.reportOutput.deduplicationSummary).toMatch(/排除件数2件/);

    // 計算結果が信頼性のあるメタデータを保有していることを確認
    expect(correlationResult.auditTrail).toBeDefined();
    expect(Array.isArray(correlationResult.auditTrail)).toBe(true);
    expect(correlationResult.auditTrail.length).toBeGreaterThan(0);
  });
});

// ヘルパー関数: 重複排除なしで相関係数を計算（比較用）
function calculateCorrelationWithoutDeduplication(
  activityLogDataset: Array<{
    salesPersonId: string;
    contactDateTime: string;
    proposalContent: string;
    contractedFlag: boolean;
  }>,
  contractResultsDataset: Array<{
    salesPersonId: string;
    contractDate: string;
    contractValue: number;
  }>
): number {
  const contractedFlags = activityLogDataset.map((log) => (log.contractedFlag ? 1 : 0));
  const contractValues = activityLogDataset.map((log) => {
    const match = contractResultsDataset.find(
      (result) =>
        result.salesPersonId === log.salesPersonId && result.contractDate === log.contactDateTime
    );
    return match?.contractValue ?? 0;
  });

  const meanFlags = contractedFlags.reduce((a, b) => a + b, 0) / contractedFlags.length;
  const meanValues = contractValues.reduce((a, b) => a + b, 0) / contractValues.length;

  const covariance = contractedFlags.reduce((sum, flag, i) => {
    return sum + (flag - meanFlags) * (contractValues[i] - meanValues);
  }, 0) / contractedFlags.length;

  const stddevFlags = Math.sqrt(
    contractedFlags.reduce((sum, flag) => sum + Math.pow(flag - meanFlags, 2), 0) /
      contractedFlags.length
  );

  const stddevValues = Math.sqrt(
    contractValues.reduce((sum, value) => sum + Math.pow(value - meanValues, 2), 0) /
      contractValues.length
  );

  return stddevFlags !== 0 && stddevValues !== 0 ? covariance / (stddevFlags * stddevValues) : 0;
}
import { validateLearningDataQuality } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-086
  test('営業活動ログが欠落している場合、学習データの品質検証に失敗する', () => {
    const totalRequiredActivityLogs = 100;
    const missingActivityLogCount = 12;
    const presentActivityLogCount = totalRequiredActivityLogs - missingActivityLogCount;

    const learningDataset = {
      salesActivityLogs: Array.from({ length: presentActivityLogCount }, (_, i) => ({
        id: `log_${i + 1}`,
        activityType: i % 3 === 0 ? 'visit' : i % 3 === 1 ? 'call' : 'proposal_sent',
        timestamp: new Date(`2024-01-${(i % 28) + 1}T10:00:00Z`),
        salesPersonId: `sales_${(i % 5) + 1}`,
        customerId: `customer_${(i % 10) + 1}`,
      })),
      requiredMinimumActivityLogs: totalRequiredActivityLogs,
    };

    const validationResult = validateLearningDataQuality(learningDataset);

    expect(validationResult.status).toBe('FAILED');
    expect(validationResult.message).toMatch(/営業活動ログが不足しています/);
    expect(validationResult.message).toMatch(/12/);
    expect(validationResult.insufficientActivityLogCount).toBe(missingActivityLogCount);
    expect(validationResult.canExecuteInference).toBe(false);
    expect(validationResult.blockedReason).toMatch(/営業活動ログ/);
  });
});
import { describe, test, expect } from '@jest/globals';
import { validateLearningDataQuality } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-087: 成約実績データが欠落している場合、学習データの品質検証に失敗する', () => {
    const incompleteTrainingDataset = {
      customerAttributes: [
        {
          customerId: 'C001',
          customerName: '株式会社A',
          industry: '製造業',
          employeeCount: 100
        }
      ],
      salesActivityHistory: [
        {
          activityId: 'SA001',
          customerId: 'C001',
          activityType: '訪問',
          activityDate: '2024-01-10',
          duration: 60
        }
      ],
      proposalContent: [
        {
          proposalId: 'P001',
          customerId: 'C001',
          proposalTitle: '業務効率化ソリューション',
          proposalDate: '2024-01-15',
          proposalAmount: 500000
        }
      ]
    };

    const result = validateLearningDataQuality(incompleteTrainingDataset);

    expect(result.status).toBe('VALIDATION_FAILED');
    expect(result.errorCode).toBe('MISSING_REQUIRED_FIELD_CONVERSION_DATA');
    expect(result.detailedMessage).toBe('成約実績データが欠落しています。学習データに成約フラグ、成約日時、契約金額の各項目が必須です');
  });
});
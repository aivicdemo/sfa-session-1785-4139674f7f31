import { validateLearningDataQuality } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-025: 学習データが最小要件を満たし品質スコアが良好な場合に推論実行許可が返される', () => {
    const learningDataset = {
      records: Array.from({ length: 500 }, (_, i) => ({
        id: `record_${i + 1}`,
        customerId: `customer_${(i % 50) + 1}`,
        dealStatus: ['won', 'lost', 'ongoing'][i % 3],
        productCategory: ['A', 'B', 'C'][i % 3],
        dealAmount: 100000 + (i % 50) * 10000,
        dealDuration: 30 + (i % 60),
        salesPersonExperience: 1 + (i % 20),
        customerIndustry: ['IT', 'Manufacturing', 'Finance', 'Retail'][i % 4],
        proposalApproach: ['direct', 'indirect', 'referral'][i % 3],
        followUpCount: i % 10,
      })),
      missingRate: 0,
      anomalyCount: 0,
    };

    const expectedQualityScore = 0.85;
    const expectedValidationStatus = 'PASSED';
    const expectedRecordCount = 500;
    const expectedIsApproved = true;

    const result = validateLearningDataQuality(learningDataset, expectedQualityScore);

    expect(result.isApprovedForInference).toBe(expectedIsApproved);
    expect(result.qualityScore).toBe(expectedQualityScore);
    expect(result.dataRecordCount).toBe(expectedRecordCount);
    expect(result.validationStatus).toBe(expectedValidationStatus);
  });
});
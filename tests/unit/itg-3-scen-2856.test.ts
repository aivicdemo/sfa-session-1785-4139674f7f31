import { recordRecommendationHistory } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2856
  test('推奨履歴の記録機能 - 推奨内容が生成された場合、営業管理職による検証判定と改善指導優先度が推奨履歴として記録される', () => {
    const recommendationId = 'REC-20240115-001';
    const managerUserId = 'MGR-USER-12345';
    const generatedRecommendationContent = {
      proposalApproach: '顧客の経営課題に基づいたカスタマイズ提案',
      basis: [
        {
          type: 'customer_profile',
          value: '製造業、従業員数500人、売上100億円'
        },
        {
          type: 'success_pattern',
          value: '類似案件の成功パターンA'
        },
        {
          type: 'timing',
          value: '購買シグナル検出日から14日以内が最適'
        }
      ],
      confidenceScore: 87
    };

    const verificationInput = {
      recommendationId: recommendationId,
      managerUserId: managerUserId,
      verificationStatus: 'APPROVED',
      improvementPriority: 'HIGH',
      verifiedAtISO: '2024-01-15T10:30:00Z',
      generatedRecommendationContent: generatedRecommendationContent
    };

    const result = recordRecommendationHistory(verificationInput);

    expect(result).toEqual({
      recommendationId: 'REC-20240115-001',
      managerVerificationStatus: 'APPROVED',
      improvementPriority: 'HIGH',
      verifiedBy: 'MGR-USER-12345',
      verifiedAt: '2024-01-15T10:30:00Z',
      createdRecommendationContent: {
        proposalApproach: '顧客の経営課題に基づいたカスタマイズ提案',
        basis: [
          {
            type: 'customer_profile',
            value: '製造業、従業員数500人、売上100億円'
          },
          {
            type: 'success_pattern',
            value: '類似案件の成功パターンA'
          },
          {
            type: 'timing',
            value: '購買シグナル検出日から14日以内が最適'
          }
        ],
        confidenceScore: 87
      },
      status: 'RECORDED'
    });
  });
});
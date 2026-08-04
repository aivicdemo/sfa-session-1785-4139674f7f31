import { generateRecommendationWithFallback } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1070
  test('[normal] 推奨レポートの生成と保存 - Amazon S3アップロード失敗時にHTML形式で推奨内容が画面表示される', async () => {
    const mockRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'REC-20240115-001',
        customerId: 'CUST-12345',
        proposalApproach: '顧客の経営課題を解決する統合ソリューション提案',
        confidenceScore: 92,
        reasoningBasis: [
          {
            type: 'pastSuccessCase',
            caseId: 'CASE-2023-008',
            similarity: 0.95,
            description: '同業界の類似案件で成功した提案パターン'
          },
          {
            type: 'customerProfile',
            attribute: '業種：製造業、売上規模：50億円以上',
            relevance: 0.88,
            description: '顧客属性が成功パターンと合致'
          }
        ],
        recommendedTiming: '2024-01-20T09:00:00Z',
        suggestedActions: [
          '初回面談で経営課題ヒアリング',
          'ROI試算シミュレーション提示',
          '競合対策ポイント強調'
        ]
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        narrativeExplanation: 'この推奨は過去の同業界成功案件から抽出された営業パターンに基づいています。顧客の経営規模と課題特性が95%の確度で一致しており、提案のタイミングと内容が最適と判定されました。',
        confidenceFactors: ['過去成功事例との適合度 95%', '顧客属性マッチ度 88%', '市場環境適合度 89%']
      })
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn()
        .mockRejectedValueOnce(new Error('NetworkError'))
        .mockRejectedValueOnce(new Error('NetworkError'))
        .mockRejectedValueOnce(new Error('NetworkError'))
    };

    const mockRecommendationData = {
      recommendationId: 'REC-20240115-001',
      customerId: 'CUST-12345',
      proposalApproach: '顧客の経営課題を解決する統合ソリューション提案',
      confidenceScore: 92,
      reasoningBasis: [
        {
          type: 'pastSuccessCase',
          caseId: 'CASE-2023-008',
          similarity: 0.95,
          description: '同業界の類似案件で成功した提案パターン'
        },
        {
          type: 'customerProfile',
          attribute: '業種：製造業、売上規模：50億円以上',
          relevance: 0.88,
          description: '顧客属性が成功パターンと合致'
        }
      ],
      recommendedTiming: '2024-01-20T09:00:00Z',
      suggestedActions: [
        '初回面談で経営課題ヒアリング',
        'ROI試算シミュレーション提示',
        '競合対策ポイント強調'
      ],
      narrativeExplanation: 'この推奨は過去の同業界成功案件から抽出された営業パターンに基づいています。顧客の経営規模と課題特性が95%の確度で一致しており、提案のタイミングと内容が最適と判定されました。',
      confidenceFactors: ['過去成功事例との適合度 95%', '顧客属性マッチ度 88%', '市場環境適合度 89%']
    };

    const result = await generateRecommendationWithFallback(
      mockRecommendationData,
      mockRecommendationEngine,
      mockFileStorageAdapter
    );

    expect(result.status).toBe('fallback_activated');
    expect(result.displayFormat).toBe('html');
    expect(result.errorMessage).toBe('レポート生成に失敗しました。画面上で推奨内容を確認するか、後ほど再度お試しください');
    expect(result.htmlContent).toBeDefined();
    expect(result.htmlContent).toContain('REC-20240115-001');
    expect(result.htmlContent).toContain('92');
    expect(result.htmlContent).toContain('この推奨は過去の同業界成功案件から抽出された営業パターンに基づいています');
    expect(result.retryAttempts).toBe(2);
    expect(result.retryTimestamps).toHaveLength(2);
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(3);
    expect(result.userCanBrowserSave).toBe(true);
  });
});
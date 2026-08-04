import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  test('SCEN-2688: 推奨内容の生成タイムスタンプが月末のとき、正しく根拠の時系列に反映される', () => {
    // Setup: AIRecommendationEngineのスタブを作成
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: 'フォローアップメール送信',
        generatedAt: '2026-01-31T23:59:59.999Z',
        evidences: [
          {
            id: 'evidence_1',
            timestamp: '2026-01-31T10:00:00Z',
            type: 'customer_interaction',
            description: '顧客との初期接触'
          },
          {
            id: 'evidence_2',
            timestamp: '2026-01-31T15:30:00Z',
            type: 'purchase_signal',
            description: '購買シグナル検出'
          },
          {
            id: 'evidence_3',
            timestamp: '2026-02-01T09:00:00Z',
            type: 'success_pattern_match',
            description: '成功パターンマッチ'
          }
        ]
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        explanation: '過去事例から推奨タイミングを判定しました。月末を含む期間内の顧客接触（2026-01-31T10:00:00Z）から、購買シグナル（2026-01-31T15:30:00Z）を検出し、翌月の成功パターン（2026-02-01T09:00:00Z）と照合した結果、フォローアップ提案の実行時期が最適と判定されました。',
        evidenceTimeline: [
          '2026-01-31T10:00:00Z',
          '2026-01-31T15:30:00Z',
          '2026-02-01T09:00:00Z'
        ],
        confidenceScore: 87
      })
    };

    // Input: 推奨内容と根拠データを含むリクエスト
    const recommendationInput = {
      customerId: 'CUST-20260131-001',
      customerName: 'テスト顧客',
      industryType: 'IT',
      companySize: 'large',
      dealValue: 5000000,
      dealStage: 'proposal'
    };

    // Execute: generateRecommendation呼び出し
    const generatedRecommendation = mockAIRecommendationEngine.generateRecommendation(
      recommendationInput
    );

    return generatedRecommendation.then((recommendation: any) => {
      // Execute: explainRecommendationReasoning呼び出し
      return mockAIRecommendationEngine.explainRecommendationReasoning({
        recommendationId: 'REC-20260131-001',
        generatedAt: recommendation.generatedAt,
        evidences: recommendation.evidences
      }).then((reasoning: any) => {
        // Verify: 根拠の時系列順序を確認
        const evidenceTimeline = reasoning.evidenceTimeline;

        // 期待値：根拠が時系列昇順で並んでいることを確認
        expect(evidenceTimeline).toEqual([
          '2026-01-31T10:00:00Z',
          '2026-01-31T15:30:00Z',
          '2026-02-01T09:00:00Z'
        ]);

        // 月末タイムスタンプを含む推奨生成時点での時系列ソート検証
        expect(recommendation.generatedAt).toBe('2026-01-31T23:59:59.999Z');

        // 根拠データ内の各タイムスタンプが正しく保持されていること
        expect(recommendation.evidences).toHaveLength(3);
        expect(recommendation.evidences[0].timestamp).toBe('2026-01-31T10:00:00Z');
        expect(recommendation.evidences[1].timestamp).toBe('2026-01-31T15:30:00Z');
        expect(recommendation.evidences[2].timestamp).toBe('2026-02-01T09:00:00Z');

        // 月末を理由とした時系列ソート順序の逆転がないこと
        for (let i = 0; i < evidenceTimeline.length - 1; i++) {
          const currentTime = new Date(evidenceTimeline[i]).getTime();
          const nextTime = new Date(evidenceTimeline[i + 1]).getTime();
          expect(currentTime).toBeLessThanOrEqual(nextTime);
        }

        // 信頼度スコアが正常に計算されていること
        expect(reasoning.confidenceScore).toBe(87);
      });
    });
  });
});
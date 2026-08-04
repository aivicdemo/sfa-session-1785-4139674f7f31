import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-1791
  test('推奨根拠の可視化機能 - 根拠データに商談IDが正確に含まれる', async () => {
    const dealId = 'DEAL-20250801-0047';
    const customerId = 'CUST-A-20250801-001';
    const recommendationId = 'REC-20250801-0047-001';

    const mockRecommendationContext = {
      dealId: dealId,
      customerId: customerId,
      proposalApproachId: 'APPROACH-20250801-001',
      successPatternId: 'PATTERN-ENTERPRISE-CONSULTATIVE-001',
      confidenceScore: 87,
      appliedPatterns: [
        {
          patternId: 'PATTERN-ENTERPRISE-CONSULTATIVE-001',
          patternName: '大規模企業向けコンサルティング提案',
          matchScore: 87,
          applicableConditions: [
            '顧客規模: 従業員数1000名以上',
            '業種: 金融・保険',
            '課題: デジタル変革推進'
          ]
        }
      ],
      customerSegmentData: {
        industry: 'Finance',
        employeeCount: 5000,
        revenue: '500M USD',
        currentChallenges: ['Digital Transformation', 'Cost Optimization']
      },
      similarSuccessCases: [
        {
          referenceDealId: 'DEAL-20250701-0031',
          caseTitle: '大手銀行のDX推進案件',
          adoptionRate: 95,
          contractValue: 2500000,
          timeToClose: 120
        },
        {
          referenceDealId: 'DEAL-20250601-0019',
          caseTitle: '保険会社の業務効率化案件',
          adoptionRate: 88,
          contractValue: 1800000,
          timeToClose: 95
        }
      ],
      timingFactors: {
        purchaseSignalDetected: true,
        optimalFollowupWindowStart: '2025-08-15T00:00:00Z',
        optimalFollowupWindowEnd: '2025-08-28T23:59:59Z',
        seasonalityScore: 78,
        competitiveUrgency: 'HIGH'
      },
      riskAssessment: {
        implementationRisk: 'LOW',
        adoptionRisk: 'MEDIUM',
        mitigation: '段階的実装アプローチの提案、導入支援チームの配置'
      }
    };

    const mockExplanationResponse = {
      recommendationId: recommendationId,
      dealId: dealId,
      targetDealExplanation: `提案根拠: 商談ID ${dealId} に対して、以下の要因に基づき推奨内容を生成しました。`,
      patternMatchExplanation: '適用成功パターン: 大規模企業向けコンサルティング提案パターン（適合度87%）。過去事例では同一業種・規模の顧客5社で92%の採用率を達成。',
      similarCasesExplanation: '参考事例: 商談ID DEAL-20250701-0031（大手銀行DX推進、採用率95%）と商談ID DEAL-20250601-0019（保険会社業務効率化、採用率88%）の成功要因を適用。',
      timingExplanation: '推奨実行時期: 2025年8月15日～28日が購買シグナル最適ウィンドウ。競合状況の緊急度が高く（HIGH）、本商談IDの進捗加速が必須。',
      customerContextExplanation: '顧客コンテキスト: 従業員数5000名の金融企業。デジタル変革推進と業務効率化が主要課題で、提案内容との適合度が高い。',
      riskMitigationExplanation: '想定リスク対応: 実装リスク（LOW）に対しては段階的アプローチ、採用リスク（MEDIUM）に対しては導入支援チーム配置で軽減。',
      confidenceScoreDetail: '総合信頼度スコア: 87点。パターン適合度（+22点）、類似成功事例の頻度（+18点）、顧客属性マッチング（+25点）、タイミング最適性（+22点）から構成。',
      recommendedNextActions: [
        `商談ID ${dealId} の営業担当者に対し、2025年8月15日中の顧客初期接触を推奨`,
        '提案資料に「段階的実装ロードマップ」セクションを追加',
        '導入支援チーム（SIパートナー）との事前アライメント'
      ],
      generatedAt: '2025-08-01T09:30:00Z',
      modelVersion: 'gpt-4-turbo-2025-08',
      dataSourceSummary: {
        historicalDealsAnalyzed: 247,
        matchingPatternsFound: 3,
        similarCasesRetrieved: 2,
        trainingDataCutoff: '2025-07-31'
      }
    };

    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue(mockExplanationResponse)
    };

    const result = await explainRecommendationReasoning(
      mockRecommendationContext,
      mockAIRecommendationEngine
    );

    expect(mockAIRecommendationEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      mockRecommendationContext
    );

    expect(result).toBeDefined();
    expect(result.dealId).toBe(dealId);
    expect(result.recommendationId).toBe(recommendationId);

    const visualizedReasoningContent = JSON.stringify(result);
    const dealIdOccurrenceCount = (visualizedReasoningContent.match(new RegExp(dealId, 'g')) || []).length;

    expect(dealIdOccurrenceCount).toBeGreaterThanOrEqual(1);

    expect(result.targetDealExplanation).toContain(dealId);

    expect(result.patternMatchExplanation).toBeDefined();
    expect(result.patternMatchExplanation.length).toBeGreaterThan(0);

    expect(result.similarCasesExplanation).toBeDefined();
    expect(result.timingExplanation).toBeDefined();
    expect(result.customerContextExplanation).toBeDefined();
    expect(result.riskMitigationExplanation).toBeDefined();

    expect(result.confidenceScoreDetail).toMatch(/87/);

    expect(Array.isArray(result.recommendedNextActions)).toBe(true);
    expect(result.recommendedNextActions.length).toBeGreaterThan(0);

    const nextActionsText = result.recommendedNextActions.join(' ');
    expect(nextActionsText).toContain(dealId);

    expect(result.generatedAt).toBe('2025-08-01T09:30:00Z');
    expect(result.dataSourceSummary).toBeDefined();
    expect(result.dataSourceSummary.historicalDealsAnalyzed).toBe(247);
    expect(result.dataSourceSummary.matchingPatternsFound).toBe(3);
  });
});
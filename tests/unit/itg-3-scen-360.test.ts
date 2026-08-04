import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('IT-1-BR-3-3-2-1: AIエージェント推奨支援システム - 外部API失敗時の代替推奨', () => {
  test('SCEN-360: OpenAI API呼び出し失敗時、内部推奨パターンマスタからの代替検索が正常に実行される', async () => {
    // テストデータ: 顧客規模『中堅企業』、業種『製造業』、商談段階『提案前』
    const dealInfo = {
      customerId: 'CUST-12345',
      companySize: 'mid_market',
      industry: 'manufacturing',
      dealStage: 'pre_proposal',
      dealValue: 5000000,
      productCategory: 'enterprise_software',
    };

    // 推奨パターンマスタのモックデータ
    // ① 中堅製造業への提案パターン（成功率78%、サンプル数156件）
    // ② 大規模製造業への提案パターン（成功率82%、サンプル数203件）
    // ③ 中堅卸売業への提案パターン（成功率71%、サンプル数89件）
    const recommendationPatternMaster = [
      {
        patternId: 'PAT-001',
        targetCompanySize: 'mid_market',
        targetIndustry: 'manufacturing',
        successRate: 78,
        sampleCount: 156,
        approachDescription: '段階的な導入提案を重視',
        matchScore: 100,
      },
      {
        patternId: 'PAT-002',
        targetCompanySize: 'enterprise',
        targetIndustry: 'manufacturing',
        successRate: 82,
        sampleCount: 203,
        approachDescription: 'グローバル対応機能を強調',
        matchScore: 45,
      },
      {
        patternId: 'PAT-003',
        targetCompanySize: 'mid_market',
        targetIndustry: 'wholesale',
        successRate: 71,
        sampleCount: 89,
        approachDescription: 'コスト最適化重視',
        matchScore: 30,
      },
    ];

    // OpenAI APIをスタブ化し、接続タイムアウトで失敗させる
    const mockAIEngine = {
      generateRecommendation: jest
        .fn()
        .mockRejectedValueOnce(new Error('Connection timeout'))
        .mockRejectedValueOnce(new Error('Connection timeout'))
        .mockRejectedValueOnce(new Error('Connection timeout')),
    };

    // generateRecommendation呼び出し
    const result = await generateRecommendation(
      dealInfo,
      mockAIEngine,
      recommendationPatternMaster
    );

    // 期待結果の検証
    expect(result).toEqual({
      status: 'fallback_applied',
      recommendation: {
        patternId: 'PAT-001',
        targetCompanySize: 'mid_market',
        targetIndustry: 'manufacturing',
        successRate: 78,
        sampleCount: 156,
        approachDescription: '段階的な導入提案を重視',
        matchScore: 100,
        reasoning:
          '過去156件の類似案件データから統計的に上位の成功パターンです',
      },
      userMessage:
        '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します',
      retryAttempts: 3,
      apiFailureDetected: true,
    });

    // OpenAI API呼び出しが指数バックオフで最大3回まで再試行されたことを確認
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(3);

    // 代替推奨がマスタから最高一致度のパターンであることを確認
    expect(result.recommendation.matchScore).toBe(100);
    expect(result.recommendation.successRate).toBe(78);
    expect(result.recommendation.sampleCount).toBe(156);

    // ユーザー向けメッセージが正しく表示されることを確認
    expect(result.userMessage).toMatch(/推奨の生成に一時的な遅延が発生しています/);
    expect(result.userMessage).toMatch(/過去の推奨履歴から類似案件を表示します/);

    // システムログにAPIエラーと代替動作が記録されたことを確認
    expect(result.apiFailureDetected).toBe(true);
    expect(result.status).toBe('fallback_applied');

    // 根拠説明が簡略版で返却されていることを確認
    expect(result.recommendation.reasoning).toBe(
      '過去156件の類似案件データから統計的に上位の成功パターンです'
    );
  });
});
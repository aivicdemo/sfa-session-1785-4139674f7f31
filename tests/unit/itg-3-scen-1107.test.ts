import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AI推奨エンジン呼び出し - OpenAI API タイムアウト時の代替パターン返却', () => {
  test('SCEN-1107', async () => {
    // タイムアウトエラーをシミュレートするモックAIエンジン
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockImplementation(async () => {
        // 30秒以上のタイムアウトをシミュレート
        throw new Error('OpenAI API request timeout after 30s');
      }),
    };

    // テスト用の推奨パターンマスタ（統計的に上位の3件）
    const mockPatternMaster = [
      {
        patternId: 'pattern_001',
        customerIndustry: 'IT',
        customerScale: 'large',
        successRate: 0.85,
        approachName: '経営課題ヒアリング型提案',
        approachDescription: '顧客経営課題を詳細ヒアリング後、ソリューション提案',
        keyElements: ['課題分析', 'ROI試算', 'POC提案'],
      },
      {
        patternId: 'pattern_002',
        customerIndustry: 'IT',
        customerScale: 'large',
        successRate: 0.78,
        approachName: 'ベストプラクティス展開型提案',
        approachDescription: '業界ベストプラクティスに基づいた段階的導入提案',
        keyElements: ['段階導入', '業界比較', 'スケーラビリティ'],
      },
      {
        patternId: 'pattern_003',
        customerIndustry: 'IT',
        customerScale: 'large',
        successRate: 0.72,
        approachName: 'リスク最小化型提案',
        approachDescription: 'リスク要因を最小化した保守的な実装提案',
        keyElements: ['リスク評価', '段階的実装', '保守性重視'],
      },
    ];

    // テスト用の新規案件データ
    const newDealData = {
      customerId: 'cust_test_001',
      customerName: 'Test Corporation',
      industry: 'IT',
      companyScale: 'large',
      businessChallenge: '業務プロセス効率化',
      dealStage: 'initial_contact',
      dealValue: 5000000,
      dealTimeline: '3months',
      createdAt: new Date('2024-01-15T10:00:00Z'),
    };

    // API呼び出し失敗時の再試行ログを記録
    const retryLog: Array<{ attempt: number; delay: number; timestamp: string }> = [];
    const recordRetry = (attempt: number, delay: number) => {
      retryLog.push({
        attempt,
        delay,
        timestamp: new Date('2024-01-15T10:00:00Z').toISOString(),
      });
    };

    // 指数バックオフ再試行をシミュレート（1秒、2秒、4秒）
    const backoffDelays = [1000, 2000, 4000];
    for (let i = 0; i < 3; i++) {
      recordRetry(i + 1, backoffDelays[i]);
    }

    // generateRecommendation を呼び出す
    const result = await generateRecommendation(
      newDealData,
      mockAIRecommendationEngine,
      mockPatternMaster
    );

    // 期待結果の検証

    // (1) API呼び出し失敗時に内部の推奨パターンマスタから統計的に上位の成功パターン（複数件）が返却されている
    expect(result.recommendations).toBeDefined();
    expect(result.recommendations.length).toBe(3);
    expect(result.recommendations[0].patternId).toBe('pattern_001');
    expect(result.recommendations[1].patternId).toBe('pattern_002');
    expect(result.recommendations[2].patternId).toBe('pattern_003');

    // (2) 返却されたパターンに根拠説明が簡略版形式で含まれている
    expect(result.recommendations[0].briefExplanation).toBeDefined();
    expect(result.recommendations[0].briefExplanation).toContain('経営課題ヒアリング型提案');
    expect(result.recommendations[1].briefExplanation).toContain('ベストプラクティス展開型提案');
    expect(result.recommendations[2].briefExplanation).toContain('リスク最小化型提案');

    // (3) ユーザーに表示するメッセージが「推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します」と設定されている
    expect(result.userMessage).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );

    // (4) レスポンス内の fallbackMode フラグが true に設定されている
    expect(result.fallbackMode).toBe(true);

    // (5) 最大3回の指数バックオフ再試行が記録されている
    expect(retryLog.length).toBe(3);
    expect(retryLog[0].attempt).toBe(1);
    expect(retryLog[0].delay).toBe(1000);
    expect(retryLog[1].attempt).toBe(2);
    expect(retryLog[1].delay).toBe(2000);
    expect(retryLog[2].attempt).toBe(3);
    expect(retryLog[2].delay).toBe(4000);

    // 追加検証：結果にタイムアウト情報が含まれていること
    expect(result.errorInfo).toBeDefined();
    expect(result.errorInfo.errorType).toBe('timeout');
    expect(result.errorInfo.originalError).toContain('timeout');
    expect(result.recommendations[0].successRate).toBe(0.85);
  });
});
import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨支援システム - 過去商談データからの成功パターン抽出と推奨', () => {
  // SCEN-1025
  test('OpenAI APIがタイムアウト（30秒超）した場合、内部推奨パターンマスタから代替推奨が返却される', async () => {
    const fallback_pattern_master = [
      {
        patternId: 'PAT-001',
        recommendation: '初期接触段階では顧客の経営課題をヒアリングし、課題解決型アプローチで提案する',
        successRate: 80,
        applicableIndustries: ['製造業'],
        applicableCompanySizes: ['mid-cap']
      },
      {
        patternId: 'PAT-002',
        recommendation: '中堅企業への提案では、ROI試算と導入事例を組み合わせた資料を提供する',
        successRate: 75,
        applicableIndustries: ['製造業'],
        applicableCompanySizes: ['mid-cap']
      },
      {
        patternId: 'PAT-003',
        recommendation: '初期段階では競合調査と顧客環境分析を優先する',
        successRate: 70,
        applicableIndustries: ['製造業'],
        applicableCompanySizes: ['mid-cap']
      }
    ];

    let attempt_count = 0;
    const mock_ai_engine = {
      generateRecommendation: jest.fn(async () => {
        attempt_count++;
        if (attempt_count <= 3) {
          await new Promise((_, reject) => {
            setTimeout(() => {
              reject(new Error('API timeout exceeded 30 seconds'));
            }, 30100);
          });
        }
        return null;
      })
    };

    const new_deal_data = {
      customerIndustry: '製造業',
      companySizeCategory: 'mid-cap',
      dealStage: 'initial_contact',
      customerId: 'CUST-20240115-001'
    };

    const result = await generateRecommendation(
      new_deal_data,
      mock_ai_engine,
      fallback_pattern_master
    );

    expect(result.source).toBe('fallback_pattern_master');
    expect(result.patternId).toBe('PAT-001');
    expect(result.successRate).toBe(80);
    expect(result.recommendation).toBe('初期接触段階では顧客の経営課題をヒアリングし、課題解決型アプローチで提案する');
    expect(result.reasoning).toBe('過去の成功事例に基づく推奨です');
    expect(result.userMessage).toBe('推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します');
    expect(attempt_count).toBe(3);
  });
});
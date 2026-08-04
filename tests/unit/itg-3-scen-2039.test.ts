import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-2039
  test('OpenAI API explainRecommendationReasoningがタイムアウトで失敗した場合、内部推奨パターンマスタから代替説明が提供される', async () => {
    const mockExternalEngine = {
      explainRecommendationReasoning: jest.fn().mockRejectedValue(
        new Error('API call timeout exceeded 30 seconds')
      ),
    };

    const mockRecommendationPatternMaster = [
      {
        pattern_id: 'PAT-001',
        industry: '製造業',
        challenge: 'コスト削減',
        pattern_name: '工程自動化アプローチ',
        brief_explanation: '製造業向けコスト削減提案は工程自動化アプローチが過去成功率85%で最適',
        success_rate: 0.85,
      },
      {
        pattern_id: 'PAT-002',
        industry: '製造業',
        challenge: 'コスト削減',
        pattern_name: 'サプライチェーン最適化',
        brief_explanation: 'サプライチェーン最適化により調達コスト平均20%削減を実現',
        success_rate: 0.78,
      },
    ];

    const customerInput = {
      industry: '製造業',
      challenge: 'コスト削減',
      proposal_content: '業務効率化ツール導入',
    };

    const retryAttempts: number[] = [];
    const mockExternalEngineWithRetry = {
      explainRecommendationReasoning: jest.fn(async () => {
        retryAttempts.push(Date.now());
        throw new Error('API call timeout exceeded 30 seconds');
      }),
    };

    const result = await explainRecommendationReasoning(
      customerInput,
      mockExternalEngineWithRetry,
      mockRecommendationPatternMaster
    );

    expect(mockExternalEngineWithRetry.explainRecommendationReasoning).toHaveBeenCalledTimes(3);
    
    expect(result).toEqual({
      is_fallback: true,
      pattern_id: 'PAT-001',
      pattern_name: '工程自動化アプローチ',
      brief_explanation: '製造業向けコスト削減提案は工程自動化アプローチが過去成功率85%で最適',
      success_rate: 0.85,
      user_message: '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します',
    });

    expect(result.pattern_id).toBe('PAT-001');
    expect(result.success_rate).toBe(0.85);
    expect(result.is_fallback).toBe(true);
    expect(result.user_message).toMatch(/推奨の生成に一時的な遅延が発生しています/);
  });
});
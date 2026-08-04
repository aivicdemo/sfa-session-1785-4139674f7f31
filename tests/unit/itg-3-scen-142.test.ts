import { generateRecommendationWithFallback } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-142
  test('AIエージェント呼び出しタイムアウト時に内部パターンマスタから根拠が代替生成される', async () => {
    // 新規案件の顧客・商談条件を定義
    const dealCondition = {
      industry: 'IT',
      budget: 5000000, // 500万円
      challenge: 'DX推進',
      companySize: 'large',
      existingProducts: []
    };

    // AIRecommendationEngine スタブ：タイムアウト遅延を設定
    // 3回の指数バックオフ再試行（1秒→2秒→4秒）でタイムアウト
    const aiEngineStub = {
      generateRecommendation: jest.fn(async () => {
        return new Promise((_, reject) => {
          setTimeout(
            () => reject(new Error('API timeout: 30000ms exceeded')),
            31000 // 30秒以上のタイムアウト
          );
        });
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    // 内部パターンマスタ：過去の同業種・同予算帯の成功パターン
    const internalPatternMaster = {
      getTopPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'PAT-IT-5M-001',
          industry: 'IT',
          budgetMin: 4000000,
          budgetMax: 6000000,
          successRate: 0.85,
          pattern: {
            approachType: 'consultative_sales',
            recommendedProduct: 'DX推進パッケージ',
            keyMessages: ['業務効率化', 'コスト削減', 'リスク低減'],
            successCount: 42,
            totalCount: 49
          },
          simplifiedReasoning: 'IT業種の500万円予算帯では、DX推進パッケージの採用率が85%で最高。過去42件の成功事例から推奨'
        }
      ])
    };

    // システムの動作を実行
    const result = await generateRecommendationWithFallback(
      dealCondition,
      aiEngineStub,
      internalPatternMaster
    );

    // 検証1：AIエージェント呼び出しが3回再試行されたことを確認
    // 初回1秒、2回目2秒、3回目4秒の指数バックオフ
    expect(aiEngineStub.generateRecommendation).toHaveBeenCalledTimes(3);

    // 検証2：内部パターンマスタへのアクセスが実行されたことを確認
    expect(internalPatternMaster.getTopPatterns).toHaveBeenCalledWith({
      industry: 'IT',
      budgetMin: 4000000,
      budgetMax: 6000000
    });

    // 検証3：生成された推奨内容に簡略版の根拠説明が含まれていることを確認
    expect(result.recommendationReasoning).toBe(
      'IT業種の500万円予算帯では、DX推進パッケージの採用率が85%で最高。過去42件の成功事例から推奨'
    );

    // 検証4：推奨内容に代替パターンマスタから取得した成功パターンが含まれていることを確認
    expect(result.recommendedApproach).toEqual({
      approachType: 'consultative_sales',
      recommendedProduct: 'DX推進パッケージ',
      keyMessages: ['業務効率化', 'コスト削減', 'リスク低減']
    });

    // 検証5：ユーザー向けメッセージが正しく生成されていることを確認
    expect(result.userMessage).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );

    // 検証6：フォールバック状態が正しく記録されていることを確認
    expect(result.isFallback).toBe(true);

    // 検証7：推奨内容の信頼度スコア（0～100）が代替パターンの成功率から算出されていることを確認
    // 成功率 0.85 から信頼度スコア 85 に換算
    expect(result.confidenceScore).toBe(85);

    // 検証8：パターンマスタから取得したデータの統計情報が含まれていることを確認
    expect(result.fallbackPatternInfo).toEqual({
      patternId: 'PAT-IT-5M-001',
      successCount: 42,
      totalCount: 49,
      successRate: 0.85
    });

    // 検証9：推奨内容がJSON形式で正常に生成されていることを確認
    expect(typeof result).toBe('object');
    expect(result).toHaveProperty('recommendedApproach');
    expect(result).toHaveProperty('recommendationReasoning');
    expect(result).toHaveProperty('userMessage');
    expect(result).toHaveProperty('isFallback');
    expect(result).toHaveProperty('confidenceScore');
  });
});
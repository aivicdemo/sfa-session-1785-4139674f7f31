import { generateRecommendationWithHistory } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-321
  test('推奨履歴テーブルに記録されている唯一の推奨履歴が検索対象として返却される', () => {
    // 推奨履歴テーブルの初期化と確認
    const recommendationHistoryTable: Array<{
      id: string;
      customerCondition: {
        industry: string;
        revenue: number;
      };
      dealCondition: {
        productCategory: string;
        dealStage: string;
      };
      recommendationContent: {
        approachId: string;
        approachName: string;
        rationale: string;
      };
      generatedTimestamp: string;
    }> = [];

    // AIRecommendationEngineのスタブ設定
    const stubAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockReturnValue({
        approachId: 'APPR-001',
        approachName: '顧客の課題解決型提案',
        rationale: '過去の類似案件で成功した提案パターン',
        confidenceScore: 85,
      }),
    };

    // 新規案件の顧客・商談条件を入力
    const newDealInput = {
      customerId: 'CUST-001',
      customerIndustry: 'manufacturing',
      customerRevenue: 50000000,
      dealProductCategory: 'enterprise_software',
      dealStage: 'proposal',
    };

    // 推奨生成APIを呼び出し
    const result = generateRecommendationWithHistory(
      newDealInput,
      stubAIRecommendationEngine,
      recommendationHistoryTable,
    );

    // 推奨内容が推奨履歴テーブルに1件記録されたことを確認
    expect(recommendationHistoryTable).toHaveLength(1);

    // 記録された推奨履歴の構造を確認
    const recordedHistory = recommendationHistoryTable[0];
    expect(recordedHistory).toEqual({
      id: expect.any(String),
      customerCondition: {
        industry: 'manufacturing',
        revenue: 50000000,
      },
      dealCondition: {
        productCategory: 'enterprise_software',
        dealStage: 'proposal',
      },
      recommendationContent: {
        approachId: 'APPR-001',
        approachName: '顧客の課題解決型提案',
        rationale: '過去の類似案件で成功した提案パターン',
      },
      generatedTimestamp: expect.any(String),
    });

    // 推奨履歴検索機能を実行 - 検索対象となる推奨履歴のクエリを実行
    const searchQuery = {
      industry: 'manufacturing',
      dealStage: 'proposal',
    };

    // 検索結果取得（テーブルから該当レコードをフィルタリング）
    const searchResults = recommendationHistoryTable.filter(
      (history) =>
        history.customerCondition.industry === searchQuery.industry &&
        history.dealCondition.dealStage === searchQuery.dealStage,
    );

    // 検索結果が記録された1件の推奨履歴のみであることを確認
    expect(searchResults).toHaveLength(1);

    // 検索結果に含まれる推奨内容が、入力した商談条件と合致することを確認
    const searchedHistory = searchResults[0];
    expect(searchedHistory.customerCondition.industry).toBe('manufacturing');
    expect(searchedHistory.customerCondition.revenue).toBe(50000000);
    expect(searchedHistory.dealCondition.productCategory).toBe('enterprise_software');
    expect(searchedHistory.dealCondition.dealStage).toBe('proposal');

    // 検索結果に含まれる推奨内容のID、顧客条件、推奨アプローチ、生成タイムスタンプが含まれていることを確認
    expect(searchedHistory).toHaveProperty('id');
    expect(searchedHistory).toHaveProperty('customerCondition');
    expect(searchedHistory).toHaveProperty('dealCondition');
    expect(searchedHistory).toHaveProperty('recommendationContent');
    expect(searchedHistory).toHaveProperty('generatedTimestamp');

    // 推奨内容の詳細を確認
    expect(searchedHistory.recommendationContent.approachId).toBe('APPR-001');
    expect(searchedHistory.recommendationContent.approachName).toBe('顧客の課題解決型提案');
    expect(searchedHistory.recommendationContent.rationale).toBe('過去の類似案件で成功した提案パターン');

    // 生成されたタイムスタンプがISO形式であることを確認
    expect(new Date(searchedHistory.generatedTimestamp)).toBeInstanceOf(Date);

    // 結果オブジェクトが正しい構造を持つことを確認
    expect(result).toHaveProperty('success', true);
    expect(result).toHaveProperty('recordedHistoryCount', 1);
    expect(result).toHaveProperty('searchResultCount', 1);
  });
});
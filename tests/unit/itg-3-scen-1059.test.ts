import { generateRecommendation } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  test('SCEN-1059: [normal] 推奨内容の根拠表示機能 - 推奨根拠テーブルに履歴として記録される', async () => {
    // テスト用AIエージェントスタブの定義
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation: '顧客の課題はコスト削減のため、SaaS型ソリューション提案が適切',
        reasoningId: 'REASON-20250801-001',
        reasoningDetail: '過去12ヶ月の類似案件5件中4件で同一提案アプローチにより成約。成功率80%'
      })
    };

    // テスト用DB操作スタブの定義
    const mockDatabase = {
      recordRecommendationReasoning: jest.fn().mockResolvedValue({
        reasoningId: 'REASON-20250801-001',
        recommendation: '顧客の課題はコスト削減のため、SaaS型ソリューション提案が適切',
        reasoning: '過去12ヶ月の類似案件5件中4件で同一提案アプローチにより成約。成功率80%',
        createdAt: '2025-08-01T10:30:00Z',
        createdByUserId: 'USER-SALESPERSON-001'
      }),
      queryRecommendationReasoning: jest.fn()
        .mockResolvedValueOnce([
          {
            reasoningId: 'REASON-20250801-001',
            recommendation: '顧客の課題はコスト削減のため、SaaS型ソリューション提案が適切',
            reasoning: '過去12ヶ月の類似案件5件中4件で同一提案アプローチにより成約。成功率80%',
            createdAt: '2025-08-01T10:30:00Z',
            createdByUserId: 'USER-SALESPERSON-001'
          }
        ])
        .mockResolvedValueOnce([
          {
            reasoningId: 'REASON-20250801-001',
            recommendation: '顧客の課題はコスト削減のため、SaaS型ソリューション提案が適切',
            reasoning: '過去12ヶ月の類似案件5件中4件で同一提案アプローチにより成約。成功率80%',
            createdAt: '2025-08-01T10:30:00Z',
            createdByUserId: 'USER-SALESPERSON-001'
          },
          {
            reasoningId: 'REASON-20250801-002',
            recommendation: '建設業向けのデジタル変革ソリューション提案が適切',
            reasoning: '過去6ヶ月の類似案件3件中3件で同一提案アプローチにより成約。成功率100%',
            createdAt: '2025-08-01T11:45:00Z',
            createdByUserId: 'USER-SALESPERSON-001'
          }
        ])
        .mockResolvedValueOnce([
          {
            reasoningId: 'REASON-20250801-001',
            recommendation: '顧客の課題はコスト削減のため、SaaS型ソリューション提案が適切',
            reasoning: '過去12ヶ月の類似案件5件中4件で同一提案アプローチにより成約。成功率80%',
            createdAt: '2025-08-01T10:30:00Z',
            createdByUserId: 'USER-SALESPERSON-001'
          },
          {
            reasoningId: 'REASON-20250801-002',
            recommendation: '建設業向けのデジタル変革ソリューション提案が適切',
            reasoning: '過去6ヶ月の類似案件3件中3件で同一提案アプローチにより成約。成功率100%',
            createdAt: '2025-08-01T11:45:00Z',
            createdByUserId: 'USER-SALESPERSON-001'
          }
        ])
    };

    // 第1回目の推奨生成実行
    const firstCaseInput = {
      customerName: 'ABC商事',
      industry: '製造業',
      budget: 5000000,
      userId: 'USER-SALESPERSON-001'
    };

    const firstResult = await generateRecommendation(
      firstCaseInput,
      mockAIEngine,
      mockDatabase,
      new Date('2025-08-01T10:30:00Z')
    );

    // 第1回目の推奨内容と根拠が返却されることを確認
    expect(firstResult.recommendation).toBe('顧客の課題はコスト削減のため、SaaS型ソリューション提案が適切');
    expect(firstResult.reasoningId).toBe('REASON-20250801-001');
    expect(firstResult.reasoningDetail).toBe('過去12ヶ月の類似案件5件中4件で同一提案アプローチにより成約。成功率80%');

    // 推奨根拠テーブルへの記録メソッドが呼ばれたことを確認
    expect(mockDatabase.recordRecommendationReasoning).toHaveBeenCalledWith({
      reasoningId: 'REASON-20250801-001',
      recommendation: '顧客の課題はコスト削減のため、SaaS型ソリューション提案が適切',
      reasoning: '過去12ヶ月の類似案件5件中4件で同一提案アプローチにより成約。成功率80%',
      createdAt: '2025-08-01T10:30:00Z',
      createdByUserId: 'USER-SALESPERSON-001'
    });

    // 第1回目後の推奨根拠テーブルの内容を検証
    const firstQueryResult = await mockDatabase.queryRecommendationReasoning();
    expect(firstQueryResult).toHaveLength(1);
    expect(firstQueryResult[0].reasoningId).toBe('REASON-20250801-001');
    expect(firstQueryResult[0].recommendation).toBe('顧客の課題はコスト削減のため、SaaS型ソリューション提案が適切');
    expect(firstQueryResult[0].reasoning).toBe('過去12ヶ月の類似案件5件中4件で同一提案アプローチにより成約。成功率80%');
    expect(firstQueryResult[0].createdAt).toBe('2025-08-01T10:30:00Z');
    expect(firstQueryResult[0].createdByUserId).toBe('USER-SALESPERSON-001');

    // 第2回目の推奨生成実行
    mockAIEngine.generateRecommendation.mockResolvedValueOnce({
      recommendation: '建設業向けのデジタル変革ソリューション提案が適切',
      reasoningId: 'REASON-20250801-002',
      reasoningDetail: '過去6ヶ月の類似案件3件中3件で同一提案アプローチにより成約。成功率100%'
    });

    mockDatabase.recordRecommendationReasoning.mockResolvedValueOnce({
      reasoningId: 'REASON-20250801-002',
      recommendation: '建設業向けのデジタル変革ソリューション提案が適切',
      reasoning: '過去6ヶ月の類似案件3件中3件で同一提案アプローチにより成約。成功率100%',
      createdAt: '2025-08-01T11:45:00Z',
      createdByUserId: 'USER-SALESPERSON-001'
    });

    const secondCaseInput = {
      customerName: 'XYZ工業',
      industry: '建設業',
      budget: 10000000,
      userId: 'USER-SALESPERSON-001'
    };

    const secondResult = await generateRecommendation(
      secondCaseInput,
      mockAIEngine,
      mockDatabase,
      new Date('2025-08-01T11:45:00Z')
    );

    // 第2回目の推奨内容と根拠が返却されることを確認
    expect(secondResult.recommendation).toBe('建設業向けのデジタル変革ソリューション提案が適切');
    expect(secondResult.reasoningId).toBe('REASON-20250801-002');
    expect(secondResult.reasoningDetail).toBe('過去6ヶ月の類似案件3件中3件で同一提案アプローチにより成約。成功率100%');

    // 第2回目後の推奨根拠テーブルの内容を検証
    const secondQueryResult = await mockDatabase.queryRecommendationReasoning();
    expect(secondQueryResult).toHaveLength(2);
    
    // 最初のレコードの内容確認
    expect(secondQueryResult[0].reasoningId).toBe('REASON-20250801-001');
    expect(secondQueryResult[0].recommendation).toBe('顧客の課題はコスト削減のため、SaaS型ソリューション提案が適切');
    expect(secondQueryResult[0].reasoning).toBe('過去12ヶ月の類似案件5件中4件で同一提案アプローチにより成約。成功率80%');
    expect(secondQueryResult[0].createdAt).toBe('2025-08-01T10:30:00Z');
    expect(secondQueryResult[0].createdByUserId).toBe('USER-SALESPERSON-001');

    // 新規レコードの内容確認
    expect(secondQueryResult[1].reasoningId).toBe('REASON-20250801-002');
    expect(secondQueryResult[1].recommendation).toBe('建設業向けのデジタル変革ソリューション提案が適切');
    expect(secondQueryResult[1].reasoning).toBe('過去6ヶ月の類似案件3件中3件で同一提案アプローチにより成約。成功率100%');
    expect(secondQueryResult[1].createdAt).toBe('2025-08-01T11:45:00Z');
    expect(secondQueryResult[1].createdByUserId).toBe('USER-SALESPERSON-001');

    // 全レコード数が2件であることを最終確認
    const finalQueryResult = await mockDatabase.queryRecommendationReasoning();
    expect(finalQueryResult).toHaveLength(2);
  });
});
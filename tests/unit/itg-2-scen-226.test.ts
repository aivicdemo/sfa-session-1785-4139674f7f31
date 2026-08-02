import { convertProcessStandardToSystemRequirement } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン - プロセス標準書ドラフトステータス検証', () => {
  test('SCEN-226: プロセス標準書が承認済み状態のとき変換処理がエラーで終了すること', () => {
    const processStandardDraft = {
      id: 'draft-001',
      status: 'approved',
      content: {
        stages: [
          {
            stageName: '初回接触',
            description: '顧客との初回接触プロセス',
            dataItems: ['顧客名', '接触日時', '接触理由'],
          },
          {
            stageName: '提案',
            description: '提案実施プロセス',
            dataItems: ['提案内容', '提案金額', '提案日時'],
          },
        ],
        judgmentCriteria: {
          successCondition: '商談成約',
          failureCondition: '顧客拒否',
        },
      },
    };

    expect(() => convertProcessStandardToSystemRequirement(processStandardDraft)).toThrow(/承認済み/);
  });
});
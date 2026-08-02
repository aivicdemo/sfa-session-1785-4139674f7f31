import { convertDataQualityRequirements } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  test('SCEN-236: [normal] 複数件のデータ項目の要件仕様が正常に変換される', () => {
    // 入力: 3件以上のデータ項目を含む要件仕様定義
    const inputRequirements = [
      {
        itemName: 'customer_name',
        dataType: 'string',
        required: true,
        maxLength: 100,
        minLength: 1,
        pattern: '^[ァ-ヴー一-龯a-zA-Z0-9_\\-\\s]*$',
        description: '顧客名',
      },
      {
        itemName: 'email',
        dataType: 'string',
        required: true,
        maxLength: 255,
        minLength: 5,
        pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
        description: 'メールアドレス',
      },
      {
        itemName: 'annual_revenue',
        dataType: 'number',
        required: false,
        minValue: 0,
        maxValue: 999999999,
        description: '年間売上',
      },
      {
        itemName: 'established_date',
        dataType: 'date',
        required: false,
        dateFormat: 'YYYY-MM-DD',
        description: '設立日',
      },
      {
        itemName: 'industry_code',
        dataType: 'string',
        required: true,
        maxLength: 10,
        minLength: 1,
        enumValues: ['1001', '1002', '1003', '2001', '2002'],
        description: '業種コード',
      },
    ];

    // 実行: 要件仕様変換処理
    const result = convertDataQualityRequirements(inputRequirements);

    // 検証: 出力オブジェクトの構造と内容
    expect(result.totalItems).toBe(5);
    expect(result.items).toHaveLength(5);

    // データ項目1: customer_name
    expect(result.items[0]).toEqual({
      itemName: 'customer_name',
      dataType: 'string',
      required: true,
      maxLength: 100,
      minLength: 1,
      pattern: '^[ァ-ヴー一-龯a-zA-Z0-9_\\-\\s]*$',
      description: '顧客名',
      validationRules: {
        type: 'string',
        required: true,
        length: { min: 1, max: 100 },
        pattern: '^[ァ-ヴー一-龯a-zA-Z0-9_\\-\\s]*$',
      },
    });

    // データ項目2: email
    expect(result.items[1]).toEqual({
      itemName: 'email',
      dataType: 'string',
      required: true,
      maxLength: 255,
      minLength: 5,
      pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
      description: 'メールアドレス',
      validationRules: {
        type: 'string',
        required: true,
        length: { min: 5, max: 255 },
        pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
      },
    });

    // データ項目3: annual_revenue
    expect(result.items[2]).toEqual({
      itemName: 'annual_revenue',
      dataType: 'number',
      required: false,
      minValue: 0,
      maxValue: 999999999,
      description: '年間売上',
      validationRules: {
        type: 'number',
        required: false,
        range: { min: 0, max: 999999999 },
      },
    });

    // データ項目4: established_date
    expect(result.items[3]).toEqual({
      itemName: 'established_date',
      dataType: 'date',
      required: false,
      dateFormat: 'YYYY-MM-DD',
      description: '設立日',
      validationRules: {
        type: 'date',
        required: false,
        dateFormat: 'YYYY-MM-DD',
      },
    });

    // データ項目5: industry_code
    expect(result.items[4]).toEqual({
      itemName: 'industry_code',
      dataType: 'string',
      required: true,
      maxLength: 10,
      minLength: 1,
      enumValues: ['1001', '1002', '1003', '2001', '2002'],
      description: '業種コード',
      validationRules: {
        type: 'string',
        required: true,
        length: { min: 1, max: 10 },
        enumValues: ['1001', '1002', '1003', '2001', '2002'],
      },
    });

    // 変換結果のメタ情報を検証
    expect(result.conversionStatus).toBe('success');
    expect(result.convertedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
    expect(result.totalItems).toBe(result.items.length);
  });
});
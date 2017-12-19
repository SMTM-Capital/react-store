import update from './immutable-update';

test('should create auto object', () => {
    const before = {
        a: { name: 'hari' },
        b: { name: 'shyam' },
    };
    const after = {
        a: { name: 'hari' },
        b: { name: 'chyame' },
        c: { name: 'gita' },
    };
    const settings = {
        b: { $auto: {
            $set: { name: 'chyame' },
        } },
        c: { $auto: {
            $set: { name: 'gita' },
        } },
    };
    expect(update(before, settings)).toEqual(after);
});


test('should create auto array', () => {
    const before = {
        a: ['hari'],
        b: ['shyam'],
    };
    const after = {
        a: ['hari'],
        b: ['shyam', 'chyame'],
        c: ['gita'],
    };
    const settings = {
        b: { $autoArray: {
            $push: ['chyame'],
        } },
        c: { $autoArray: {
            $push: ['gita'],
        } },
    };
    expect(update(before, settings)).toEqual(after);
});

test('should set conditionally', () => {
    const before = {
        a: { name: 'hari' },
        b: { name: 'shyam' },
    };
    const after = {
        a: { name: 'hari' },
        b: { name: 'gita' },
    };
    const settings = {
        a: { $if: [
            false,
            { $set: { name: 'chyame' } },
        ] },
        b: { $if: [
            true,
            { $set: { name: 'gita' } },
        ] },
    };
    expect(update(before, settings)).toEqual(after);
});

test('should filter array', () => {
    const before = {
        a: ['hari'],
        b: ['shyam', 'chyame'],
    };
    const after = {
        a: ['hari'],
        b: ['shyam'],
    };
    const settings = {
        b: {
            $filter: word => word.length <= 5,
        },
    };
    expect(update(before, settings)).toEqual(after);
});

test('should apply bulk action', () => {
    const before = {
        a: ['hari'],
        b: ['shyam', 'chyame'],
    };
    const after = {
        a: ['hari'],
        b: ['shyam', 'sundar'],
    };
    const settings = {
        b: {
            $bulk: [
                { $filter: word => word.length <= 5 },
                { $push: ['sundar'] },
            ],
        },
    };
    expect(update(before, settings)).toEqual(after);
});

/**
 * @author tnagorra <weathermist@gmail.com>
 */

export const isFalsy = val => (
    val === undefined || val === null || Number.isNaN(val) || val === false
);

export const isTruthy = val => !isFalsy(val);

// added by @frozenhelium
export const isEqualAndTruthy = (a, b) => (
    isTruthy(a) && (a === b)
);

export const bound = (value, max, min) => (
    Math.max(min, Math.min(max, value))
);

export const normalize = (value, max, min) => (
    (value - min) / (max - min)
);

export const randomString = (length = 8) => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i += 1) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;

    /*
     * -------------------------------------------------
     * better Algorithm, but not supported by enzyme :(
     * -------------------------------------------------

    const randomValues = new Uint8Array(length);
    window.crypto.getRandomValues(randomValues);
    return Array.from(randomValues, v => v.toString(36)).join('').substring(0, 8);
    */
};

/**
* Extract Date from timestamp
*/
export const extractDate = (timestamp) => {
    const today = new Date(timestamp);
    today.setHours(0, 0, 0, 0);
    return today.getTime();
};

/**
* Get Difference in days for (a - b)
*/
export const getDifferenceInDays = (a, b) => {
    const dateA = extractDate(a);
    const dateB = extractDate(b);
    return (dateA - dateB) / (1000 * 60 * 60 * 24);
};

/**
* Get Difference in human readable for (a - b)
*/
export const getDateDifferenceHumanReadable = (a, b) => {
    const daysDiff = getDifferenceInDays(a, b);
    return `${daysDiff} day${daysDiff === 1 ? '' : 's'}`;
};

export const addSeparator = (num, separator = ',') => {
    const nStr = String(num);
    const x = nStr.split('.');
    let x1 = x[0];
    const x2 = x.length > 1 ? `.${x[1]}` : '';
    const rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, `$1${separator}$2`);
    }
    return x1 + x2;
};

export const formattedNormalize = (number) => {
    let normalizeSuffix;
    let normalizedNumber = number;
    const digits = Math.log10(Math.abs(number));

    // something like foreach here

    if (digits >= 9) {
        normalizeSuffix = 'Ar';
        normalizedNumber /= 1000000000;
    } else if (digits >= 7) {
        normalizeSuffix = 'Cr';
        normalizedNumber /= 10000000;
    } else if (digits >= 5) {
        normalizeSuffix = 'Lac';
        normalizedNumber /= 100000;
    }
    return {
        number: normalizedNumber,
        normalizeSuffix,
    };
};

export const getRandomFromList = (items = []) => (
    items[Math.floor(Math.random() * items.length)]
);

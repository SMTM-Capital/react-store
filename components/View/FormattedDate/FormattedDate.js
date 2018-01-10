import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './styles.scss';


const propTypes = {
    /**
     * Timestamp
     */
    date: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    /**
     * Options
     */
    mode: PropTypes.string,
};

const defaultProps = {
    date: undefined,
    mode: 'dd-MM-yyyy',
};

/**
 * Show timestamp in Human Readable Format
 */
@CSSModules(styles, { allowMultiple: true })
export default class FormattedDate extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    static MONTHS = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June',
        'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];

    static format = (date, mode) => {
        const year = date.getFullYear();
        const month = (`0${date.getMonth() + 1}`).slice(-2);
        const monthHR = FormattedDate.MONTHS[date.getMonth()];
        const day = (`0${date.getDate()}`).slice(-2);
        const hour = (`0${date.getHours()}`).slice(-2);
        const minute = (`0${date.getMinutes()}`).slice(-2);

        let fDate;
        switch (mode) {
            case 'yyyy-MM-dd':
                fDate = `${year}-${month}-${day}`;
                break;
            case 'dd-MM-yyyy':
                fDate = `${day}-${month}-${year}`;
                break;
            case 'dd-MM-yyyy hh:mm':
                fDate = `${day}-${month}-${year} ${hour}:${minute}`;
                break;
            case 'MM-dd-yyyy':
                fDate = `${month}-${day}-${year}`;
                break;
            case 'MM-dd-yyyy hh:mm':
                fDate = `${month}-${day}-${year} ${hour}:${minute}`;
                break;
            case 'hh:mm tt': {
                const hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
                const amPm = date.getHours() >= 12 ? 'PM' : 'AM';
                fDate = `${hours}:${minute} ${amPm}`;
                break;
            } case 'MMM dd, yyyy':
                // TODO: fix this
                fDate = `${monthHR} ${day}, ${year}`;
                break;
            case 'MMM dd, yyyy hh:mm tt': {
                const hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
                const amPm = date.getHours() >= 12 ? 'PM' : 'AM';
                fDate = `${monthHR} ${day}, ${year} ${hours}:${minute} ${amPm}`;
                break;
            } case 'dd MMM, yyyy':
                // TODO: fix this
                fDate = `${day} ${monthHR}, ${year}`;
                break;
            default:
                fDate = date.toLocaleDateString();
        }
        return fDate;
    };

    render() {
        const { date, mode } = this.props;
        const formattedDate = date ? FormattedDate.format(new Date(date), mode) : '-';

        return (
            <span
                className="formatted-date"
                styleName="formatted-date-value"
            >
                { formattedDate }
            </span>
        );
    }
}

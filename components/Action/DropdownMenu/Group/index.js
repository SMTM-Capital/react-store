import PropTypes from 'prop-types';
import React from 'react';

import styles from './styles.scss';

const propTypes = {
    /**
     * child elements
     */
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.element,
    ]).isRequired,
};


export default class Group extends React.PureComponent {
    static propTypes = propTypes;

    render() {
        const {
            children,
        } = this.props;

        return (
            <div className={styles.group}>
                {children}
            </div>
        );
    }
}

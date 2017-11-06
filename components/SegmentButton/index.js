import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './styles.scss';
import { randomString } from '../../utils/common';

// TODO: @adityakhatri47, Rename property 'onPress' to 'onClick' for consistency
const propTypes = {
    className: PropTypes.string,
    data: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.string,
        }).isRequired,
    ).isRequired,
    onPress: PropTypes.func.isRequired,
    selected: PropTypes.string.isRequired,
};

const defaultProps = {
    className: '',
};

@CSSModules(styles, { allowMultiple: true })
export default class SegmentButton extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);
        // NOTE: Appending randomStr in identifiers to avoid conflict in global namespace
        const randomStr = randomString(5);

        const { data, selected } = this.props;
        // NOTE: 'data' cannot not change after initialization
        this.buttonGroupName = `buttonGroup-${randomStr}`;
        this.buttonIdentifiers = data.map((val, i) => `input-${i}-${randomStr}`);

        this.state = {
            selectedValue: selected,
        };
    }

    handleOptionChange = (changeEvent) => {
        const { value } = changeEvent.target;
        this.props.onPress(value);
        this.setState({ selectedValue: value });
    };

    render() {
        const {
            className,
            data,
        } = this.props;
        const { selectedValue } = this.state;

        return (
            <div
                className={`segment-button ${className}`}
                styleName="segment-container"
            >
                {
                    data.map((button, i) => (
                        <label
                            htmlFor={this.buttonIdentifiers[i]}
                            key={button.value}
                            className={`button ${selectedValue === button.value ? 'active' : ''}`}
                            styleName={`segment-label ${selectedValue === button.value ? 'active' : ''}`}
                        >
                            <input
                                checked={selectedValue === button.value}
                                className="input"
                                id={this.buttonIdentifiers[i]}
                                name={this.buttonGroupName}
                                onChange={this.handleOptionChange}
                                type="radio"
                                value={button.value}
                            />
                            <p
                                className="label"
                                styleName="segment-name"
                            >
                                {button.label}
                            </p>
                        </label>
                    ))
                }
            </div>
        );
    }
}

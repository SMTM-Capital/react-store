import React, { PureComponent } from 'react';
import CSSModules from 'react-css-modules';
import { PropTypes } from 'prop-types';
import { categoricalColorNames, getCategoryColorScheme } from '../../../utils/ColorScheme';
import ForceDirectedGraph from '../ForceDirectedGraph';
import ColorPallete from '../ColorPallete';

import { SelectInput } from '../../Input';
import { PrimaryButton } from '../../Action';

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
    colorScheme: PropTypes.arrayOf(PropTypes.string),
};

const defaultProps = {
    className: '',
    colorScheme: undefined,
};

@CSSModules(styles, { allowMultiple: true })
export default class ForcedDirectedGraphView extends PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        this.state = {
            colorScheme: undefined,
            selectedColorScheme: undefined,
        };

        this.colors = categoricalColorNames()
            .map(color => (
                {
                    title: color,
                    id: name,
                    image: <ColorPallete colorScheme={getCategoryColorScheme(color)} />,
                }));
    }

    componentWillReceiveProps(newProps) {
        this.setState({ colorScheme: newProps.colorScheme });
    }

    handleSelection = (data) => {
        const colors = getCategoryColorScheme(data);
        this.setState({
            colorScheme: colors,
            selectedColorScheme: data,
        });
    }

    handleSave = () => {
        this.chart.wrappedComponent.save();
    }

    render() {
        const {
            className,
            ...otherProps
        } = this.props;
        return (
            <div
                styleName="force-directed-graph-view"
                className={className}
            >
                <div styleName="action">
                    <div styleName="action-selects">
                        <SelectInput
                            clearable={false}
                            keySelector={d => d.title}
                            labelSelector={d => d.image}
                            onChange={this.handleSelection}
                            options={this.colors}
                            showHintAndError={false}
                            styleName="select-input"
                            value={this.state.selectedColorScheme}
                        />
                    </div>
                    <div styleName="action-buttons">
                        <PrimaryButton onClick={this.handleSave}>
                            Save
                        </PrimaryButton>
                    </div>
                </div>
                <ForceDirectedGraph
                    styleName="force-directed-graph"
                    ref={(instance) => { this.chart = instance; }}
                    {...otherProps}
                    colorScheme={this.state.colorScheme}
                />
            </div>
        );
    }
}

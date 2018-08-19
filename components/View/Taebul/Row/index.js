import React from 'react';
import PropTypes from 'prop-types';

import ListView from '../../List/ListView';

import Cell from '../Cell';

const propTypes = {
    className: PropTypes.string,
    datum: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    datumKey: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
    columns: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
    columnKeySelector: PropTypes.func.isRequired,
};

const defaultProps = {
    className: '',
    columns: [],
    datum: {},
};

export default class Row extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    cellRendererParams = (columnKey, column) => {
        const {
            datum,
            datumKey,
        } = this.props;

        const {
            cellRendererParams,
            cellRenderer,
        } = column;

        return {
            columnKey,
            column,
            datumKey,
            datum,
            rendererParams: cellRendererParams,
            renderer: cellRenderer,
        };
    }

    render() {
        const {
            columns,
            columnKeySelector,
            className,
        } = this.props;

        return (
            <ListView
                className={className}
                data={columns}
                keyExtractor={columnKeySelector}
                renderer={Cell}
                rendererParams={this.cellRendererParams}
            />
        );
    }
}

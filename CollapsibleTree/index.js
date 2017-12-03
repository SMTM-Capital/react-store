import React from 'react';
import CSSModules from 'react-css-modules';
import { select } from 'd3-selection';
import { hierarchy, tree } from 'd3-hierarchy';
import { scaleOrdinal } from 'd3-scale';
import { schemePaired } from 'd3-scale-chromatic';
import { PropTypes } from 'prop-types';
import SvgSaver from 'svgsaver';
import Responsive from '../Responsive';
import styles from './styles.scss';

/**
 * boundingClientRect: the width and height of the container.
 * data: the hierarchical data to be visualized.
 * labelAccessor: returns the individual label from a unit data.
 * colorScheme: the color scheme for links that connect the nodes.
 * margins: the margin object with properties for the four sides(clockwise from top).
 */
const propTypes = {
    boundingClientRect: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number,
    }).isRequired,
    data: PropTypes.shape({
        name: PropTypes.string,
    }),
    labelAccessor: PropTypes.func.isRequired,
    colorScheme: PropTypes.arrayOf(PropTypes.string),
    margins: PropTypes.shape({
        top: PropTypes.number,
        right: PropTypes.number,
        bottom: PropTypes.number,
        left: PropTypes.number,
    }),
};

const defaultProps = {
    data: [],
    colorScheme: schemePaired,
    margins: {
        top: 50,
        right: 50,
        bottom: 100,
        left: 100,
    },
};
/**
 * CollapsibleTree is a tree diagram showing the hierarchical structure of the data.
 */
@Responsive
@CSSModules(styles)
export default class CollapsibleTree extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    componentDidMount() {
        this.renderChart();
    }
    componentDidUpdate() {
        this.renderChart();
    }

    save = () => {
        const svg = select(this.svg);
        const svgsaver = new SvgSaver();
        svgsaver.asSvg(svg.node(), `collapsible-tree-${Date.now()}.svg`);
    }

    renderChart = () => {
        const {
            data,
            boundingClientRect,
            labelAccessor,
            colorScheme,
            margins,
        } = this.props;

        if (!boundingClientRect.width) {
            return;
        }

        let { width, height } = boundingClientRect;
        const {
            top,
            right,
            bottom,
            left,
        } = margins;

        const svg = select(this.svg);
        svg.selectAll('*').remove();

        width = width - left - right;
        height = height - top - bottom;

        const colors = scaleOrdinal()
            .range(colorScheme);

        function topicColors(node) {
            let color = colors(0);
            if (node.depth === 0 || node.depth === 1) {
                color = colors(labelAccessor(node.data));
            } else {
                color = topicColors(node.parent);
            }
            return color;
        }

        function diagonal(s, d) {
            const path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`;

            return path;
        }

        const group = svg
            .attr('width', width + left + right)
            .attr('height', height + top + bottom)
            .append('g')
            .attr('transform', `translate(${left},${top})`);

        const trees = tree()
            .size([height, width]);

        const root = hierarchy(data, d => d.children);
        root.x0 = height / 2;
        root.y0 = 0;

        let i = 0;
        const time = 500;
        function update(source) {
            const treeData = trees(root);
            const nodes = treeData.descendants();
            const links = treeData.descendants().slice(1);

            nodes.forEach((d) => {
                d.y = d.depth * 180; //eslint-disable-line
            });

            const node = group
                .selectAll('g.node')
                .data(nodes, (d) => {
                    if (d.id) {
                        return d.id;
                    }
                    d.id = ++i; //eslint-disable-line
                    return d.id;
                });

            function click(d) {
                if (d.children) {
                    d.childrens = d.children; // eslint-disable-line
                    d.children = null; // eslint-disable-line
                } else {
                    d.children = d.childrens; // eslint-disable-line
                    d.childrens = null; // eslint-disable-line
                }
                update(d);
            }

            const nodeEnter = node
                .enter()
                .append('g')
                .attr('class', 'node')
                .attr('transform', `translate(${source.y0}, ${source.x0})`)
                .on('click', click);

            nodeEnter
                .append('circle')
                .attr('class', 'node')
                .attr('r', 0)
                .style('fill', topicColors);

            nodeEnter
                .append('text')
                .attr('dy', '.35em')
                .attr('x', d => (d.children || d.childrens ? -13 : 13))
                .attr('text-anchor', d => ((d.children || d.childrens) ? 'end' : 'start'))
                .text(d => labelAccessor(d.data));

            const nodeUpdate = nodeEnter.merge(node);

            nodeUpdate
                .transition()
                .duration(time)
                .attr('transform', d => `translate(${d.y}, ${d.x})`);

            nodeUpdate
                .select('circle.node')
                .attr('r', 10)
                .style('fill', topicColors)
                .style('stroke', d => (d.childrens ? '#039be5' : '#fff'))
                .attr('cursor', 'pointer');

            const nodeExit = node
                .exit()
                .transition()
                .duration(time)
                .attr('transform', `translate(${source.y}, ${source.x})`)
                .remove();

            nodeExit
                .select('circle')
                .attr('r', 0);

            nodeExit
                .select('text')
                .style('fill-opacity', 0);

            const link = group
                .selectAll('path.link')
                .data(links, d => d.id);

            const linkEnter = link
                .enter()
                .insert('path', 'g')
                .attr('class', 'link')
                .attr('stroke', topicColors)
                .attr('fill', 'none')
                .attr('d', () => {
                    const out = { x: source.x0, y: source.y0 };
                    return diagonal(out, out);
                });

            const linkUpdate = linkEnter
                .merge(link);

            linkUpdate
                .transition()
                .duration(time)
                .attr('d', d => diagonal(d, d.parent));

            link
                .exit()
                .transition()
                .duration(time)
                .attr('d', () => {
                    const out = { x: source.x, y: source.y };
                    return diagonal(out, out);
                })
                .remove();

            nodes.forEach((d) => {
                d.x0 = d.x; // eslint-disable-line
                d.y0 = d.y; // eslint-disable-line
            });
        }
        update(root);
    }

    render() {
        return (
            <div
                className="collapsible-tree-container"
            >
                <button className="button" onClick={this.save}>
                    Save
                </button>
                <svg
                    className="collapsible-tree"
                    ref={(elem) => { this.svg = elem; }}
                />
            </div>
        );
    }
}

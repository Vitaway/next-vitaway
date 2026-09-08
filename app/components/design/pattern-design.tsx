import React from 'react';

function DotGrid({
    fill = '#ffffff',
    className = '',
    cols = 8,
    rows = 4,
}: {
    fill?: string;
    className?: string;
    cols?: number;
    rows?: number;
}) {
    const gap = 22;
    const radius = 2.5;
    const width = (cols - 1) * gap + radius * 2;
    const height = (rows - 1) * gap + radius * 2;
    const dots = [];

    for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
            dots.push(
                <circle
                    key={`${col}-${row}`}
                    cx={radius + col * gap}
                    cy={radius + row * gap}
                    r={radius}
                    fill={fill}
                />,
            );
        }
    }

    return (
        <svg
            className={className}
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            fill="none"
            aria-hidden="true"
        >
            {dots}
        </svg>
    );
}

function PatternDesign({ fill = '#3056D3' }) {
    return <DotGrid fill={fill} cols={5} rows={5} />;
}

export { DotGrid };
export default PatternDesign;

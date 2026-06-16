import GridLayout, {
	horizontalCompactor,
	useContainerWidth,
} from "react-grid-layout";
import { JSX, ReactElement } from "react";
import React from "react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

function CardGridLayout({
	children,
}: {
	children: JSX.Element | JSX.Element[];
}) {
	const { width, containerRef, mounted } = useContainerWidth();

	const childArray = React.Children.toArray(children) as React.ReactElement[];

	const layout = childArray.map((child, index) => {
		return {
			i: String(child.key).slice(2),
			x: index,
			y: 0,
			w: 1,
			h: 1,
		};
	});

	return (
		<div ref={containerRef}>
			{mounted && (
				<GridLayout
					width={width}
					layout={layout}
					gridConfig={{ cols: 9, rowHeight: 260, maxRows: 1 }}
					dragConfig={{ enabled: true, threshold: 100 }}
					compactor={horizontalCompactor}
				>
					{children}
				</GridLayout>
			)}
		</div>
	);
}

export default CardGridLayout;

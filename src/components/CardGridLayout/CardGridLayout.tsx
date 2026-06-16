import { JSX, useState } from "react";

import {
	Layout,
	SnapGridGroup,
	useContainerWidth,
	useGridContainer,
	useGridItem,
} from "@snapgridjs/react";
import React from "react";

function CardGridLayout({
	children,
}: {
	children: JSX.Element | JSX.Element[];
}) {
	const childArray = React.Children.toArray(children) as React.ReactElement[];

	const [left, setLeft] = useState<Layout>(
		childArray.map((child, index) => {
			return {
				i: String(child.key).slice(2),
				x: index,
				y: 0,
				w: 1,
				h: 1,
			};
		}),
	);
	const [right, setRight] = useState<Layout>(
		childArray.map((child, index) => {
			return {
				i: String(child.key).slice(2),
				x: index,
				y: 0,
				w: 1,
				h: 1,
			};
		}),
	);
	return (
		<SnapGridGroup>
			<div style={{ display: "flex", gap: "1rem" }}>
				<SubGrid label="A" layout={left} onLayoutChange={setLeft}>
					{children}
				</SubGrid>
				<SubGrid label="B" layout={right} onLayoutChange={setRight}>
					{children}
				</SubGrid>
			</div>
		</SnapGridGroup>
	);
}
function SubGrid({
	children,
	label,
	layout,
	onLayoutChange,
}: {
	children: JSX.Element | JSX.Element[];
	label: string;
	layout: Layout;
	onLayoutChange: (next: Layout) => void;
}) {
	const { width, containerRef } = useContainerWidth();
	const { containerProps } = useGridContainer({
		layout,
		width,
		onLayoutChange,
		gridConfig: { cols: 6, rowHeight: 60 },
	});
	return (
		<div ref={containerRef}>
			<div className="subgrid">
				<span className="subgrid__label">{label}</span>
				<div {...containerProps}>
					{/* {layout.map((it: { i: string }) => (
						<Tile key={it.i} id={it.i} group={group} />
					))} */}
					{children}
				</div>
			</div>
		</div>
	);
}

export default CardGridLayout;

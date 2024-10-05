import React, { useEffect, useState } from "react";
import { getVSCodeAPI } from "../getVscodeApi";
import * as vscode from "vscode";

const MIN_SEARCH_CHARS = 2;
const MAX_SEARCH_RESULTS = 10;

const FilePicker = ({
	files = [],
	onAdd,
}: {
	files: vscode.Uri[];
	onAdd: (file: vscode.Uri) => void;
}) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedFileIndex, setSelectedFileIndex] = useState(-1);

	useEffect(() => {
		if (searchTerm.length >= MIN_SEARCH_CHARS) {
			getVSCodeAPI().postMessage({
				type: "searchWorkspaceFiles",
				pattern: `**/*${searchTerm}*`,
				maxResults: MAX_SEARCH_RESULTS,
			});
		}
	}, [searchTerm]);

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "ArrowDown") {
			setSelectedFileIndex((prevIndex) => (prevIndex + 1) % files.length);
		} else if (event.key === "ArrowUp") {
			setSelectedFileIndex(
				(prevIndex) => (prevIndex - 1 + files.length) % files.length
			);
		} else if (event.key === "Enter") {
			if (selectedFileIndex !== -1) {
				onAdd(files[selectedFileIndex]);
			}
		}
	};

	return (
		<div className="absolute min-w-[50vw] p-2 border-vscode-input-border">
			<input
				value={searchTerm}
				onChange={({ target: { value } }) => setSearchTerm(value)}
				onKeyDown={handleKeyDown}
				className="input"
				type="text"
				placeholder="Search..."
				autoFocus
			/>
			<div>
				{files.map((file, index) => (
					<div
						key={file.path}
						className={
							index === selectedFileIndex
								? "bg-vscode-button-bg text-vscode-button-fg"
								: ""
						}
						onClick={() => onAdd(file)}
					>
						{file.path}
					</div>
				))}
			</div>
		</div>
	);
};

export default FilePicker;

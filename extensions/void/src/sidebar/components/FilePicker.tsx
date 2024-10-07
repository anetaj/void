import React, { useEffect, useState } from "react";
import { getVSCodeAPI } from "../getVscodeApi";
import * as vscode from "vscode";
import { getBasename } from "../utils/files";

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
		<div className="w-full relative">
			<div className="m-1">
				<button className="btn btn-secondary btn-sm border border-vscode-input-border rounded flex items-center space-x-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						className="size-4"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M12 4.5v15m7.5-7.5h-15"
						/>
					</svg>
				</button>
			</div>
			<div className="absolute p-2 border-vscode-input-border mt-4 inset-0">
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
							{getBasename(file.path)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default FilePicker;

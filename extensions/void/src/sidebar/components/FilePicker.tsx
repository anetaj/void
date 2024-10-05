import React, { useEffect, useState } from "react";
import { WorkspaceFile } from "../../shared_types";

const MIN_SEARCH_CHARS = 2;
const MAX_SEARCH_RESULTS = 10;

const FilePicker = ({ files = [] }: { files: WorkspaceFile[] }) => {
	const [filteredFiles, setFilteredFiles] = useState<WorkspaceFile[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedFileIndex, setSelectedFileIndex] = useState(-1);

	useEffect(() => {
		if (searchTerm.length >= MIN_SEARCH_CHARS) {
			const results = files.filter(
				(file) =>
					file.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
					!file.isDir // for now, don't show directories in search results
			);
			setFilteredFiles(results.slice(0, MAX_SEARCH_RESULTS));
		} else {
			setFilteredFiles([]);
		}
	}, [searchTerm, files, setFilteredFiles]);

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "ArrowDown") {
			setSelectedFileIndex(
				(prevIndex) => (prevIndex + 1) % filteredFiles.length
			);
		} else if (event.key === "ArrowUp") {
			setSelectedFileIndex(
				(prevIndex) =>
					(prevIndex - 1 + filteredFiles.length) % filteredFiles.length
			);
		} else if (event.key === "Enter") {
			if (selectedFileIndex !== -1) {
				console.log(filteredFiles[selectedFileIndex]);
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
				{filteredFiles.map((file, index) => (
					<div
						key={file.path}
						className={
							index === selectedFileIndex
								? "bg-vscode-button-bg text-vscode-button-fg"
								: ""
						}
					>
						{file.name}
					</div>
				))}
			</div>
		</div>
	);
};

export default FilePicker;

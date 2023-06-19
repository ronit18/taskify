import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import React, { useState } from "react";

export const NoteEditor = ({
  onSave,
}: {
  onSave: (note: { title: string; content: string }) => void;
}) => {
  const [code, setCode] = useState<string>("");
  const [title, setTitle] = useState<string>("");

  return (
    <div className="card mt-5  bg-base-100 pr-3 shadow-2xl">
      <div className="card-body">
        <h2 className="card-title">
          <input
            type="text"
            placeholder="Note title"
            className="input-info input input-lg w-full font-bold"
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
          />
        </h2>
        <CodeMirror
          className=" border border-gray-300"
          value={code}
          width="500px"
          height="30vh"
          minWidth="100%"
          minHeight="30vh"
          onChange={(val) => setCode(val)}
          extensions={[
            markdown({
              base: markdownLanguage,
              codeLanguages: languages,
            }),
          ]}
        />
      </div>
      <div className="card-actions justify-end">
        <button
          onClick={() => {
            onSave({
              title,
              content: code,
            });
            setCode("");
            setTitle("");
          }}
          className="btn-primary btn"
          disabled={title.trim().length === 0 || code.trim().length === 0}
        >
          Save
        </button>
      </div>
    </div>
  );
};

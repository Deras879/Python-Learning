import React, { useMemo } from "react";

interface CodeEditorProps {
  code: string;
  onChange?: (code: string) => void;
  readOnly?: boolean;
  height?: string;
  language?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  readOnly = false,
  height = "200px",
  language = "python",
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!readOnly && onChange) {
      onChange(e.target.value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (readOnly) return;

    // Solo manejar Tab para agregar espacios, sin otras funcionalidades complejas
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = e.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = code.substring(0, start) + "    " + code.substring(end);

      if (onChange) {
        onChange(newValue);
      }
    }
  };

  const lineNumbers = useMemo(() => {
    const lines = code.split("\n");
    return lines.map((_, index) => (
      <div
        key={index}
        className="text-gray-400 text-right pr-3 select-none text-sm leading-6 font-mono"
      >
        {index + 1}
      </div>
    ));
  }, [code]);

  return (
    <div className="relative border border-gray-300 rounded-lg overflow-hidden bg-gray-900 shadow-inner">
      <div className="flex">
        {/* Line numbers */}
        <div className="bg-gray-800 py-3 px-2 border-r border-gray-700 min-w-[50px]">
          {lineNumbers}
        </div>

        {/* Code area */}
        <div className="flex-1 relative">
          <textarea
            value={code}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            readOnly={readOnly}
            className="w-full p-3 bg-gray-900 text-green-400 font-mono text-sm resize-none outline-none leading-6 border-none"
            style={{
              minHeight: height,
              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, monospace',
              backgroundColor: "#111827",
              color: "#10B981",
            }}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            placeholder={
              readOnly
                ? ""
                : '# Escribe tu código Python aquí...\nprint("¡Hola, Python!")'
            }
          />

          {/* Language indicator */}
          <div className="absolute top-2 right-2 text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded uppercase font-mono">
            {language}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;

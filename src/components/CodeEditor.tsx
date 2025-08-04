import React, { useMemo, useRef, useState } from "react";

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

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

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setScrollTop(scrollTop);
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = scrollTop;
    }
  };

  const lineNumbers = useMemo(() => {
    const lines = code.split("\n");
    return lines.map((_, index) => (
      <div
        key={index}
        className="text-gray-400 text-right pr-3 select-none text-sm font-mono"
        style={{
          lineHeight: "1.5", // Exactamente la misma altura que el textarea
          height: "21px", // 14px (text-sm) * 1.5 = 21px
        }}
      >
        {index + 1}
      </div>
    ));
  }, [code]);

  return (
    <div
      className="relative border border-gray-300 rounded-lg overflow-hidden bg-gray-900 shadow-inner"
      style={{ height: height }}
    >
      <div className="flex h-full">
        {/* Line numbers */}
        <div
          ref={lineNumbersRef}
          className="bg-gray-800 border-r border-gray-700 min-w-[50px] overflow-hidden flex flex-col"
          style={{
            height: height,
            paddingTop: "12px", // Mismo padding que el textarea (p-3 = 12px)
            paddingBottom: "12px",
            paddingLeft: "8px",
            paddingRight: "8px",
          }}
        >
          <div className="flex flex-col">{lineNumbers}</div>
        </div>

        {/* Code area */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onScroll={handleScroll}
            readOnly={readOnly}
            className="w-full p-3 bg-gray-900 text-green-400 font-mono text-sm resize-none outline-none leading-6 border-none"
            style={{
              height: height,
              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, monospace',
              backgroundColor: "#111827",
              color: "#10B981",
              lineHeight: "1.5", // 24px (text-sm=14px * 1.5 = 21px, pero necesitamos que sea exactamente 24px para leading-6)
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

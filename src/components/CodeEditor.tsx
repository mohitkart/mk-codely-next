import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { useState } from "react";

interface props {
  value: any,
  height?: any,
  onChange?: (value: string) => void;
  disabled?: boolean
}

export default function CodeEditor({ value, height = '300px', onChange, disabled=false }: props) {
  const [code, setCode] = useState(value);

  return (
    <CodeMirror
      value={code}
      height={height}
      extensions={[javascript()]}
      editable={!disabled}
      onChange={(val) => {
        if (!disabled) {
          setCode(val);
          onChange?.(val);
        }
      }}
    />
  );
}

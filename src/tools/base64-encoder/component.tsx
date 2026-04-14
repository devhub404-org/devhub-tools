import { useState, useCallback, type FC } from "react"

type Mode = "encode" | "decode"
type Status = "idle" | "ok" | "error"

const Base64Tool: FC = () => {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [mode, setMode] = useState<Mode>("encode")
  const [status, setStatus] = useState<Status>("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [copied, setCopied] = useState(false)

  const reset = () => {
    setOutput("")
    setStatus("idle")
    setErrorMsg("")
    setCopied(false)
  }

  const process = useCallback(() => {
    if (!input.trim()) return
    try {
      if (mode === "encode") {
        setOutput(btoa(unescape(encodeURIComponent(input))))
      } else {
        setOutput(decodeURIComponent(escape(atob(input.trim()))))
      }
      setStatus("ok")
      setErrorMsg("")
    } catch {
      setOutput("")
      setStatus("error")
      setErrorMsg(
        mode === "decode"
          ? "Input inválido — não é um Base64 válido."
          : "Não foi possível codificar o texto."
      )
    }
  }, [input, mode])

  const copy = useCallback(() => {
    if (!output) return
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [output])

  const clear = () => {
    setInput("")
    reset()
  }

  const switchMode = (next: Mode) => {
    setMode(next)
    reset()
  }

  return (
    <div className="tool-body">

      <div className="tool-mode-switcher">
        <button
          className={`tool-mode-btn ${mode === "encode" ? "active" : ""}`}
          onClick={() => switchMode("encode")}
        >
          codificar
        </button>
        <button
          className={`tool-mode-btn ${mode === "decode" ? "active" : ""}`}
          onClick={() => switchMode("decode")}
        >
          decodificar
        </button>
      </div>

      <div className="tool-input-area">
        <label className="tool-label" htmlFor="base64-input">
          {mode === "encode" ? "texto" : "base64"}
        </label>
        <textarea
          id="base64-input"
          className="tool-textarea"
          placeholder={
            mode === "encode"
              ? "Cole o texto aqui..."
              : "Cole o Base64 aqui..."
          }
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            reset()
          }}
          spellCheck={false}
        />
      </div>

      <div className="tool-actions">
        <button className="tool-btn tool-btn-primary" onClick={process}>
          {mode === "encode" ? "codificar" : "decodificar"}
        </button>
        <button className="tool-btn" onClick={clear}>
          limpar
        </button>
      </div>

      {status === "error" && (
        <div className="tool-error" role="alert">
          {errorMsg}
        </div>
      )}

      {status === "ok" && (
        <div className="tool-output-area">
          <div className="tool-output-header">
            <span className="tool-label">
              {mode === "encode" ? "base64" : "texto"}
            </span>
            <button className="tool-btn" onClick={copy}>
              {copied ? "copiado ✓" : "copiar"}
            </button>
          </div>
          <textarea
            className="tool-textarea"
            value={output}
            readOnly
            spellCheck={false}
            style={{ minHeight: "160px" }}
          />
        </div>
      )}

    </div>
  )
}

export default Base64Tool
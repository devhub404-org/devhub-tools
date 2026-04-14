import { useState, useCallback, type FC } from "react"

type Status = "idle" | "ok" | "error"

const JsonFormatterTool: FC = () => {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [copied, setCopied] = useState(false)

  const reset = () => {
    setOutput("")
    setStatus("idle")
    setErrorMsg("")
    setCopied(false)
  }

  const format = useCallback(() => {
    if (!input.trim()) return
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, 2))
      setStatus("ok")
      setErrorMsg("")
    } catch (err) {
      const message = err instanceof SyntaxError ? err.message : "Erro desconhecido"
      setOutput("")
      setStatus("error")
      setErrorMsg(message)
    }
  }, [input])

  const minify = useCallback(() => {
    if (!input.trim()) return
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed))
      setStatus("ok")
      setErrorMsg("")
    } catch (err) {
      const message = err instanceof SyntaxError ? err.message : "Erro desconhecido"
      setOutput("")
      setStatus("error")
      setErrorMsg(message)
    }
  }, [input])

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

  return (
    <div className="tool-body">

      <div className="tool-input-area">
        <label className="tool-label" htmlFor="json-input">
          entrada
        </label>
        <textarea
          id="json-input"
          className="tool-textarea"
          placeholder='{"exemplo": "cole seu JSON aqui"}'
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            reset()
          }}
          spellCheck={false}
        />
      </div>

      <div className="tool-actions">
        <button className="tool-btn tool-btn-primary" onClick={format}>
          formatar
        </button>
        <button className="tool-btn" onClick={minify}>
          minificar
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
            <span className="tool-label">saída</span>
            <button className="tool-btn" onClick={copy}>
              {copied ? "copiado ✓" : "copiar"}
            </button>
          </div>
          <textarea
            className="tool-textarea"
            value={output}
            readOnly
            spellCheck={false}
            style={{ minHeight: "240px" }}
          />
        </div>
      )}

    </div>
  )
}

export default JsonFormatterTool
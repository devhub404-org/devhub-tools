import { useState, useCallback, type FC } from "react"

const generateUUID = (): string => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const UUIDGeneratorTool: FC = () => {
  const [quantity, setQuantity] = useState(1)
  const [uuids, setUuids] = useState<string[]>([])
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [copiedAll, setCopiedAll] = useState(false)

  const generate = useCallback(() => {
    const result = Array.from({ length: quantity }, () => generateUUID())
    setUuids(result)
    setCopiedIndex(null)
    setCopiedAll(false)
  }, [quantity])

  const copySingle = useCallback((uuid: string, index: number) => {
    navigator.clipboard.writeText(uuid).then(() => {
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    })
  }, [])

  const copyAll = useCallback(() => {
    if (!uuids.length) return
    navigator.clipboard.writeText(uuids.join("\n")).then(() => {
      setCopiedAll(true)
      setTimeout(() => setCopiedAll(false), 2000)
    })
  }, [uuids])

  return (
    <div className="tool-body">

      <div className="tool-input-area">
        <label className="tool-label" htmlFor="uuid-quantity">
          quantidade
        </label>
        <div className="uuid-controls">
          <input
            id="uuid-quantity"
            type="number"
            min={1}
            max={20}
            value={quantity}
            onChange={(e) => {
              const val = Math.min(20, Math.max(1, Number(e.target.value)))
              setQuantity(val)
            }}
            className="tool-input-number"
          />
          <button className="tool-btn tool-btn-primary" onClick={generate}>
            gerar
          </button>
        </div>
      </div>

      {uuids.length > 0 && (
        <div className="tool-output-area">
          <div className="tool-output-header">
            <span className="tool-label">
              {uuids.length} uuid{uuids.length > 1 ? "s" : ""} gerado{uuids.length > 1 ? "s" : ""}
            </span>
            <button className="tool-btn" onClick={copyAll}>
              {copiedAll ? "copiado ✓" : "copiar todos"}
            </button>
          </div>

          <ul className="uuid-list">
            {uuids.map((uuid, index) => (
              <li key={uuid} className="uuid-item">
                <span className="uuid-value">{uuid}</span>
                <button
                  className="tool-btn uuid-copy-btn"
                  onClick={() => copySingle(uuid, index)}
                >
                  {copiedIndex === index ? "✓" : "copiar"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  )
}

export default UUIDGeneratorTool
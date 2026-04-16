import { useState, useCallback, type FC } from "react"

const LOWERCASE = "abcdefghijklmnopqrstuvwxyz"
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const NUMBERS   = "0123456789"
const SYMBOLS   = "!@#$%^&*()_+-=[]{}|;:,.<>?"

type Strength = "fraca" | "média" | "forte" | "muito forte"

interface Options {
  lowercase: boolean
  uppercase: boolean
  numbers:   boolean
  symbols:   boolean
}

const getStrength = (password: string): Strength => {
  let score = 0
  if (password.length >= 12) score++
  if (password.length >= 20) score++
  if (/[a-z]/.test(password)) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++
  if (score <= 2) return "fraca"
  if (score <= 3) return "média"
  if (score <= 4) return "forte"
  return "muito forte"
}

const strengthColor: Record<Strength, string> = {
  "fraca":       "#e05a5a",
  "média":       "#e0a85a",
  "forte":       "#5ae07a",
  "muito forte": "#5ae0d4",
}

const strengthWidth: Record<Strength, string> = {
  "fraca":       "25%",
  "média":       "50%",
  "forte":       "75%",
  "muito forte": "100%",
}

const generateOne = (options: Options, length: number): string => {
  let charset = ""
  if (options.lowercase) charset += LOWERCASE
  if (options.uppercase) charset += UPPERCASE
  if (options.numbers)   charset += NUMBERS
  if (options.symbols)   charset += SYMBOLS
  if (!charset) return ""
  const array = new Uint32Array(length)
  crypto.getRandomValues(array)
  return Array.from(array).map((val) => charset[val % charset.length]).join("")
}

const PasswordGeneratorTool: FC = () => {
  const [length,   setLength]   = useState(16)
  const [quantity, setQuantity] = useState(1)
  const [options,  setOptions]  = useState<Options>({
    lowercase: true,
    uppercase: true,
    numbers:   true,
    symbols:   false,
  })
  const [passwords,   setPasswords]   = useState<string[]>([])
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [copiedAll,   setCopiedAll]   = useState(false)

  const generate = useCallback(() => {
    const result = Array.from({ length: quantity }, () => generateOne(options, length))
    setPasswords(result)
    setCopiedIndex(null)
    setCopiedAll(false)
  }, [length, quantity, options])

  const copySingle = useCallback((pwd: string, index: number) => {
    navigator.clipboard.writeText(pwd).then(() => {
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    })
  }, [])

  const clearSingle = useCallback((index: number) => {
    setPasswords((prev) => prev.filter((_, i) => i !== index))
    setCopiedIndex(null)
  }, [])

  const copyAll = useCallback(() => {
    if (!passwords.length) return
    navigator.clipboard.writeText(passwords.join("\n")).then(() => {
      setCopiedAll(true)
      setTimeout(() => setCopiedAll(false), 2000)
    })
  }, [passwords])

  const clearAll = useCallback(() => {
    setPasswords([])
    setCopiedIndex(null)
    setCopiedAll(false)
  }, [])

  const toggleOption = (key: keyof Options) => {
    const next = { ...options, [key]: !options[key] }
    const active = Object.values(next).filter(Boolean).length
    if (active === 0) return
    setOptions(next)
    setPasswords([])
    setCopiedIndex(null)
    setCopiedAll(false)
  }

  return (
    <div className="tool-body">

      <div className="tool-input-area">
        <div className="pwd-length-header">
          <span className="tool-label">tamanho da senha</span>
          <span className="pwd-length-value">{length} caracteres</span>
        </div>
        <input
          type="range"
          min={8}
          max={128}
          value={length}
          onChange={(e) => {
            setLength(Number(e.target.value))
            setPasswords([])
          }}
          className="pwd-range"
        />
        <div className="pwd-range-labels">
          <span>8</span>
          <span>128</span>
        </div>
      </div>

      <div className="tool-input-area">
        <label className="tool-label" htmlFor="pwd-quantity">
          quantidade
        </label>
        <div className="uuid-controls">
          <input
            id="pwd-quantity"
            type="number"
            min={1}
            max={20}
            value={quantity}
            onChange={(e) => {
              const val = Math.min(20, Math.max(1, Number(e.target.value)))
              setQuantity(val)
              setPasswords([])
            }}
            className="tool-input-number"
          />
        </div>
      </div>

      <div className="tool-input-area">
        <span className="tool-label">composição</span>
        <div className="pwd-options">
          {(
            [
              { key: "lowercase", label: "minúsculas (a-z)" },
              { key: "uppercase", label: "maiúsculas (A-Z)" },
              { key: "numbers",   label: "números (0-9)"   },
              { key: "symbols",   label: "símbolos (!@#$)" },
            ] as { key: keyof Options; label: string }[]
          ).map(({ key, label }) => (
            <button
              key={key}
              className={`pwd-option-btn ${options[key] ? "active" : ""}`}
              onClick={() => toggleOption(key)}
            >
              <span className="pwd-option-indicator" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="tool-actions">
        <button className="tool-btn tool-btn-primary" onClick={generate}>
          gerar {quantity > 1 ? `${quantity} senhas` : "senha"}
        </button>
      </div>

      {passwords.length > 0 && (
        <div className="tool-output-area">
          <div className="tool-output-header">
            <span className="tool-label">
              {passwords.length} senha{passwords.length > 1 ? "s" : ""} gerada{passwords.length > 1 ? "s" : ""}
            </span>
            <div className="uuid-header-actions">
              <button className="tool-btn" onClick={copyAll}>
                {copiedAll ? "copiado ✓" : "copiar todas"}
              </button>
              <button className="tool-btn" onClick={clearAll}>
                limpar todas
              </button>
            </div>
          </div>

          <ul className="uuid-list">
            {passwords.map((pwd, index) => {
              const strength = getStrength(pwd)
              return (
                <li key={index} className="uuid-item pwd-item">
                  <div className="pwd-item-content">
                    <span className="uuid-value pwd-value">{pwd}</span>
                    <div className="pwd-strength-bar">
                      <div
                        className="pwd-strength-fill"
                        style={{
                          width: strengthWidth[strength],
                          backgroundColor: strengthColor[strength],
                        }}
                      />
                    </div>
                  </div>
                  <div className="uuid-item-actions">
                    <button
                      className="tool-btn uuid-copy-btn"
                      onClick={() => copySingle(pwd, index)}
                    >
                      {copiedIndex === index ? "✓" : "copiar"}
                    </button>
                    <button
                      className="tool-btn uuid-copy-btn"
                      onClick={() => clearSingle(index)}
                    >
                      limpar
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}

    </div>
  )
}

export default PasswordGeneratorTool
import { useState, useCallback, type FC } from "react"

const LOWERCASE = "abcdefghijklmnopqrstuvwxyz"
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const NUMBERS   = "0123456789"
const SYMBOLS   = "!@#$%^&*()_+-=[]{}|;:,.<>?"

type Strength = "fraca" | "média" | "forte" | "muito forte"

interface Options {
  lowercase: boolean
  uppercase: boolean
  numbers: boolean
  symbols: boolean
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

const PasswordGeneratorTool: FC = () => {
  const [length, setLength] = useState(16)
  const [options, setOptions] = useState<Options>({
    lowercase: true,
    uppercase: true,
    numbers:   true,
    symbols:   false,
  })
  const [password, setPassword] = useState("")
  const [copied, setCopied]     = useState(false)

  const generate = useCallback(() => {
    let charset = ""
    if (options.lowercase) charset += LOWERCASE
    if (options.uppercase) charset += UPPERCASE
    if (options.numbers)   charset += NUMBERS
    if (options.symbols)   charset += SYMBOLS

    if (!charset) return

    const array  = new Uint32Array(length)
    crypto.getRandomValues(array)
    const result = Array.from(array)
      .map((val) => charset[val % charset.length])
      .join("")

    setPassword(result)
    setCopied(false)
  }, [length, options])

  const copy = useCallback(() => {
    if (!password) return
    navigator.clipboard.writeText(password).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [password])

  const toggleOption = (key: keyof Options) => {
    const active = Object.values({ ...options, [key]: !options[key] }).filter(Boolean).length
    if (active === 0) return
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }))
    setPassword("")
    setCopied(false)
  }

  const strength = password ? getStrength(password) : null

  return (
    <div className="tool-body">

      <div className="tool-input-area">
        <div className="pwd-length-header">
          <span className="tool-label">tamanho</span>
          <span className="pwd-length-value">{length}</span>
        </div>
        <input
          type="range"
          min={8}
          max={128}
          value={length}
          onChange={(e) => {
            setLength(Number(e.target.value))
            setPassword("")
            setCopied(false)
          }}
          className="pwd-range"
        />
        <div className="pwd-range-labels">
          <span>8</span>
          <span>128</span>
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
          gerar senha
        </button>
      </div>

      {password && (
        <div className="tool-output-area">
          <div className="tool-output-header">
            <span className="tool-label">senha gerada</span>
            <button className="tool-btn" onClick={copy}>
              {copied ? "copiado ✓" : "copiar"}
            </button>
          </div>

          <div className="pwd-output">
            <span className="pwd-value">{password}</span>
          </div>

          {strength && (
            <div className="pwd-strength">
              <div className="pwd-strength-bar">
                <div
                  className="pwd-strength-fill"
                  style={{
                    width: strengthWidth[strength],
                    backgroundColor: strengthColor[strength],
                  }}
                />
              </div>
              <span
                className="pwd-strength-label"
                style={{ color: strengthColor[strength] }}
              >
                {strength}
              </span>
            </div>
          )}
        </div>
      )}

    </div>
  )
}

export default PasswordGeneratorTool
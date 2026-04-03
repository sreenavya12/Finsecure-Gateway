import { useEffect, useRef, useState } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { useNavigate } from "react-router-dom"

export default function PayQR() {

  const navigate = useNavigate()
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const isRunningRef = useRef(false)

  const [flashOn, setFlashOn] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)

  const playBeep = () => {
    const audio = new Audio("/beep.mp3")
    audio.play().catch(() => {})
  }

  // Extract UPI ID from QR
  const extractUpiId = (qrText: string) => {

    if (qrText.includes("upi://")) {
      const match = qrText.match(/pa=([^&]+)/)
      return match ? decodeURIComponent(match[1]) : qrText
    }

    return qrText
  }

  // Stop camera safely
  const stopScanner = async () => {

    if (scannerRef.current && isRunningRef.current) {
      try {
        await scannerRef.current.stop()
        await scannerRef.current.clear()
      } catch {}

      isRunningRef.current = false
    }
  }

  useEffect(() => {
    let mounted = true
    let isCleanupInProgress = false

    const startScanner = async () => {
      if (!mounted) return

      // Delay to let the previous instance clenaup in React 18 strict mode
      await new Promise(r => setTimeout(r, 200))
      
      if (!mounted) return

      const html5QrCode = new Html5Qrcode("reader")
      scannerRef.current = html5QrCode

      try {
        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 }
          },
          (decodedText) => {
            if (!isRunningRef.current) return
            playBeep()
            const upiId = extractUpiId(decodedText)
            stopScanner()
            navigate("/enter-amount", { state: { upiId } })
          },
          () => {}
        )

        isRunningRef.current = true
        setCameraError(null)
      } catch (err: any) {
        console.error("Scanner error:", err)
        if (mounted) {
          setCameraError(err?.message || "Camera permission denied or unavailable")
        }
      }
    }

    startScanner()

    return () => {
      mounted = false
      if (scannerRef.current && isRunningRef.current && !isCleanupInProgress) {
        isCleanupInProgress = true
        scannerRef.current.stop().then(() => {
          scannerRef.current?.clear()
          isRunningRef.current = false
        }).catch(err => console.error("Error stopping scanner", err))
      }
    }
  }, [navigate])


  // Flash toggle
  const toggleFlash = async () => {

    if (!scannerRef.current || !isRunningRef.current) return

    try {

      await scannerRef.current.applyVideoConstraints({
        advanced: [{ torch: !flashOn } as any]
      })

      setFlashOn(!flashOn)

    } catch {

      console.log("Flash not supported")

    }

  }


  // Scan uploaded QR image
 const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {

  const file = e.target.files?.[0]
  if (!file) return

  try {

    // stop camera before scanning file
    await stopScanner()

    const html5Qr = new Html5Qrcode("reader")

    const decodedText = await html5Qr.scanFile(file, true)

    playBeep()

    const upiId = extractUpiId(decodedText)

    navigate("/enter-amount", {
      state: { upiId }
    })

  } catch (error) {

    console.error("QR Image Scan Failed:", error)

    alert("Could not detect QR code. Try a clearer image.")

  }

  e.target.value = ""
}


  return (

    <div className="min-h-screen bg-black text-white flex flex-col items-center">

      {/* HEADER */}

      <div className="w-full flex justify-between items-center p-4 border-b border-white/10 bg-[#0f172a]">

        <button
          onClick={() => navigate(-1)}
          className="text-slate-400"
        >
          Back
        </button>

        <span className="font-semibold">
          Scan & Pay
        </span>

        <label className="cursor-pointer bg-blue-600 px-3 py-1 rounded text-sm">

          Upload QR

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />

        </label>

      </div>


      {/* SCANNER */}

      <div className="relative w-full max-w-md mt-6 px-4">

        {cameraError ? (

          <div className="text-center bg-slate-900 p-6 rounded-xl">

            <div className="text-xl text-red-400 mb-4">
              Camera Error
            </div>

            <p className="text-slate-400 mb-4">
              Allow camera permission or upload QR image.
            </p>

            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 px-4 py-2 rounded"
            >
              Retry Camera
            </button>

          </div>

        ) : (

          <>
            <div
              id="reader"
              className="rounded-xl overflow-hidden border border-slate-700 min-h-[300px]"
            />

            {/* Scan Frame */}

            <div className="absolute top-0 left-4 right-4 h-full flex items-center justify-center pointer-events-none">

              <div className="w-64 h-64 border-2 border-blue-500 rounded-xl relative overflow-hidden">

                <div className="absolute w-full h-1 bg-blue-500 animate-scan"></div>

              </div>

            </div>

          </>

        )}

      </div>


      {/* FLASH */}

      {!cameraError && (

        <button
          onClick={toggleFlash}
          className="mt-8 bg-slate-800 px-6 py-3 rounded-xl"
        >
          {flashOn ? "Flash Off 🔦" : "Flash On 🔦"}
        </button>

      )}


      <style>

        {`

        @keyframes scan {
          0% { top:0% }
          50% { top:95% }
          100% { top:0% }
        }

        .animate-scan {
          animation: scan 2s infinite
        }

        `}

      </style>

    </div>

  )

}
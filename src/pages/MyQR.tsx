import { QRCodeSVG } from "qrcode.react"
import { useNavigate } from "react-router-dom"
import { Share2, Download, QrCode } from "lucide-react"

export default function MyQR() {
  const navigate = useNavigate()
  const customerId = localStorage.getItem("customer_id") || "Unknown"

  // We could also embed UPI URI format like upi://pay?pa=... 
  // but for the internal wallet, customer_id is best.
  let qrData = customerId;
  if (!qrData.includes("upi://")) {
      qrData = `upi://pay?pa=${customerId}&pn=FinSecureUser`
  }

  const handleDownload = () => {
    const svg = document.getElementById("my-qr-code")
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg)
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new Image()
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        if(ctx) {
            ctx.fillStyle = "white"
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(img, 0, 0)
            const pngFile = canvas.toDataURL("image/png")
            const downloadLink = document.createElement("a")
            downloadLink.download = "MyFinSecureQR.png"
            downloadLink.href = `${pngFile}`
            downloadLink.click()
        }
      }
      img.src = "data:image/svg+xml;base64," + btoa(svgData)
    }
  }

  return (
    <div className="min-h-screen bg-[#0b1120] text-white flex flex-col items-center">
      {/* HEADER */}
      <div className="w-full flex justify-between items-center p-4 border-b border-white/10 bg-[#0f172a]">
        <button onClick={() => navigate(-1)} className="text-slate-400">Back</button>
        <span className="font-semibold flex items-center gap-2"><QrCode size={18} /> My QR Code</span>
        <div className="w-10"></div>
      </div>

      {/* QR CONTAINER */}
      <div className="flex-1 w-full max-w-md p-6 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-[2rem] shadow-[0_0_40px_rgba(6,182,212,0.15)] flex flex-col items-center w-full relative overflow-hidden">
          {/* Header decor */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
          
          <h2 className="text-2xl font-black text-slate-800 tracking-tighter mb-1 mt-4">FINSECURE</h2>
          <p className="text-slate-500 text-sm font-semibold mb-8">Scan to pay me</p>

          <div className="border-[4px] border-indigo-50 p-4 rounded-3xl bg-white shadow-sm inline-block">
            <QRCodeSVG
              id="my-qr-code"
              value={qrData}
              size={200}
              level={"H"}
              includeMargin={false}
              fgColor="#1e293b" // slate-800
            />
          </div>

          <div className="bg-slate-50 mt-8 w-full p-4 rounded-xl border border-slate-100 flex flex-col items-center">
             <span className="text-xs uppercase font-bold tracking-widest text-slate-400">FinSecure ID</span>
             <span className="text-lg font-mono font-bold text-slate-800 mt-1">{customerId}</span>
          </div>

        </div>

        {/* ACTIONS */}
        <div className="flex gap-4 mt-8 w-full">
           <button 
             onClick={handleDownload}
             className="flex-1 bg-[#1e293b] hover:bg-[#2d3748] border border-white/10 text-white p-4 rounded-2xl flex items-center justify-center gap-2 font-bold transition">
             <Download size={18} /> Save QR
           </button>
           <button 
             className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white p-4 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)] transition">
             <Share2 size={18} /> Share
           </button>
        </div>
      </div>
    </div>
  )
}

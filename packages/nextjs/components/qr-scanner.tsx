"use client"

import { useEffect, useRef } from "react"
import { Html5Qrcode } from "html5-qrcode"

interface QrScannerProps {
  onScan: (data: string) => void
  onError: (error: string) => void
}

export function QrScanner({ onScan, onError }: QrScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const qrCodeId = "qr-reader"

    // Create a container for the scanner if it doesn't exist
    let qrContainer = document.getElementById(qrCodeId)
    if (!qrContainer) {
      qrContainer = document.createElement("div")
      qrContainer.id = qrCodeId
      containerRef.current.appendChild(qrContainer)
    }

    // Initialize the scanner
    scannerRef.current = new Html5Qrcode(qrCodeId)

    // Start scanning
    scannerRef.current
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          onScan(decodedText)
          if (scannerRef.current) {
            scannerRef.current.stop()
          }
        },
        (errorMessage) => {
          console.error(errorMessage)
        },
      )
      .catch((err) => {
        onError(err)
      })

    // Cleanup
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch((err) => console.error("Error stopping scanner:", err))
      }
    }
  }, [onScan, onError])

  return <div ref={containerRef} className="w-full h-full" />
}


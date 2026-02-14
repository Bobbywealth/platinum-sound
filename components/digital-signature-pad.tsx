"use client"

import { useRef, useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { RotateCcw, Check, PenLine } from 'lucide-react'

interface DigitalSignaturePadProps {
  onSignatureChange: (signatureData: string | null) => void
  width?: number
  height?: number
  disabled?: boolean
}

export function DigitalSignaturePad({
  onSignatureChange,
  width = 400,
  height = 200,
  disabled = false,
}: DigitalSignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set up canvas context
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    setContext(ctx)

    // Clear canvas with white background
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, width, height)
  }, [width, height])

  const getPosition = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    
    if ('touches' in e) {
      const touch = e.touches[0]
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      }
    }
    
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (disabled) return
    
    e.preventDefault()
    setIsDrawing(true)
    setHasSignature(true)
    
    const pos = getPosition(e)
    if (context) {
      context.beginPath()
      context.moveTo(pos.x, pos.y)
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || disabled) return
    
    e.preventDefault()
    const pos = getPosition(e)
    
    if (context) {
      context.lineTo(pos.x, pos.y)
      context.stroke()
    }
  }

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false)
      
      // Get signature data
      const canvas = canvasRef.current
      if (canvas && hasSignature) {
        const signatureData = canvas.toDataURL('image/png')
        onSignatureChange(signatureData)
      }
    }
  }

  const clearSignature = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !context) return

    context.fillStyle = '#fff'
    context.fillRect(0, 0, width, height)
    setHasSignature(false)
    onSignatureChange(null)
  }, [context, width, height, onSignatureChange])

  const confirmSignature = () => {
    if (hasSignature) {
      const canvas = canvasRef.current
      if (canvas) {
        const signatureData = canvas.toDataURL('image/png')
        onSignatureChange(signatureData)
      }
    }
  }

  return (
    <Card className={disabled ? 'opacity-50' : ''}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <PenLine className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Digital Signature</span>
        </div>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="touch-none cursor-crosshair bg-white w-full"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>
        
        {!hasSignature && (
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Sign above using your mouse or touch screen
          </p>
        )}
        
        <div className="flex gap-2 mt-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearSignature}
            disabled={disabled || !hasSignature}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Clear
          </Button>
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={confirmSignature}
            disabled={disabled || !hasSignature}
          >
            <Check className="h-4 w-4 mr-1" />
            Confirm
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

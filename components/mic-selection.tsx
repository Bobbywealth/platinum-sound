"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { Mic, Star, Check } from 'lucide-react'

interface MicOption {
  id: string
  name: string
  description?: string
  upcharge: number
  isPremium: boolean
  image?: string
}

interface MicSelectionProps {
  onSelectionChange: (selection: { micId: string; quantity: number; price: number }[]) => void
  quantity?: number
}

export function MicSelection({ onSelectionChange, quantity = 1 }: MicSelectionProps) {
  const [selectedMic, setSelectedMic] = useState<string>('standard-mic')
  const [micOptions, setMicOptions] = useState<MicOption[]>([
    {
      id: 'standard-mic',
      name: 'Standard Mic (Included)',
      description: 'Neumann TLM 103 or equivalent large-diaphragm condenser',
      upcharge: 0,
      isPremium: false,
    },
    {
      id: 'shure-sm7b',
      name: 'Shure SM7B',
      description: 'Dynamic microphone ideal for vocals and podcasts',
      upcharge: 25,
      isPremium: true,
    },
    {
      id: 'neumann-u87',
      name: 'Neumann U87',
      description: 'Legendary studio condenser microphone',
      upcharge: 75,
      isPremium: true,
    },
    {
      id: 'akg-c12',
      name: 'AKG C12 VR',
      description: 'Vintage-style tube condenser microphone',
      upcharge: 100,
      isPremium: true,
    },
    {
      id: 'sony-c800g',
      name: 'Sony C-800G',
      description: 'Premium tube condenser with Peltier cooling system',
      upcharge: 150,
      isPremium: true,
    },
  ])

  useEffect(() => {
    const selected = micOptions.find(m => m.id === selectedMic)
    if (selected) {
      onSelectionChange([{
        micId: selected.id,
        quantity,
        price: selected.upcharge * quantity,
      }])
    }
  }, [selectedMic, quantity, micOptions, onSelectionChange])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Mic className="h-5 w-5" />
        <h3 className="text-lg font-medium">Microphone Selection</h3>
      </div>
      
      <RadioGroup value={selectedMic} onValueChange={setSelectedMic} className="space-y-3">
        {micOptions.map((mic) => (
          <Label
            key={mic.id}
            htmlFor={mic.id}
            className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedMic === mic.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
            }`}
          >
            <RadioGroupItem value={mic.id} id={mic.id} className="mt-1" />
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{mic.name}</span>
                {mic.isPremium && (
                  <Badge variant="secondary" className="text-xs">
                    <Star className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                )}
                {selectedMic === mic.id && (
                  <Check className="h-4 w-4 text-primary ml-auto" />
                )}
              </div>
              
              {mic.description && (
                <p className="text-sm text-muted-foreground mb-2">
                  {mic.description}
                </p>
              )}
              
              <div className="flex items-center gap-2">
                {mic.upcharge === 0 ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Included
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    +${mic.upcharge.toFixed(2)} per session
                  </Badge>
                )}
                
                {quantity > 1 && mic.upcharge > 0 && (
                  <span className="text-sm text-muted-foreground">
                    (Total: ${(mic.upcharge * quantity).toFixed(2)})
                  </span>
                )}
              </div>
            </div>
          </Label>
        ))}
      </RadioGroup>
      
      {/* Summary */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Selected Microphone</span>
            <span className="font-medium">
              {micOptions.find(m => m.id === selectedMic)?.name}
            </span>
          </div>
          {micOptions.find(m => m.id === selectedMic)?.upcharge !== 0 && (
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-muted-foreground">Add-on Cost</span>
              <span className="font-bold text-primary">
                +${((micOptions.find(m => m.id === selectedMic)?.upcharge || 0) * quantity).toFixed(2)}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

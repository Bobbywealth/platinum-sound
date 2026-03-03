"use client"

import { useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UserPlus } from 'lucide-react'

interface ReferralOption {
  id: string
  name: string
  type: 'MANAGER' | 'ENGINEER' | 'TEAM_MEMBER' | 'EXTERNAL'
}

interface ReferralDropdownProps {
  onSelectionChange: (referral: { referrerType: string; referrerId: string; referrerName: string } | null) => void
}

export function ReferralDropdown({ onSelectionChange }: ReferralDropdownProps) {
  const [selectedReferrer, setSelectedReferrer] = useState<string>('')
  const [referrers, setReferrers] = useState<ReferralOption[]>([])


  useEffect(() => {
    fetch('/api/engineers')
      .then((r) => (r.ok ? r.json() : []))
      .then((rows) => setReferrers(rows.map((e: any) => ({ id: e.id, name: e.name, type: 'ENGINEER' as const }))))
  }, [])

  useEffect(() => {
    if (selectedReferrer) {
      const referrer = referrers.find(r => r.id === selectedReferrer)
      if (referrer) {
        onSelectionChange({
          referrerType: referrer.type,
          referrerId: referrer.id,
          referrerName: referrer.name,
        })
      }
    } else {
      onSelectionChange(null)
    }
  }, [selectedReferrer, referrers, onSelectionChange])

  const groupedReferrers = {
    MANAGER: referrers.filter(r => r.type === 'MANAGER'),
    ENGINEER: referrers.filter(r => r.type === 'ENGINEER'),
    TEAM_MEMBER: referrers.filter(r => r.type === 'TEAM_MEMBER'),
    EXTERNAL: referrers.filter(r => r.type === 'EXTERNAL'),
  }

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <UserPlus className="h-4 w-4" />
        Who referred you? (Optional)
      </Label>
      <Select value={selectedReferrer} onValueChange={setSelectedReferrer}>
        <SelectTrigger>
          <SelectValue placeholder="Select referral source" />
        </SelectTrigger>
        <SelectContent>
          {groupedReferrers.MANAGER.length > 0 && (
            <>
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                Managers
              </div>
              {groupedReferrers.MANAGER.map(referrer => (
                <SelectItem key={referrer.id} value={referrer.id}>
                  {referrer.name}
                </SelectItem>
              ))}
            </>
          )}
          
          {groupedReferrers.ENGINEER.length > 0 && (
            <>
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">
                Engineers
              </div>
              {groupedReferrers.ENGINEER.map(referrer => (
                <SelectItem key={referrer.id} value={referrer.id}>
                  {referrer.name}
                </SelectItem>
              ))}
            </>
          )}
          
          {groupedReferrers.TEAM_MEMBER.length > 0 && (
            <>
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">
                Team Members
              </div>
              {groupedReferrers.TEAM_MEMBER.map(referrer => (
                <SelectItem key={referrer.id} value={referrer.id}>
                  {referrer.name}
                </SelectItem>
              ))}
            </>
          )}
          
          {groupedReferrers.EXTERNAL.length > 0 && (
            <>
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">
                Other
              </div>
              {groupedReferrers.EXTERNAL.map(referrer => (
                <SelectItem key={referrer.id} value={referrer.id}>
                  {referrer.name}
                </SelectItem>
              ))}
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import * as React from "react"

interface FormFieldConfig {
  name: string
  label: string
  type?: string
  placeholder?: string
  description?: string
}

interface CustomFormProps {
  fields: FormFieldConfig[]
  onSubmit: (values: Record<string, string>) => void
  submitLabel?: string
}

export function CustomForm({
  fields,
  onSubmit,
  submitLabel = "Submit",
}: CustomFormProps) {
  const [values, setValues] = React.useState<Record<string, string>>({})
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    const newErrors: Record<string, string> = {}
    fields.forEach((field) => {
      if (!values[field.name]) {
        newErrors[field.name] = `${field.label} is required`
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit(values)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name}>{field.label}</Label>
          <Input
            id={field.name}
            type={field.type || "text"}
            placeholder={field.placeholder}
            value={values[field.name] || ""}
            onChange={(e) => handleChange(field.name, e.target.value)}
          />
          {field.description && (
            <p className="text-sm text-muted-foreground">{field.description}</p>
          )}
          {errors[field.name] && (
            <p className="text-sm text-destructive">{errors[field.name]}</p>
          )}
        </div>
      ))}
      <Button type="submit">{submitLabel}</Button>
    </form>
  )
}

import { Label } from '@/components/ui/label'
import { Textarea, type TextareaProps } from '@/components/ui/textarea'

export function TextareaWithDescription (props: TextareaProps & { label: string, description: string}) {
  const { label, description, ...textareaProps } = props

  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="text-area-id">{label}</Label>
      <Textarea
        placeholder="Type your message here."
        id="text-area-id"
        className='mt-2'
        {...textareaProps}
        />
      <p className="text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

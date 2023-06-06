import * as React from 'react'

import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

export type ChordsPreviewProps = React.TextareaHTMLAttributes<HTMLDivElement> & { label: string, description: string, songAsHtml: string, isError: boolean }

const ChordsPreview = React.forwardRef<HTMLDivElement, ChordsPreviewProps>(
  ({ className, label, description, songAsHtml, isError, ...props }, ref) => {
    const [song, setSong] = useState('')

    useEffect(() => {
      if (songAsHtml) {
        setSong(songAsHtml)
        // setSong('<div class="chord-sheet"><div class="paragraph"><table class="row"><tr><td class="chord">G</td><td class="chord"></td><td class="chord">C9</td></tr><tr><td class="lyrics">Eu </td><td class="lyrics">olhei a tristeza nos olhos e sorri</td><td class="lyrics"></td></tr></table><table class="row"><tr><td class="chord">G</td><td class="chord"></td><td class="chord">C9</td></tr><tr><td class="lyrics">Mesmo </td><td class="lyrics">quebrantado pela vida que escolhi</td><td class="lyrics"></td></tr></table><table class="row"><tr><td class="chord">G</td><td class="chord"></td><td class="chord">C9</td></tr><tr><td class="lyrics">Da </td><td class="lyrics">janela eu vi</td><td class="lyrics"></td></tr></table><table class="row"><tr><td class="chord">G</td><td class="chord"></td><td class="chord">C9</td></tr><tr><td class="lyrics">Cada </td><td class="lyrics">estação fugir</td><td class="lyrics"></td></tr></table></div></div>')
      }
    }, [songAsHtml])

    return (
      <div className="w-full max-h-96 flex flex-col gap-1.5">
        <div
          className={cn(
            'flex min-h-[80px] w-full overflow-x-scroll rounded-md border border-input bg-transparent mt-2 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            `${isError ? 'border-red-500 border-2' : ''}`,
            className
          )}
          ref={ref}
          // placeholder="Type your message here."
          id="text-area-id"
          dangerouslySetInnerHTML={{ __html: song }}
          {...props}
        >
          {props.children}
        </div>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    )
  }
)

ChordsPreview.displayName = 'ChordsPreview'

export { ChordsPreview }

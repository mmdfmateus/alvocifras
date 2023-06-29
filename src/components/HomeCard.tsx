import { cn } from '~/lib/utils'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '~/components/ui/card'
import { type ReactNode } from 'react'
import Link from 'next/link'

type CardProps = React.ComponentProps<typeof Card> & {
    title: string,
    buttonTitle: string,
    buttonRedirectTo: string,
    children?: ReactNode;
}

export function HomeCard ({ className, ...props }: CardProps) {
  return (
    <Card className={cn('w-[380px]', className)} {...props}>
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
        <CardDescription>Procuras recentes</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div>
          {props.children}
        </div>
      </CardContent>
      <CardFooter>
        <Link href={props.buttonRedirectTo} className="w-full" >
          <Button className="w-full">
            {props.buttonTitle}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

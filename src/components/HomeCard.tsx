import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import Image from 'next/image'
import { ReactNode } from 'react'

const songs = [
  {
    song: "Algo melhor",
    artist: "Sujeito a Reboque",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQd-msomLi9iPCsy56AD6P6qV52munNoPtoztyiRgsFRoO3E2YTQobSBR9mbo6-YEW4DXw&usqp=CAU"
  },
  {
    song: "Algo melhor",
    artist: "Sujeito a Reboque",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQd-msomLi9iPCsy56AD6P6qV52munNoPtoztyiRgsFRoO3E2YTQobSBR9mbo6-YEW4DXw&usqp=CAU"
  },
  {
    song: "Algo melhor",
    artist: "Sujeito a Reboque",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQd-msomLi9iPCsy56AD6P6qV52munNoPtoztyiRgsFRoO3E2YTQobSBR9mbo6-YEW4DXw&usqp=CAU"
  },
]

type CardProps = React.ComponentProps<typeof Card> & {
    title: string,
    buttonText: string,
    children?: ReactNode;
}

export function HomeCard({ className, ...props }: CardProps) {
  return (
    <Card className={cn("w-[380px]", className)} {...props}>
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
        <Button className="w-full">
          {props.buttonText}
        </Button>
      </CardFooter>
    </Card>
  )
}

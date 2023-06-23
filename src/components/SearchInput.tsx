import { Input } from './ui/input'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export const SearchInput = (props: InputProps) => {
  return (
    <Input
        type="search"
        placeholder="Procure por uma música..."
        className="h-9 block sm:hidden md:w-40 lg:w-80 focus:outline-none"
        {...props}
    />)
}

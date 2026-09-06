interface Props {
    children: React.ReactNode;
}
export function QuickSelectGroup({children}: Props) {
    return (
        <div className="flex flex-col space-y-2">
                {children}
        </div>
    )
}